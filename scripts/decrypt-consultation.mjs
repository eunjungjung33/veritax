import { createDecipheriv } from "node:crypto";
import { chmod, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const input = argument("--input");
const output = argument("--output");
const encodedKey = process.env.CONSULTATION_ENCRYPTION_KEY;

if (!input || !output || !encodedKey) {
  console.error("Usage: CONSULTATION_ENCRYPTION_KEY=... node scripts/decrypt-consultation.mjs --input encrypted.json --output consultation.decrypted.json");
  process.exit(1);
}

if (!output.endsWith(".decrypted.json")) {
  throw new Error("Output must end with .decrypted.json so repository ignore rules protect it");
}

const key = Buffer.from(encodedKey, "base64");
if (key.length !== 32 || key.toString("base64").replace(/=+$/u, "") !== encodedKey.trim().replace(/=+$/u, "")) {
  throw new Error("CONSULTATION_ENCRYPTION_KEY must be a valid base64-encoded 32-byte key");
}

const envelope = JSON.parse(await readFile(resolve(input), "utf8"));
if (envelope.schemaVersion !== 1 || envelope.algorithm !== "AES-256-GCM") throw new Error("Unsupported envelope");

const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(envelope.iv, "base64"));
decipher.setAAD(Buffer.from(`veritax-consultation:v1:${envelope.keyVersion}`, "utf8"));
decipher.setAuthTag(Buffer.from(envelope.authTag, "base64"));
const plaintext = Buffer.concat([
  decipher.update(Buffer.from(envelope.ciphertext, "base64")),
  decipher.final(),
]);

const outputPath = resolve(output);
await writeFile(outputPath, `${JSON.stringify(JSON.parse(plaintext.toString("utf8")), null, 2)}\n`, { mode: 0o600, flag: "wx" });
await chmod(outputPath, 0o600).catch(() => undefined);
console.log(`Decrypted to ${outputPath}. The plaintext was not printed to the terminal.`);
