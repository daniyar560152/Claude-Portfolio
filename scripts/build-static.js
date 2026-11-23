#!/usr/bin/env node
/*
 * Builds a static copy of the site into dist/ with one HTML file per case study and language
 * (case-housing.html, case-housing-ru.html, …) instead of case.html?p=<slug> / case-ru.html?p=<slug>.
 * Useful for hosts that don't keep query strings (e.g. claude.ai artifacts) and for
 * plain static hosting such as GitHub Pages.
 *
 *   node scripts/build-static.js            → dist/index.html is a normal full page
 *   node scripts/build-static.js --fragment → dist/index.html has no <html>/<head>/<body>
 *                                             wrapper (for hosts that add their own skeleton)
 * The Russian pages (index-ru.html, case-*-ru.html) are always full pages; they are generated
 * from the English ones by scripts/make-ru.js, which this script runs first.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const fragment = process.argv.includes('--fragment');
require('./make-ru.js'); // refresh index-ru.html / case-ru.html
const PROJECTS = require(path.join(root, 'assets', 'js', 'projects.js'));

const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(dist, f), s);
const caseFile = (slug, lang) => `case-${slug}${lang === 'ru' ? '-ru' : ''}.html`;
const homeFile = (lang) => (lang === 'ru' ? 'index-ru.html' : 'index.html');
const routing = (lang, slug) => {
  const other = lang === 'ru' ? '' : '-ru';
  const own = lang === 'ru' ? '-ru' : '';
  return `<script>window.caseUrl = function (s) { return 'case-' + s + '${own}.html'; }; window.altCaseUrl = function (s) { return 'case-' + s + '${other}.html'; }; window.homeUrl = '${homeFile(lang)}';${slug ? ` window.CASE_SLUG = '${slug}';` : ''}</script>\n  `;
};
// routing goes in before the first site script (ru.js on Russian pages, i18n.js on English ones)
const withRouting = (html, lang, slug) => {
  const anchor = lang === 'ru' ? '<script src="assets/js/ru.js">' : '<script src="assets/js/i18n.js">';
  return html.replace(anchor, routing(lang, slug) + anchor);
};

function copyDir(src, dst, skip = []) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.includes(e.name)) continue;
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

fs.mkdirSync(dist, { recursive: true });
copyDir(path.join(root, 'assets'), path.join(dist, 'assets'), ['illustrations']);

// ---- home pages ----
let home = withRouting(read('index.html').replace(/case\.html\?p=([a-z0-9-]+)/g, (_, s) => caseFile(s, 'en')), 'en');
if (fragment) {
  const head = home.match(/<head>([\s\S]*?)<\/head>/)[1]
    .replace(/<meta charset[^>]*>\s*/, '')
    .replace(/<meta name="viewport"[^>]*>\s*/, '');
  const bodyOpen = home.match(/<body([^>]*)>/)[1];
  const cls = (bodyOpen.match(/class="([^"]*)"/) || [])[1] || '';
  const page = (bodyOpen.match(/data-page="([^"]*)"/) || [])[1] || '';
  const body = home.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
  home = head.trim().replace(/<title>[^<]*<\/title>/, '<title>Daniyar Portfolio</title>') + '\n<script>document.documentElement.classList.add(\'js\'); document.body.className = ' +
    JSON.stringify(cls) + '; document.body.dataset.page = ' + JSON.stringify(page) + ';</script>\n' + body.trim() + '\n';
}
write('index.html', home);
write('index-ru.html', withRouting(read('index-ru.html').replace(/case-ru\.html\?p=([a-z0-9-]+)/g, (_, s) => caseFile(s, 'ru')), 'ru'));

// ---- one page per case study and language ----
const tpl = { en: read('case.html'), ru: read('case-ru.html') };
for (const p of PROJECTS) {
  for (const lang of ['en', 'ru']) {
    let html = tpl[lang].replace(/<title>[^<]*<\/title>/, lang === 'ru' ? '<title>Кейс — Daniyar</title>' : `<title>${p.client} case study</title>`);
    // the language switch points at the same case in the other language even before JS runs
    html = html.replace(lang === 'ru' ? 'href="case.html"' : 'href="case-ru.html"', `href="${caseFile(p.slug, lang === 'ru' ? 'en' : 'ru')}"`);
    write(caseFile(p.slug, lang), withRouting(html, lang, p.slug));
  }
}

console.log(`Built dist/ (${fragment ? 'fragment' : 'full'} index + index-ru + ${PROJECTS.length * 2} case pages)`);
