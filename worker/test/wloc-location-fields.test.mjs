import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const workerDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function encVarint(value) {
  let v = BigInt(value);
  if (v < 0n) v = BigInt.asUintN(64, v);
  const out = [];
  while (v >= 0x80n) {
    out.push(Number((v & 0x7fn) | 0x80n));
    v >>= 7n;
  }
  out.push(Number(v));
  return out;
}
function field(no, wire, value) {
  const key = encVarint((BigInt(no) << 3n) | BigInt(wire));
  if (wire === 0) return [...key, ...encVarint(value)];
  if (wire === 2) return [...key, ...encVarint(value.length), ...value];
  throw new Error("unsupported wire");
}
function decodeVarint(bytes, offset) {
  let result = 0n;
  let shift = 0n;
  let i = offset;
  while (i < bytes.length) {
    const b = BigInt(bytes[i++]);
    result |= (b & 0x7fn) << shift;
    if ((b & 0x80n) === 0n) return [Number(result), i];
    shift += 7n;
  }
  throw new Error("truncated varint");
}
function fields(bytes) {
  const out = [];
  let i = 0;
  while (i < bytes.length) {
    const [key, afterKey] = decodeVarint(bytes, i);
    i = afterKey;
    const no = Math.floor(key / 8);
    const wire = key & 7;
    let value;
    if (wire === 0) {
      const [v, end] = decodeVarint(bytes, i);
      value = v;
      i = end;
    } else if (wire === 2) {
      const [len, start] = decodeVarint(bytes, i);
      value = bytes.slice(start, start + len);
      i = start + len;
    } else {
      throw new Error("unsupported wire");
    }
    out.push({ no, wire, value });
  }
  return out;
}

async function runWloc(body) {
  const script = await readFile(path.resolve(workerDir, "../dist/wloc.js"), "utf8");
  let resolveDone;
  const done = new Promise((resolve) => {
    resolveDone = resolve;
  });
  const context = vm.createContext({
    $environment: { "stash-version": "3.2.5" },
    $script: { startTime: Date.now() },
    $argument: "longitude=113.7&latitude=22.7&horizontalAccuracy=10&verticalAccuracy=20&altitude=88&logLevel=off",
    $request: { url: "https://gs-loc-cn.apple.com/clls/wloc", method: "POST", headers: {} },
    $response: { status: 200, headers: {}, body: new Uint8Array(body) },
    $persistentStore: { read() { return null; }, write() { return true; } },
    $done(payload) { resolveDone(payload); },
    console: { log() {} },
    setTimeout,
    clearTimeout,
    Uint8Array,
    ArrayBuffer,
  });
  vm.runInContext(script, context);
  return Promise.race([
    done,
    new Promise((_, reject) => setTimeout(() => reject(new Error("wloc script did not call $done")), 1000)),
  ]);
}

test("wloc response patch writes altitude and accuracy fields", async () => {
  const location = field(1, 0, 1).concat(field(2, 0, 2), field(3, 0, 25));
  const wifi = field(1, 2, Array.from(Buffer.from("aa:bb:cc:dd:ee:ff"))).concat(field(2, 2, location));
  const payload = field(2, 2, wifi);
  const body = [0, 1, 0, 0, 0, 1, 0, 0, (payload.length >> 8) & 255, payload.length & 255, ...payload];
  const patched = await runWloc(body);
  const output = Array.from(patched.body);
  const len = (output[8] << 8) | output[9];
  const root = fields(output.slice(10, 10 + len));
  const patchedWifi = fields(root.find((f) => f.no === 2).value);
  const patchedLocation = fields(patchedWifi.find((f) => f.no === 2).value);
  const byNo = new Map(patchedLocation.map((f) => [f.no, f.value]));

  assert.equal(byNo.get(3), 10);
  assert.equal(byNo.get(5), 88);
  assert.equal(byNo.get(6), 20);
});
