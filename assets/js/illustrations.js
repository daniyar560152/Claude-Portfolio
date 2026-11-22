/*
 * Monochrome retro "rubber-hose" cartoon characters holding Figma UI props.
 * Every illustration is an inline SVG with NO background -> fully transparent.
 * Colours come from CSS custom properties so they can be re-themed:
 *   --ill-ink   (default #111)   lines & solid fills
 *   --ill-paper (default #fff)   faces, gloves, UI surfaces
 * Pupils are wrapped in <g class="pupil"> so main.js can make them follow the cursor.
 */
(function (root) {
  const STYLE = `<style>
    .k{fill:var(--ill-ink,#111)}
    .p{fill:var(--ill-paper,#fff);stroke:var(--ill-ink,#111);stroke-width:5;stroke-linejoin:round;stroke-linecap:round}
    .l{fill:none;stroke:var(--ill-ink,#111);stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
    .t{fill:none;stroke:var(--ill-ink,#111);stroke-width:2.5;stroke-linecap:round}
    .d{fill:none;stroke:var(--ill-ink,#111);stroke-width:3;stroke-dasharray:2 10;stroke-linecap:round}
    .n{fill:none;stroke:var(--ill-ink,#111);stroke-width:11;stroke-linecap:round;stroke-linejoin:round}
    .w{fill:var(--ill-paper,#fff)}
    .tx{font:600 15px 'DM Mono',ui-monospace,monospace;fill:var(--ill-paper,#fff);letter-spacing:.02em}
    .tk{font:600 15px 'DM Mono',ui-monospace,monospace;fill:var(--ill-ink,#111);letter-spacing:.02em}
  </style>`;

  const svg = (vb, body, label) =>
    `<svg class="ill" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${STYLE}${body}</svg>`;

  /* ---------- reusable body parts (local coordinates) ---------- */

  // Head centred at 0,0. mood: 'grin' | 'smile' | 'o'
  function head(x, y, s = 1, { mood = 'grin', hat = 'beret', flip = false } = {}) {
    const mouth = {
      grin: `<path class="k" d="M-25 17 Q0 50 25 17 Q0 27 -25 17Z"/><path class="w" d="M-10 30 Q0 38 10 30 Q0 27 -10 30Z"/>`,
      smile: `<path class="l" d="M-20 18 Q0 36 20 18"/>`,
      o: `<ellipse class="k" cx="0" cy="26" rx="8" ry="10"/>`,
    }[mood];
    const hats = {
      beret: `<path class="k" d="M-50 -14 C-56 -60 46 -74 56 -26 C30 -38 -20 -36 -50 -14Z"/><path class="l" d="M4 -56 l3 -12"/>`,
      cap: `<path class="k" d="M-44 -18 C-44 -64 44 -64 44 -18Z"/><path class="k" d="M30 -22 L82 -18 C80 -10 60 -8 30 -10Z"/>`,
      hair: `<path class="k" d="M-46 -10 C-50 -50 -10 -66 20 -54 C44 -50 54 -30 48 -10 C40 -30 20 -36 0 -30 C-20 -40 -36 -30 -46 -10Z"/>`,
      none: '',
    }[hat];
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
      <circle class="p" cx="-45" cy="2" r="11"/><circle class="p" cx="45" cy="2" r="11"/>
      <ellipse class="p" cx="0" cy="0" rx="46" ry="44"/>
      ${hats}
      <g class="pupil">
        <ellipse class="k" cx="-14" cy="-8" rx="8.5" ry="14"/><ellipse class="k" cx="14" cy="-8" rx="8.5" ry="14"/>
        <path class="w" d="M-14 -9 L-10.5 -20 L-7.2 -12Z"/><path class="w" d="M14 -9 L17.5 -20 L20.8 -12Z"/>
      </g>
      <ellipse class="k" cx="0" cy="10" rx="9" ry="6"/>
      ${mouth}
      <path class="t" d="M-32 14 q-5 5 -2 11"/><path class="t" d="M32 14 q5 5 2 11"/>
    </g>`;
  }

  // Torso + classic shorts; neck at x,y.
  function torso(x, y, s = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path class="p" d="M-30 2 C-50 40 -46 96 -24 106 L26 106 C48 96 50 40 30 2 Z"/>
      <path class="k" d="M-30 94 L30 94 L38 136 L9 136 L0 118 L-9 136 L-38 136 Z"/>
      <circle class="w" cx="-14" cy="108" r="4.5"/><circle class="w" cx="14" cy="108" r="4.5"/>
    </g>`;
  }

  const noodle = (d) => `<path class="n" d="${d}"/>`;

  function glove(x, y, r = 0, s = 1) {
    return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
      <path class="p" d="M-8 14 L8 14 L9 24 L-9 24Z"/>
      <path class="p" d="M-16 6 C-24 -10 -12 -24 0 -20 C10 -28 24 -18 18 -4 C24 6 14 16 4 12 C-4 18 -14 16 -16 6Z"/>
      <path class="t" d="M-3 -6 l6 6 M6 -10 l6 6"/>
    </g>`;
  }

  function shoe(x, y, flip = false) {
    return `<g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)">
      <ellipse class="k" cx="0" cy="0" rx="27" ry="14"/>
      <ellipse class="w" cx="-9" cy="-5" rx="7" ry="3.5"/>
    </g>`;
  }

  // Figma-style pointer cursor, tip at 0,0
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

  function selection(x, y, w, h) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="t" style="stroke-width:2"/>
      ${handle(x, y)}${handle(x + w, y)}${handle(x, y + h)}${handle(x + w, y + h)}`;
  }

  const motion = (x, y, r = 0) =>
    `<g transform="translate(${x} ${y}) rotate(${r})"><path class="l" d="M0 0 q10 8 8 22"/><path class="l" d="M14 -6 q14 10 12 32"/></g>`;

  function diamond4(x, y, s = 1) {
    // Figma "main component" icon
    const d = (cx, cy) => `<path class="k" d="M${cx} ${cy - 13} L${cx + 13} ${cy} L${cx} ${cy + 13} L${cx - 13} ${cy}Z"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${d(0, -17)}${d(17, 0)}${d(0, 17)}${d(-17, 0)}</g>`;
  }

  /* ---------- characters ---------- */

  const ILL = {};

  // HERO — the designer holding a giant Figma cursor inside a selection box
  ILL.cursorKid = () =>
    svg(
      '0 0 440 480',
      `
      ${selection(70, 52, 300, 382)}
      ${nameTag(70, 18, 'Designer')}
      ${nameTag(176, 446, '300 × Hug', false)}
      <g class="arm-wave" style="transform-origin:250px 232px">
        ${noodle('M250 232 C282 216 300 190 310 156')}
        ${glove(314, 140, 20)}
        ${motion(336, 112, 10)}
      </g>
      ${noodle('M198 346 C194 378 176 396 166 410')}
      ${noodle('M234 346 C238 378 256 396 268 410')}
      ${shoe(156, 418)}${shoe(280, 418, true)}
      ${torso(216, 214)}
      ${noodle('M188 232 C158 220 138 190 134 150')}
      ${cursor(92, 58, 1.25, -8)}
      ${glove(134, 140, -15)}
      ${head(216, 164, 1.05, { mood: 'grin', hat: 'beret' })}
      ${cursor(360, 330, 0.55, -10)}
      ${nameTag(380, 370, 'you', true)}
    `,
      'Retro cartoon designer holding a giant Figma cursor'
    );

  // Pen tool — drawing a bezier curve with anchors & handles
  ILL.penPal = () =>
    svg(
      '0 0 460 400',
      `
      <path class="l" d="M24 330 C110 160 230 380 330 210" style="stroke-width:4"/>
      <path class="t" d="M24 330 L90 210"/><circle class="p" cx="90" cy="210" r="7" style="stroke-width:3"/>
      <path class="t" d="M190 300 L130 300 M190 300 L250 300"/><circle class="p" cx="130" cy="300" r="7" style="stroke-width:3"/><circle class="p" cx="250" cy="300" r="7" style="stroke-width:3"/>
      ${handle(24, 330)}${handle(190, 300)}
      <rect class="k" x="324" y="204" width="13" height="13"/>
      ${noodle('M356 330 C352 352 340 366 330 378')}
      ${noodle('M388 330 C392 352 404 366 414 378')}
      ${shoe(322, 384)}${shoe(424, 384, true)}
      ${torso(372, 210, 0.9)}
      <g transform="translate(338 206) rotate(-35)">
        <path class="p" d="M0 0 L-22 -52 L0 -96 L22 -52 Z"/>
        <path class="l" d="M0 0 L0 -44" style="stroke-width:3"/><circle class="w" cx="0" cy="-50" r="6" stroke="var(--ill-ink,#111)" stroke-width="3"/>
        <rect class="k" x="-16" y="-128" width="32" height="34" rx="4"/>
      </g>
      ${noodle('M348 232 C330 240 318 226 316 200')}
      ${glove(318, 184, -30, 0.95)}
      ${noodle('M396 232 C420 238 432 214 432 190')}
      ${glove(432, 176, 10, 0.95)}
      ${head(372, 166, 0.95, { mood: 'smile', hat: 'hair' })}
      ${nameTag(250, 362, 'Pen (P)', true)}
    `,
      'Retro cartoon character drawing a bezier curve with the Figma pen tool'
    );

  // Peeking over the top of a Frame with a wireframe inside
  ILL.framePeek = () =>
    svg(
      '0 0 460 380',
      `
      ${head(230, 98, 1, { mood: 'o', hat: 'cap' })}
      <rect class="p" x="40" y="130" width="380" height="230" rx="6"/>
      <text x="40" y="120" class="tk" style="font-size:14px">Frame 12 — 1440</text>
      ${glove(150, 128, -10)}${glove(310, 128, 10)}
      <rect class="t" x="62" y="152" width="336" height="22" rx="4"/>
      <rect class="t" x="62" y="190" width="150" height="110" rx="4"/>
      <path class="t" d="M62 190 L212 300 M212 190 L62 300"/>
      <path class="l" d="M232 198 H380 M232 222 H350 M232 246 H368" style="stroke-width:6"/>
      <rect class="k" x="232" y="270" width="96" height="30" rx="15"/>
      <text x="248" y="290" class="tx" style="font-size:12px">BUTTON</text>
      <path class="t" d="M62 326 H398" style="stroke-dasharray:6 8"/>
      ${cursor(372, 290, 0.5, -10)}
    `,
      'Retro cartoon character peeking over a Figma frame containing a wireframe'
    );

  // Juggling components
  ILL.juggler = () =>
    svg(
      '0 0 440 460',
      `
      <path class="d" d="M110 170 C130 30 310 30 330 170"/>
      <g class="float-a">${diamond4(120, 118, 1)}</g>
      <g class="float-b"><rect class="p" x="194" y="22" width="52" height="52" rx="8"/><text x="204" y="56" class="tk" style="font-size:22px">Aa</text></g>
      <g class="float-c" transform="translate(320 118)"><path class="p" d="M0 -26 L26 0 L0 26 L-26 0Z"/><path class="k" d="M0 -10 L10 0 L0 10 L-10 0Z"/></g>
      ${noodle('M202 360 C196 392 182 410 170 424')}
      ${noodle('M238 360 C244 392 258 410 270 424')}
      ${shoe(160, 432)}${shoe(282, 432, true)}
      ${torso(220, 228)}
      ${noodle('M192 246 C160 236 140 210 136 186')}
      ${glove(134, 172, -20)}
      ${noodle('M248 246 C280 236 300 210 304 186')}
      ${glove(306, 172, 20)}
      ${head(220, 178, 1, { mood: 'grin', hat: 'none' })}
      <path class="l" d="M188 132 q-6 -18 6 -26 M220 126 q0 -18 10 -24 M250 132 q8 -16 -2 -28" />
    `,
      'Retro cartoon character juggling Figma component icons'
    );

  // Sitting on a giant comment bubble
  ILL.commenter = () =>
    svg(
      '0 0 420 420',
      `
      <path class="p" d="M60 404 L60 276 C60 214 110 180 210 180 C310 180 360 214 360 292 C360 370 310 404 210 404 Z"/>
      <text x="210" y="338" text-anchor="middle" class="tk" style="font:400 52px 'Anton',Impact,sans-serif;letter-spacing:.02em">LGTM!</text>
      <path class="l" d="M140 364 H282" style="stroke-width:4"/>
      ${noodle('M194 190 C190 222 176 240 164 254')}
      ${noodle('M222 190 C228 222 244 240 256 252')}
      ${shoe(154, 260)}${shoe(266, 258, true)}
      ${torso(208, 64, 0.95)}
      ${noodle('M182 82 C150 80 132 104 130 132')}
      ${glove(128, 148, 170)}
      ${noodle('M234 82 C266 70 280 44 284 20')}
      ${glove(286, 8, 10)}
      ${motion(306, -6, 20)}
      ${head(208, 20, 0.9, { mood: 'grin', hat: 'beret' })}
    `,
      'Retro cartoon character sitting on a Figma comment bubble that says LGTM'
    ).replace('viewBox="0 0 420 420"', 'viewBox="0 -40 420 460"');

  // Standing on stacked layers with a flag
  ILL.layers = () => {
    const slab = (y, label) => `<g transform="translate(220 ${y})">
        <path class="p" d="M-150 0 L0 -60 L150 0 L0 60 Z"/>
        <path class="k" d="M-150 0 L0 60 L0 78 L-150 18Z"/><path class="p" d="M150 0 L0 60 L0 78 L150 18Z" style="stroke-width:4"/>
        <path class="t" d="M150 10 L176 10"/><text x="182" y="15" class="tk" style="font-size:14px">${label}</text>
      </g>`;
    return svg(
      '0 0 540 500',
      `
      ${slab(412, 'Tokens')}${slab(352, 'Components')}${slab(292, 'Patterns')}
      ${noodle('M208 270 C206 282 200 290 194 296')}${noodle('M234 270 C236 282 242 290 248 296')}
      ${shoe(186, 298)}${shoe(256, 298, true)}
      ${torso(220, 134)}
      <path class="l" d="M296 40 L296 232" style="stroke-width:6"/>
      <path class="k" d="M300 42 L380 56 L300 90 Z"/><text x="306" y="70" class="tx" style="font-size:13px">v2.0</text>
      ${noodle('M246 150 C270 160 286 170 296 176')}
      ${glove(296, 172, 80)}
      ${noodle('M194 150 C164 146 150 124 148 100')}
      ${glove(148, 86, -10)}
      ${motion(118, 62, -40)}
      ${head(220, 92, 1, { mood: 'grin', hat: 'cap' })}
    `,
      'Retro cartoon character standing on stacked design-system layers holding a v2.0 flag'
    );
  };

  // Researcher with a giant magnifying glass over a sticky note
  ILL.researcher = (tag = 'n = 14 interviews') =>
    svg(
      '0 0 460 440',
      `
      <g transform="rotate(-6 120 300)">
        <rect class="p" x="30" y="220" width="170" height="170"/>
        <path class="k" d="M30 220 h170 v18 h-170z"/>
        <path class="l" d="M54 360 V310 M84 360 V280 M114 360 V330 M144 360 V262 M174 360 V300" style="stroke-width:12;stroke-linecap:butt"/>
      </g>
      ${noodle('M300 352 C296 384 286 402 276 416')}${noodle('M336 352 C342 384 352 402 362 416')}
      ${shoe(266, 422)}${shoe(374, 422, true)}
      ${torso(318, 220)}
      <g transform="translate(196 210) rotate(-30)">
        <rect class="k" x="-10" y="60" width="20" height="90" rx="8"/>
        <circle class="p" cx="0" cy="0" r="62" style="stroke-width:12"/>
        <path class="l" d="M-30 -30 q14 -14 34 -14" style="stroke-width:6"/>
      </g>
      ${noodle('M292 238 C266 250 252 268 246 290')}
      ${glove(242, 300, -150)}
      ${noodle('M344 238 C372 230 384 206 384 182')}
      ${glove(386, 168, 15)}
      ${head(318, 170, 1, { mood: 'o', hat: 'hair', flip: true })}
      ${tag ? nameTag(Math.max(10, 440 - tag.length * 9.4 - 20), 30, tag) : ''}
    `,
      'Retro cartoon researcher inspecting a sticky note chart with a magnifying glass'
    );

  /* ---------- stickers (used by the click-to-stick mouse toy & decorations) ---------- */
  const st = (vb, body, label) => svg(vb, body, label).replace('class="ill"', 'class="ill sticker-svg"');

  ILL.stickers = {
    burst: () =>
      st(
        '0 0 160 160',
        `<path class="p" d="${(() => {
          let d = '';
          for (let i = 0; i < 24; i++) {
            const a = (i / 24) * Math.PI * 2, r = i % 2 ? 58 : 76;
            d += (i ? 'L' : 'M') + (80 + r * Math.cos(a)).toFixed(1) + ' ' + (80 + r * Math.sin(a)).toFixed(1) + ' ';
          }
          return d + 'Z';
        })()}"/><text x="80" y="92" text-anchor="middle" class="tk" style="font:400 34px 'Anton',Impact,sans-serif">NEW!</text>`,
        'Sticker: NEW!'
      ),
    ship: () =>
      st('0 0 200 90', `<rect class="k" x="4" y="4" width="192" height="82" rx="41"/><text x="100" y="58" text-anchor="middle" class="tx" style="font:400 36px 'Anton',Impact,sans-serif">SHIP IT</text>`, 'Sticker: ship it'),
    wip: () =>
      st('0 0 170 100', `<rect class="p" x="6" y="6" width="158" height="88" rx="10"/><rect class="k" x="16" y="16" width="138" height="68" rx="6"/><text x="85" y="66" text-anchor="middle" class="tx" style="font:400 42px 'Anton',Impact,sans-serif">WIP</text>`, 'Sticker: WIP'),
    component: () => st('-50 -50 100 100', `<circle class="p" cx="0" cy="0" r="44"/>${diamond4(0, 0, 0.9)}`, 'Sticker: component'),
    cursor: () => st('-10 -10 110 120', `${cursor(10, 6, 1.1, -6)}<g transform="translate(46 78)"><rect class="k" x="0" y="0" width="48" height="24" rx="5"/><text x="9" y="17" class="tx" style="font-size:13px">hi!</text></g>`, 'Sticker: cursor'),
    smile: () =>
      st('-60 -60 120 120', `<circle class="p" cx="0" cy="0" r="52"/><g class="pupil"><ellipse class="k" cx="-15" cy="-10" rx="7" ry="12"/><ellipse class="k" cx="15" cy="-10" rx="7" ry="12"/></g><path class="k" d="M-26 12 Q0 44 26 12 Q0 22 -26 12Z"/>`, 'Sticker: smiley'),
    bolt: () => st('0 0 100 140', `<path class="k" d="M58 4 L10 80 L46 80 L34 136 L90 52 L54 52 L70 4Z" stroke="var(--ill-paper,#fff)" stroke-width="5" stroke-linejoin="round"/>`, 'Sticker: lightning bolt'),
    a11y: () => st('0 0 150 150', `<circle class="k" cx="75" cy="75" r="70"/><circle class="p" cx="75" cy="75" r="56" style="stroke-dasharray:4 8"/><text x="75" y="70" text-anchor="middle" class="tk" style="font:400 28px 'Anton',Impact,sans-serif">WCAG</text><text x="75" y="100" text-anchor="middle" class="tk" style="font-size:16px">AA ✓</text>`, 'Sticker: WCAG AA'),
    star: () => st('0 0 120 120', `<path class="p" d="M60 6 L74 44 L114 46 L82 70 L94 110 L60 86 L26 110 L38 70 L6 46 L46 44Z"/>`, 'Sticker: star'),
    pixel: () => st('0 0 150 70', `<rect class="p" x="4" y="4" width="142" height="62" rx="8" transform="rotate(-3 75 35)"/><text x="75" y="46" text-anchor="middle" class="tk" style="font:400 21px 'Anton',Impact,sans-serif;letter-spacing:.03em" transform="rotate(-3 75 35)">PIXEL PERFECT</text>`, 'Sticker: pixel perfect'),
  };

  ILL.characters = ['cursorKid', 'penPal', 'framePeek', 'juggler', 'commenter', 'layers', 'researcher'];

  root.ILL = ILL;
  if (typeof module !== 'undefined' && module.exports) module.exports = ILL;
})(typeof window !== 'undefined' ? window : globalThis);
