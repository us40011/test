import assert from "node:assert/strict";
import test from "node:test";

import { getPageHtml } from "../src/page.js";

test("CARTO basemaps use MapLibre vector styles through the Leaflet layer adapter", () => {
  const html = getPageHtml();

  assert.match(html, /maplibre-gl@5\/dist\/maplibre-gl\.css/);
  assert.match(html, /@maplibre\/maplibre-gl-leaflet@0\.0\.22\/leaflet-maplibre-gl\.js/);
  assert.match(html, /\.leaflet-gl-layer, \.leaflet-gl-layer \.maplibregl-map, \.leaflet-gl-layer \.maplibregl-canvas-container, \.leaflet-gl-layer \.maplibregl-canvas \{ pointer-events:none!important; \}/);
  assert.match(html, /const layer = L\.maplibreGL\(\{style, interactive:false\}\)/);
  assert.match(html, /glMap\.dragPan\.disable\(\);[\s\S]*glMap\.touchZoomRotate\.disable\(\);[\s\S]*map\.dragging\.enable\(\);[\s\S]*map\.touchZoom\.enable\(\);/);
  assert.match(html, /currentLayer\.addTo\(map\);\nrestoreLeafletTouch\(\);/);
  assert.match(html, /currentLayer\.addTo\(map\);\n  restoreLeafletTouch\(\);/);
  assert.match(html, /dark: cartoVectorLayer\('https:\/\/basemaps\.cartocdn\.com\/gl\/dark-matter-gl-style\/style\.json'\)/);
  assert.match(html, /voyager: cartoVectorLayer\('https:\/\/basemaps\.cartocdn\.com\/gl\/voyager-gl-style\/style\.json'\)/);
  assert.match(html, /positron: cartoVectorLayer\('https:\/\/basemaps\.cartocdn\.com\/gl\/positron-gl-style\/style\.json'\)/);
  assert.doesNotMatch(html, /basemaps\.cartocdn\.com\/(?:rastertiles|dark_all)/);
  assert.match(html, /function switchLayer\(name\) \{\n  map\.removeLayer\(currentLayer\);\n  currentLayer = tiles\[name\];\n  currentLayer\.addTo\(map\);/);
});
