import {
  defineRailway,
  github,
  preserve,
  project,
  service,
  volume,
} from "railway/iac";

export default defineRailway(() => {
  const consultationData = volume("consultation-data", {
    region: "sfo",
    sizeMB: 50_000,
  });

  const web = service("web", {
    source: github("eunjungjung33/veritax", { branch: "main" }),
    build: {
      builder: "RAILPACK",
      buildCommand: "npm run build",
    },
    deploy: {
      startCommand: "npm start",
      healthcheckPath: "/healthz",
      healthcheckTimeout: 30,
      restartPolicyMaxRetries: 3,
    },
    env: {
      ALLOWED_ORIGINS: preserve(),
      CONSULTATION_ENCRYPTION_KEY: preserve(),
      CONSULTATION_KEY_VERSION: preserve(),
      CONSULTATION_RETENTION_DAYS: preserve(),
      CONSULTATION_STORAGE_DIR: preserve(),
      CSRF_SECRET: preserve(),
    },
    volumeMounts: {
      "/data": consultationData,
    },
  });

  return project("veritax", { resources: [consultationData, web] });
});
