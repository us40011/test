import test from "node:test";
import assert from "node:assert/strict";

import { getPageHtml } from "../src/page.js";

test("satellite tiles retain high-density source levels and cap zoom by local availability", () => {
  const html = getPageHtml();

  assert.match(html, /id="layerLabel">卫星<\/span>/);
  assert.match(html, /class="layer-btn active" data-layer="satellite"/);
  assert.match(html, /let currentLayer = tiles\.satellite;/);
  assert.match(html, /window\.devicePixelRatio >= 3 \? 2 : window\.devicePixelRatio > 1 \? 1 : 0/);
  assert.match(html, /tileSize: satelliteTileSize/);
  assert.match(html, /zoomOffset: satelliteTileZoomOffset/);
  assert.match(html, /const satelliteMaxNativeZoom = 23/);
  assert.match(html, /const satelliteMaxZoom = 19/);
  assert.match(html, /maxNativeZoom: satelliteMaxNativeZoom/);
  assert.match(html, /maxZoom: satelliteMaxZoom/);
  assert.match(html, /tilemap/);
  assert.match(html, /limitSatelliteZoomToAvailableData/);
  assert.match(html, /map\.on\('moveend', limitSatelliteZoomToAvailableData\)/);
  assert.match(html, /World_Imagery\/MapServer\/tile\/\{z\}\/\{y\}\/\{x\}', satelliteTileOptions/);
});
