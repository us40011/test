import { GCJ_BROWSER_JS } from "./gcj-browser.js";

export function getPageHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>Apple GPS</title>
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="WLOC">
<!-- 内联图标: 没有它浏览器每次加载都会去要 /favicon.ico 并拿到 404 -->
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ctext y='26' font-size='26'%3E%F0%9F%93%8D%3C/text%3E%3C/svg%3E">
<!-- integrity 为 Leaflet 官方在 leafletjs.com/download.html 公布的 SRI 值,
     可自行核对。CDN 被篡改时浏览器会拒绝执行, 下面的 typeof L 检查会给出提示。 -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="anonymous"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin="anonymous"><\/script>
<style>
:root { --blue:#1677c8; --green:#34c759; --red:#ff3b30; --gray:#7b8794; --bg:#edf5e9; --orange:#ff9500; --tg:#229ED9; --card:rgba(255,255,255,.78); --stroke:rgba(255,255,255,.86); --shadow:0 18px 42px rgba(64,98,72,.16),0 2px 8px rgba(255,255,255,.62) inset; --lift-shadow:0 10px 24px rgba(58,88,64,.14); }
* { margin:0; padding:0; box-sizing:border-box; }
html { width:100%; background:#dfeeda; scroll-behavior:auto; font-variant-numeric:normal; font-feature-settings:"zero" 0; }
body { position:relative; overflow-x:hidden; width:100%; min-width:0; font-family:-apple-system,system-ui,"SF Pro","Helvetica Neue",sans-serif; background:#edf5e9 linear-gradient(145deg,#eef8e9 0%,#dcecd6 46%,#eff6df 100%); color:#1c1c1e; min-height:100vh; }
button,input { font-family:inherit; }
body::before { content:""; position:fixed; inset:0; pointer-events:none; z-index:-1; background:radial-gradient(ellipse at 18% 8%,rgba(164,210,151,.42),transparent 34%),radial-gradient(ellipse at 84% 18%,rgba(123,187,156,.32),transparent 30%),radial-gradient(ellipse at 50% 88%,rgba(255,246,206,.38),transparent 38%),linear-gradient(145deg,rgba(255,255,255,.32),transparent 45%); transform:translateZ(0); }
#map { display:block; height:50vh; width:100%; min-height:250px; background:#edf5e9; }
.panel { position:relative; z-index:700; padding:16px; max-width:600px; margin:-46px auto 0; }
.card { position:relative; overflow:hidden; background:linear-gradient(145deg,rgba(255,255,255,.86),rgba(236,247,229,.72)); border:1px solid var(--stroke); border-radius:18px; padding:16px; margin-bottom:12px; box-shadow:var(--shadow); contain:layout paint style; transform:translateZ(0); }
.card::before { content:""; position:absolute; inset:0; pointer-events:none; background:linear-gradient(135deg,rgba(255,255,255,.82),transparent 38%),radial-gradient(circle at 16% 0%,rgba(255,255,255,.7),transparent 28%),linear-gradient(315deg,rgba(119,164,105,.12),transparent 42%); opacity:.9; }
.dashboard-card { background:linear-gradient(145deg,#fff,#ecf7e5); }
.dashboard-card::before { opacity:1; }
.card > * { position:relative; z-index:1; }
.card h3 { font-size:15px; font-weight:700; margin-bottom:10px; color:#1c1c1e; letter-spacing:.01em; }
.coords { font-size:14px; color:#263248; padding:10px 12px; background:linear-gradient(135deg,rgba(255,255,255,.86),rgba(236,247,229,.68)); border:1px solid rgba(255,255,255,.82); border-radius:12px; word-break:break-all; box-shadow:inset 0 1px 0 rgba(255,255,255,.86),0 6px 16px rgba(72,112,76,.08); }
.row { display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
.action-card { padding:12px; }
.action-row { display:flex; gap:8px; flex-wrap:nowrap; margin-top:0; }
.action-row .btn { min-width:0; padding:12px 8px; font-size:clamp(12px,3.35vw,14px); white-space:nowrap; }
.btn { flex:1; min-width:100px; padding:12px 16px; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; transition:transform .12s ease,filter .12s ease,box-shadow .12s ease; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; text-align:center; box-shadow:0 6px 14px rgba(32,68,138,.10); touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
.btn:active { transform:translateY(1px) scale(.985); filter:brightness(.96); box-shadow:0 3px 8px rgba(32,68,138,.10); }
.btn-primary { background:linear-gradient(135deg,#007aff,#5856d6); color:#fff; }
.btn-secondary { background:linear-gradient(135deg,rgba(255,255,255,.76),rgba(232,246,225,.68)); color:#263248; border:1px solid rgba(255,255,255,.78); }
.btn-danger { background:linear-gradient(135deg,#ff6b61,#ff4f72); color:#fff; }
.btn-tg { background:linear-gradient(135deg,#229ED9,#1677b8); color:#fff; }
.btn.success { background:var(--green); color:#fff; }
.btn-sm { flex:none; min-width:auto; padding:6px 12px; font-size:12px; border-radius:8px; }
.input-row { display:flex; gap:8px; margin-top:10px; }
.input-row input { flex:1; padding:11px 12px; border:1px solid rgba(255,255,255,.78); border-radius:12px; font-size:14px; outline:none; min-width:0; background:linear-gradient(135deg,rgba(255,255,255,.82),rgba(238,248,231,.72)); color:#1c1c1e; box-shadow:inset 0 1px 0 rgba(255,255,255,.82),0 4px 12px rgba(32,68,138,.05); transition:border-color .12s ease,box-shadow .12s ease; }
.input-row input:focus { border-color:rgba(0,122,255,.72); box-shadow:0 0 0 3px rgba(0,122,255,.14),inset 0 1px 0 rgba(255,255,255,.8); }
.param-row { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:10px; font-size:13px; color:var(--gray); }
.param-row input { width:80px; flex:none; padding:11px 12px; border:1px solid rgba(255,255,255,.78); border-radius:12px; font-size:14px; outline:none; min-width:0; background:linear-gradient(135deg,rgba(255,255,255,.82),rgba(238,248,231,.72)); color:#1c1c1e; box-shadow:inset 0 1px 0 rgba(255,255,255,.82),0 4px 12px rgba(32,68,138,.05); transition:border-color .12s ease,box-shadow .12s ease; }
.param-row input:focus { border-color:rgba(0,122,255,.72); box-shadow:0 0 0 3px rgba(0,122,255,.14),inset 0 1px 0 rgba(255,255,255,.8); }
.status { font-size:12px; color:var(--gray); margin-top:8px; text-align:center; }
.error-banner { background:var(--red); color:#fff; padding:14px 16px; border-radius:12px; margin-bottom:12px; font-size:14px; line-height:1.5; display:none; }
.error-banner b { display:block; margin-bottom:4px; }
.toast { position:fixed; top:60px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,.8); color:#fff; padding:10px 20px; border-radius:20px; font-size:14px; opacity:0; transition:opacity .3s; pointer-events:none; z-index:9999; max-width:90vw; text-align:center; }
.toast.show { opacity:1; }
.active-loc { background:linear-gradient(135deg,rgba(255,255,255,.82),rgba(238,248,231,.72)); border:1px solid rgba(255,255,255,.78); border-radius:12px; padding:10px 12px; font-size:13px; color:#263248; box-shadow:inset 0 1px 0 rgba(255,255,255,.82),0 4px 12px rgba(32,68,138,.05); }
.active-loc .label { font-size:11px; color:var(--gray); margin-bottom:4px; }
.active-loc .value { font-size:13px; }
.active-loc .value.coords-line { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.active-loc .value .coord-meta { color:var(--gray); }
.fav-list { max-height:240px; overflow-y:auto; }
.fav-item { display:flex; align-items:center; gap:8px; padding:10px 12px; background:linear-gradient(135deg,rgba(255,255,255,.74),rgba(238,248,231,.68)); border:1px solid rgba(255,255,255,.68); border-radius:12px; margin-bottom:6px; cursor:pointer; transition:filter .12s ease,transform .12s ease; }
.fav-item:active { transform:translateY(1px); filter:brightness(.97); }
.fav-item .fav-info { flex:1; min-width:0; }
.fav-item .fav-name { font-size:14px; font-weight:500; color:#333; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.fav-item .fav-coords { font-size:11px; color:var(--gray); margin-top:2px; display:flex; gap:10px; align-items:center; }
.fav-item .fav-active { font-size:10px; color:var(--green); font-weight:600; }
.fav-item .fav-del { flex:none; width:28px; height:28px; border:none; border-radius:50%; background:transparent; color:var(--red); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.fav-item .fav-del:hover { background:rgba(255,59,48,.1); }
.fav-empty { text-align:center; color:var(--gray); font-size:13px; padding:16px 0; }
.fav-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.fav-header h3 { margin-bottom:0; }
.modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,.36); z-index:10000; display:none; align-items:center; justify-content:center; padding:20px; }
.modal-overlay.show { display:flex; }
.modal { position:relative; overflow:hidden; background:linear-gradient(145deg,rgba(255,255,255,.92),rgba(235,247,229,.82)); border:1px solid rgba(255,255,255,.84); border-radius:24px; padding:22px; width:100%; max-width:340px; box-shadow:0 22px 58px rgba(36,58,40,.24); }
.fav-modal { padding-top:24px; }
.modal::before { content:""; position:absolute; inset:0; pointer-events:none; background:linear-gradient(135deg,rgba(255,255,255,.65),transparent 44%),radial-gradient(circle at 20% 0%,rgba(0,122,255,.12),transparent 34%); }
.modal > * { position:relative; z-index:1; }
.modal-icon { width:46px; height:46px; border-radius:16px; margin:0 auto 12px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#007aff,#5856d6); color:#fff; box-shadow:0 10px 24px rgba(0,122,255,.20); font-size:24px; }
.modal h3 { font-size:18px; font-weight:700; margin-bottom:10px; text-align:center; color:#1c1c1e; }
.modal-desc { font-size:14px; line-height:1.55; color:#4b5563; text-align:center; margin-bottom:18px; }
.modal-coords { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; font-size:12px; color:var(--gray); margin-bottom:12px; text-align:center; }
.modal input { width:100%; padding:12px; border:1px solid rgba(255,255,255,.78); border-radius:14px; font-size:15px; outline:none; margin-bottom:12px; background:linear-gradient(135deg,rgba(255,255,255,.86),rgba(238,248,231,.74)); box-shadow:inset 0 1px 0 rgba(255,255,255,.8); }
.modal input:focus { border-color:rgba(0,122,255,.72); box-shadow:0 0 0 3px rgba(0,122,255,.14),inset 0 1px 0 rgba(255,255,255,.8); }
.modal .modal-btns { display:flex; gap:10px; }
.modal .modal-btns .btn { padding:12px; min-width:0; }
.confirm-modal { padding-top:28px; }
.confirm-modal .modal-desc { margin:0 8px 20px; font-size:16px; font-weight:600; color:#1f2937; }
.confirm-modal .btn-secondary { background:rgba(255,255,255,.62); }
@media(max-width:480px) { .modal { max-width:none; border-radius:26px; padding:24px 20px; } }
.footer-card { text-align:center; padding:24px 16px; margin-top:16px; }
.footer-logo { width:96px; height:96px; border-radius:20px; margin:0 auto 12px; object-fit:contain; background:#fff; box-shadow:none; display:block; }
.map-wrap { position:relative; overflow:hidden; isolation:isolate; width:100vw; margin-left:calc(50% - 50vw); margin-right:calc(50% - 50vw); background:#edf5e9; }
.layer-menu { position:absolute; top:10px; right:10px; z-index:1000; display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
.layer-menu-toggle { border:1px solid rgba(255,255,255,.72); background:rgba(255,255,255,.86); color:#263248; padding:8px 12px; border-radius:999px; font-size:13px; font-weight:700; cursor:pointer; box-shadow:0 8px 22px rgba(15,23,42,.16),inset 0 1px 0 rgba(255,255,255,.7); -webkit-backdrop-filter:blur(16px) saturate(1.18); backdrop-filter:blur(16px) saturate(1.18); transition:transform .12s ease,filter .12s ease,box-shadow .12s ease; touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
.layer-menu-toggle:active { transform:translateY(1px) scale(.985); filter:brightness(.96); box-shadow:0 4px 12px rgba(15,23,42,.14),inset 0 1px 0 rgba(255,255,255,.64); }
.layer-switch { display:none; flex-direction:column; gap:4px; min-width:112px; background:rgba(255,255,255,.82); border:1px solid rgba(255,255,255,.7); border-radius:14px; padding:6px; box-shadow:0 12px 30px rgba(15,23,42,.18),inset 0 1px 0 rgba(255,255,255,.68); -webkit-backdrop-filter:blur(18px) saturate(1.2); backdrop-filter:blur(18px) saturate(1.2); }
.layer-menu.open .layer-switch { display:flex; }
.layer-btn { width:100%; border:none; background:transparent; padding:8px 10px; border-radius:10px; font-size:13px; font-weight:600; color:#263248; cursor:pointer; transition:transform .12s ease,filter .12s ease,background .12s ease,color .12s ease; white-space:nowrap; text-align:left; touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
.layer-btn.active { background:linear-gradient(135deg,#007aff,#5856d6); color:#fff; box-shadow:0 6px 14px rgba(0,122,255,.18); }
.layer-btn:active { transform:translateY(1px) scale(.985); filter:brightness(.96); }
.target-pin { width:48px; height:48px; filter:drop-shadow(0 2px 2px rgba(0,0,0,.18)); }
.target-pin svg { display:block; width:48px; height:48px; overflow:visible; }
.target-pin .pin-outline { fill:#ff3b30; }
.target-pin .pin-fill { fill:url(#target-pin-red); }
.target-pin .pin-core { fill:#fff; }
.target-pin .pin-center { fill:#ff453a; }
@media(prefers-color-scheme:dark) { .layer-menu-toggle,.layer-switch { background:rgba(28,32,38,.76); border-color:rgba(255,255,255,.18); color:#f5f7fa; box-shadow:0 12px 30px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.12); } .layer-btn { color:#f5f7fa; } }
@media(max-width:480px) { :root { --shadow:0 10px 22px rgba(64,98,72,.13),0 1px 6px rgba(255,255,255,.58) inset; } #map { height:44vh; } .panel { margin-top:-40px; padding:12px; } .card { border-radius:16px; padding:14px; } .action-card { padding:10px; } .action-row { gap:6px; } .action-row .btn { padding:11px 4px; } .layer-menu { top:8px; right:8px; } .layer-menu-toggle { padding:7px 11px; font-size:12px; } .layer-btn { padding:8px 10px; font-size:12px; } }
</style>
</head>
<body>
<div class="map-wrap">
<div id="map"></div>
<div class="layer-menu" id="layerMenu">
<button class="layer-menu-toggle" type="button" onclick="toggleLayerMenu()" aria-expanded="false" aria-controls="layerSwitch">图层：<span id="layerLabel">卫星</span></button>
<div class="layer-switch" id="layerSwitch">
  <button class="layer-btn active" data-layer="satellite" onclick="switchLayer('satellite')">卫星</button>
  <button class="layer-btn" data-layer="wgs84" onclick="switchLayer('wgs84')">WGS84</button>
  <button class="layer-btn" data-layer="amap" onclick="switchLayer('amap')" title="高德为 GCJ-02 偏移图源，选点已自动换算回 WGS84">高德</button>
  <button class="layer-btn" data-layer="voyager" onclick="switchLayer('voyager')">彩色</button>
  <button class="layer-btn" data-layer="standard" onclick="switchLayer('standard')">标准</button>
  <button class="layer-btn" data-layer="dark" onclick="switchLayer('dark')">暗色</button>
</div>
</div>
</div>
<div class="panel">
  <div class="error-banner" id="errorBanner">
    请检查以下配置<br>
    1. 已启用Apple New模块<br>
    2. 已信任CA证书<br>
    3. VPN软件已连接
  </div>
  <div class="card dashboard-card">
    <h3>地图实时数据</h3>
    <div class="coords" id="coords">每次定位在目标点随机移动 0=关闭</div>
    <label class="param-row">
      <span>移动半径 / 米</span>
      <input id="radiusInput" type="number" min="0" max="5000" step="1" value="0" />
    </label>
    <label class="param-row">
      <span>海拔度</span>
      <input id="altitudeInput" type="number" step="1" placeholder="自动" />
    </label>
    <label class="param-row">
      <span>水平精度</span>
      <input id="horizontalAccuracyInput" type="number" min="0" step="1" value="15" />
    </label>
    <label class="param-row">
      <span>垂直精度</span>
      <input id="verticalAccuracyInput" type="number" min="0" step="1" value="30" />
    </label>
  </div>
  <div class="card action-card" aria-label="位置操作">
    <div class="action-row">
      <button class="btn btn-primary" id="saveBtn" onclick="save()">保存到设备</button>
      <button class="btn btn-secondary" onclick="addFav()">收藏位置</button>
      <button class="btn btn-secondary" onclick="locateMe()">当前位置</button>
    </div>
  </div>
  <div class="card">
    <div class="fav-header">
      <h3>已收藏的位置</h3>
      <button class="btn btn-sm btn-secondary" onclick="clearAllFav()" id="clearAllBtn" style="display:none">清空全部</button>
    </div>
    <div id="favList" class="fav-list"></div>
  </div>
  <div class="card">
    <h3>当前生效坐标</h3>
    <div class="active-loc" id="activeLoc">
      <div class="label">设备持久化</div>
      <div class="value" id="activeValue">查询中...</div>
    </div>
    <div class="row">
      <button class="btn btn-sm btn-secondary" onclick="queryActive()">更新</button>
      <button class="btn btn-sm btn-danger" onclick="clearActive()">清空数据</button>
    </div>
  </div>
  <div class="card">
    <h3>地图共享坐标</h3>
    <div class="input-row">
      <input id="urlInput" placeholder="Apple/高德 > 链接/经纬度" />
      <button class="btn btn-secondary" style="flex:none;min-width:56px" onclick="parseUrl()">解析</button>
    </div>
  </div>
  <div class="card">
    <h3>搜索地点</h3>
    <div class="input-row">
      <input id="searchInput" placeholder="输入地名 例如: 美国纽约" />
      <button class="btn btn-secondary" style="flex:none;min-width:56px" onclick="searchPlace()">搜索</button>
    </div>
  </div>
  <div class="card footer-card">
    <img class="footer-logo" id="footerLogo" src="https://raw.githubusercontent.com/us40011/test/main/gps.png" alt="Logo" onerror="this.onerror=null; this.style.display='none'; document.getElementById('fallbackLogo').style.display='flex';">
    <div id="fallbackLogo" style="display:none; width:96px; height:96px; border-radius:20px; margin:0 auto 12px; background:linear-gradient(135deg, #007aff, #5856d6); box-shadow:0 4px 16px rgba(0, 122, 255, 0.25); align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:22px;">W</div>
    <div style="font-weight:600;font-size:15px;color:#1c1c1e;margin-bottom:4px">澳门银河科技</div>
    <div style="font-size:12px;color:var(--gray);margin-bottom:14px;font-weight:700;">版本号 v2.0</div>
    <a class="btn btn-tg" href="https://t.me/VIP111177" target="_blank" rel="noopener">Telegram</a>
  </div>
  <div class="status" id="status">选好位置后点击「保存到设备」写入代理工具</div>
</div>
<div class="toast" id="toast"></div>
<div class="modal-overlay" id="favModal">
  <div class="modal fav-modal">
    <input id="favNameInput" placeholder="输入备注名称" maxlength="30" />
    <div class="modal-coords" id="favModalCoords"></div>
    <div class="modal-btns">
      <button class="btn btn-secondary" onclick="closeFavModal()">取消</button>
      <button class="btn btn-primary" onclick="confirmFav()">保存</button>
    </div>
  </div>
</div>
<div class="modal-overlay" id="confirmModal">
  <div class="modal confirm-modal">
    <div class="modal-desc" id="confirmMessage"></div>
    <div class="modal-btns">
      <button class="btn btn-secondary" onclick="closeConfirm(false)">取消</button>
      <button class="btn btn-primary" onclick="closeConfirm(true)">确定</button>
    </div>
  </div>
</div>
<script>
if (typeof L === 'undefined') {
  document.getElementById('map').innerHTML =
    '<div style="padding:24px;text-align:center;font-size:14px;color:#8e8e93;line-height:1.6">' +
    '地图库加载失败<br>unpkg.com 不可达, 请检查网络或代理后更新<\\/div>';
  throw new Error('leaflet unavailable');
}
${GCJ_BROWSER_JS}
const SAVE_API = 'https://gs-loc.apple.com/wloc-settings/save';
const FAV_KEY = 'wloc_favorites';
// lat/lon 恒为 WGS84 —— 这是写进设备、也是 wloc 唯一认的坐标系。
// 底图可能是 GCJ-02 图源, 屏幕上的经纬度与它并不相等, 换算集中在 toDisplay/
// fromDisplay 两个函数里, 其它地方一律不碰。
let lat = 16.830687, lon = 112.344046;
let selected = false;
let activeLon = null, activeLat = null;
let altitude = null;
let layerIsGcj = false;

// 高德瓦片画的是 GCJ-02 地物, 而 Leaflet 按 WGS84 算「像素 -> 经纬度」。所以在
// 高德图层上点中的那个读数, 其实是目标点的 GCJ-02 值; 不反算就直接存, 深圳一带
// 会偏 500 米左右 —— 对一个定位工具来说这是致命的。反过来, 要把一个 WGS84 点
// 画在高德图层上, 得先正算成 GCJ-02, 否则 marker 会落在错误的楼上。
function toDisplay(la, lo) { return layerIsGcj ? wgs84ToGcj02(la, lo) : { lat: la, lon: lo }; }
function fromDisplay(la, lo) { return layerIsGcj ? gcj02ToWgs84(la, lo) : { lat: la, lon: lo }; }

const map = L.map('map', { attributionControl: false }).setView([lat, lon], 13);
// ArcGIS 返回的是 256px 的栅格瓦片。普通移动页面里，一个 256 CSS px 瓦片在
// 2x/3x iPhone 上会被放大到 512/768 个物理像素，所以即使网络已加载完成仍会发糊。
// 不使用 Leaflet 的 detectRetina（它只有 2x 档），而是按实际 DPR 请求更高一级/两级
// 的 zoom，并以更小的 CSS 尺寸铺回当前地图 zoom：
//   DPR 1 -> z     / 256 CSS px；DPR 2 -> z+1 / 128 CSS px；DPR 3 -> z+2 / 64 CSS px。
// 这样 iPhone 的卫星图不会由低分辨率瓦片放大得到。World_Imagery 的原生层级足以
// 覆盖这里最高的 z+2 请求；maxNativeZoom 也避免 Leaflet 在更高层级继续请求不存在的图块。
const satelliteTileZoomOffset = window.devicePixelRatio >= 3 ? 2 : window.devicePixelRatio > 1 ? 1 : 0;
const satelliteTileSize = 256 / Math.pow(2, satelliteTileZoomOffset);
const satelliteTileOptions = {
  tileSize: satelliteTileSize,
  zoomOffset: satelliteTileZoomOffset,
  maxNativeZoom: 23,
  maxZoom: 19,
  attribution: 'ArcGIS'
};
const tiles = {
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', satelliteTileOptions),
  wgs84: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {maxZoom:19, attribution:'ArcGIS WGS84'}),
  standard: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'\\u00a9 OSM'}),
  dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_2b4m_1_e28b181cee1a1b7969fc0bb3', {maxZoom:19, attribution:'\\u00a9 Carto'}),
  amap: L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {maxZoom:18, subdomains:'1234', attribution:'\\u00a9 高德'}),
  voyager: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_2b4m_1_e28b181cee1a1b7969fc0bb3', {maxZoom:19, attribution:'\\u00a9 Carto'})
};
let currentLayer = tiles.satellite;
currentLayer.addTo(map);
function toggleLayerMenu(force) {
  const menu = document.getElementById('layerMenu');
  const open = typeof force === 'boolean' ? force : !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  document.querySelector('.layer-menu-toggle').setAttribute('aria-expanded', String(open));
}
function switchLayer(name) {
  map.removeLayer(currentLayer);
  currentLayer = tiles[name];
  currentLayer.addTo(map);
  layerIsGcj = (name === 'amap');
  // 底图坐标系变了, 同一个 WGS84 点对应的屏幕位置也就变了, marker 必须重摆,
  // 否则切换图层后它会停在旧图源的像素位置上, 看起来像是坐标被改掉了。
  const d = toDisplay(lat, lon);
  marker.setLatLng([d.lat, d.lon]);
  map.setView([d.lat, d.lon], map.getZoom());
  document.querySelectorAll('.layer-btn').forEach(b => b.classList.toggle('active', b.dataset.layer === name));
  const active = document.querySelector('.layer-btn[data-layer="' + name + '"]');
  if (active) document.getElementById('layerLabel').textContent = active.textContent.trim();
  toggleLayerMenu(false);
}
document.addEventListener('click', e => {
  const menu = document.getElementById('layerMenu');
  if (menu && !menu.contains(e.target)) toggleLayerMenu(false);
});
const targetIcon = L.divIcon({
  className: 'target-pin-icon',
  html: '<div class="target-pin" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><defs><linearGradient id="target-pin-red" x1="10" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ff6b63"/><stop offset="0.48" stop-color="#ff453a"/><stop offset="1" stop-color="#ff3b30"/></linearGradient></defs><path class="pin-outline" d="M24 3C14.1 3 6 11.1 6 21c0 12.2 15.8 22.7 17.1 23.6.6.4 1.2.4 1.8 0C26.2 43.7 42 33.2 42 21 42 11.1 33.9 3 24 3Z"/><path class="pin-fill" d="M24 6C15.7 6 9 12.7 9 21c0 9.4 11.4 18.5 15 21.1C27.6 39.5 39 30.4 39 21 39 12.7 32.3 6 24 6Z"/><circle class="pin-core" cx="24" cy="21" r="9"/><circle class="pin-center" cx="24" cy="21" r="4"/></svg></div>',
  iconSize: [48, 48],
  iconAnchor: [24, 44],
});
let marker = L.marker([lat, lon], {draggable:true, icon:targetIcon}).addTo(map);

// 地图交互给出的都是「屏幕坐标系」的读数, 一律先过 fromDisplay 再进 setPos。
marker.on('dragend', e => { const p=e.target.getLatLng(); setPosFromDisplay(p.lat, p.lng); });
map.on('click', e => { setPosFromDisplay(e.latlng.lat, e.latlng.lng); });

function setPosFromDisplay(dLat, dLon) {
  const w = fromDisplay(dLat, dLon);
  setPos(w.lat, w.lon);
}

// 参数恒为 WGS84。
function setPos(newLat, newLon) {
  lat = newLat; lon = newLon; selected = true;
  const d = toDisplay(lat, lon);
  marker.setLatLng([d.lat, d.lon]);
  document.getElementById('coords').textContent = '经度 ' + lon.toFixed(6) + '  纬度 ' + lat.toFixed(6);
  fetchElevation(lat, lon);
}

function readOptionalNumber(id) {
  const value = document.getElementById(id).value.trim();
  if (value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function fetchElevation(la, lo) {
  try {
    const r = await fetch('https://api.open-meteo.com/v1/elevation?latitude=' + encodeURIComponent(la) + '&longitude=' + encodeURIComponent(lo), { method:'GET', mode:'cors', cache:'no-store' });
    if (!r.ok) throw new Error('elevation api failed');
    const data = await r.json();
    const list = data && data.elevation;
    const value = Array.isArray(list) ? Number(list[0]) : Number(list);
    if (Number.isFinite(value)) {
      altitude = value;
      document.getElementById('altitudeInput').value = Math.round(value);
    }
  } catch (e) {
    console.warn('[elevation] failed', e);
  }
}

function moveTo(newLat, newLon, zoom) {
  setPos(newLat, newLon);
  const d = toDisplay(lat, lon);
  map.setView([d.lat, d.lon], zoom || 15);
}

function toast(msg, ms) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms || 2500);
}

function showError(show) {
  document.getElementById('errorBanner').style.display = show ? 'block' : 'none';
}

/* ---- Favorites (localStorage) ---- */
function getFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch(e) { return []; }
}
function saveFavs(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

function renderFavs() {
  const favs = getFavs();
  const el = document.getElementById('favList');
  const clearBtn = document.getElementById('clearAllBtn');
  clearBtn.style.display = favs.length ? '' : 'none';
  if (!favs.length) {
    el.innerHTML = '<div class="fav-empty">「暂无坐标」</div>';
    return;
  }
  el.innerHTML = favs.map((f, i) => {
    const isActive = activeLon !== null && Math.abs(f.lon - activeLon) < 0.000001 && Math.abs(f.lat - activeLat) < 0.000001;
    return '<div class="fav-item" onclick="loadFav(' + i + ')">' +
      '<div class="fav-info">' +
        '<div class="fav-name">' + escHtml(f.name) + '<\\/div>' +
        '<div class="fav-coords"><span>' + f.lon.toFixed(6) + '<\/span><span>' + f.lat.toFixed(6) + '<\/span><\/div>' +
        (isActive ? '<div class="fav-active">\\u2713 当前生效<\\/div>' : '') +
      '<\\/div>' +
      '<button class="fav-del" onclick="event.stopPropagation();delFav(' + i + ')" title="删除">\\u00d7<\\/button>' +
    '<\\/div>';
  }).join('');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function addFav() {
  if (!selected) { toast('请先选择一个位置'); return; }
  document.getElementById('favModalCoords').innerHTML = '<span>' + lon.toFixed(6) + '<\/span><span>' + lat.toFixed(6) + '<\/span>';
  document.getElementById('favNameInput').value = '';
  document.getElementById('favModal').classList.add('show');
  setTimeout(() => document.getElementById('favNameInput').focus(), 100);
}

function closeFavModal() {
  document.getElementById('favModal').classList.remove('show');
}

function confirmFav() {
  const name = document.getElementById('favNameInput').value.trim();
  if (!name) { toast('输入备注名称'); return; }
  const favs = getFavs();
  favs.push({ name, lon, lat, time: new Date().toISOString() });
  saveFavs(favs);
  closeFavModal();
  renderFavs();
  toast('已收藏: ' + name);
}

function loadFav(i) {
  const favs = getFavs();
  if (!favs[i]) return;
  moveTo(favs[i].lat, favs[i].lon, 15);
  toast(favs[i].name);
}

function delFav(i) {
  const favs = getFavs();
  if (!favs[i]) return;
  const name = favs[i].name;
  favs.splice(i, 1);
  saveFavs(favs);
  renderFavs();
  toast('已删除: ' + name);
}

let confirmResolver = null;
function showConfirm(message) {
  document.getElementById('confirmMessage').textContent = message;
  document.getElementById('confirmModal').classList.add('show');
  return new Promise(resolve => { confirmResolver = resolve; });
}
function closeConfirm(ok) {
  document.getElementById('confirmModal').classList.remove('show');
  if (confirmResolver) { confirmResolver(ok); confirmResolver = null; }
}

async function clearAllFav() {
  if (!(await showConfirm('清空已收藏的位置'))) return;
  saveFavs([]);
  renderFavs();
  toast('已清空所有收藏');
}

/* ---- Active location query ---- */
function setActiveCoords(lo, la, opts) {
  const el = document.getElementById('activeValue');
  const accuracy = opts && opts.accuracy ? '<span class="coord-meta">精度 ' + opts.accuracy + 'm<\/span>' : '';
  const altitudeText = opts && opts.altitude !== undefined && opts.altitude !== null ? '<span class="coord-meta">海拔 ' + opts.altitude + 'm<\/span>' : '';
  const hAcc = opts && opts.horizontalAccuracy ? '<span class="coord-meta">水平 ' + opts.horizontalAccuracy + 'm<\/span>' : '';
  const vAcc = opts && opts.verticalAccuracy ? '<span class="coord-meta">垂直 ' + opts.verticalAccuracy + 'm<\/span>' : '';
  const randomRadius = opts && opts.randomRadius ? '<span class="coord-meta">扰动 ' + opts.randomRadius + 'm<\/span>' : '';
  el.className = 'value coords-line';
  el.innerHTML = '<span>经度 ' + lo.toFixed(6) + '<\/span><span>纬度 ' + la.toFixed(6) + '<\/span>' + accuracy + altitudeText + hAcc + vAcc + randomRadius;
}
function setActiveText(text) {
  const el = document.getElementById('activeValue');
  el.className = 'value';
  el.textContent = text;
}

function queryActive() {
  setActiveText('查询中...');
  fetch(SAVE_API + '?action=query', { method:'GET', mode:'cors', cache:'no-store' })
    .then(r => r.json())
    .then(d => {
      if (d.success && d.longitude && d.latitude) {
        activeLon = parseFloat(d.longitude);
        activeLat = parseFloat(d.latitude);
        const rr = d.randomRadius || 0;
        setActiveCoords(activeLon, activeLat, { accuracy: d.accuracy, altitude: d.altitude, horizontalAccuracy: d.horizontalAccuracy, verticalAccuracy: d.verticalAccuracy, randomRadius: rr });
        document.getElementById('radiusInput').value = rr;
        if (d.altitude !== undefined && d.altitude !== null) document.getElementById('altitudeInput').value = d.altitude;
        if (d.horizontalAccuracy !== undefined && d.horizontalAccuracy !== null) document.getElementById('horizontalAccuracyInput').value = d.horizontalAccuracy;
        if (d.verticalAccuracy !== undefined && d.verticalAccuracy !== null) document.getElementById('verticalAccuracyInput').value = d.verticalAccuracy;
        renderFavs();
      } else {
        activeLon = null; activeLat = null;
        setActiveText('无已保存的坐标');
        renderFavs();
      }
    })
    .catch(() => {
      setActiveText('查询结果');
    });
}

async function clearActive() {
  if (!(await showConfirm('清空设备已保存坐标'))) return;
  fetch(SAVE_API + '?action=clear', { method:'GET', mode:'cors', cache:'no-store' })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        activeLon = null; activeLat = null;
        setActiveText('已清空');
        renderFavs();
        toast('已清空设备坐标');
      } else { toast('清空失败: ' + (d.error || ''), 3000); }
    })
    .catch(() => { toast('清空失败', 3000); });
}

/* ---- Save to device ---- */
async function save() {
  if (!selected) { toast('请先选择一个位置'); return; }
  const btn = document.getElementById('saveBtn');
  btn.textContent = '保存中...'; btn.disabled = true;
  showError(false);
  try {
    const radius = parseInt(document.getElementById('radiusInput').value) || 0;
    const alt = readOptionalNumber('altitudeInput');
    const hAcc = readOptionalNumber('horizontalAccuracyInput');
    const vAcc = readOptionalNumber('verticalAccuracyInput');
    const params = new URLSearchParams({ lon: String(lon), lat: String(lat), acc: String(hAcc ?? 15), randomRadius: String(radius) });
    if (alt !== null) params.set('altitude', String(alt));
    if (hAcc !== null) params.set('horizontalAccuracy', String(hAcc));
    if (vAcc !== null) params.set('verticalAccuracy', String(vAcc));
    const r = await fetch(SAVE_API + '?' + params.toString(), {
      method: 'GET', mode: 'cors', cache: 'no-store'
    });
    const d = await r.json();
    if (d.success) {
      activeLon = lon; activeLat = lat;
      btn.textContent = '\\u2713 已保存'; btn.className = 'btn btn-primary success';
      document.getElementById('status').textContent = '\\u2713 已写入: ' + lon.toFixed(6) + ', ' + lat.toFixed(6) + ' \\u00b7 ' + new Date().toLocaleTimeString('zh-CN');
      setActiveCoords(lon, lat, { accuracy: hAcc ?? 15, altitude: alt, horizontalAccuracy: hAcc, verticalAccuracy: vAcc });
      renderFavs();
      toast('\\u2713 坐标已写入设备');
      setTimeout(() => { btn.textContent='保存到设备'; btn.className='btn btn-primary'; btn.disabled=false; }, 2500);
    } else {
      throw new Error(d.error || '写入失败');
    }
  } catch(e) {
    btn.textContent = '保存到设备'; btn.className = 'btn btn-primary'; btn.disabled = false;
    showError(true);
    toast('保存失败', 4000);
  }
}

function locateMe() {
  if (!navigator.geolocation) return toast('浏览器不支持定位');
  toast('获取位置中...');
  navigator.geolocation.getCurrentPosition(
    pos => { moveTo(pos.coords.latitude, pos.coords.longitude, 16); toast('已获取当前位置'); },
    err => toast('定位失败: ' + err.message, 3000),
    { enableHighAccuracy:true, timeout:10000 }
  );
}

function parseMapUrl(text) {
  let m;
  m = text.match(/ll=([0-9.-]+),([0-9.-]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  m = text.match(/@([0-9.-]+),([0-9.-]+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  m = text.match(/lnglat=([0-9.-]+),([0-9.-]+)/);
  if (m) return { lat: parseFloat(m[2]), lon: parseFloat(m[1]) };
  m = text.match(/(?:location|center)=([0-9.-]+),([0-9.-]+)/);
  if (m) return { lat: parseFloat(m[2]), lon: parseFloat(m[1]) };
  m = text.match(/(-?[0-9]+\\.[0-9]+)[,\\s]+(-?[0-9]+\\.[0-9]+)/);
  if (m) {
    const a = parseFloat(m[1]), b = parseFloat(m[2]);
    // 纬度绝对值不超过 90, 经度可达 180: 按绝对值判断谁是经度, 否则
    // -122.009 这类西经会被当成纬度 (-122 < 90 恒成立)。
    if (Math.abs(a) <= 90 && Math.abs(b) > 90) return { lat: a, lon: b };
    if (Math.abs(b) <= 90 && Math.abs(a) > 90) return { lat: b, lon: a };
    return { lat: a, lon: b };
  }
  return null;
}

// 含链接的输入交给服务端 /api/parse: 浏览器读不到跨域 302 的 Location 头, 短链
// 只能由 worker 展开; 服务端还认 coordinate= 并按来源做 GCJ-02->WGS84 换算。
// 纯坐标文本本地直接解析 —— 它也是唯一不需要坐标系换算的输入, 免去一次往返。
async function parseUrl() {
  const input = document.getElementById('urlInput').value.trim();
  if (!input) return toast('请粘贴链接或坐标');

  const low = input.toLowerCase();
  if (low.includes('http://') || low.includes('https://')) {
    toast('解析中...');
    let data;
    try {
      const r = await fetch('/api/parse?format=json&u=' + encodeURIComponent(input));
      data = await r.json();
    } catch (e) {
      toast('解析服务不可达', 3000);
      return;
    }
    if (!data || data.error || typeof data.lat !== 'number') {
      toast(data && data.error ? data.error : '请检查格式', 3000);
      return;
    }
    moveTo(data.lat, data.lon, 15);
    document.getElementById('urlInput').value = '';
    toast(data.name ? '📍 ' + data.name : '📍 ' + data.lon.toFixed(4) + ', ' + data.lat.toFixed(4));
    return;
  }

  const result = parseMapUrl(input);
  if (!result) { toast('请检查格式', 3000); return; }
  moveTo(result.lat, result.lon, 15);
  document.getElementById('urlInput').value = '';
  toast('📍 ' + result.lon.toFixed(4) + ', ' + result.lat.toFixed(4));
}

async function searchPlace() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) return toast('请输入地名');
  toast('搜索中...');
  try {
    const r = await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(q));
    const results = await r.json();
    if (!results.length) { toast('未找到: ' + q, 3000); return; }
    const p = results[0];
    moveTo(parseFloat(p.lat), parseFloat(p.lon), 15);
    document.getElementById('searchInput').value = '';
    toast(p.display_name.slice(0, 40));
  } catch(e) { toast('搜索失败', 3000); }
}

document.addEventListener('paste', e => {
  const text = (e.clipboardData||window.clipboardData).getData('text');
  if (!text) return;
  if (!(text.includes('map') || text.includes('loc') || text.includes('lnglat') || /[0-9]+\\.[0-9]+/.test(text))) return;
  const input = document.getElementById('urlInput');
  // 粘贴目标本来就是这个输入框时, 让浏览器原生插入即可; 此处再赋一次值,
  // 原生插入会叠加在后面, 结果是同一段文本出现两遍。
  if (e.target !== input) input.value = text;
});
document.getElementById('searchInput').addEventListener('keydown', e => { if(e.key==='Enter') searchPlace(); });
document.getElementById('favNameInput').addEventListener('keydown', e => { if(e.key==='Enter') confirmFav(); });

renderFavs();
queryActive();
<\/script>
</body>
</html>`;
}
