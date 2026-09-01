import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

function cutoffDate() {
  const configured = Number(process.env.CONSULTATION_RETENTION_DAYS ?? "90");
  const days = Number.isInteger(configured) && configured >= 1 && configured <= 365 ? configured : 90;
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

export default async function cleanupConsultations() {
  const store = getStore("veritax-consultations");
  const { blobs } = await store.list({ prefix: "v1/" });
  const cutoff = cutoffDate();
  let deleted = 0;

  for (const blob of blobs) {
    const date = blob.key.split("/")[1];
    if (/^\d{4}-\d{2}-\d{2}$/u.test(date) && date < cutoff) {
      await store.delete(blob.key);
      deleted += 1;
    }
  }

  console.info("consultation_retention_cleanup", { scanned: blobs.length, deleted });
  return new Response(null, { status: 204 });
}

export const config: Config = { schedule: "@daily" };
