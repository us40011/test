import assert from "node:assert/strict";
import test from "node:test";

import { getPageHtml } from "../src/page.js";

test("CARTO basemaps use MapLibre vector styles through the Leaflet layer adapter", () => {
  const html = getPageHtml();

  assert.match(html, /maplibre-gl@5\/dist\/maplibre-gl\.css/);
  assert.match(html, /@maplibre\/maplibre-gl-leaflet@0\.0\.22\/leaflet-maplibre-gl\.js/);
  assert.match(html, /\.leaflet-gl-layer, \.leaflet-gl-layer \.maplibregl-canvas \{ pointer-events:none; \}/);
  assert.match(html, /dark: L\.maplibreGL\(\{style:'https:\/\/basemaps\.cartocdn\.com\/gl\/dark-matter-gl-style\/style\.json', interactive:false\}\)/);
  assert.match(html, /voyager: L\.maplibreGL\(\{style:'https:\/\/basemaps\.cartocdn\.com\/gl\/voyager-gl-style\/style\.json', interactive:false\}\)/);
  assert.match(html, /positron: L\.maplibreGL\(\{style:'https:\/\/basemaps\.cartocdn\.com\/gl\/positron-gl-style\/style\.json', interactive:false\}\)/);
  assert.doesNotMatch(html, /basemaps\.cartocdn\.com\/(?:rastertiles|dark_all)/);
  assert.match(html, /function switchLayer\(name\) \{\n  map\.removeLayer\(currentLayer\);\n  currentLayer = tiles\[name\];\n  currentLayer\.addTo\(map\);/);
});
