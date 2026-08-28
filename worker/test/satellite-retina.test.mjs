import test from "node:test";
import assert from "node:assert/strict";

import { getPageHtml } from "../src/page.js";

test("satellite tiles request a source zoom that matches iPhone pixel density", () => {
  const html = getPageHtml();

  assert.match(html, /id="layerLabel">卫星<\/span>/);
  assert.match(html, /class="layer-btn active" data-layer="satellite"/);
  assert.match(html, /let currentLayer = tiles\.satellite;/);
  assert.match(html, /window\.devicePixelRatio >= 3 \? 2 : window\.devicePixelRatio > 1 \? 1 : 0/);
  assert.match(html, /tileSize: satelliteTileSize/);
  assert.match(html, /zoomOffset: satelliteTileZoomOffset/);
  assert.match(html, /maxNativeZoom: 23/);
  assert.match(html, /World_Imagery\/MapServer\/tile\/\{z\}\/\{y\}\/\{x\}', satelliteTileOptions/);
});
