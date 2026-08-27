import test from "node:test";
import assert from "node:assert/strict";

import { getPageHtml } from "../src/page.js";

test("page renders zero with the normal glyph", () => {
  const html = getPageHtml();

  assert.match(html, /font-variant-numeric:normal; font-feature-settings:"zero" 0/);
  assert.match(html, /button,input \{ font-family:inherit; \}/);
  assert.doesNotMatch(html, /font-family:(?:"SF Mono"|monospace)/);
});
