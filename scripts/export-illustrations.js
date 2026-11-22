#!/usr/bin/env node
/*
 * Writes every character and sticker from assets/js/illustrations.js as a
 * standalone, transparent-background SVG into assets/illustrations/.
 * Usage: node scripts/export-illustrations.js
 */
const fs = require('fs');
const path = require('path');
const ILL = require(path.join(__dirname, '..', 'assets', 'js', 'illustrations.js'));

const out = path.join(__dirname, '..', 'assets', 'illustrations');
fs.mkdirSync(out, { recursive: true });

const standalone = (markup) =>
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  markup
    // drop the page-only class so the file stands alone
    .replace(/ class="ill( sticker-svg)?"/, '')
    // inline the default colours so tools without CSS variables still render ink/paper
    .replace(/var\(--ill-ink,#111\)/g, '#111111')
    .replace(/var\(--ill-paper,#fff\)/g, '#ffffff') +
  '\n';

let n = 0;
for (const name of ILL.characters) {
  fs.writeFileSync(path.join(out, `${name}.svg`), standalone(ILL[name]()));
  n++;
}
for (const [name, fn] of Object.entries(ILL.stickers)) {
  fs.writeFileSync(path.join(out, `sticker-${name}.svg`), standalone(fn()));
  n++;
}
console.log(`Exported ${n} transparent SVGs to ${path.relative(process.cwd(), out)}/`);
