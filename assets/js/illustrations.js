/*
 * Old-Mac style 1-bit pixel icons combined with Figma UI (selection boxes, tags,
 * cursors, bezier handles, frames, components).
 * Every illustration is an inline SVG with NO background, so it is fully transparent.
 * Colours come from CSS custom properties so they can be re-themed:
 *   --ill-ink   (default #111)   pixels, outlines, solid fills
 *   --ill-paper (default #fff)   icon interiors, UI surfaces
 * Eyes on the little computer are wrapped in <g class="pupil"> so main.js can make them follow the cursor.
 *
 * Pixel icons are not hand-placed: a tiny rasteriser fills shapes (rounded rects, ellipses,
 * polygons) on a grid and outlines them automatically, the way classic 32×32 icons were drawn.
 */
(function (root) {
  const STYLE = `<style>
    .k{fill:var(--ill-ink,#111)}
    .w{fill:var(--ill-paper,#fff)}
    .p{fill:var(--ill-paper,#fff);stroke:var(--ill-ink,#111);stroke-width:5;stroke-linejoin:round;stroke-linecap:round}
    .l{fill:none;stroke:var(--ill-ink,#111);stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
    .t{fill:none;stroke:var(--ill-ink,#111);stroke-width:2.5;stroke-linecap:round}
    .d{fill:none;stroke:var(--ill-ink,#111);stroke-width:3;stroke-dasharray:2 10;stroke-linecap:round}
    .tx{font:600 15px 'DM Mono',ui-monospace,monospace;fill:var(--ill-paper,#fff);letter-spacing:.02em}
    .tk{font:600 15px 'DM Mono',ui-monospace,monospace;fill:var(--ill-ink,#111);letter-spacing:.02em}
    .px{font:400 16px 'Silkscreen','Courier New',monospace;fill:var(--ill-ink,#111)}
  </style>`;

  const svg = (vb, body, label) =>
    `<svg class="ill" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${STYLE}${body}</svg>`;

  /* =========================================================
     1-bit pixel rasteriser
     0 = transparent, 1 = ink, 2 = paper
     ========================================================= */
  function Grid(w, h) {
    this.w = w; this.h = h; this.c = new Uint8Array(w * h);
  }
  Grid.prototype.set = function (x, y, v) {
    x = Math.round(x); y = Math.round(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.c[y * this.w + x] = v;
  };
  Grid.prototype.get = function (x, y) { return x < 0 || y < 0 || x >= this.w || y >= this.h ? 0 : this.c[y * this.w + x]; };
  // fill a shape; mode 'blob' = paper inside with 1px ink outline, 'ink' = solid ink, 'paper' = solid paper, 'dither' = 50% checker
  Grid.prototype.shape = function (inside, mode = 'blob') {
    const m = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) m[y * this.w + x] = inside(x + 0.5, y + 0.5);
    const at = (x, y) => x >= 0 && y >= 0 && x < this.w && y < this.h && m[y * this.w + x];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (!m[y * this.w + x]) continue;
      const edge = !at(x - 1, y) || !at(x + 1, y) || !at(x, y - 1) || !at(x, y + 1);
      let v;
      if (mode === 'clear') v = 0;
      else if (mode === 'ink') v = 1;
      else if (mode === 'paper') v = 2;
      else if (mode === 'dither') v = edge || (x + y) % 2 === 0 ? 1 : 2;
      else v = edge ? 1 : 2;
      this.c[y * this.w + x] = v;
    }
    return this;
  };
  Grid.prototype.line = function (x0, y0, x1, y1, v = 1) {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    for (;;) {
      this.set(x0, y0, v);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
    return this;
  };
  Grid.prototype.rect = function (x, y, w, h, v = 1) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, v); return this; };
  Grid.prototype.frame = function (x, y, w, h, v = 1) { this.line(x, y, x + w - 1, y, v); this.line(x, y + h - 1, x + w - 1, y + h - 1, v); this.line(x, y, x, y + h - 1, v); this.line(x + w - 1, y, x + w - 1, y + h - 1, v); return this; };
  // render as two run-length paths (ink + paper)
  Grid.prototype.svg = function (x, y, s, extra = '') {
    let ink = '', paper = '';
    for (let j = 0; j < this.h; j++) {
      let i = 0;
      while (i < this.w) {
        const v = this.c[j * this.w + i];
        let k = i;
        while (k < this.w && this.c[j * this.w + k] === v) k++;
        if (v) { const d = `M${i} ${j}h${k - i}v1h-${k - i}z`; if (v === 1) ink += d; else paper += d; }
        i = k;
      }
    }
    return `<g transform="translate(${x} ${y}) scale(${s})" shape-rendering="crispEdges">${paper ? `<path class="w" d="${paper}"/>` : ''}<path class="k" d="${ink}"/>${extra}</g>`;
  };

  // shape predicates
  const rr = (x, y, w, h, r = 0) => (px, py) => {
    if (px < x || py < y || px > x + w || py > y + h) return false;
    const cx = Math.min(Math.max(px, x + r), x + w - r), cy = Math.min(Math.max(py, y + r), y + h - r);
    return (px - cx) ** 2 + (py - cy) ** 2 <= r * r + 0.01;
  };
  const ell = (cx, cy, rx, ry = rx) => (px, py) => ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 <= 1;
  const poly = (pts) => (px, py) => {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  const any = (...fs) => (x, y) => fs.some((f) => f(x, y));
  const not = (f, g) => (x, y) => f(x, y) && !g(x, y);

  /* ---------- pixel icons (original designs in the classic 1-bit style) ---------- */
  const PX = {};

  // little desktop computer with a face (eyes drawn separately so they can move)
  PX.computer = () => {
    const g = new Grid(32, 40);
    g.shape(rr(2, 32, 28, 7, 1));
    g.shape(rr(1, 0, 30, 34, 3));
    g.line(2, 33, 29, 33);
    g.shape(rr(5, 4, 22, 17, 2));
    g.frame(7, 6, 18, 13, 1);
    g.line(11, 15, 12, 16).line(12, 16, 19, 16).line(19, 16, 20, 15);
    g.rect(17, 25, 9, 2, 1);
    g.frame(6, 26, 4, 4, 1);
    g.line(4, 36, 27, 36);
    return g;
  };
  PX.computerEyes = (x, y, s) =>
    `<g class="pupil"><rect class="k" x="${x + 11 * s}" y="${y + 9 * s}" width="${2 * s}" height="${3 * s}" shape-rendering="crispEdges"/><rect class="k" x="${x + 19 * s}" y="${y + 9 * s}" width="${2 * s}" height="${3 * s}" shape-rendering="crispEdges"/></g>`;

  PX.pencil = () => {
    const g = new Grid(40, 40);
    g.shape(poly([[30, 1], [38, 9], [33, 14], [25, 6]]), 'dither');
    g.shape(poly([[25, 6], [33, 14], [30, 17], [22, 9]]));
    g.line(24, 8, 31, 15);
    g.shape(poly([[22, 9], [30, 17], [13, 34], [5, 26]]));
    g.line(26, 13, 9, 30);
    g.shape(poly([[5, 26], [13, 34], [2, 38]]));
    g.shape(poly([[3, 33], [7, 37], [1, 39]]), 'ink');
    return g;
  };

  PX.window = () => {
    const g = new Grid(66, 48);
    g.rect(1, 1, 65, 47, 1);
    g.shape(rr(0, 0, 64, 46, 0));
    for (let y = 2; y <= 7; y += 2) g.line(2, y, 61, y);
    g.rect(20, 2, 25, 6, 2);
    g.rect(5, 2, 7, 6, 2);
    g.frame(6, 2, 5, 6);
    g.line(0, 9, 63, 9);
    g.frame(4, 13, 56, 4);
    g.frame(4, 20, 24, 19);
    g.line(4, 20, 27, 38).line(27, 20, 4, 38);
    g.rect(32, 21, 26, 2).rect(32, 26, 20, 2).rect(32, 31, 24, 2);
    g.shape(rr(32, 35, 17, 6, 3), 'ink');
    g.rect(36, 37, 9, 2, 2);
    g.line(0, 42, 63, 42);
    for (let x = 4; x < 60; x += 4) g.set(x, 44, 1);
    return g;
  };

  PX.hand = () => {
    const g = new Grid(32, 38);
    const finger = rr(11, 1, 6, 17, 3);
    const k1 = rr(16, 11, 5, 9, 2.5), k2 = rr(20, 12, 5, 9, 2.5), k3 = rr(24, 13, 5, 9, 2.5);
    const palm = rr(8, 15, 21, 15, 4);
    const thumb = poly([[9, 18], [3, 15], [1, 18], [7, 25], [10, 25]]);
    g.shape(any(finger, k1, k2, k3, palm, thumb));
    g.line(16, 13, 16, 18).line(20, 14, 20, 19).line(24, 15, 24, 20);
    g.line(12, 4, 15, 4);
    g.shape(rr(9, 29, 19, 8, 1));
    g.line(9, 32, 27, 32);
    return g;
  };

  PX.magnifier = () => {
    const g = new Grid(34, 34);
    g.shape(poly([[19, 22], [22, 19], [33, 30], [30, 33]]), 'ink');
    g.shape(ell(13, 13, 12.5), 'ink');
    g.shape(ell(13, 13, 9.5), 'clear');
    g.line(8, 7, 11, 5).line(6, 10, 6, 9);
    return g;
  };

  PX.document = () => {
    const g = new Grid(28, 34);
    g.shape(poly([[0.5, 0.5], [19.5, 0.5], [27.5, 8.5], [27.5, 33.5], [0.5, 33.5]]));
    g.line(19, 0, 19, 8).line(19, 8, 27, 8);
    g.rect(4, 5, 11, 1).rect(4, 8, 8, 1);
    [[5, 18], [9, 12], [13, 20], [17, 9], [21, 15]].forEach(([x, top]) => g.rect(x, top, 3, 30 - top));
    g.line(3, 30, 25, 30);
    return g;
  };

  PX.folder = () => {
    const g = new Grid(36, 28);
    g.shape(rr(1, 1, 14, 7, 2));
    g.shape(rr(1, 5, 34, 22, 1));
    g.line(2, 5, 14, 5);
    g.line(2, 9, 33, 9);
    return g;
  };

  PX.floppy = () => {
    const g = new Grid(32, 32);
    g.shape(poly([[0.5, 0.5], [28.5, 0.5], [31.5, 3.5], [31.5, 31.5], [0.5, 31.5]]));
    g.shape(rr(7, 0.5, 17, 11, 0), 'dither');
    g.rect(18, 3, 3, 6, 2);
    g.shape(rr(5, 16, 22, 15, 1));
    g.rect(8, 20, 16, 1).rect(8, 23, 13, 1).rect(8, 26, 15, 1);
    return g;
  };

  PX.trash = () => {
    const g = new Grid(28, 36);
    g.shape(rr(9, 0, 10, 5, 1));
    g.shape(rr(1, 4, 26, 5, 1));
    g.shape(poly([[3, 8.5], [25, 8.5], [23, 35.5], [5, 35.5]]));
    [9, 14, 19].forEach((x) => g.line(x, 12, x, 32));
    return g;
  };

  PX.watch = () => {
    const g = new Grid(24, 36);
    g.shape(rr(6, 0, 12, 9, 1), 'dither');
    g.shape(rr(6, 27, 12, 9, 1), 'dither');
    g.shape(ell(12, 18, 11));
    g.line(12, 18, 12, 10).line(12, 18, 17, 18);
    [[12, 8], [12, 28], [2, 18], [22, 18]].forEach(([x, y]) => g.set(x, y, 1));
    return g;
  };

  PX.bomb = () => {
    const g = new Grid(34, 34);
    g.shape(ell(14, 20, 12.5), 'ink');
    g.shape(poly([[18, 6], [25, 9], [22, 14], [16, 11]]), 'ink');
    g.line(8, 15, 10, 13).line(7, 17, 7, 18).line(11, 12, 12, 12);
    [[9, 14], [8, 16]].forEach(([x, y]) => g.set(x, y, 2));
    g.line(22, 8, 25, 4).line(25, 4, 27, 4);
    [[30, 1], [30, 7], [27, 0], [33, 4], [32, 1], [32, 7], [28, 7]].forEach(([x, y]) => g.set(x, y, 1));
    return g;
  };

  /* ---------- Figma UI parts (vector) ---------- */
  function cursor(x, y, s = 1, r = 0) {
    return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
      <path class="k" d="M0 0 L0 62 L15 48 L27 74 L39 68 L27 43 L47 43 Z" stroke="var(--ill-paper,#fff)" stroke-width="5" stroke-linejoin="round"/>
    </g>`;
  }
  function nameTag(x, y, text, dark = true) {
    const w = text.length * 9.4 + 20;
    return `<g transform="translate(${x} ${y})">
      <rect x="0" y="0" width="${w}" height="26" rx="5" class="${dark ? 'k' : 'p'}" ${dark ? '' : 'style="stroke-width:3"'}/>
      <text x="10" y="18" class="${dark ? 'tx' : 'tk'}">${text}</text>
    </g>`;
  }
  const handle = (x, y) => `<rect class="p" x="${x - 6}" y="${y - 6}" width="12" height="12" style="stroke-width:3"/>`;
  const selection = (x, y, w, h) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="t" style="stroke-width:2"/>${handle(x, y)}${handle(x + w, y)}${handle(x, y + h)}${handle(x + w, y + h)}`;
  function diamond4(x, y, s = 1) {
    const d = (cx, cy) => `<path class="k" d="M${cx} ${cy - 13} L${cx + 13} ${cy} L${cx} ${cy + 13} L${cx - 13} ${cy}Z"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${d(0, -17)}${d(17, 0)}${d(0, 17)}${d(-17, 0)}</g>`;
  }
  const sparkle = (x, y, s = 1) => `<path class="k" transform="translate(${x} ${y}) scale(${s})" d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3Z"/>`;

  /* =========================================================
     Illustrations (names kept so pages don't change)
     ========================================================= */
  const ILL = { PX };

  // Pocket / generic: smiling computer inside a Figma selection, with multiplayer cursors
  ILL.cursorKid = () => {
    const s = 8, x = 92, y = 82;
    return svg('0 0 440 480', `
      ${selection(70, 52, 300, 382)}
      ${nameTag(70, 18, 'Designer')}
      ${nameTag(176, 446, '300 × Hug', false)}
      ${PX.computer().svg(x, y, s)}
      ${PX.computerEyes(x, y, s)}
      ${sparkle(392, 96, 1.1)}${sparkle(40, 300, .8)}
      ${cursor(360, 330, 0.55, -10)}
      ${nameTag(380, 370, 'you', true)}
      ${cursor(26, 150, 0.5, -10)}
      ${nameTag(0, 188, 'PM', false)}
    `, 'Pixel-art retro computer with a smiling face inside a Figma selection box');
  };

  // Pen tool: pixel pencil drawing a bezier curve with Figma anchors & handles
  ILL.penPal = () => {
    const s = 6, x = 232, y = 40;
    return svg('0 0 460 400', `
      <path class="l" d="M24 330 C110 160 190 380 253 271" style="stroke-width:4"/>
      <path class="t" d="M24 330 L90 210"/><circle class="p" cx="90" cy="210" r="7" style="stroke-width:3"/>
      <path class="t" d="M160 296 L110 296 M160 296 L210 296"/><circle class="p" cx="110" cy="296" r="7" style="stroke-width:3"/><circle class="p" cx="210" cy="296" r="7" style="stroke-width:3"/>
      ${handle(24, 330)}${handle(160, 296)}
      ${PX.pencil().svg(x, y, s)}
      ${nameTag(300, 330, 'Pen (P)', true)}
      ${sparkle(410, 60, 1)}
    `, 'Pixel-art pencil drawing a bezier curve with Figma anchor points');
  };

  // A classic window, selected as a Figma frame, with a wireframe inside
  ILL.framePeek = () => {
    const s = 6, x = 32, y = 62;
    return svg('0 0 460 380', `
      <text x="32" y="50" class="tk" style="font-size:14px">Frame 12 — 1440</text>
      ${PX.window().svg(x, y, s)}
      <text x="${x + 32.5 * s}" y="${y + 6.6 * s}" text-anchor="middle" class="px" style="font-size:15px">untitled</text>
      ${handle(32, 62)}${handle(416, 62)}${handle(32, 338)}${handle(416, 338)}
      ${cursor(316, 268, 0.5, -10)}
      ${nameTag(340, 300, 'you', true)}
    `, 'Pixel-art classic window with a wireframe, selected as a Figma frame');
  };

  // Hand pointer juggling components
  ILL.juggler = () => {
    const s = 8, x = 84, y = 150;
    return svg('0 0 440 460', `
      <path class="d" d="M110 170 C130 30 310 30 330 170"/>
      <g class="float-a">${diamond4(120, 118, 1)}</g>
      <g class="float-b"><rect class="p" x="194" y="22" width="52" height="52" rx="8"/><text x="204" y="56" class="tk" style="font-size:22px">Aa</text></g>
      <g class="float-c"><g transform="translate(320 118)"><path class="p" d="M0 -26 L26 0 L0 26 L-26 0Z"/><path class="k" d="M0 -10 L10 0 L0 10 L-10 0Z"/></g></g>
      ${PX.hand().svg(x, y, s)}
      <path class="l" d="M150 150 l-14 -12 M206 128 l0 -16 M246 150 l14 -12" style="stroke-width:4"/>
    `, 'Pixel-art pointing hand juggling Figma component icons');
  };

  // Figma comment bubble with a pixel floppy: saved & approved
  ILL.commenter = () => {
    const s = 5, x = 132, y = 26;
    return svg('0 -40 420 460', `
      <path class="p" d="M60 404 L60 276 C60 214 110 180 210 180 C310 180 360 214 360 292 C360 370 310 404 210 404 Z"/>
      <text x="210" y="338" text-anchor="middle" class="tk" style="font:400 52px 'Anton',Impact,sans-serif;letter-spacing:.02em">LGTM!</text>
      <path class="l" d="M140 364 H282" style="stroke-width:4"/>
      ${PX.floppy().svg(x, y, s)}
      ${sparkle(318, 40, 1.1)}${sparkle(96, 120, .8)}
      ${nameTag(250, 120, 'saved ✓', true)}
    `, 'Pixel-art floppy disk on a Figma comment bubble that says LGTM');
  };

  // Stacked folders = design-system layers, with a v2.0 flag
  ILL.layers = () => {
    const s = 7;
    const f = PX.folder();
    const label = (x, y, t) => `<text x="${x}" y="${y}" class="px" style="font-size:20px">${t}</text>`;
    return svg('0 0 540 500', `
      ${f.svg(190, 60, s)}${label(212, 158, 'Patterns')}
      ${f.svg(145, 175, s)}${label(167, 273, 'Components')}
      ${f.svg(100, 290, s)}${label(122, 388, 'Tokens')}
      <path class="l" d="M410 0 L410 96" style="stroke-width:6"/>
      <path class="k" d="M414 2 L494 16 L414 50 Z"/><text x="420" y="30" class="tx" style="font-size:13px">v2.0</text>
      ${sparkle(120, 200, .9)}
    `, 'Pixel-art stacked folders labelled tokens, components and patterns with a v2.0 flag');
  };

  // Magnifier over a document with a bar chart
  ILL.researcher = (tag = 'n = 14 interviews') =>
    svg('0 0 460 460', `
      <g transform="rotate(-6 140 290)">${PX.document().svg(40, 170, 7)}</g>
      ${PX.magnifier().svg(139, 209, 7)}
      ${tag ? nameTag(Math.max(10, 440 - tag.length * 9.4 - 20), 30, tag) : ''}
      ${cursor(380, 300, 0.5, -10)}
      ${sparkle(360, 140, 1)}
    `, 'Pixel-art magnifying glass over a document with a bar chart');

  /* ---------- housing set (Otbasy case): more old-Mac 1-bit icons ---------- */
  PX.house = () => {
    const g = new Grid(32, 32);
    g.shape(rr(22, 3, 4, 9, 0));
    g.shape(poly([[16, 1], [31.5, 15.5], [0.5, 15.5]]), 'dither');
    g.shape(rr(4, 14, 24, 17, 0));
    g.line(1, 15, 30, 15);
    g.frame(13, 21, 6, 10); g.rect(14, 22, 4, 9, 2); g.set(16.6, 26, 1);
    g.frame(6, 18, 5, 5); g.line(8, 18, 8, 22); g.line(6, 20, 10, 20);
    g.frame(21, 18, 5, 5); g.line(23, 18, 23, 22); g.line(21, 20, 25, 20);
    g.line(0, 31, 31, 31);
    return g;
  };
  PX.key = () => {
    const g = new Grid(38, 18);
    g.shape(ell(8, 9, 7.5), 'ink'); g.shape(ell(8, 9, 5.2), 'paper'); g.shape(ell(8, 9, 2.4), 'ink'); g.shape(ell(8, 9, 1.2), 'clear');
    g.shape(rr(15, 7, 22, 4, 0)); g.shape(rr(27, 10, 3, 6, 0)); g.shape(rr(32, 10, 3, 4, 0));
    return g;
  };
  PX.idCard = () => {
    const g = new Grid(40, 28);
    g.shape(rr(0, 0, 40, 28, 2)); g.shape(rr(3, 5, 12, 15, 0));
    g.shape(ell(9, 10, 3), 'ink'); g.shape(rr(5, 15, 8, 5, 2), 'ink');
    g.rect(18, 6, 18, 2); g.rect(18, 11, 13, 2); g.rect(18, 16, 16, 2);
    g.shape(rr(1, 22, 38, 5, 0), 'dither'); g.rect(3, 2, 8, 1);
    return g;
  };
  PX.stamp = () => {
    const g = new Grid(26, 26);
    g.shape(ell(13, 13, 12.5), 'ink'); g.shape(ell(13, 13, 10), 'paper'); g.shape(ell(13, 13, 8.5), 'ink'); g.shape(ell(13, 13, 7), 'paper');
    g.line(8, 13, 11, 16).line(11, 16, 18, 9).line(8, 14, 11, 17).line(11, 17, 18, 10);
    return g;
  };
  PX.alert = () => {
    const g = new Grid(46, 32);
    g.rect(1, 1, 46, 32, 1); g.shape(rr(0, 0, 45, 31, 0)); g.frame(2, 2, 41, 27);
    g.shape(poly([[11, 5], [20, 20], [2, 20]])); g.rect(10, 9, 2, 6); g.rect(10, 16, 2, 2);
    g.rect(23, 7, 17, 2); g.rect(23, 11, 13, 2); g.rect(23, 15, 15, 2);
    g.shape(rr(25, 19, 18, 10, 4), 'ink'); g.shape(rr(27, 21, 14, 6, 2), 'paper');
    g.frame(29, 22, 4, 4); g.line(35, 22, 35, 25); g.line(36, 23, 38, 22); g.line(36, 24, 38, 25);
    return g;
  };
  PX.ticket = () => {
    const g = new Grid(42, 24);
    g.shape(rr(0, 0, 42, 24, 1));
    g.shape(ell(0, 12, 4.5), 'ink'); g.shape(ell(0, 12, 3), 'clear'); g.shape(ell(42, 12, 4.5), 'ink'); g.shape(ell(42, 12, 3), 'clear');
    for (let y = 2; y < 22; y += 3) g.set(30, y, 1);
    g.rect(6, 5, 20, 4); g.rect(6, 11, 8, 1); g.rect(6, 13, 18, 3); g.rect(6, 18, 12, 2);
    g.shape(poly([[36, 6], [37.5, 10], [41, 10], [38, 12.5], [39, 16.5], [36, 14], [33, 16.5], [34, 12.5], [31, 10], [34.5, 10]]), 'ink');
    return g;
  };
  PX.macHome = () => {
    const g = new Grid(32, 40);
    g.shape(rr(2, 32, 28, 7, 1)); g.shape(rr(1, 0, 30, 34, 3)); g.line(2, 33, 29, 33);
    g.shape(rr(5, 4, 22, 17, 2)); g.frame(7, 6, 18, 13, 1);
    g.line(11, 12, 16, 8).line(16, 8, 21, 12); g.frame(12, 12, 9, 6); g.rect(15, 14, 3, 4);
    g.rect(17, 25, 9, 2, 1); g.frame(6, 26, 4, 4, 1); g.line(4, 36, 27, 36);
    return g;
  };

  // Otbasy: a classic Mac showing a house — the queue lives in one cabinet
  ILL.macHome = () => svg('0 0 440 480', `
      ${nameTag(70, 20, 'queue #1284')}
      ${PX.macHome().svg(92, 70, 8)}
      ${sparkle(392, 120, 1.1)}${sparkle(40, 320, .8)}
      ${cursor(350, 340, 0.55, -10)}
      ${nameTag(372, 380, 'you', true)}
      ${cursor(30, 160, 0.5, -10)}
      ${nameTag(4, 198, 'PM', false)}
    `, 'Pixel-art classic computer showing a house, tagged queue number 1284');

  // A pixel house selected as a Figma frame
  ILL.houseFrame = () => svg('0 0 440 430', `
      ${selection(60, 66, 300, 306)}
      ${nameTag(60, 30, 'Home 01')}
      ${nameTag(150, 384, '240 × 240', false)}
      ${PX.house().svg(90, 100, 7.5)}
      ${sparkle(400, 90, 1.1)}${sparkle(28, 320, .8)}
      ${cursor(332, 300, 0.55, -10)}
      ${nameTag(356, 342, 'you', true)}
    `, 'Pixel-art house inside a Figma selection box');

  // ID card with an approval stamp
  ILL.idCheck = () => svg('0 0 460 420', `
      <g transform="rotate(-5 200 230)">${PX.idCard().svg(30, 110, 8.5)}</g>
      ${PX.stamp().svg(290, 230, 6.5)}
      ${nameTag(230, 40, 'IIN ✓ verified')}
      ${sparkle(60, 70, 1)}
      ${cursor(400, 330, 0.5, -10)}
    `, 'Pixel-art ID card with a round approval stamp');

  // Classic Mac alert: all set
  ILL.allSet = () => svg('0 0 460 400', `
      ${PX.alert().svg(20, 50, 9)}
      <text x="120" y="38" class="tk" style="font:400 34px 'Anton',Impact,sans-serif">ALL SET!</text>
      ${cursor(318, 250, 0.6, -10)}
      ${sparkle(420, 60, 1.1)}${sparkle(40, 360, .8)}
    `, 'Pixel-art classic Mac alert dialog with the cursor on OK');

  /* ---------- stickers (click-to-stick toy & decorations) ---------- */
  const st = (vb, body, label) => svg(vb, body, label).replace('class="ill"', 'class="ill sticker-svg"');
  const pxSticker = (icon, w, h, s, label, tag) =>
    st(`-8 -8 ${w * s + 16} ${h * s + 16 + (tag ? 30 : 0)}`, `${icon.svg(0, 0, s)}${tag ? nameTag(0, h * s + 8, tag, true) : ''}`, label);

  ILL.stickers = {
    burst: () =>
      st('0 0 160 160', `<path class="p" d="${(() => {
        let d = '';
        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * Math.PI * 2, r = i % 2 ? 58 : 76;
          d += (i ? 'L' : 'M') + (80 + r * Math.cos(a)).toFixed(1) + ' ' + (80 + r * Math.sin(a)).toFixed(1) + ' ';
        }
        return d + 'Z';
      })()}"/><text x="80" y="92" text-anchor="middle" class="tk" style="font:400 34px 'Anton',Impact,sans-serif">NEW!</text>`, 'Sticker: NEW!'),
    ship: () => st('0 0 200 90', `<rect class="k" x="4" y="4" width="192" height="82" rx="41"/><text x="100" y="58" text-anchor="middle" class="tx" style="font:400 36px 'Anton',Impact,sans-serif">SHIP IT</text>`, 'Sticker: ship it'),
    wip: () => st('0 0 170 100', `<rect class="p" x="6" y="6" width="158" height="88" rx="10"/><rect class="k" x="16" y="16" width="138" height="68" rx="6"/><text x="85" y="66" text-anchor="middle" class="tx" style="font:400 42px 'Anton',Impact,sans-serif">WIP</text>`, 'Sticker: WIP'),
    component: () => st('-50 -50 100 100', `<circle class="p" cx="0" cy="0" r="44"/>${diamond4(0, 0, 0.9)}`, 'Sticker: component'),
    cursor: () => st('-10 -10 110 120', `${cursor(10, 6, 1.1, -6)}<g transform="translate(46 78)"><rect class="k" x="0" y="0" width="48" height="24" rx="5"/><text x="9" y="17" class="tx" style="font-size:13px">hi!</text></g>`, 'Sticker: cursor'),
    a11y: () => st('0 0 150 150', `<circle class="k" cx="75" cy="75" r="70"/><circle class="p" cx="75" cy="75" r="56" style="stroke-dasharray:4 8"/><text x="75" y="70" text-anchor="middle" class="tk" style="font:400 28px 'Anton',Impact,sans-serif">WCAG</text><text x="75" y="100" text-anchor="middle" class="tk" style="font-size:16px">AA ✓</text>`, 'Sticker: WCAG AA'),
    star: () => st('0 0 120 120', `<path class="p" d="M60 6 L74 44 L114 46 L82 70 L94 110 L60 86 L26 110 L38 70 L6 46 L46 44Z"/>`, 'Sticker: star'),
    pixel: () => st('0 0 150 70', `<rect class="p" x="4" y="4" width="142" height="62" rx="8" transform="rotate(-3 75 35)"/><text x="75" y="46" text-anchor="middle" class="tk" style="font:400 21px 'Anton',Impact,sans-serif;letter-spacing:.03em" transform="rotate(-3 75 35)">PIXEL PERFECT</text>`, 'Sticker: pixel perfect'),
    // pixel stickers in the old-Mac style
    computer: () => st('-8 -8 272 336', `${PX.computer().svg(0, 0, 8)}${PX.computerEyes(0, 0, 8)}`, 'Sticker: pixel computer'),
    floppy: () => pxSticker(PX.floppy(), 32, 32, 5, 'Sticker: floppy disk', 'saved'),
    trash: () => pxSticker(PX.trash(), 28, 36, 5, 'Sticker: trash can'),
    watch: () => pxSticker(PX.watch(), 24, 36, 5, 'Sticker: watch', 'wait…'),
    bomb: () => pxSticker(PX.bomb(), 34, 34, 5, 'Sticker: bomb', 'bug!'),
    hand: () => pxSticker(PX.hand(), 32, 38, 5, 'Sticker: pointing hand'),
    folder: () => pxSticker(PX.folder(), 36, 28, 5, 'Sticker: folder', 'v2_final'),
    // housing set
    house: () => pxSticker(PX.house(), 32, 32, 5, 'Sticker: pixel house'),
    keys: () => st('-12 -12 236 150', `<g transform="rotate(-4 105 62)"><rect class="p" x="0" y="0" width="210" height="124" rx="16"/>${PX.key().svg(10, 12, 5.2)}<text x="105" y="112" text-anchor="middle" class="tk" style="font-size:18px">your keys</text></g>`, 'Sticker: your keys'),
    ticket: () => pxSticker(PX.ticket(), 42, 24, 5, 'Sticker: queue ticket', '#1284'),
    movein: () => st('0 0 210 90', `<rect class="k" x="4" y="4" width="202" height="82" rx="41"/><text x="105" y="58" text-anchor="middle" class="tx" style="font:400 36px 'Anton',Impact,sans-serif">MOVE IN!</text>`, 'Sticker: move in'),
    zoom: () => st('0 0 150 150', `<circle class="k" cx="75" cy="75" r="70"/><circle class="p" cx="75" cy="75" r="56" style="stroke-dasharray:4 8"/><text x="75" y="76" text-anchor="middle" class="tk" style="font:400 34px 'Anton',Impact,sans-serif">200%</text><text x="75" y="102" text-anchor="middle" class="tk" style="font-size:15px">ZOOM ✓</text>`, 'Sticker: zoom 200%'),
  };

  ILL.characters = ['cursorKid', 'penPal', 'framePeek', 'juggler', 'commenter', 'layers', 'researcher', 'macHome', 'houseFrame', 'idCheck', 'allSet'];

  root.ILL = ILL;
  if (typeof module !== 'undefined' && module.exports) module.exports = ILL;
})(typeof window !== 'undefined' ? window : globalThis);
