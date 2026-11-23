#!/usr/bin/env node
/*
 * Generates the Russian entry pages from the English ones:
 *   index.html → index-ru.html,  case.html → case-ru.html
 * Static text, <title>, meta description and alt / aria-label / title / data-cursor attributes
 * are translated with assets/js/ru.js; everything rendered by JavaScript (projects, case
 * boards, illustrations) is translated in the browser by assets/js/i18n.js.
 *
 *   node scripts/make-ru.js
 * Run it after editing index.html, case.html or assets/js/ru.js (build-static.js runs it too).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
require(path.join(root, 'assets', 'js', 'ru.js'));
require(path.join(root, 'assets', 'js', 'i18n.js'));
globalThis.LANG = 'ru';
const t = globalThis.t;

const ATTRS = ['alt', 'aria-label', 'title', 'placeholder', 'data-cursor', 'content'];
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
const encode = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function translateHtml(html) {
  // leave <script> and <style> blocks alone
  return html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>)/i).map((part, i) => {
    if (i % 2) return part;
    part = part.replace(/(<[^>]*)>([^<]+)(?=<)/g, (m, open, text) => {
      const k = decode(text).replace(/\s+/g, ' ').trim();
      if (!k || !/[A-Za-z]/.test(k)) return m;
      const ctx = (open.match(/\sdata-t="([^"]*)"/) || [])[1]; // context key for ambiguous words
      const tr = ctx && t(ctx) !== ctx ? t(ctx) : t(k);
      return tr === k ? m : open + '>' + text.match(/^\s*/)[0] + encode(tr) + text.match(/\s*$/)[0];
    });
    return part.replace(new RegExp(`\\s(${ATTRS.join('|')})="([^"]*)"`, 'g'), (m, a, v) => {
      if (!/[A-Za-z]/.test(v)) return m;
      const tr = t(decode(v));
      return tr === decode(v) ? m : ` ${a}="${tr.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
    });
  }).join('');
}

function toRu(src, langTarget) {
  let html = fs.readFileSync(path.join(root, src), 'utf8')
    .replace('<html lang="en"', '<html lang="ru"')
    .replace('<script src="assets/js/i18n.js"></script>', '<script src="assets/js/ru.js"></script>\n  <script src="assets/js/i18n.js"></script>')
    .replace(/href="index\.html/g, 'href="index-ru.html')
    .replace(/href="case\.html\?p=/g, 'href="case-ru.html?p=');
  html = translateHtml(html);
  // the switch goes back to English
  return html.replace(/<a class="nav__lang" href="[^"]*" hreflang="ru" lang="ru" data-lang-switch aria-label="[^"]*">RU<\/a>/,
    `<a class="nav__lang" href="${langTarget}" hreflang="en" lang="en" data-lang-switch aria-label="English version">EN</a>`);
}

fs.writeFileSync(path.join(root, 'index-ru.html'), toRu('index.html', 'index.html'));
fs.writeFileSync(path.join(root, 'case-ru.html'), toRu('case.html', 'case.html'));
if (require.main === module) console.log('Wrote index-ru.html and case-ru.html');
module.exports = { translateHtml };
