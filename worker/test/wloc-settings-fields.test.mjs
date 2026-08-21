import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const workerDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function runSettings(url, stored = null) {
  const script = await readFile(path.resolve(workerDir, "../dist/wloc-settings.js"), "utf8");
  let saved = stored;
  let resolveDone;
  const done = new Promise((resolve) => {
    resolveDone = resolve;
  });
  const context = vm.createContext({
    $environment: { "stash-version": "3.2.5" },
    $script: { startTime: Date.now() },
    $argument: "",
    $request: { url, method: "GET", headers: {} },
    $persistentStore: {
      read() {
        return saved == null ? null : JSON.stringify(saved);
      },
      write(value) {
        saved = value == null ? null : JSON.parse(value);
        return true;
      },
    },
    $done(payload) {
      resolveDone({ payload, saved });
    },
    console: { log() {} },
    setTimeout,
    clearTimeout,
  });

  vm.runInContext(script, context);
  return Promise.race([
    done,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("settings script did not call $done")), 1000);
    }),
  ]);
}

test("settings save persists altitude and accuracy fields", async () => {
  const { payload, saved } = await runSettings(
    "https://gs-loc.apple.com/wloc-settings/save?lon=113.1&lat=22.2&altitude=88&horizontalAccuracy=10&verticalAccuracy=20&randomRadius=0",
  );
  const body = JSON.parse(payload.response.body);

  assert.equal(body.success, true);
  assert.equal(body.altitude, 88);
  assert.equal(body.horizontalAccuracy, 10);
  assert.equal(body.verticalAccuracy, 20);
  assert.equal(saved.altitude, 88);
  assert.equal(saved.horizontalAccuracy, 10);
  assert.equal(saved.verticalAccuracy, 20);
});

test("settings query defaults empty optional fields", async () => {
  const { payload } = await runSettings(
    "https://gs-loc.apple.com/wloc-settings/save?action=query",
    { longitude: 113.1, latitude: 22.2, accuracy: 25 },
  );
  const body = JSON.parse(payload.response.body);

  assert.equal(body.success, true);
  assert.equal(body.altitude, 0);
  assert.equal(body.horizontalAccuracy, 15);
  assert.equal(body.verticalAccuracy, 30);
});
