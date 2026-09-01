import { randomBytes, randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { chmod, mkdir, open, readdir, rmdir, stat, unlink } from "node:fs/promises";
import { createServer, type IncomingHttpHeaders, type IncomingMessage, type ServerResponse } from "node:http";
import { basename, extname, isAbsolute, join, parse, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { issueCsrfToken, verifyCsrfToken } from "../netlify/functions/_lib/csrf.js";
import { encryptConsultation, type EncryptedEnvelope } from "../netlify/functions/_lib/encryption.js";
import {
  constantTimeEqual,
  isLocalRequest,
  isSameOriginRead,
  isSameOriginRequest,
  jsonResponse,
  parseCookies,
} from "../netlify/functions/_lib/http.js";
import { MAX_BODY_BYTES, validateConsultation } from "../netlify/functions/_lib/validation.js";

const MODULE_DIR = resolve(fileURLToPath(new URL(".", import.meta.url)));
const APP_ROOT = resolve(MODULE_DIR, "../..");
const DIST_ROOT = resolve(APP_ROOT, "dist");
const PORT = Number(process.env.PORT ?? "3000");
const RATE_LIMIT_WINDOW_MS = 180_000;
const RATE_LIMIT_MAX = 5;
const MAX_RATE_LIMIT_ENTRIES = 10_000;

const STATIC_HEADERS = {
  "Content-Security-Policy": "default-src 'self'; base-uri 'none'; connect-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'none'; img-src 'self' data:; manifest-src 'self'; media-src 'self'; object-src 'none'; require-trusted-types-for 'script'; script-src 'self'; script-src-attr 'none'; style-src 'self'; style-src-attr 'none'; worker-src 'none'; upgrade-insecure-requests",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "no-referrer",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-DNS-Prefetch-Control": "off",
  "X-Frame-Options": "DENY",
  "X-Permitted-Cross-Domain-Policies": "none",
  "X-XSS-Protection": "0",
} as const;

const MIME_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

type RateLimitEntry = { count: number; resetAt: number };
const rateLimits = new Map<string, RateLimitEntry>();

function requiredSecrets() {
  const csrfSecret = process.env.CSRF_SECRET ?? "";
  const encodedKey = process.env.CONSULTATION_ENCRYPTION_KEY ?? "";
  const key = Buffer.from(encodedKey, "base64");

  if (csrfSecret.length < 32) throw new Error("CSRF_SECRET must contain at least 32 characters");
  if (key.length !== 32 || key.toString("base64").replace(/=+$/u, "") !== encodedKey.trim().replace(/=+$/u, "")) {
    throw new Error("CONSULTATION_ENCRYPTION_KEY must be a valid base64-encoded 32-byte key");
  }

  return { csrfSecret, encodedKey };
}

export function safeStorageRoot(configured = process.env.CONSULTATION_STORAGE_DIR ?? join(APP_ROOT, "consultation-data")) {
  if (!configured || configured.length > 1_024) throw new Error("Invalid consultation storage path");
  const root = resolve(configured);
  if (!isAbsolute(root) || root === parse(root).root || basename(root).length < 3) throw new Error("Unsafe consultation storage path");
  return root;
}

function within(root: string, candidate: string) {
  const pathFromRoot = relative(root, candidate);
  return pathFromRoot === "" || (!pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== ".." && !isAbsolute(pathFromRoot));
}

function retentionDays() {
  const configured = Number(process.env.CONSULTATION_RETENTION_DAYS ?? "90");
  return Number.isInteger(configured) && configured >= 1 && configured <= 365 ? configured : 90;
}

export function clientIp(headers: IncomingHttpHeaders, socketAddress: string | undefined) {
  const railwayIp = headers["x-real-ip"];
  if (typeof railwayIp === "string" && railwayIp.length <= 64 && /^[0-9a-f:.]+$/iu.test(railwayIp)) return railwayIp;
  return socketAddress?.slice(0, 64) || "unknown";
}

function rateLimit(ip: string, now = Date.now()) {
  const current = rateLimits.get(ip);
  if (!current || current.resetAt <= now) {
    if (rateLimits.size >= MAX_RATE_LIMIT_ENTRIES) {
      for (const [key, entry] of rateLimits) {
        if (entry.resetAt <= now) rateLimits.delete(key);
      }
      while (rateLimits.size >= MAX_RATE_LIMIT_ENTRIES) {
        const oldest = rateLimits.keys().next().value as string | undefined;
        if (!oldest) break;
        rateLimits.delete(oldest);
      }
    }
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)) };
  }
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function firstHeader(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value?.split(",", 1)[0]?.trim();
}

function externalRequest(request: IncomingMessage, body?: string) {
  const socketWithTls = request.socket as typeof request.socket & { encrypted?: boolean };
  const protocol = firstHeader(request.headers["x-forwarded-proto"]) ?? (socketWithTls.encrypted ? "https" : "http");
  const host = firstHeader(request.headers["x-forwarded-host"]) ?? request.headers.host ?? "localhost";
  const headers = new Headers();
  Object.entries(request.headers).forEach(([key, value]) => {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) value.forEach((item) => headers.append(key, item));
  });
  return new Request(`${protocol}://${host}${request.url ?? "/"}`, {
    method: request.method,
    headers,
    body: body === undefined ? undefined : body,
  });
}

async function readBody(request: IncomingMessage) {
  const declared = Number(request.headers["content-length"] ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) throw new Error("body_too_large");

  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) throw new Error("body_too_large");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function sendResponse(response: ServerResponse, webResponse: Response) {
  response.statusCode = webResponse.status;
  webResponse.headers.forEach((value, key) => response.setHeader(key, value));
  response.end(Buffer.from(await webResponse.arrayBuffer()));
}

function receiptId(now: Date) {
  const day = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `VTX-${day}-${randomBytes(5).toString("hex").toUpperCase()}`;
}

async function storeEnvelope(root: string, now: Date, envelope: EncryptedEnvelope) {
  const dayRoot = resolve(root, now.toISOString().slice(0, 10));
  if (!within(root, dayRoot)) throw new Error("unsafe_storage_target");
  await mkdir(dayRoot, { recursive: true, mode: 0o700 });
  await chmod(dayRoot, 0o700).catch(() => undefined);

  const target = resolve(dayRoot, `${randomUUID()}.json`);
  if (!within(dayRoot, target)) throw new Error("unsafe_storage_target");
  const handle = await open(target, "wx", 0o600);
  try {
    await handle.writeFile(`${JSON.stringify(envelope)}\n`, { encoding: "utf8" });
    await handle.sync();
  } finally {
    await handle.close();
  }
  await chmod(target, 0o600).catch(() => undefined);
}

export async function cleanupExpiredConsultations(root = safeStorageRoot(), now = Date.now()) {
  const cutoff = now - retentionDays() * 86_400_000;
  let removed = 0;
  const days = await readdir(root, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });

  for (const day of days) {
    if (!day.isDirectory() || !/^\d{4}-\d{2}-\d{2}$/u.test(day.name)) continue;
    const dayRoot = resolve(root, day.name);
    if (!within(root, dayRoot)) continue;
    const files = await readdir(dayRoot, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile() || !/^[0-9a-f-]{36}\.json$/iu.test(file.name)) continue;
      const target = resolve(dayRoot, file.name);
      if (!within(dayRoot, target)) continue;
      const details = await stat(target);
      if (details.mtimeMs < cutoff) {
        await unlink(target);
        removed += 1;
      }
    }
    const remaining = await readdir(dayRoot);
    if (remaining.length === 0) await rmdir(dayRoot);
  }

  return removed;
}

async function csrfEndpoint(request: IncomingMessage, response: ServerResponse, csrfSecret: string) {
  const webRequest = externalRequest(request);
  if (request.method !== "GET") {
    await sendResponse(response, jsonResponse({ message: "허용되지 않은 요청입니다." }, 405, { Allow: "GET" }));
    return;
  }
  if (!isSameOriginRead(webRequest)) {
    await sendResponse(response, jsonResponse({ message: "요청 출처를 확인할 수 없습니다." }, 403));
    return;
  }

  const token = issueCsrfToken(csrfSecret);
  const cookieName = isLocalRequest(webRequest) ? "veritax_csrf_dev" : "__Host-veritax_csrf";
  await sendResponse(response, jsonResponse({ token }, 200, {
    "Set-Cookie": `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=1800${isLocalRequest(webRequest) ? "" : "; Secure"}`,
  }));
}

async function consultationEndpoint(
  request: IncomingMessage,
  response: ServerResponse,
  secrets: { csrfSecret: string; encodedKey: string },
  storageRoot: string,
) {
  if (request.method !== "POST") {
    await sendResponse(response, jsonResponse({ message: "허용되지 않은 요청입니다." }, 405, { Allow: "POST" }));
    return;
  }

  const limit = rateLimit(clientIp(request.headers, request.socket.remoteAddress));
  if (!limit.allowed) {
    await sendResponse(response, jsonResponse({ message: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }, 429, {
      "Retry-After": String(limit.retryAfter),
    }));
    return;
  }

  if (firstHeader(request.headers["content-type"])?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    await sendResponse(response, jsonResponse({ message: "입력 형식을 확인해 주세요." }, 415));
    return;
  }

  let rawBody: string;
  try {
    rawBody = await readBody(request);
  } catch {
    await sendResponse(response, jsonResponse({ message: "입력 내용이 너무 깁니다." }, 413));
    return;
  }

  const webRequest = externalRequest(request, rawBody);
  if (!isSameOriginRequest(webRequest)) {
    await sendResponse(response, jsonResponse({ message: "요청 출처를 확인할 수 없습니다." }, 403));
    return;
  }

  const submittedToken = webRequest.headers.get("x-csrf-token") ?? "";
  const cookies = parseCookies(webRequest);
  const cookieName = isLocalRequest(webRequest) ? "veritax_csrf_dev" : "__Host-veritax_csrf";
  const cookieToken = cookies.get(cookieName) ?? "";
  if (!submittedToken || !cookieToken || !constantTimeEqual(submittedToken, cookieToken) || !verifyCsrfToken(submittedToken, secrets.csrfSecret)) {
    await sendResponse(response, jsonResponse({ message: "보안 확인 시간이 만료되었습니다. 다시 시도해 주세요." }, 403));
    return;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    await sendResponse(response, jsonResponse({ message: "입력 형식을 확인해 주세요." }, 400));
    return;
  }

  const validation = validateConsultation(parsed);
  if (!validation.ok) {
    await sendResponse(response, jsonResponse({ message: validation.message }, 422));
    return;
  }

  const now = new Date();
  const receipt = receiptId(now);
  if (!validation.isSpam) {
    const expiresAt = new Date(now.getTime() + retentionDays() * 86_400_000).toISOString();
    try {
      const envelope = encryptConsultation({
        ...validation.value,
        receiptId: receipt,
        submittedAt: now.toISOString(),
        expiresAt,
      }, secrets.encodedKey, process.env.CONSULTATION_KEY_VERSION ?? "v1");
      await storeEnvelope(storageRoot, now, envelope);
    } catch {
      console.error("consultation_store_failed");
      await sendResponse(response, jsonResponse({ message: "안전하게 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." }, 503));
      return;
    }
  }

  await sendResponse(response, jsonResponse({ receiptId: receipt }, 201, {
    "Set-Cookie": `${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isLocalRequest(webRequest) ? "" : "; Secure"}`,
  }));
}

async function fileExists(path: string) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function staticEndpoint(request: IncomingMessage, response: ServerResponse) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    await sendResponse(response, jsonResponse({ message: "허용되지 않은 요청입니다." }, 405, { Allow: "GET, HEAD" }));
    return;
  }

  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  } catch {
    response.statusCode = 400;
    response.end("Bad Request");
    return;
  }

  const requested = resolve(DIST_ROOT, `.${pathname}`);
  if (!within(DIST_ROOT, requested)) {
    response.statusCode = 400;
    response.end("Bad Request");
    return;
  }

  const target = await fileExists(requested) ? requested : join(DIST_ROOT, "index.html");
  const extension = extname(target).toLowerCase();
  response.statusCode = 200;
  Object.entries(STATIC_HEADERS).forEach(([key, value]) => response.setHeader(key, value));
  response.setHeader("Content-Type", MIME_TYPES[extension] ?? "application/octet-stream");
  response.setHeader("Cache-Control", pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache");
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(target).on("error", () => {
    if (!response.headersSent) response.statusCode = 500;
    response.end();
  }).pipe(response);
}

export async function startRailwayServer() {
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65_535) throw new Error("PORT must be a valid TCP port");
  const secrets = requiredSecrets();
  const storageRoot = safeStorageRoot();
  await mkdir(storageRoot, { recursive: true, mode: 0o700 });
  await chmod(storageRoot, 0o700).catch(() => undefined);
  const removed = await cleanupExpiredConsultations(storageRoot);
  if (removed > 0) console.info("consultation_retention_cleanup", { removed });

  const cleanupTimer = setInterval(() => {
    void cleanupExpiredConsultations(storageRoot)
      .then((count) => {
        if (count > 0) console.info("consultation_retention_cleanup", { removed: count });
      })
      .catch(() => console.error("consultation_cleanup_failed"));
  }, 24 * 60 * 60 * 1_000);
  cleanupTimer.unref();

  const server = createServer((request, response) => {
    void (async () => {
      const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
      if (pathname === "/healthz") {
        await sendResponse(response, jsonResponse({ status: "ok" }));
      } else if (pathname === "/api/csrf") {
        await csrfEndpoint(request, response, secrets.csrfSecret);
      } else if (pathname === "/api/consultations") {
        await consultationEndpoint(request, response, secrets, storageRoot);
      } else if (pathname.startsWith("/api/")) {
        await sendResponse(response, jsonResponse({ message: "찾을 수 없습니다." }, 404));
      } else {
        await staticEndpoint(request, response);
      }
    })().catch(() => {
      console.error("request_failed");
      if (!response.headersSent) void sendResponse(response, jsonResponse({ message: "요청을 처리하지 못했습니다." }, 500));
      else response.end();
    });
  });

  server.requestTimeout = 15_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  server.maxRequestsPerSocket = 100;
  server.listen(PORT, "0.0.0.0", () => console.info("veritax_server_ready", { port: PORT }));
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await startRailwayServer();
}
