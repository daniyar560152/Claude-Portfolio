#!/usr/bin/env node
/*
 * Builds a static copy of the site into dist/ with one HTML file per case study
 * (case-pocket.html, case-orbit.html, …) instead of case.html?p=<slug>.
 * Useful for hosts that don't keep query strings (e.g. claude.ai artifacts) and for
 * plain static hosting such as GitHub Pages.
 *
 *   node scripts/build-static.js            → dist/index.html is a normal full page
 *   node scripts/build-static.js --fragment → dist/index.html has no <html>/<head>/<body>
 *                                             wrapper (for hosts that add their own skeleton)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const fragment = process.argv.includes('--fragment');
const PROJECTS = require(path.join(root, 'assets', 'js', 'projects.js'));

const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(dist, f), s);
const caseFile = (slug) => `case-${slug}.html`;
const routing = (slug) =>
  `<script>window.caseUrl = function (s) { return 'case-' + s + '.html'; };${slug ? ` window.CASE_SLUG = '${slug}';` : ''}</script>\n  `;

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

// ---- home ----
let home = read('index.html').replace(/case\.html\?p=([a-z0-9-]+)/g, (_, s) => caseFile(s));
home = home.replace('<script src="assets/js/illustrations.js">', routing() + '<script src="assets/js/illustrations.js">');
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

// ---- one page per case study ----
const tpl = read('case.html');
for (const p of PROJECTS) {
  const html = tpl
    .replace(/<title>[^<]*<\/title>/, `<title>${p.client} case study</title>`)
    .replace('<script src="assets/js/illustrations.js">', routing(p.slug) + '<script src="assets/js/illustrations.js">');
  write(caseFile(p.slug), html);
}

console.log(`Built dist/ (${fragment ? 'fragment' : 'full'} index + ${PROJECTS.length} case pages)`);
