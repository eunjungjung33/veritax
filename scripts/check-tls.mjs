import https from "node:https";
import tls from "node:tls";

const domains = (process.env.TLS_CHECK_DOMAINS ?? "web-production-6ef9.up.railway.app")
  .split(",")
  .map((domain) => domain.trim())
  .filter(Boolean);

const minimumDays = Number(process.env.TLS_MINIMUM_VALID_DAYS ?? "14");

function inspectCertificate(domain) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      { host: domain, port: 443, servername: domain, rejectUnauthorized: true, timeout: 15_000 },
      () => {
        const certificate = socket.getPeerCertificate();
        const validTo = new Date(certificate.valid_to);
        const remainingDays = Math.floor((validTo.getTime() - Date.now()) / 86_400_000);
        socket.end();

        if (!Number.isFinite(remainingDays) || remainingDays < minimumDays) {
          reject(new Error(`${domain}: certificate expires in ${remainingDays} days`));
          return;
        }
        resolve({ domain, validTo: validTo.toISOString(), remainingDays, subject: certificate.subject?.CN });
      },
    );
    socket.once("timeout", () => socket.destroy(new Error(`${domain}: TLS timeout`)));
    socket.once("error", reject);
  });
}

function inspectHeaders(domain) {
  return new Promise((resolve, reject) => {
    const request = https.request(
      { hostname: domain, path: "/", method: "HEAD", timeout: 15_000, headers: { "User-Agent": "veritax-tls-monitor/1.0" } },
      (response) => {
        response.resume();
        const hsts = response.headers["strict-transport-security"];
        if (!hsts || !/max-age=(?:[3-9]\d{7}|\d{9,})/u.test(hsts)) {
          reject(new Error(`${domain}: missing or short HSTS policy`));
          return;
        }
        resolve({ domain, status: response.statusCode, hsts });
      },
    );
    request.once("timeout", () => request.destroy(new Error(`${domain}: HTTPS timeout`)));
    request.once("error", reject);
    request.end();
  });
}

let failed = false;
for (const domain of domains) {
  try {
    const [certificate, headers] = await Promise.all([inspectCertificate(domain), inspectHeaders(domain)]);
    console.log(`PASS ${domain} | ${certificate.remainingDays} days | HTTP ${headers.status} | ${certificate.subject}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${domain} | ${error instanceof Error ? error.message : "unknown error"}`);
  }
}

if (failed) process.exitCode = 1;
