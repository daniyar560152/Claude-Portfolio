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
    if (root.t) text = root.t(text); // Russian pages: size the tag to the translated label
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

  PX.stampDoc = () => {
    const g = new Grid(32, 38);
    g.shape(poly([[0.5, 0.5], [22.5, 0.5], [29.5, 7.5], [29.5, 37.5], [0.5, 37.5]]));
    g.line(22, 0, 22, 7).line(22, 7, 29, 7);
    g.rect(4, 6, 14, 1); g.rect(4, 9, 18, 1); g.rect(4, 12, 12, 1); g.rect(4, 15, 20, 1); g.rect(4, 18, 10, 1);
    g.shape(ell(21, 28, 9), 'ink'); g.shape(ell(21, 28, 7), 'paper');
    g.line(17, 28, 20, 31).line(20, 31, 25, 24).line(17, 29, 20, 32).line(20, 32, 25, 25);
    return g;
  };
  PX.checklist = () => {
    const g = new Grid(46, 40);
    g.rect(1, 1, 45, 39, 1); g.shape(rr(0, 0, 44, 38, 0));
    for (let y = 2; y <= 6; y += 2) g.line(2, y, 41, y);
    g.rect(15, 2, 14, 5, 2); g.rect(3, 2, 5, 5, 2); g.frame(3, 2, 5, 5); g.line(0, 8, 43, 8);
    for (let i = 0; i < 3; i++) { const y = 12 + i * 8; g.frame(4, y, 7, 7); if (i < 2) { g.line(5, y + 3, 7, y + 5); g.line(7, y + 5, 10, y + 1); } g.rect(14, y + 2, 24 - i * 5, 3); }
    return g;
  };
  PX.hourglass = () => {
    const g = new Grid(26, 38);
    g.shape(any(poly([[3, 3], [23, 3], [14, 18], [12, 18]]), poly([[12, 20], [14, 20], [23, 35], [3, 35]]), rr(11, 16, 4, 6, 0)));
    g.shape(rr(0, 0, 26, 4, 1), 'ink'); g.shape(rr(0, 34, 26, 4, 1), 'ink');
    g.shape(poly([[7, 7], [19, 7], [13, 15]]), 'dither'); g.shape(poly([[6, 34], [20, 34], [13, 27]]), 'ink'); g.line(13, 17, 13, 28);
    return g;
  };
  PX.envelope = () => {
    const g = new Grid(38, 26);
    g.rect(1, 1, 38, 26, 1); g.shape(rr(0, 0, 37, 25, 1));
    g.line(1, 1, 18, 13); g.line(18, 13, 35, 1); g.line(1, 24, 14, 13); g.line(35, 24, 23, 13);
    g.shape(rr(27, 3, 7, 6, 0), 'dither');
    return g;
  };
  PX.family = () => {
    const g = new Grid(42, 32);
    const person = (cx, top, r, w, h) => { g.shape(ell(cx, top + r, r)); g.shape(rr(cx - w / 2, top + 2 * r + 1, w, h, 4)); g.set(cx - 2, top + r - 1, 1); g.set(cx + 2, top + r - 1, 1); g.line(cx - 1, top + r + 2, cx + 1, top + r + 2); };
    person(9, 1, 5, 14, 17); person(33, 1, 5, 14, 17); person(21, 11, 4, 12, 11); g.line(0, 31, 41, 31);
    return g;
  };
  PX.database = () => {
    const g = new Grid(32, 38);
    for (let i = 2; i >= 0; i--) { const y = i * 11; g.shape(any(rr(1, 4 + y, 30, 9, 0), ell(16, 13 + y, 15, 3.5))); g.shape(ell(16, 4 + y, 15, 3.5)); g.set(25, 9 + y, 1); g.set(27, 9 + y, 1); }
    return g;
  };
  PX.chart = () => {
    const g = new Grid(42, 36);
    g.line(3, 1, 3, 33); g.line(3, 33, 41, 33);
    [[7, 22], [15, 17], [23, 11], [31, 5]].forEach(([x, t]) => g.shape(rr(x, t, 6, 33 - t, 0), 'dither'));
    g.line(6, 19, 36, 2); g.line(36, 2, 31, 2); g.line(36, 2, 36, 7); g.line(7, 19, 37, 2);
    return g;
  };
  /* ---------- loan set (Otbasy early-repayment case): new old-Mac 1-bit icons ---------- */
  PX.bank = () => {
    const g = new Grid(36, 33);
    g.shape(poly([[18, 0.5], [35.5, 9.5], [0.5, 9.5]]), 'dither');
    g.shape(ell(18, 6.5, 2.2), 'paper'); g.set(18, 5, 1); g.set(18, 7, 1);
    g.shape(rr(1, 9, 34, 3, 0), 'ink');
    for (let i = 0; i < 5; i++) g.shape(rr(2.5 + i * 7, 12, 4, 14, 0));
    g.shape(rr(0, 26, 36, 3, 0), 'ink'); g.shape(rr(0, 29, 36, 4, 0));
    return g;
  };
  PX.bankCard = () => {
    const g = new Grid(42, 28);
    g.rect(1, 1, 41, 27, 1); g.shape(rr(0, 0, 40, 26, 2));
    g.shape(rr(4, 7, 9, 7, 1), 'dither'); g.line(4, 10, 12, 10); g.line(8, 7, 8, 13);
    for (let i = 0; i < 4; i++) g.rect(4 + i * 8, 18, 6, 2);
    g.rect(28, 4, 8, 2); g.rect(31, 7, 5, 1); g.rect(4, 22, 12, 1);
    return g;
  };
  PX.coins = () => {
    const g = new Grid(40, 35);
    for (let i = 0; i < 4; i++) { const y = 28 - i * 5; g.shape(any(rr(1, y - 3, 20, 6, 0), ell(11, y + 3, 10, 3))); g.shape(ell(11, y - 3, 10, 3)); }
    g.line(1, 9, 1, 31); g.line(21, 9, 21, 31);
    g.shape(ell(29, 22, 10), 'ink'); g.shape(ell(29, 22, 7.6), 'paper');
    g.rect(25, 17, 9, 1); g.rect(25, 19, 9, 1); g.rect(29, 19, 1, 8);
    return g;
  };
  PX.calculator = () => {
    const g = new Grid(30, 40);
    g.rect(2, 2, 28, 38, 1); g.shape(rr(0, 0, 28, 38, 2));
    g.shape(rr(3, 3, 22, 9, 0), 'ink'); [10, 14, 18].forEach((x) => g.frame(x, 5, 3, 5, 2)); g.rect(22, 9, 1, 1, 2);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const x = 3 + c * 6, y = 15 + r * 5.5;
      if (c === 3 && r === 3) continue;
      if (c === 3 && r === 2) { g.shape(rr(x, y, 4, 9.5, 0), 'ink'); continue; }
      g.shape(rr(x, y, 4, 4, 0));
    }
    return g;
  };
  PX.phone = () => {
    const g = new Grid(26, 40);
    g.rect(2, 2, 24, 38, 1); g.shape(rr(0, 0, 24, 38, 3));
    g.shape(rr(3, 5, 18, 16, 0), 'ink'); g.shape(rr(5, 7, 14, 12, 0), 'paper');
    [7, 11, 15].forEach((x) => g.rect(x, 10, 2, 2)); g.rect(7, 15, 10, 1);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) g.shape(rr(4 + c * 6, 24 + r * 4, 4, 2.6, 0), 'ink');
    g.rect(9, 2, 6, 1);
    return g;
  };
  PX.padlockOpen = () => {
    const g = new Grid(32, 40);
    g.shape(any(ell(20, 9, 8.5), rr(11.5, 9, 17, 11, 0)), 'ink'); g.shape(any(ell(20, 9, 5.5), rr(14.5, 9, 11, 12, 0)), 'clear');
    g.shape(rr(11, 12.5, 4, 8, 0), 'clear');
    g.shape(rr(2.5, 19, 27, 20.5, 2)); g.shape(rr(4.5, 21, 23, 3, 0), 'dither');
    g.shape(ell(16, 28, 2.6), 'ink'); g.rect(15, 29, 3, 6);
    return g;
  };
  PX.receipt = () => {
    const g = new Grid(30, 40), pts = [[0.5, 0.5], [28.5, 0.5], [28.5, 36]];
    for (let i = 0; i <= 9; i++) pts.push([28.5 - i * 3, i % 2 ? 36 : 39.5]);
    pts.push([0.5, 36]);
    g.shape(poly(pts)); g.rect(5, 4, 19, 2);
    for (let i = 0; i < 4; i++) { const y = 10 + i * 3.5; g.rect(5, y, 11, 1); g.rect(19, y, 5, 1); }
    for (let x = 5; x < 25; x += 2) g.set(x, 25, 1);
    g.rect(5, 28, 8, 2); g.rect(16, 28, 8, 2);
    return g;
  };
  PX.alarmClock = () => {
    const g = new Grid(34, 37);
    g.shape(ell(7, 6.5, 5.5), 'ink'); g.shape(ell(27, 6.5, 5.5), 'ink'); g.rect(15, 1, 4, 3);
    g.line(8, 31, 5, 36); g.line(9, 31, 6, 36); g.line(26, 31, 29, 36); g.line(25, 31, 28, 36);
    g.shape(ell(17, 19.5, 14.5), 'ink'); g.shape(ell(17, 19.5, 12), 'paper');
    g.rect(16, 9, 2, 2); g.rect(16, 28, 2, 2); g.rect(7, 19, 2, 2); g.rect(25, 19, 2, 2);
    g.line(17, 19, 17, 12); g.line(16, 19, 16, 12); g.line(17, 19, 22, 23); g.line(17, 20, 22, 24);
    return g;
  };
  const pie = (full) => {
    const g = new Grid(34, 34), C = ell(17, 17, 16);
    g.shape(C); g.shape((x, y) => C(x, y) && (full || x < 17), 'dither');
    if (!full) { g.line(17, 1, 17, 32); g.line(16, 1, 16, 32); }
    else { g.shape(rr(8, 10, 18, 14, 2), 'paper'); g.frame(8, 10, 18, 14); g.line(11, 17, 15, 21); g.line(15, 21, 23, 13); g.line(11, 18, 15, 22); g.line(15, 22, 23, 14); }
    for (let y = 0; y < 34; y++) for (let x = 0; x < 34; x++) {
      const e = C(x + 0.5, y + 0.5) && (!C(x - 0.5, y + 0.5) || !C(x + 1.5, y + 0.5) || !C(x + 0.5, y - 0.5) || !C(x + 0.5, y + 1.5));
      if (e) g.set(x, y, 1);
    }
    return g;
  };
  PX.pieHalf = () => pie(false);
  PX.pieFull = () => pie(true);
  PX.macCoin = () => {
    const g = new Grid(32, 40);
    g.shape(rr(2, 32, 28, 7, 1)); g.shape(rr(1, 0, 30, 34, 3)); g.line(2, 33, 29, 33);
    g.shape(rr(5, 4, 22, 17, 2)); g.frame(7, 6, 18, 13, 1);
    g.shape(ell(16, 12.5, 5.2), 'ink'); g.shape(ell(16, 12.5, 3.8), 'paper'); g.rect(14, 10, 5, 1); g.rect(14, 12, 5, 1); g.rect(16, 12, 1, 4);
    g.rect(17, 25, 9, 2, 1); g.frame(6, 26, 4, 4, 1); g.line(4, 36, 27, 36);
    return g;
  };
  PX.ticketTray = () => {
    const g = new Grid(42, 34);
    for (let i = 0; i < 3; i++) { const x = 6 + i * 3, y = 2 + i * 4; g.shape(rr(x, y, 24, 20, 0)); for (let k = 0; k < 3; k++) g.rect(x + 3, y + 4 + k * 3, 14 - k * 3, 1); }
    g.shape(poly([[0.5, 18.5], [41.5, 18.5], [37.5, 33.5], [4.5, 33.5]]), 'dither');
    g.shape(rr(12, 22, 18, 7, 1), 'paper'); g.frame(12, 22, 18, 7); g.rect(15, 24, 12, 3);
    return g;
  };

  /* ---------- market set (Baspana Market case): new old-Mac 1-bit icons ---------- */
  PX.block = () => {
    const g = new Grid(30, 40);
    g.rect(2, 2, 28, 38, 1); g.shape(rr(0, 0, 28, 38, 0));
    g.shape(rr(0, 0, 28, 4, 0), 'dither'); g.line(0, 4, 27, 4);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) { const x = 3 + c * 6, y = 7 + r * 4.6; g.frame(x, y, 4, 3); if ((r + c) % 3 === 0) g.rect(x + 1, y + 1, 2, 1); }
    g.shape(rr(10, 32, 8, 6, 0), 'ink'); g.rect(13, 33, 2, 5, 2); g.line(0, 37, 27, 37);
    return g;
  };
  PX.floorPlan = () => {
    const g = new Grid(40, 34);
    g.rect(1, 1, 40, 34, 1); g.shape(rr(0, 0, 38, 32, 0));
    g.rect(0, 0, 38, 2); g.rect(0, 30, 38, 2); g.rect(0, 0, 2, 32); g.rect(36, 0, 2, 32);
    g.rect(16, 0, 2, 13); g.rect(16, 19, 2, 13); g.rect(2, 15, 9, 2); g.rect(24, 15, 12, 2);
    g.shape(rr(4, 4, 9, 6, 1), 'dither'); g.frame(22, 20, 10, 7); g.rect(24, 22, 6, 3, 2);
    g.line(18, 13, 22, 9); g.line(11, 16, 14, 13); g.set(8, 22, 1); g.rect(5, 24, 6, 2);
    return g;
  };
  PX.mapPin = () => {
    const g = new Grid(36, 36);
    g.shape(rr(0, 18, 36, 18, 0), 'dither'); g.line(0, 26, 35, 26, 2); g.line(12, 18, 12, 35, 2); g.line(25, 18, 25, 35, 2);
    g.shape(any(ell(18, 11, 10), poly([[10, 16], [26, 16], [18, 31]])), 'ink'); g.shape(ell(18, 11, 4.2), 'paper');
    return g;
  };
  PX.filter = () => {
    const g = new Grid(38, 30);
    for (let i = 0; i < 3; i++) { const y = 3 + i * 11; g.rect(1, y + 2, 36, 2); const k = [24, 9, 18][i]; g.shape(rr(k - 4, y - 1, 8, 9, 1)); g.rect(k - 1, y + 1, 2, 5); }
    return g;
  };
  PX.crane = () => {
    const g = new Grid(40, 40);
    g.shape(rr(8, 6, 5, 32, 0), 'dither'); g.frame(8, 6, 5, 32); g.rect(0, 5, 40, 3); g.rect(0, 2, 6, 3); g.line(10, 0, 10, 5); g.line(10, 0, 0, 5); g.line(10, 0, 30, 5);
    g.line(34, 8, 34, 20); g.shape(rr(29, 20, 10, 7, 0)); g.frame(29, 20, 10, 7); g.rect(31, 22, 6, 1); g.rect(31, 24, 6, 1);
    g.rect(4, 37, 14, 3); g.shape(rr(22, 30, 12, 8, 0)); g.frame(22, 30, 12, 8); g.rect(24, 32, 3, 2); g.rect(29, 32, 3, 2);
    return g;
  };
  PX.yurt = () => {
    const g = new Grid(40, 32);
    g.shape(poly([[20, 1], [38.5, 13], [1.5, 13]])); g.shape(rr(15, 0, 10, 4, 1), 'ink');
    g.line(20, 4, 8, 12); g.line(20, 4, 32, 12); g.line(20, 4, 20, 12);
    g.shape(rr(3, 13, 34, 17, 0), 'dither'); g.frame(3, 13, 34, 17); g.shape(rr(15, 17, 10, 13, 2), 'ink'); g.shape(rr(17, 19, 6, 11, 1), 'paper');
    g.line(0, 31, 39, 31);
    return g;
  };
  PX.priceTag = () => {
    const g = new Grid(40, 26);
    g.shape(poly([[0.5, 13], [10, 1], [39.5, 1], [39.5, 25], [10, 25]])); g.shape(ell(9, 13, 2.6), 'ink'); g.shape(ell(9, 13, 1.2), 'clear');
    g.shape(ell(19, 8, 2.2), 'ink'); g.shape(ell(30, 18, 2.2), 'ink'); g.line(31, 5, 18, 21); g.line(32, 5, 19, 21);
    g.rect(35, 4, 2, 18, 2);
    return g;
  };
  PX.calendar = () => {
    const g = new Grid(34, 36);
    g.rect(2, 4, 32, 32, 1); g.shape(rr(0, 2, 32, 32, 2)); g.shape(rr(0, 2, 32, 8, 1), 'ink');
    g.shape(rr(7, 0, 3, 7, 0), 'ink'); g.shape(rr(22, 0, 3, 7, 0), 'ink');
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) g.rect(3 + c * 6, 13 + r * 5, 3, 2);
    g.shape(ell(22, 24, 5.5), 'paper'); g.frame(16, 18, 13, 13); g.line(19, 24, 21, 27); g.line(21, 27, 26, 20); g.line(19, 25, 21, 28); g.line(21, 28, 26, 21);
    return g;
  };
  PX.macGrid = () => {
    const g = new Grid(32, 40);
    g.shape(rr(2, 32, 28, 7, 1)); g.shape(rr(1, 0, 30, 34, 3)); g.line(2, 33, 29, 33);
    g.shape(rr(5, 4, 22, 17, 2)); g.frame(7, 6, 18, 13, 1);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) g.shape(rr(9 + c * 5.4, 8 + r * 5.4, 4.4, 4.4, 0), 'dither');
    g.rect(17, 25, 9, 2, 1); g.frame(6, 26, 4, 4, 1); g.line(4, 36, 27, 36);
    return g;
  };

  // property-for-sale sign on a post: a little house and a % for the mortgage on the board
  PX.saleSign = () => {
    const g = new Grid(44, 46);
    g.shape(rr(3, 2, 4, 41, 0), 'dither'); g.frame(3, 2, 5, 42);              // post
    g.shape(rr(3, 4, 38, 3, 0)); g.frame(3, 4, 39, 4); g.rect(39, 3, 3, 6);   // arm
    [12, 34].forEach((x) => { for (let y = 8; y < 13; y += 2) g.set(x, y, 1); }); // chains
    g.rect(11, 15, 32, 22, 1);                                                 // board shadow
    g.shape(rr(9, 13, 31, 22, 1)); g.frame(11, 15, 27, 18);
    g.shape(poly([[13, 23.5], [19, 17.5], [25, 23.5]]), 'ink');                 // house
    g.shape(rr(14.5, 23, 9, 7, 0)); g.frame(14, 23, 10, 8); g.rect(18, 26, 2, 5);
    [[27, 17], [32, 25]].forEach(([x, y]) => {                                  // %
      g.rect(x, y, 6, 6, 1); g.rect(x + 2, y + 2, 2, 2, 2);
      [[x, y], [x + 5, y], [x, y + 5], [x + 5, y + 5]].forEach(([cx, cy]) => g.set(cx, cy, 2));
    });
    g.line(36, 17, 28, 31); g.line(37, 17, 29, 31);
    g.rect(0, 43, 44, 3, 1); g.rect(0, 44, 44, 1, 2);                          // ground
    [[14, 41], [22, 42], [30, 41], [38, 42]].forEach(([x, y]) => { g.set(x, y, 1); g.set(x + 1, y - 1, 1); g.set(x + 2, y, 1); });
    return g;
  };

  /* ---------- Smartbank (statements + design system) icons ---------- */
  // a statement: rows with an icon, a name and an amount, and a download badge
  PX.statement = () => {
    const g = new Grid(36, 42);
    g.rect(3, 3, 30, 39, 1); g.shape(poly([[0.5, 0.5], [22, 0.5], [29.5, 8], [29.5, 38.5], [0.5, 38.5]]));
    g.shape(poly([[21.5, 1], [21.5, 8.5], [29, 8.5]]), 'ink');
    g.shape(rr(3, 4, 15, 4, 0), 'dither');
    for (let r = 0; r < 5; r++) { const y = 12 + r * 5; g.frame(3, y, 4, 4); g.rect(9, y, 9 - (r % 2) * 3, 1); g.rect(9, y + 2, 6, 1); g.rect(22 - (r % 3), y + 1, 5 + (r % 3), 1); }
    g.shape(ell(28, 34, 7), 'ink'); g.shape(ell(28, 34, 5.4), 'paper'); g.rect(27, 30, 2, 6); g.line(25, 34, 28, 37); g.line(31, 34, 28, 37); g.rect(25, 38, 7, 1);
    return g;
  };
  // a phone split into a dark and a light theme, a diamond in the middle
  PX.themeSplit = () => {
    const g = new Grid(30, 44);
    g.rect(2, 2, 28, 42, 1); g.shape(rr(0, 0, 28, 42, 4));
    g.shape(rr(2.5, 4, 11.5, 34, 1), 'ink'); g.shape(rr(14, 4, 11.5, 34, 1), 'paper'); g.frame(2, 4, 24, 35);
    g.rect(10, 1, 8, 2, 1);
    [8, 13, 18].forEach((y, i) => { g.rect(4, y + 10, 7 - i, 1, 2); g.rect(16, y + 10, 7 - i, 1, 1); });
    g.shape(poly([[10, 8], [18, 8], [21.5, 12], [14, 21], [6.5, 12]])); g.line(7, 12, 21, 12);
    g.rect(11, 40, 6, 1, 2);
    return g;
  };
  // a fan of colour-token strips
  PX.swatches = () => {
    const g = new Grid(40, 36);
    [0, 1, 2].forEach((i) => {
      const x = 1 + i * 12, y = 1 + i * 2;
      g.rect(x + 2, y + 2, 12, 31 - i * 2, 1); g.shape(rr(x, y, 12, 31 - i * 2, 1));
      g.shape(rr(x + 2, y + 2, 8, 7, 0), ['ink', 'dither', 'ink'][i]);
      g.shape(rr(x + 2, y + 11, 8, 7, 0), ['dither', 'paper', 'dither'][i]); g.frame(x + 2, y + 11, 8, 7);
      g.rect(x + 2, y + 21, 6, 1); g.rect(x + 2, y + 24, 4, 1);
    });
    return g;
  };
  // a window full of tiny interface icons
  PX.iconGrid = () => {
    const g = new Grid(38, 36);
    g.rect(3, 3, 35, 33, 1); g.shape(rr(0, 0, 35, 33, 1)); g.shape(rr(0, 0, 35, 6, 0), 'dither'); g.line(0, 6, 34, 6);
    const ic = [
      (x, y) => { g.frame(x, y, 6, 6); g.rect(x + 2, y + 2, 2, 2); },
      (x, y) => { g.line(x, y + 5, x + 5, y); g.line(x + 2, y, x + 5, y); g.line(x + 5, y, x + 5, y + 3); },
      (x, y) => { g.shape(ell(x + 3, y + 3, 3)); g.set(x + 3, y + 3, 1); },
      (x, y) => { g.rect(x, y + 2, 6, 1); g.rect(x + 2, y, 1, 6); g.rect(x + 3, y, 1, 6); g.rect(x, y + 3, 6, 1); },
      (x, y) => { g.shape(poly([[x + 3, y], [x + 6.2, y + 6], [x - 0.2, y + 6]]), 'ink'); },
      (x, y) => { g.frame(x, y + 1, 6, 5); g.rect(x, y + 1, 6, 2); },
      (x, y) => { g.shape(ell(x + 3, y + 2.5, 2.4), 'ink'); g.rect(x + 1, y + 5, 4, 1); },
      (x, y) => { g.line(x, y + 3, x + 2, y + 5); g.line(x + 2, y + 5, x + 6, y + 1); g.line(x, y + 4, x + 2, y + 6); },
      (x, y) => { g.rect(x, y, 6, 6); g.rect(x + 1, y + 1, 4, 4, 2); g.rect(x + 2, y + 2, 2, 2); },
    ];
    ic.forEach((f, i) => f(4 + (i % 3) * 10, 10 + Math.floor(i / 3) * 8));
    return g;
  };
  // two bank cards, fanned
  PX.cardFan = () => {
    const g = new Grid(44, 34);
    g.shape(poly([[2, 12], [30, 2], [37, 20], [9, 30]]), 'dither'); g.line(2, 12, 30, 2); g.line(30, 2, 37, 20); g.line(37, 20, 9, 30); g.line(9, 30, 2, 12);
    g.rect(10, 13, 33, 21, 1); g.shape(rr(8, 11, 33, 21, 2)); g.rect(9, 16, 31, 3);
    g.shape(rr(12, 22, 7, 5, 1), 'ink'); g.rect(14, 23, 3, 3, 2);
    g.shape(ell(33, 26.5, 2.6), 'ink'); g.shape(ell(36, 26.5, 2.6), 'dither'); g.rect(22, 27, 7, 1);
    return g;
  };
  // one transaction row: icon, name + type, amount + bonus
  PX.txRow = () => {
    const g = new Grid(46, 22);
    g.rect(2, 2, 44, 20, 1); g.shape(rr(0, 0, 44, 20, 3));
    g.shape(rr(3, 4, 12, 12, 2), 'dither'); g.shape(rr(5.5, 8, 6, 5, 1), 'ink'); g.rect(11, 9, 2, 3); g.set(7, 6, 1); g.set(10, 6, 1);
    g.rect(18, 6, 11, 2); g.rect(18, 12, 8, 1);
    g.rect(32, 6, 9, 2); g.rect(34, 12, 7, 1); g.rect(30, 12, 2, 1);
    return g;
  };
  // a VIP diamond
  PX.gem = () => {
    const g = new Grid(36, 28);
    g.shape(poly([[8, 1], [28, 1], [35, 9], [18, 27], [1, 9]])); g.line(1, 9, 35, 9);
    g.line(8, 1, 12, 9); g.line(28, 1, 24, 9); g.line(18, 1, 12, 9); g.line(18, 1, 24, 9); g.line(12, 9, 18, 26); g.line(24, 9, 18, 26);
    g.shape(poly([[12.5, 9.5], [23.5, 9.5], [18, 24]]), 'dither'); g.rect(5, 3, 2, 1, 1); g.rect(29, 3, 2, 1, 1);
    return g;
  };
  // a classic Mac showing a statement list
  PX.macStatement = () => {
    const g = new Grid(32, 40);
    g.shape(rr(2, 32, 28, 7, 1)); g.shape(rr(1, 0, 30, 34, 3)); g.line(2, 33, 29, 33);
    g.shape(rr(5, 4, 22, 17, 2)); g.frame(7, 6, 18, 13, 1);
    for (let r = 0; r < 3; r++) { const y = 8 + r * 3.6; g.rect(9, y, 2, 2); g.rect(12, y, 6 - (r % 2) * 2, 1); g.rect(20, y, 3, 1); }
    g.rect(17, 25, 9, 2, 1); g.frame(6, 26, 4, 4, 1); g.line(4, 36, 27, 36);
    return g;
  };

  /* ---------- Car loan (c2c, used cars) icons ---------- */
  // a little retro sedan, side view
  PX.car = () => {
    const g = new Grid(48, 26);
    g.shape(poly([[13, 9.5], [17, 2.5], [33, 2.5], [38.5, 9.5]]));                       // cabin
    g.shape(poly([[16.5, 9], [19, 4.5], [24.5, 4.5], [24.5, 9]]), 'dither'); g.shape(poly([[26.5, 9], [26.5, 4.5], [32, 4.5], [35.5, 9]]), 'dither');
    g.shape(rr(1.5, 9, 45, 10, 3));                                                        // body
    g.rect(2, 13, 44, 1); g.rect(25, 10, 1, 8); g.rect(29, 12, 3, 1); g.rect(15, 12, 3, 1);
    g.shape(rr(43, 11, 3, 3, 1), 'ink'); g.shape(rr(2, 11, 2, 3, 0), 'dither');           // lights
    [[11, 19], [36, 19]].forEach(([x, y]) => { g.shape(ell(x, y, 5.2), 'ink'); g.shape(ell(x, y, 2.6), 'paper'); g.set(x, y, 1); });
    g.line(0, 25, 47, 25);
    return g;
  };
  // a car key with a fob
  PX.carKey = () => {
    const g = new Grid(40, 26);
    g.shape(rr(1, 3, 18, 20, 5)); g.shape(ell(10, 9, 3), 'ink'); g.shape(rr(5, 14, 10, 5, 1), 'dither'); g.frame(5, 14, 10, 5);
    g.shape(rr(18, 10, 20, 6, 0)); g.rect(26, 16, 3, 4); g.rect(31, 16, 2, 3); g.rect(35, 16, 3, 5);
    g.line(19, 12, 37, 12);
    return g;
  };
  // a tow truck for road assistance
  PX.towTruck = () => {
    const g = new Grid(48, 28);
    g.shape(rr(1, 8, 16, 13, 2)); g.shape(rr(4, 10, 8, 5, 1), 'dither'); g.frame(4, 10, 8, 5);
    g.shape(rr(16, 14, 30, 7, 0)); g.line(18, 14, 38, 2); g.line(19, 14, 39, 2); g.line(38, 2, 42, 9); g.rect(41, 9, 3, 2);
    g.rect(43, 11, 1, 3);
    [[8, 22], [26, 22], [38, 22]].forEach(([x, y]) => { g.shape(ell(x, y, 4.2), 'ink'); g.shape(ell(x, y, 1.8), 'paper'); });
    g.shape(rr(5, 4, 6, 4, 1), 'ink');
    return g;
  };
  // a wrench — car check at a special service station
  PX.wrench = () => {
    const g = new Grid(36, 36);
    g.shape(poly([[8, 25], [25, 8], [29, 12], [12, 29]]));
    g.shape(ell(28, 8, 7)); g.shape(poly([[26, 1], [35, 10], [31, 13], [24, 6]]), 'clear'); g.frame(0, 0, 0, 0, 0);
    g.shape(ell(8, 28, 7)); g.shape(ell(8, 28, 2.6), 'ink');
    g.line(11, 21, 21, 11);
    return g;
  };
  // a speedometer: 2 minutes to a decision
  PX.gauge = () => {
    const g = new Grid(40, 28);
    g.shape(not(ell(20, 24, 19, 21), ell(20, 24, 13, 15)), 'blob'); g.rect(0, 25, 40, 3, 0);
    g.shape(not(ell(20, 24, 19, 21), ell(20, 24, 16.5, 18.5)), 'dither');
    [[5, 18], [9, 10], [20, 6], [31, 10], [35, 18]].forEach(([x, y]) => g.rect(x, y, 2, 2));
    g.line(20, 24, 31, 13); g.line(21, 24, 32, 13); g.shape(ell(20, 24, 3), 'ink');
    g.rect(0, 25, 40, 1);
    return g;
  };
  // a steering wheel
  PX.steering = () => {
    const g = new Grid(36, 36);
    g.shape(not(ell(18, 18, 17), ell(18, 18, 12.5)), 'ink'); g.shape(not(ell(18, 18, 16), ell(18, 18, 13.5)), 'dither');
    g.shape(ell(18, 18, 5)); g.shape(ell(18, 18, 2), 'ink');
    g.rect(5, 17, 9, 3); g.rect(22, 17, 9, 3); g.rect(17, 22, 3, 10);
    return g;
  };
  // a classic Mac showing a car on screen
  PX.macCar = () => {
    const g = new Grid(32, 40);
    g.shape(rr(2, 32, 28, 7, 1)); g.shape(rr(1, 0, 30, 34, 3)); g.line(2, 33, 29, 33);
    g.shape(rr(5, 4, 22, 17, 2)); g.frame(7, 6, 18, 13, 1);
    g.shape(poly([[11, 11.5], [13, 8.5], [19, 8.5], [21.5, 11.5]])); g.shape(rr(8.5, 11, 15, 4, 1)); g.shape(ell(12, 15.5, 1.6), 'ink'); g.shape(ell(20, 15.5, 1.6), 'ink');
    g.rect(17, 25, 9, 2, 1); g.frame(6, 26, 4, 4, 1); g.line(4, 36, 27, 36);
    return g;
  };

  /* ---------- Mobile bank 2025 (group wallets + envelopes) icons ---------- */
  // a coin purse with a kiss clasp and four pockets inside
  PX.purse = () => {
    const g = new Grid(40, 36);
    g.shape(poly([[7, 12], [33, 12], [38.5, 27], [36, 34.5], [4, 34.5], [1.5, 27]]));          // body
    g.shape(poly([[3, 27], [37, 27], [36, 34], [4, 34]]), 'dither'); g.line(3, 27, 37, 27);
    g.shape(rr(6, 8, 28, 5, 2), 'ink'); g.rect(8, 10, 24, 1, 2);                                  // metal frame
    g.shape(ell(16, 4.5, 3.2)); g.shape(ell(24, 4.5, 3.2)); g.set(15, 3, 2); g.set(23, 3, 2);     // kiss clasp
    g.rect(15, 7, 2, 2); g.rect(23, 7, 2, 2);
    [[9, 16], [17, 16], [25, 16]].forEach(([x, y]) => { for (let k = 0; k < 7; k += 2) { g.set(x + k, y, 1); g.set(x + k, y + 7, 1); g.set(x, y + k, 1); g.set(x + 6, y + k, 1); } });
    return g;
  };
  // three envelopes fanned out — money already split into sections
  PX.envelopes = () => {
    const g = new Grid(44, 34);
    [[1, 12, 'dither'], [9, 6, 'blob'], [17, 0, 'blob']].forEach(([x, y, m]) => {
      g.rect(x + 2, y + 2, 26, 20, 1); g.shape(rr(x, y, 26, 20, 1), m); g.frame(x, y, 26, 20);
      g.line(x, y, x + 13, y + 10); g.line(x + 25, y, x + 13, y + 10);
    });
    g.shape(ell(30, 10, 2.4), 'ink');
    return g;
  };
  // a piggy bank — a savings goal
  PX.piggy = () => {
    const g = new Grid(42, 32);
    g.shape(ell(20, 16, 15, 11)); g.shape(poly([[7, 7], [12, 1], [14, 9]])); g.shape(rr(32, 12, 8, 8, 3));
    g.rect(35, 15, 1, 2); g.rect(37, 15, 1, 2); g.shape(ell(12, 13, 1.4), 'ink');
    g.rect(16, 6, 9, 2); g.rect(9, 25, 4, 6); g.rect(25, 25, 4, 6); g.line(9, 30, 12, 30); g.line(25, 30, 28, 30);
    g.shape(ell(20, 18, 5, 4), 'dither'); g.line(1, 16, 4, 14);
    return g;
  };
  // three people — a group wallet
  PX.group = () => {
    const g = new Grid(44, 30);
    [[10, 'dither'], [34, 'dither'], [22, 'blob']].forEach(([x, m]) => {
      const big = x === 22; const r = big ? 6 : 5;
      g.shape(ell(x, big ? 9 : 11, r), m); g.shape(poly([[x - (big ? 11 : 9), 29], [x - (big ? 8 : 7), big ? 18 : 20], [x + (big ? 8 : 7), big ? 18 : 20], [x + (big ? 11 : 9), 29]]), m);
    });
    g.line(0, 29, 43, 29);
    return g;
  };
  // an umbrella — the safety cushion
  PX.umbrella = () => {
    const g = new Grid(38, 38);
    g.shape(not(ell(19, 18, 18, 16), rr(0, 18, 38, 20, 0)));
    [[1, 18], [10, 18], [19, 18], [28, 18]].forEach(([x]) => g.shape(ell(x + 4.5, 18, 4.6, 2.6), 'clear'));
    g.line(19, 3, 19, 18); g.line(10, 5, 14, 17); g.line(28, 5, 24, 17);
    g.rect(18, 18, 2, 14); g.rect(12, 31, 8, 2); g.rect(12, 28, 2, 4);
    g.shape(ell(19, 2, 1.4), 'ink');
    return g;
  };
  // a calendar with a repeat arrow — automatic payments
  PX.autopay = () => {
    const g = new Grid(36, 36);
    g.rect(2, 4, 32, 32, 1); g.shape(rr(0, 2, 32, 32, 2)); g.shape(rr(0, 2, 32, 8, 1), 'ink');
    g.shape(rr(7, 0, 3, 7, 0), 'ink'); g.shape(rr(22, 0, 3, 7, 0), 'ink');
    g.shape(not(ell(16, 22, 8.5), ell(16, 22, 6)), 'ink'); g.shape(rr(15, 12, 9, 6, 0), 'paper');
    g.shape(poly([[17, 11], [23, 14.5], [17, 18]]), 'ink'); g.rect(15, 21, 2, 2);
    return g;
  };
  // a classic Mac showing a ring chart of a wallet section
  PX.macRing = () => {
    const g = new Grid(32, 40);
    g.shape(rr(2, 32, 28, 7, 1)); g.shape(rr(1, 0, 30, 34, 3)); g.line(2, 33, 29, 33);
    g.shape(rr(5, 4, 22, 17, 2)); g.frame(7, 6, 18, 13, 1);
    g.shape(not(ell(12.5, 12.5, 4.6), ell(12.5, 12.5, 2.6)), 'dither'); g.shape(not(ell(12.5, 12.5, 4.6), any(ell(12.5, 12.5, 2.6), rr(7, 12.5, 12, 6, 0))), 'ink');
    g.rect(19, 9, 4, 1); g.rect(19, 12, 4, 1); g.rect(19, 15, 3, 1);
    g.rect(17, 25, 9, 2, 1); g.frame(6, 26, 4, 4, 1); g.line(4, 36, 27, 36);
    return g;
  };

  /* ---------- Car re-registration (GovTech) icons ---------- */
  // a KZ licence plate
  PX.plate = () => {
    const g = new Grid(48, 18);
    g.rect(2, 2, 46, 16, 1); g.shape(rr(0, 0, 46, 16, 2)); g.frame(1, 1, 44, 14);
    g.shape(rr(3, 3, 8, 10, 0), 'dither'); g.rect(4, 4, 6, 3, 2); g.shape(ell(7, 5.5, 1.3), 'ink'); g.rect(11, 3, 1, 10);
    const d = (x, cols) => cols.forEach(([cx, cy, w, h]) => g.rect(x + cx, 4 + cy, w, h));
    d(14, [[0, 0, 4, 1], [3, 0, 1, 8], [0, 7, 4, 1]]);           // 1-ish
    d(20, [[0, 0, 4, 1], [3, 0, 1, 4], [0, 3, 4, 1], [0, 3, 1, 5], [0, 7, 4, 1]]); // 2
    d(26, [[0, 0, 4, 1], [3, 0, 1, 8], [0, 3, 4, 1], [0, 7, 4, 1]]); // 3
    d(33, [[0, 0, 1, 8], [3, 0, 1, 8], [0, 0, 4, 1], [0, 3, 4, 1]]); // A
    d(39, [[0, 0, 4, 1], [0, 0, 1, 8], [0, 3, 3, 1], [0, 7, 4, 1]]); // E-ish
    return g;
  };
  // a face inside a scan frame — biometrics
  PX.faceScan = () => {
    const g = new Grid(36, 36);
    [[0, 0, 1, 1], [35, 0, -1, 1], [0, 35, 1, -1], [35, 35, -1, -1]].forEach(([x, y, dx, dy]) => { for (let i = 0; i < 8; i++) { g.set(x + i * dx, y, 1); g.set(x, y + i * dy, 1); g.set(x + i * dx, y + dy, 1); g.set(x + dx, y + i * dy, 1); } });
    g.shape(ell(18, 17, 9, 11)); g.shape(rr(10, 6, 16, 6, 3), 'dither'); g.frame(10, 6, 16, 6);
    g.rect(14, 15, 2, 2); g.rect(20, 15, 2, 2); g.line(18, 17, 17, 20); g.line(15, 23, 21, 23);
    for (let x = 3; x < 33; x += 2) g.set(x, 18, 1);
    return g;
  };
  // a document with a seal and a signature line — e-signature
  PX.eSign = () => {
    const g = new Grid(36, 40);
    g.rect(2, 2, 30, 38, 1); g.shape(rr(0, 0, 30, 37, 1));
    for (let r = 0; r < 4; r++) g.rect(4, 5 + r * 4, 22 - (r % 2) * 6, 1);
    g.line(4, 30, 7, 26); g.line(7, 26, 9, 30); g.line(9, 30, 12, 27); g.line(12, 27, 14, 30); g.rect(4, 32, 13, 1);
    g.shape(ell(26, 29, 7.5), 'ink'); g.shape(ell(26, 29, 5.5), 'dither'); g.shape(ell(26, 29, 3), 'paper'); g.rect(25, 27, 2, 4);
    return g;
  };
  // a government building
  PX.govBuilding = () => {
    const g = new Grid(42, 36);
    g.shape(poly([[21, 1], [40, 10], [2, 10]])); g.shape(ell(21, 7, 2.2), 'ink');
    g.shape(rr(3, 10, 36, 3, 0), 'ink');
    [6, 13, 20, 27, 34].forEach((x) => { g.shape(rr(x, 13, 3, 16, 0)); g.frame(x, 13, 3, 16); });
    g.shape(rr(2, 29, 38, 3, 0), 'dither'); g.frame(2, 29, 38, 3); g.rect(0, 32, 42, 3);
    return g;
  };
  // a padlock on a chain — the pledge
  PX.pledge = () => {
    const g = new Grid(40, 36);
    [[2, 6], [8, 9], [14, 12]].forEach(([x, y]) => { g.shape(not(ell(x + 3, y + 2, 3.4, 2.2), ell(x + 3, y + 2, 1.6, 0.8)), 'ink'); });
    g.shape(not(rr(20, 4, 14, 16, 6), rr(23, 7, 8, 14, 3)), 'ink');
    g.shape(rr(16, 15, 22, 18, 2)); g.shape(rr(16, 15, 22, 4, 1), 'dither'); g.frame(16, 15, 22, 18);
    g.shape(ell(27, 23, 2.4), 'ink'); g.rect(26, 24, 2, 5);
    return g;
  };
  // two hands shaking — buyer and seller
  PX.handshake = () => {
    const g = new Grid(44, 26);
    g.shape(rr(0, 6, 9, 13, 0), 'dither'); g.frame(0, 6, 9, 13); g.shape(rr(35, 6, 9, 13, 0), 'dither'); g.frame(35, 6, 9, 13);
    g.shape(poly([[8, 8], [20, 5], [30, 9], [36, 8], [36, 18], [28, 22], [18, 23], [8, 18]]));
    g.line(16, 10, 24, 14); g.line(14, 13, 22, 17); g.line(18, 16, 24, 19); g.line(26, 9, 34, 12);
    g.line(20, 5, 15, 11);
    return g;
  };

  // any pixel icon as a standalone transparent svg, optionally with a name tag under it
  ILL.icon = (name, tag = '') => {
    const g = PX[name](), s = 5;
    return svg(`-8 -8 ${g.w * s + 16} ${g.h * s + 16 + (tag ? 30 : 0)}`, `${g.svg(0, 0, s)}${tag ? nameTag(0, g.h * s + 8, tag, true) : ''}`, `Pixel-art ${name} icon`);
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


  /* ---------- loan case characters ---------- */
  ILL.calcFrame = () => svg('0 0 440 430', `
      ${selection(60, 50, 300, 330)}
      ${nameTag(60, 14, 'payoff 01')}
      ${nameTag(118, 392, '1 700 000 ₸', false)}
      ${PX.calculator().svg(98, 70, 7.6)}
      ${sparkle(400, 90, 1.1)}${sparkle(28, 320, .8)}
      ${cursor(332, 310, 0.55, -10)}
      ${nameTag(356, 352, 'you', true)}
    `, 'Pixel-art calculator inside a Figma selection box, tagged with the payoff sum');
  ILL.macPay = () => svg('0 0 440 480', `
      ${nameTag(70, 20, 'loan #2021')}
      ${PX.macCoin().svg(92, 70, 8)}
      ${sparkle(392, 120, 1.1)}${sparkle(40, 320, .8)}
      ${cursor(350, 340, 0.55, -10)}
      ${nameTag(372, 380, 'you', true)}
      ${cursor(30, 160, 0.5, -10)}
      ${nameTag(4, 198, 'bank', false)}
    `, 'Pixel-art classic computer showing a tenge coin, tagged loan 2021');
  ILL.unlocked = () => svg('0 0 460 420', `
      <g transform="rotate(-5 200 230)">${PX.padlockOpen().svg(70, 70, 8)}</g>
      ${PX.stamp().svg(290, 230, 6.5)}
      ${nameTag(220, 40, 'encumbrance ✓ lifted')}
      ${sparkle(50, 90, 1)}
      ${cursor(400, 330, 0.5, -10)}
    `, 'Pixel-art open padlock with a round approval stamp');
  ILL.paidOff = () => svg('0 0 460 420', `
      ${PX.receipt().svg(40, 96, 7.6)}
      ${PX.stamp().svg(220, 228, 6.5)}
      <text x="40" y="66" class="tk" style="font:400 46px 'Anton',Impact,sans-serif">PAID OFF!</text>
      ${cursor(352, 318, 0.6, -10)}
      ${sparkle(420, 120, 1.1)}${sparkle(20, 390, .8)}
    `, 'Pixel-art receipt with a paid stamp');
  ILL.ticketTray = () => svg('0 0 440 420', `
      ${nameTag(40, 24, '2 236 tickets')}
      ${PX.ticketTray().svg(40, 76, 8.4)}
      ${sparkle(410, 90, 1.1)}${sparkle(24, 380, .8)}
      ${cursor(330, 300, 0.55, -10)}
      ${nameTag(200, 376, 'from branches', false)}
    `, 'Pixel-art in-tray full of support tickets');

  // Loan card: a stack of tenge coins, paid off
  ILL.coinStack = () => svg('0 0 440 440', `
      ${nameTag(56, 24, 'paid off ✓')}
      ${PX.coins().svg(44, 84, 8.6)}
      ${sparkle(400, 110, 1.1)}${sparkle(30, 380, .8)}
      ${cursor(330, 330, 0.55, -10)}
      ${nameTag(354, 372, 'you', true)}
    `, 'Pixel-art stack of coins and a tenge coin, tagged paid off');

  /* ---------- Baspana Market characters ---------- */
  ILL.blockFrame = () => svg('0 0 440 430', `
      ${selection(70, 40, 290, 350)}
      ${nameTag(70, 4, 'complex #2021')}
      ${nameTag(128, 402, '805 flats', false)}
      ${PX.block().svg(100, 60, 7.8)}
      ${sparkle(400, 90, 1.1)}${sparkle(30, 320, .8)}
      ${cursor(332, 300, 0.55, -10)}
      ${nameTag(356, 342, 'you', true)}
    `, 'Pixel-art apartment block inside a Figma selection box');
  ILL.macCatalog = () => svg('0 0 440 480', `
      ${nameTag(70, 20, '102 000 results')}
      ${PX.macGrid().svg(92, 70, 8)}
      ${sparkle(392, 120, 1.1)}${sparkle(40, 320, .8)}
      ${cursor(350, 340, 0.55, -10)}
      ${nameTag(372, 380, 'you', true)}
      ${cursor(30, 160, 0.5, -10)}
      ${nameTag(4, 198, 'bank', false)}
    `, 'Pixel-art classic computer showing a catalog grid');
  ILL.planCheck = () => svg('0 0 460 420', `
      <g transform="rotate(-5 200 230)">${PX.floorPlan().svg(30, 110, 7.6)}</g>
      ${PX.stamp().svg(300, 240, 6.5)}
      ${nameTag(190, 40, '2-room ✓ fits Nauryz')}
      ${sparkle(60, 70, 1)}
      ${cursor(410, 340, 0.5, -10)}
    `, 'Pixel-art floor plan with an approval stamp');

  // Market card: a property-for-sale sign with the mortgage on it
  ILL.homeSign = () => svg('0 0 440 470', `
      ${nameTag(150, 16, 'for sale + mortgage')}
      ${PX.saleSign().svg(46, 66, 8.2)}
      ${sparkle(408, 110, 1.1)}${sparkle(26, 300, .8)}
      ${cursor(360, 380, 0.55, -10)}
      ${nameTag(384, 422, 'you', true)}
    `, 'Pixel-art for-sale sign on a post, showing a house and a percent sign');

  /* ---------- Smartbank characters ---------- */
  ILL.statementMac = () => svg('0 0 440 480', `
      ${nameTag(70, 20, '12 months · PDF')}
      ${PX.macStatement().svg(92, 70, 8)}
      ${sparkle(392, 120, 1.1)}${sparkle(40, 320, .8)}
      ${cursor(350, 340, 0.55, -10)}
      ${nameTag(372, 380, 'you', true)}
      ${cursor(30, 160, 0.5, -10)}
      ${nameTag(4, 198, 'bonus +30%', false)}
    `, 'Pixel-art classic computer showing a bank statement');
  ILL.themeSwitch = () => svg('0 0 440 470', `
      ${selection(110, 50, 236, 352)}
      ${nameTag(110, 14, 'Black VIP / White VIP')}
      ${PX.themeSplit().svg(112, 52, 8)}
      ${sparkle(400, 100, 1.1)}${sparkle(40, 330, .8)}
      ${cursor(330, 330, 0.55, -10)}
      ${nameTag(354, 372, '4 themes', true)}
    `, 'Pixel-art phone half dark and half light, with a diamond');
  ILL.tokenFan = () => svg('0 0 460 420', `
      ${PX.swatches().svg(40, 60, 8.4)}
      ${nameTag(250, 24, '76 tokens / theme')}
      ${PX.gem().svg(330, 250, 3.2)}
      ${sparkle(70, 50, 1)}
      ${cursor(410, 330, 0.5, -10)}
    `, 'Pixel-art fan of colour swatches and a diamond');

  /* ---------- Car loan characters ---------- */
  ILL.carLoan = () => svg('0 0 460 400', `
      ${nameTag(40, 30, 'approved in 2 min ✓')}
      ${PX.car().svg(22, 120, 8.6)}
      ${PX.carKey().svg(318, 62, 3.4)}
      ${sparkle(430, 140, 1.1)}${sparkle(30, 360, .8)}
      ${cursor(372, 300, 0.55, -10)}
      ${nameTag(396, 342, 'you', true)}
    `, 'Pixel-art retro car with a car key, tagged approved in 2 minutes');
  ILL.macCar = () => svg('0 0 440 480', `
      ${nameTag(70, 20, 'up to ₸15 m · 2–7 yrs')}
      ${PX.macCar().svg(92, 70, 8)}
      ${sparkle(392, 120, 1.1)}${sparkle(40, 320, .8)}
      ${cursor(350, 340, 0.55, -10)}
      ${nameTag(372, 380, 'you', true)}
      ${cursor(30, 160, 0.5, -10)}
      ${nameTag(4, 198, 'seller', false)}
    `, 'Pixel-art classic computer showing a car');
  ILL.keyTag = () => svg('0 0 460 400', `
      ${selection(40, 60, 380, 240)}
      ${nameTag(40, 24, 'first payment from 10%')}
      ${PX.carKey().svg(60, 90, 9)}
      ${PX.gauge().svg(250, 310, 3.4)}
      ${sparkle(430, 80, 1)}
      ${cursor(400, 250, 0.5, -10)}
    `, 'Pixel-art car key inside a selection box, with a speedometer');

  /* ---------- Mobile bank 2025 characters ---------- */
  ILL.groupPurse = () => svg('0 0 460 420', `
      ${nameTag(40, 24, 'trip to Georgia · 4 people')}
      ${PX.purse().svg(40, 70, 7)}
      ${PX.group().svg(306, 296, 3)}
      ${sparkle(430, 120, 1.1)}${sparkle(30, 380, .8)}
      ${cursor(370, 190, 0.55, -10)}
      ${nameTag(394, 232, 'you', true)}
    `, 'Pixel-art coin purse with four pockets and a group of three people');
  ILL.macRing = () => svg('0 0 440 480', `
      ${nameTag(70, 20, 'rent · 100% ✓')}
      ${PX.macRing().svg(92, 70, 8)}
      ${sparkle(392, 120, 1.1)}${sparkle(40, 320, .8)}
      ${cursor(350, 340, 0.55, -10)}
      ${nameTag(372, 380, 'you', true)}
      ${cursor(30, 160, 0.5, -10)}
      ${nameTag(4, 198, 'Vlad', false)}
    `, 'Pixel-art classic computer showing a ring chart of a wallet section');
  ILL.piggyGoal = () => svg('0 0 460 400', `
      ${selection(40, 60, 380, 300)}
      ${nameTag(40, 24, 'piggy bank · new phone')}
      ${PX.piggy().svg(70, 100, 7.6)}
      ${PX.umbrella().svg(330, 250, 2.6)}
      ${sparkle(430, 80, 1)}
      ${cursor(400, 320, 0.5, -10)}
    `, 'Pixel-art piggy bank inside a selection box, with an umbrella');

  /* ---------- Car re-registration characters ---------- */
  ILL.plateFrame = () => svg('0 0 460 380', `
      ${selection(30, 120, 400, 160)}
      ${nameTag(30, 84, 'keep my plate · 6 months')}
      ${PX.plate().svg(42, 132, 7.8)}
      ${PX.handshake().svg(150, 300, 3)}
      ${sparkle(430, 80, 1.1)}${sparkle(30, 340, .8)}
      ${cursor(330, 300, 0.55, -10)}
      ${nameTag(354, 342, 'you', true)}
    `, 'Pixel-art Kazakh licence plate in a selection box, with a handshake');
  ILL.govMac = () => svg('0 0 440 480', `
      ${nameTag(70, 20, 'GovTech · registered ✓')}
      ${PX.govBuilding().svg(76, 92, 7)}
      ${PX.eSign().svg(300, 270, 3.2)}
      ${sparkle(392, 120, 1.1)}${sparkle(40, 340, .8)}
      ${cursor(250, 380, 0.55, -10)}
      ${nameTag(274, 422, 'you', true)}
    `, 'Pixel-art government building and an e-signed document');
  ILL.bioCheck = () => svg('0 0 460 420', `
      ${nameTag(40, 24, 'biometrics + e-signature')}
      ${PX.faceScan().svg(40, 70, 8.6)}
      ${PX.pledge().svg(330, 300, 3)}
      ${sparkle(430, 90, 1)}
      ${cursor(360, 160, 0.5, -10)}
      ${nameTag(378, 202, 'buyer', false)}
    `, 'Pixel-art face in a scan frame with a padlock on a chain');

  /* ---------- career route: animated retro icons ----------
     Each icon is rigged from separate pixel parts (body, hanger, wheels, shutters…) wrapped in
     <g class="ca-*">, so CSS can move every part on its own (see .ca-* in style.css). */
  const part = (cls, inner, style = '') => `<g class="${cls}"${style ? ` style="${style}"` : ''}>${inner}</g>`;
  const CA = {};
  CA.mac = () => {
    const g = new Grid(32, 40);
    g.shape(rr(2, 32, 28, 7, 1)); g.shape(rr(1, 0, 30, 34, 3)); g.line(2, 33, 29, 33);
    g.shape(rr(5, 4, 22, 17, 2)); g.frame(7, 6, 18, 13, 1);
    g.rect(17, 25, 9, 2, 1); g.frame(6, 26, 4, 4, 1); g.line(4, 36, 27, 36);
    return g;
  };
  CA.bag = () => {
    const g = new Grid(12, 13);
    g.shape(rr(0.5, 4.5, 11, 8, 1)); g.line(4, 5, 4, 2).line(4, 1, 7, 1).line(7, 2, 7, 5); g.set(4, 1, 0); g.set(7, 1, 0); g.line(5, 0, 6, 0);
    return g;
  };
  CA.hanger = () => {
    const g = new Grid(27, 14);
    g.line(13, 5, 13, 3).line(13, 3, 14, 2).line(14, 1, 16, 1).line(17, 2, 17, 3);
    g.line(13, 5, 1, 12).line(13, 5, 25, 12).line(1, 12, 25, 12).line(13, 6, 2, 12).line(13, 6, 24, 12);
    return g;
  };
  CA.window = (kind) => {
    const g = new Grid(40, 30);
    g.shape(rr(0.5, 0.5, 39, 29, 0));
    [2, 4].forEach((y) => g.line(2, y, 37, y)); g.rect(14, 1, 12, 5, 2); g.line(0, 7, 39, 7); g.frame(3, 2, 4, 4);
    if (kind === 'landing') { g.rect(4, 10, 32, 7, 1); g.rect(8, 12, 18, 1, 2); g.rect(4, 20, 20, 2, 1); g.rect(4, 24, 14, 2, 1); g.frame(28, 20, 8, 6); }
    if (kind === 'crm') { for (let y = 10; y <= 25; y += 5) { g.line(3, y, 36, y); g.rect(4, y + 2, 6, 1); g.rect(14, y + 2, 10, 1); g.rect(29, y + 2, 5, 1); } }
    if (kind === 'app') { g.shape(rr(14, 9, 12, 19, 2)); g.rect(16, 12, 8, 4, 1); g.rect(16, 18, 8, 1); g.rect(16, 21, 6, 1); }
    return g;
  };
  CA.bubble = (flip, lines) => {
    const g = new Grid(34, 20);
    const tail = flip ? poly([[26, 12], [31, 12], [32, 19]]) : poly([[3, 12], [8, 12], [2, 19]]);
    g.shape(any(rr(0.5, 0.5, 33, 13, 3), tail));
    lines.forEach(([x, w], i) => g.rect(x, 4 + i * 4, w, 2, 1));
    return g;
  };
  CA.shield = () => {
    const g = new Grid(24, 28);
    g.shape(poly([[12, 0.5], [23.5, 4.5], [22, 17], [12, 27.5], [2, 17], [0.5, 4.5]]));
    g.shape(poly([[12, 3.5], [20.5, 6.5], [19.5, 16], [12, 24], [4.5, 16], [3.5, 6.5]]), 'dither');
    g.shape(rr(7, 9, 10, 9, 2), 'paper'); g.line(9, 13, 11, 15).line(11, 15, 15, 11).line(9, 14, 11, 16).line(11, 16, 15, 12);
    return g;
  };
  CA.car = () => {
    const g = new Grid(46, 20);
    g.shape(any(rr(0.5, 8.5, 45, 9, 2), poly([[8, 9], [14, 1.5], [31, 1.5], [37, 9]])));
    g.shape(poly([[11, 8.5], [15.5, 3.5], [21.5, 3.5], [21.5, 8.5]]), 'dither'); g.shape(poly([[23.5, 8.5], [23.5, 3.5], [29.5, 3.5], [34, 8.5]]), 'dither');
    g.line(22, 9, 22, 16); g.rect(42, 10, 2, 2, 1); g.rect(2, 10, 2, 2, 1); g.line(25, 12, 28, 12);
    return g;
  };
  CA.wheel = () => {
    const g = new Grid(11, 11);
    g.shape(ell(5.5, 5.5, 5.3), 'ink'); g.shape(ell(5.5, 5.5, 3.2), 'paper'); g.line(5, 3, 5, 7).line(3, 5, 7, 5); g.set(5, 5, 1);
    return g;
  };
  CA.card = () => {
    const g = new Grid(30, 19);
    g.shape(rr(0.5, 0.5, 29, 18, 2)); g.rect(1, 3, 28, 3, 1);
    g.shape(rr(3.5, 8.5, 6, 5, 1), 'dither'); g.rect(13, 9, 12, 1); g.rect(13, 12, 8, 1); g.rect(3, 15, 16, 1);
    return g;
  };
  CA.tiles = () => {
    const g = new Grid(22, 22);
    g.shape(rr(0.5, 0.5, 9, 9, 2)); g.shape(rr(12.5, 0.5, 9, 9, 4.5), 'dither'); g.shape(rr(0.5, 12.5, 9, 9, 0), 'ink'); g.shape(poly([[17, 12.5], [21.5, 21.5], [12.5, 21.5]]));
    return g;
  };
  CA.house = () => {
    const g = new Grid(42, 38);
    g.shape(rr(28.5, 3.5, 5, 10, 0), 'ink');
    g.shape(rr(5.5, 17.5, 31, 20, 0)); g.shape(poly([[21, 0.5], [41.5, 18.5], [0.5, 18.5]]));
    g.line(4, 17, 21, 2).line(38, 17, 21, 2);
    g.shape(rr(17.5, 25.5, 8, 12, 1), 'dither'); g.set(24, 31, 2);
    g.frame(8, 22, 7, 7); g.frame(28, 22, 7, 7);
    return g;
  };
  CA.ticket = () => {
    const g = new Grid(18, 22);
    g.shape(not(rr(0.5, 0.5, 17, 21, 1), any(ell(0, 11, 2.5), ell(18, 11, 2.5))));
    g.rect(4, 4, 10, 2, 1); g.rect(4, 8, 7, 1); for (let x = 3; x < 16; x += 2) g.set(x, 11, 1); g.rect(4, 14, 4, 4, 1); g.rect(10, 14, 4, 4, 1);
    return g;
  };
  CA.key = () => {
    const g = new Grid(12, 24);
    g.shape(ell(6, 5, 5.5, 5)); g.shape(ell(6, 5, 2, 1.8), 'clear'); g.frame(4, 3, 5, 5); g.rect(5, 10, 3, 13, 1); g.rect(8, 16, 3, 2, 1); g.rect(8, 20, 2, 2, 1);
    return g;
  };
  CA.phone = () => {
    const g = new Grid(26, 44);
    g.shape(rr(0.5, 0.5, 25, 43, 4)); g.shape(rr(2.5, 4.5, 21, 33, 1)); g.rect(10, 2, 6, 1, 1); g.frame(11, 39, 4, 3);
    g.rect(5, 8, 10, 2, 1); g.rect(5, 13, 16, 7, 1); g.rect(7, 15, 7, 1, 2); for (let i = 0; i < 3; i++) { g.frame(5, 23 + i * 4, 3, 3); g.rect(10, 24 + i * 4, 9 - i * 2, 1); }
    return g;
  };
  CA.shutter = (left) => {
    const g = new Grid(11, 34);
    g.shape(rr(0.5, 0.5, 10, 33, 0));
    for (let y = 3; y < 33; y += 3) g.line(1, y, 9, y);
    g.rect(left ? 8 : 1, 15, 2, 4, 1);
    return g;
  };
  CA.coin = () => {
    const g = new Grid(12, 12);
    g.shape(ell(6, 6, 5.6)); g.shape(ell(6, 6, 3.6), 'dither'); g.rect(5, 3, 2, 6, 2); g.rect(4, 3, 4, 1, 2);
    return g;
  };

  ILL.caFashion = () => svg('0 0 320 270', `
      ${CA.mac().svg(16, 30, 5.4)}
      ${part('ca-bob', CA.bag().svg(16 + 10 * 5.4, 30 + 6.5 * 5.4, 5.4))}
      ${part('ca-swing', CA.hanger().svg(200, 34, 4.2))}
      ${part('ca-blink', nameTag(160, 206, '{ } full-stack'))}
      ${part('ca-twinkle', sparkle(290, 150, .9))}
      ${part('ca-wander', cursor(236, 120, 0.5, -8))}
    `, 'Animated retro Macintosh with a shopping bag on screen and a swinging coat hanger');
  ILL.caFreelance = () => svg('0 0 320 270', `
      ${part('ca-pop ca-d0', CA.window('landing').svg(10, 16, 4.6))}
      ${part('ca-pop ca-d1', CA.window('crm').svg(110, 70, 4.6))}
      ${part('ca-pop ca-d2', CA.window('app').svg(60, 130, 4.6))}
      ${part('ca-wander', cursor(250, 200, 0.55, -10))}
      ${part('ca-twinkle', sparkle(292, 40, 1))}
    `, 'Animated retro windows popping up one by one: a landing page, a CRM table and an app');
  ILL.caQex = () => svg('0 0 320 270', `
      ${part('ca-pop ca-d0', CA.bubble(false, [[4, 22], [4, 14]]).svg(16, 20, 4.4))}
      ${part('ca-pop ca-d1', CA.bubble(true, [[8, 22], [16, 14]]).svg(80, 104, 4.4))}
      ${part('ca-pop ca-d2', nameTag(18, 214, 'AI ✦ typing…'))}
      ${part('ca-pulse', CA.shield().svg(214, 120, 3.8))}
      ${part('ca-twinkle', sparkle(270, 64, 1.2))}
    `, 'Animated retro chat bubbles with an AI tag and a pulsing security shield');
  ILL.caEurasian = () => svg('0 0 320 270', `
      ${part('ca-float', CA.card().svg(160, 18, 4.6))}
      ${part('ca-pulse', CA.tiles().svg(24, 26, 4))}
      ${part('ca-drive', `${CA.car().svg(28, 128, 5.6)}${part('ca-spin', CA.wheel().svg(28 + 5 * 5.6, 128 + 12.5 * 5.6, 5.6))}${part('ca-spin', CA.wheel().svg(28 + 29 * 5.6, 128 + 12.5 * 5.6, 5.6))}`)}
      ${part('ca-twinkle', sparkle(292, 120, .9))}
    `, 'Animated retro bank card, design-system tiles and a car driving with spinning wheels');
  ILL.caOtbasy = () => svg('0 0 320 270', `
      ${CA.house().svg(20, 40, 5.4)}
      ${part('ca-blink', `<rect class="k" x="${20 + 9 * 5.4}" y="${40 + 23 * 5.4}" width="${5 * 5.4}" height="${5 * 5.4}"/>`)}
      ${part('ca-blink ca-d1', `<rect class="k" x="${20 + 29 * 5.4}" y="${40 + 23 * 5.4}" width="${5 * 5.4}" height="${5 * 5.4}"/>`)}
      ${part('ca-ticket', CA.ticket().svg(256, 70, 3.4))}
      ${part('ca-swing', CA.key().svg(262, 160, 3.4))}
      ${part('ca-twinkle', sparkle(40, 30, .9))}
    `, 'Animated retro house with lit windows, a queue ticket and a swinging key');
  ILL.caWindow = () => svg('0 0 320 270', `
      ${CA.phone().svg(100, 12, 5.6)}
      ${part('ca-shutter-l', CA.shutter(true).svg(100 + 2.5 * 5.6, 12 + 4.5 * 5.6, 5.6))}
      ${part('ca-shutter-r', CA.shutter(false).svg(100 + 13 * 5.6, 12 + 4.5 * 5.6, 5.6))}
      ${part('ca-coin', CA.coin().svg(232, 40, 4))}
      ${part('ca-coin ca-d1', CA.coin().svg(26, 120, 4))}
      ${part('ca-twinkle', sparkle(270, 214, 1))}
    `, 'Animated retro phone whose window shutters open on a banking app, with coins');

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
    // loan set
    paidoff: () => st('0 0 210 90', `<rect class="k" x="4" y="4" width="202" height="82" rx="41"/><text x="105" y="58" text-anchor="middle" class="tx" style="font:400 36px 'Anton',Impact,sans-serif">PAID OFF!</text>`, 'Sticker: paid off'),
    coins: () => st('-12 -12 236 160', `<g transform="rotate(-4 105 66)"><rect class="p" x="0" y="0" width="210" height="132" rx="16"/>${PX.coins().svg(48, 6, 2.85)}<text x="105" y="120" text-anchor="middle" class="tk" style="font-size:18px">0 ₸ left to pay</text></g>`, 'Sticker: zero left to pay'),
    zero: () => st('0 0 150 150', `<circle class="k" cx="75" cy="75" r="70"/><circle class="p" cx="75" cy="75" r="56" style="stroke-dasharray:4 8"/><text x="75" y="80" text-anchor="middle" class="tk" style="font:400 40px 'Anton',Impact,sans-serif">0 ₸</text><text x="75" y="104" text-anchor="middle" class="tk" style="font-size:15px">DEBT ✓</text>`, 'Sticker: zero debt'),
    // Baspana Market set
    newbuild: () => st('0 0 230 90', `<rect class="k" x="4" y="4" width="222" height="82" rx="41"/><text x="115" y="58" text-anchor="middle" class="tx" style="font:400 36px 'Anton',Impact,sans-serif">${root.t ? root.t('NEW BUILD!') : 'NEW BUILD!'}</text>`, 'Sticker: new build'),
    yurtcard: () => st('-12 -12 236 160', `<g transform="rotate(-4 105 66)"><rect class="p" x="0" y="0" width="210" height="132" rx="16"/>${PX.yurt().svg(57, 8, 2.4)}<text x="105" y="120" text-anchor="middle" class="tk" style="font-size:18px">8 programmes</text></g>`, 'Sticker: eight programmes'),
    pdffree: () => st('0 0 230 90', `<rect class="k" x="4" y="4" width="222" height="82" rx="41"/><text x="115" y="58" text-anchor="middle" class="tx" style="font:400 34px 'Anton',Impact,sans-serif">${root.t ? root.t('PDF · 0 ₸') : 'PDF · 0 ₸'}</text>`, 'Sticker: free PDF statement'),
    viptheme: () => st('0 0 150 150', `<circle class="k" cx="75" cy="75" r="70"/><circle class="p" cx="75" cy="75" r="56" style="stroke-dasharray:4 8"/>${PX.gem().svg(48, 34, 1.5)}<text x="75" y="106" text-anchor="middle" class="tk" style="font:400 30px 'Anton',Impact,sans-serif">VIP</text>`, 'Sticker: VIP theme'),
    twomin: () => st('0 0 150 150', `<circle class="k" cx="75" cy="75" r="70"/><circle class="p" cx="75" cy="75" r="56" style="stroke-dasharray:4 8"/><text x="75" y="84" text-anchor="middle" class="tk" style="font:400 36px 'Anton',Impact,sans-serif">${root.t ? root.t('2 MIN') : '2 MIN'}</text><text x="75" y="108" text-anchor="middle" class="tk" style="font-size:15px">${root.t ? root.t('ONLINE ✓') : 'ONLINE ✓'}</text>`, 'Sticker: decision in 2 minutes'),
    usedcar: () => st('-12 -12 236 160', `<g transform="rotate(-4 105 66)"><rect class="p" x="0" y="0" width="210" height="132" rx="16"/>${PX.car().svg(33, 14, 3)}<text x="105" y="120" text-anchor="middle" class="tk" style="font-size:18px">${root.t ? root.t('used car OK') : 'used car OK'}</text></g>`, 'Sticker: used car'),
    splitok: () => st('0 0 230 90', `<rect class="k" x="4" y="4" width="222" height="82" rx="41"/><text x="115" y="58" text-anchor="middle" class="tx" style="font:400 34px 'Anton',Impact,sans-serif">${root.t ? root.t('SPLIT ✓') : 'SPLIT ✓'}</text>`, 'Sticker: split the bill'),
    envelopes4: () => st('-12 -12 236 160', `<g transform="rotate(-4 105 66)"><rect class="p" x="0" y="0" width="210" height="132" rx="16"/>${PX.envelopes().svg(61, 10, 2.1)}<text x="105" y="120" text-anchor="middle" class="tk" style="font-size:18px">${root.t ? root.t('4 envelopes') : '4 envelopes'}</text></g>`, 'Sticker: four envelopes'),
    esign: () => st('0 0 150 150', `<circle class="k" cx="75" cy="75" r="70"/><circle class="p" cx="75" cy="75" r="56" style="stroke-dasharray:4 8"/><text x="75" y="82" text-anchor="middle" class="tk" style="font:400 30px 'Anton',Impact,sans-serif">${root.t ? root.t('E-SIGN') : 'E-SIGN'}</text><text x="75" y="104" text-anchor="middle" class="tk" style="font-size:12px">${root.t ? root.t('NO QUEUE ✓') : 'NO QUEUE ✓'}</text>`, 'Sticker: e-signature, no queue'),
    kzplate: () => st('-12 -12 236 130', `<g transform="rotate(-4 105 50)"><rect class="p" x="0" y="0" width="210" height="100" rx="16"/>${PX.plate().svg(15, 12, 3.8)}<text x="105" y="94" text-anchor="middle" class="tk" style="font-size:16px">${root.t ? root.t('re-registered') : 're-registered'}</text></g>`, 'Sticker: licence plate re-registered'),
    online50: () => st('0 0 150 150', `<circle class="k" cx="75" cy="75" r="70"/><circle class="p" cx="75" cy="75" r="56" style="stroke-dasharray:4 8"/><text x="75" y="80" text-anchor="middle" class="tk" style="font:400 40px 'Anton',Impact,sans-serif">−50%</text><text x="75" y="104" text-anchor="middle" class="tk" style="font-size:15px">ONLINE ✓</text>`, 'Sticker: online mortgage discount'),
  };

  ILL.characters = ['cursorKid', 'penPal', 'framePeek', 'juggler', 'commenter', 'layers', 'researcher', 'macHome', 'houseFrame', 'idCheck', 'allSet', 'calcFrame', 'macPay', 'unlocked', 'paidOff', 'ticketTray', 'coinStack', 'blockFrame', 'macCatalog', 'planCheck', 'homeSign', 'statementMac', 'themeSwitch', 'tokenFan', 'carLoan', 'macCar', 'keyTag', 'groupPurse', 'macRing', 'piggyGoal', 'plateFrame', 'govMac', 'bioCheck'];

  root.ILL = ILL;
  if (typeof module !== 'undefined' && module.exports) module.exports = ILL;
})(typeof window !== 'undefined' ? window : globalThis);
