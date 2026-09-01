import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const netlify = readFileSync(new URL("../netlify.toml", import.meta.url), "utf8");
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("deployment security configuration", () => {
  it("enforces the critical browser protections", () => {
    expect(netlify).toContain("Content-Security-Policy");
    expect(netlify).toContain("frame-ancestors 'none'");
    expect(netlify).toContain("connect-src 'self'");
    expect(netlify).toContain("script-src-attr 'none'");
    expect(netlify).toContain("require-trusted-types-for 'script'");
    expect(netlify).toContain("Strict-Transport-Security");
    expect(netlify).toContain('Referrer-Policy = "no-referrer"');
    expect(netlify).toContain('Cache-Control = "no-store, max-age=0"');
  });

  it("does not publish source maps or run install scripts in the build environment", () => {
    expect(netlify).toContain('NPM_FLAGS = "--ignore-scripts"');
    expect(readFileSync(new URL("../vite.config.ts", import.meta.url), "utf8")).toContain("sourcemap: false");
  });

  it("pins production dependencies exactly", () => {
    for (const version of Object.values(packageJson.dependencies)) {
      expect(version).toMatch(/^\d+\.\d+\.\d+$/u);
    }
  });
});
