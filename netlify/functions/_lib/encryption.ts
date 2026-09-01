import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export type EncryptedEnvelope = {
  schemaVersion: 1;
  algorithm: "AES-256-GCM";
  keyVersion: string;
  iv: string;
  authTag: string;
  ciphertext: string;
};

function encryptionKey(encoded: string) {
  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32 || key.toString("base64").replace(/=+$/u, "") !== encoded.trim().replace(/=+$/u, "")) {
    throw new Error("CONSULTATION_ENCRYPTION_KEY must be a valid base64-encoded 32-byte key");
  }
  return key;
}

function additionalData(keyVersion: string) {
  return Buffer.from(`veritax-consultation:v1:${keyVersion}`, "utf8");
}

export function encryptConsultation(value: Record<string, unknown>, encodedKey: string, keyVersion = "v1"): EncryptedEnvelope {
  const key = encryptionKey(encodedKey);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(additionalData(keyVersion));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);

  return {
    schemaVersion: 1,
    algorithm: "AES-256-GCM",
    keyVersion,
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };
}

export function decryptConsultation(envelope: EncryptedEnvelope, encodedKey: string) {
  if (envelope.schemaVersion !== 1 || envelope.algorithm !== "AES-256-GCM") throw new Error("Unsupported envelope");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(encodedKey), Buffer.from(envelope.iv, "base64"));
  decipher.setAAD(additionalData(envelope.keyVersion));
  decipher.setAuthTag(Buffer.from(envelope.authTag, "base64"));
  const plaintext = Buffer.concat([decipher.update(Buffer.from(envelope.ciphertext, "base64")), decipher.final()]);
  return JSON.parse(plaintext.toString("utf8")) as Record<string, unknown>;
}
