import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 9333;
const profilePath = join(tmpdir(), `jej-edge-cdp-${process.pid}`);
const outputPath = resolve(process.argv[2] ?? "artifacts/qa/home-mobile-final.png");
const targetUrl = process.argv[3] ?? "http://127.0.0.1:4173/";

mkdirSync(profilePath, { recursive: true });

const edge = spawn(edgePath, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profilePath}`,
  "--no-first-run",
  "--hide-scrollbars",
  "about:blank",
], { stdio: "ignore" });

const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));

async function waitForDebugger() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {
      // Edge is still starting.
    }
    await delay(100);
  }
  throw new Error("Edge DevTools endpoint did not start.");
}

try {
  await waitForDebugger();
  const page = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(targetUrl)}`, {
    method: "PUT",
  }).then((response) => response.json());

  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener("open", resolveOpen, { once: true });
    socket.addEventListener("error", rejectOpen, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolveCommand, rejectCommand } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) rejectCommand(new Error(message.error.message));
    else resolveCommand(message.result);
  });

  const command = (method, params = {}) => new Promise((resolveCommand, rejectCommand) => {
    const id = ++nextId;
    pending.set(id, { resolveCommand, rejectCommand });
    socket.send(JSON.stringify({ id, method, params }));
  });

  await command("Page.enable");
  await command("Runtime.enable");
  await command("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
    screenWidth: 390,
    screenHeight: 844,
  });
  await command("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await command("Page.navigate", { url: targetUrl });
  await delay(1200);

  const metrics = await command("Runtime.evaluate", {
    expression: `(async () => {
      await document.fonts.ready;
      const header = document.querySelector('.site-header');
      const heroCopy = document.querySelector('.hero-copy');
      return {
        innerWidth: window.innerWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        headerWidth: header?.getBoundingClientRect().width,
        headerScrollWidth: header?.scrollWidth,
        heroCopy: heroCopy && {
          left: heroCopy.getBoundingClientRect().left,
          right: heroCopy.getBoundingClientRect().right,
          width: heroCopy.getBoundingClientRect().width,
          scrollWidth: heroCopy.scrollWidth,
        },
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  const screenshot = await command("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });

  writeFileSync(outputPath, Buffer.from(screenshot.data, "base64"));
  console.log(JSON.stringify(metrics.result.value, null, 2));
  socket.close();
} finally {
  edge.kill();
  await delay(250);
  rmSync(profilePath, { recursive: true, force: true });
}
