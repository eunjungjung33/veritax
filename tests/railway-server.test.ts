import { mkdir, mkdtemp, readFile, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, parse } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cleanupExpiredConsultations, clientIp, parseByteRange, safeStorageRoot } from "../server/railway";

const temporaryRoots: string[] = [];

afterEach(async () => {
  delete process.env.CONSULTATION_RETENTION_DAYS;
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("Railway consultation server safety", () => {
  it("rejects a filesystem root as consultation storage", () => {
    expect(() => safeStorageRoot(parse(process.cwd()).root)).toThrow(/Unsafe consultation storage path/u);
  });

  it("uses Railway's normalized client IP header", () => {
    expect(clientIp({ "x-real-ip": "203.0.113.10" }, "127.0.0.1")).toBe("203.0.113.10");
    expect(clientIp({ "x-real-ip": "spoofed, 203.0.113.10" }, "127.0.0.1")).toBe("127.0.0.1");
  });

  it("parses single byte ranges for mobile video streaming", () => {
    expect(parseByteRange(undefined, 100)).toBeNull();
    expect(parseByteRange("bytes=0-9", 100)).toEqual({ start: 0, end: 9 });
    expect(parseByteRange("bytes=90-", 100)).toEqual({ start: 90, end: 99 });
    expect(parseByteRange("bytes=-10", 100)).toEqual({ start: 90, end: 99 });
    expect(parseByteRange("bytes=0-999", 100)).toEqual({ start: 0, end: 99 });
    expect(parseByteRange("bytes=100-101", 100)).toBe("invalid");
    expect(parseByteRange("bytes=0-1,5-6", 100)).toBe("invalid");
  });

  it("deletes only expired encrypted record files", async () => {
    const root = await mkdtemp(join(tmpdir(), "veritax-retention-"));
    temporaryRoots.push(root);
    const dayRoot = join(root, "2026-01-01");
    await mkdir(dayRoot, { recursive: true });

    const expired = join(dayRoot, "00000000-0000-4000-8000-000000000001.json");
    const preserved = join(dayRoot, "00000000-0000-4000-8000-000000000002.json");
    const unrelated = join(dayRoot, "notes.txt");
    await Promise.all([
      writeFile(expired, "encrypted-old"),
      writeFile(preserved, "encrypted-current"),
      writeFile(unrelated, "do-not-touch"),
    ]);

    const now = Date.UTC(2026, 8, 2);
    await utimes(expired, new Date(now - 2 * 86_400_000), new Date(now - 2 * 86_400_000));
    await utimes(preserved, new Date(now), new Date(now));
    process.env.CONSULTATION_RETENTION_DAYS = "1";

    await expect(cleanupExpiredConsultations(root, now)).resolves.toBe(1);
    await expect(readFile(preserved, "utf8")).resolves.toBe("encrypted-current");
    await expect(readFile(unrelated, "utf8")).resolves.toBe("do-not-touch");
  });
});
