// Share cards (1200×630) for every chapter and the prologue, in both languages.
// Usage: build first (npx next build), serve `out/` under /broken-collective, then
//   node scripts/og.mjs http://localhost:4323/broken-collective
// Writes public/og/<lang>/<season>-<n>.jpg and public/og/<lang>/prologue.jpg.
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
import { mkdirSync, readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const base = process.argv[2] ?? 'http://localhost:4323/broken-collective'
const font = (p) => `data:font/woff2;base64,${readFileSync(join(root, 'node_modules', p)).toString('base64')}`

const fonts = `
@font-face{font-family:K;src:url(${font('@fontsource/karantina/files/karantina-hebrew-400-normal.woff2')}) format('woff2');unicode-range:U+0590-05FF,U+FB1D-FB4F}
@font-face{font-family:K;src:url(${font('@fontsource/karantina/files/karantina-latin-400-normal.woff2')}) format('woff2');unicode-range:U+0000-024F,U+2000-206F,U+20AC}
@font-face{font-family:B;src:url(${font('@fontsource-variable/frank-ruhl-libre/files/frank-ruhl-libre-hebrew-wght-normal.woff2')}) format('woff2');unicode-range:U+0590-05FF}
@font-face{font-family:B;src:url(${font('@fontsource-variable/literata/files/literata-latin-wght-normal.woff2')}) format('woff2');unicode-range:U+0000-024F,U+2000-206F}
`

const card = ({ lang, kicker, title, book, line, plate }) => `<!doctype html><html lang="${lang}" dir="${lang === 'he' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
${fonts}
:root{--art-paper:#f2eadb;--art-deep:#e6dac4;--art-ink:#1d1a21;--art-soft:#46404d;--art-sea:#2a5a5d;--art-red:#a8101f;--art-red-soft:#e8b4aa;--paper:#f2eadb;--ink:#1d1a21;--thread:#a8101f}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#f2eadb;color:#1d1a21;font-family:B,serif;display:flex;gap:56px;padding:56px 64px;overflow:hidden;position:relative}
body:before{content:"";position:absolute;inset:0;background-image:radial-gradient(#1d1a2112 1px,transparent 1.4px);background-size:7px 7px}
.plate{flex:none;width:430px;height:518px;position:relative;transform:rotate(${lang === 'he' ? '1.2' : '-1.2'}deg);box-shadow:14px 16px 0 #1d1a21}
.plate svg{width:100%;height:100%;display:block}
.txt{flex:1;display:flex;flex-direction:column;justify-content:space-between;position:relative;min-width:0}
.k{font-family:K;font-size:34px;letter-spacing:.12em;color:#a8101f}
h1{font-family:K;font-weight:400;font-size:${title.length > 22 ? 92 : 116}px;line-height:.88;margin-top:14px}
p{font-size:27px;line-height:1.45;color:#46404d;margin-top:22px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.foot{display:flex;align-items:center;gap:18px}
.foot b{font-family:K;font-weight:400;font-size:46px;white-space:nowrap}
.foot svg{flex:1;height:26px}
.free{font-family:K;font-size:26px;letter-spacing:.08em;color:#a8101f;white-space:nowrap}
</style></head><body>
<div class="plate">${plate}</div>
<div class="txt"><div><div class="k">${kicker}</div><h1>${title}</h1><p>${line}</p></div>
<div class="foot"><b>${book}</b><svg viewBox="0 0 300 26" preserveAspectRatio="none"><path d="M0 13 L60 11 L90 17 L130 9 L170 14 L200 7 L214 19 L226 10 L300 13" fill="none" stroke="#a8101f" stroke-width="3"/></svg><span class="free">${lang === 'he' ? 'לקריאה חופשית' : 'FREE TO READ'}</span></div></div>
</body></html>`

const pages = []
for (const lang of ['he', 'en']) {
  pages.push({ lang, path: `/${lang}/prologue/`, out: `${lang}/prologue.jpg` })
  const dir = join(root, 'out', lang)
  for (const y of readdirSync(dir).filter((d) => /^\d{4}$/.test(d)))
    for (const n of readdirSync(join(dir, y)).filter((d) => /^\d+$/.test(d)))
      pages.push({ lang, path: `/${lang}/${y}/${n}/`, out: `${lang}/${y}-${n}.jpg` })
}

const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1200, height: 630 } })
const read = await ctx.newPage()
const shot = await ctx.newPage()
for (const pg of pages) {
  await read.addInitScript(() => localStorage.setItem('bc:mode', 'scroll'))
  await read.goto(base + pg.path, { waitUntil: 'networkidle' })
  const data = await read.evaluate(() => {
    const plate = document.querySelector('main svg.art-plate, aside svg.art-plate, svg.art-plate')
    const h1 = document.querySelector('main h1') ?? document.querySelector('h1')
    const kicker = document.querySelector('main .kicker')?.textContent ?? ''
    const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''
    const book = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ?? ''
    return { plate: plate?.outerHTML ?? '', title: h1?.textContent ?? '', kicker, line: desc, book }
  })
  await shot.setContent(card({ lang: pg.lang, ...data }), { waitUntil: 'load' })
  await shot.evaluate(() => document.fonts.ready)
  const file = join(root, 'public', 'og', pg.out)
  if (!existsSync(dirname(file))) mkdirSync(dirname(file), { recursive: true })
  await shot.screenshot({ path: file, type: 'jpeg', quality: 84 })
  console.log('og', pg.out, data.title)
}
await b.close()
