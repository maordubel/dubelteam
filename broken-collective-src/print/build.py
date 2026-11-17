#!/usr/bin/env python3
"""
Broken Collective · the paperback.

Builds the print-ready files Lulu prints from, one edition per language:
  out/broken-collective-{lang}-interior.pdf   5.5 x 8.5 in trim, 0.125 in bleed, fonts embedded, black & white
  out/broken-collective-{lang}-cover.pdf      one-piece cover (back · spine · front), full colour
  out/editions.json                           page counts, spine widths and Lulu SKU per edition (read by the shop)

Source of truth is the same manuscript the website reads (content/{lang}/…) and the same plates the website draws
(taken from the static export in ../../broken-collective/). Nothing is typed twice.

Hebrew is bound right-to-left. Lulu binds on the left, so the Hebrew interior is written in reading order and then
reversed (Lulu: "the first page of your manuscript should be the last page of your print-ready PDF"), and its cover is
laid out front-on-the-left. Run:  python3 print/build.py   (needs: pip install weasyprint pypdf segno)
"""
from __future__ import annotations

import html
import json
import math
import re
import sys
from pathlib import Path

import segno
from pypdf import PdfReader, PdfWriter
from weasyprint import HTML

ROOT = Path(__file__).resolve().parent
SRC = ROOT.parent
EXPORT = SRC.parent / 'broken-collective'
OUT = ROOT / 'out'
FONTS = ROOT / 'fonts'

# ── the product ────────────────────────────────────────────────────────────────────────────────────────────────
TRIM_W, TRIM_H, BLEED = 5.5, 8.5, 0.125
TEXT_W = TRIM_W - 0.82 - 0.56  # text block width between gutter and outside margin
c = lambda w: f'0 {(TEXT_W - w) / 2:.4f}in'
SKU = '0550X0850BWSTDPB060UC444MXX'  # 5.5x8.5 · B&W standard · perfect bound · 60# cream · 444 ppi · matte cover
PPI = 444                              # pages per inch for 60# cream: spine = pages / 444 + 0.06 in (Lulu's formula)
SITE = 'https://www.dubelteam.com/broken-collective'

SEASONS = [2020, 2021, 2022, 2023, 2024, 2025]

T = {
    'he': {
        'dir': 'rtl', 'title': 'קולקטיב שבור', 'other': 'Broken Collective', 'author': 'מאור הראל',
        'tagline': 'ים אחד. שני חופים. חוט אדום אחד.', 'novel': 'רומן',
        'edition': 'עונות \u20662020–2025\u2069', 'season': 'עונה', 'chapter': 'פרק', 'contents': 'תוכן העניינים',
        'prologue': 'מבוא', 'chars': 'הדמויות',
        'seasonTitle': {2020: 'השנה שבה העולם עצר', 2021: 'שנה של בריחות', 2022: 'השנה שבה הבית התפרק',
                        2023: 'השנה שבה הכול נשבר', 2024: 'השנה שבה הכול בער', 2025: 'השנה שבה חיכינו לבוקר'},
        'charsList': [('אלכס', 'לוחם גולני משוחרר, אולטראס של הפועל, מאמין רק בחופש של עצמו.'),
                      ('נטלי', 'בת שש־עשרה בסגר. מרדנית שקטה שמחפשת גבול לבעוט בו.'),
                      ('מהראן', 'נער ממחנה שאטי. מתמטיקה, חלומות על מכונות, ואהבה סודית לאדום.')],
        'seasonEnd': 'סוף עונת {y}.',
        'tbcKicker': 'המשך יבוא', 'tbcTitle': 'רגע. זה לא נגמר.',
        'tbcBody': ['כפי שהבנתם, אם קראתם עד כאן — הספר הזה נכתב בהתאם למציאות של כולנו.',
                    'ההמשך, וסיום הספר, עדיין נמצאים בכתיבה. המציאות עוד לא הגישה את הפרק הבא, ואנחנו מחכים לה עם עט ביד.'],
        'tbcScan': 'העונה הבאה תעלה קודם באתר, לקריאה חופשית.',
        'rights': '© 2026 מאור הראל. כל הזכויות שמורות.',
        'rights2': 'אין להעתיק, לשכפל או להפיץ חלק כלשהו מהספר בכל אמצעי ללא אישור בכתב מהמחבר, למעט ציטוטים קצרים לצורך ביקורת.',
        'first': 'מהדורה ראשונה בכריכה רכה · עונות \u20662020–2025\u2069',
        'online': 'הספר כולו לקריאה חופשית, בעברית ובאנגלית:',
        'set': 'סודר באותיות פרנק ריהל ליברה וקרנטינה.',
        'printed': 'הודפס לפי הזמנה.',
        'credit': 'עיצוב והפקה: Dubel Team · DubelTeam.com',
        'blurb': ['שלושה צעירים. שני צדי הגדר. שש שנים שבהן העולם נסדק.',
                  'אלכס, לוחם משוחרר ואולטראס של הפועל. נטלי, אחותו, בת שש־עשרה בסגר. מהראן, נער ממחנה שאטי שאוהב בסתר את האדום.',
                  'רומן שנכתב בזמן אמת, עונה אחרי עונה, יחד עם המציאות — ועדיין נכתב.'],
        'backLine': 'קראו את ההמשך באתר',
        'lang': 'he',
    },
    'en': {
        'dir': 'ltr', 'title': 'Broken Collective', 'other': 'קולקטיב שבור', 'author': 'Maor Harel',
        'tagline': 'One sea. Two shores. One red thread.', 'novel': 'A novel',
        'edition': 'Seasons 2020–2025', 'season': 'Season', 'chapter': 'Chapter', 'contents': 'Contents',
        'prologue': 'Prologue', 'chars': 'The characters',
        'seasonTitle': {2020: 'The Year the World Stopped', 2021: 'A Year of Escapes', 2022: 'The Year the House Came Apart',
                        2023: 'The Year Everything Broke', 2024: 'The Year Everything Burned', 2025: 'The Year We Waited for Morning'},
        'charsList': [('Alex', 'Discharged Golani soldier, Hapoel ultra, believer only in his own freedom.'),
                      ('Natalie', 'Sixteen, in lockdown. A quiet rebel looking for a boundary to kick.'),
                      ('Mehran', 'A boy from the Shati camp. Maths, dreams of machines, and a secret love for red.')],
        'seasonEnd': 'End of season {y}.',
        'tbcKicker': 'To be continued', 'tbcTitle': 'Wait. It isn’t over.',
        'tbcBody': ['As you’ve figured out, if you’ve read this far — this book is written along the reality we all share.',
                    'The rest of it, and the ending, are still being written. Reality hasn’t handed in the next chapter yet; we’re waiting for it, pen in hand.'],
        'tbcScan': 'The next season goes up online first, free to read.',
        'rights': '© 2026 Maor Harel. All rights reserved.',
        'rights2': 'No part of this book may be reproduced, stored or transmitted in any form without written permission from the author, except for brief quotations in a review.',
        'first': 'First paperback edition · Seasons 2020–2025',
        'online': 'The whole book is free to read online, in English and Hebrew:',
        'set': 'Set in Literata and Karantina.',
        'printed': 'Printed on demand.',
        'credit': 'Design & production: Dubel Team · DubelTeam.com',
        'blurb': ['Three young people. Two sides of a fence. Six years in which the world cracked.',
                  'Alex, a discharged soldier and Hapoel ultra. Natalie, his sister, sixteen and in lockdown. Mehran, a boy from the Shati camp with a secret love for red.',
                  'A novel written in real time, season by season, alongside reality — and still being written.'],
        'backLine': 'Read what comes next online',
        'lang': 'en',
    },
}

# ── the manuscript (same tiny Markdown subset as src/lib/content.ts) ────────────────────────────────────────────
def front(raw: str):
    m = re.match(r'^---\n([\s\S]*?)\n---\n?', raw)
    if not m:
        return {}, raw
    meta = {}
    for line in m.group(1).split('\n'):
        if ':' in line:
            k, v = line.split(':', 1)
            meta[k.strip()] = v.strip()
    return meta, raw[m.end():]


def runs(text: str) -> str:
    out = []
    for part in re.split(r'(\*\*[^*]+\*\*)', text):
        if not part:
            continue
        if part.startswith('**') and part.endswith('**'):
            out.append(f'<strong>{html.escape(part[2:-2])}</strong>')
        else:
            out.append(html.escape(part))
    return ''.join(out)


def body_html(body: str) -> str:
    out, first, after_scene = [], True, False
    for chunk in re.split(r'\n{2,}', body):
        t = chunk.strip()
        if not t:
            continue
        if t.startswith('## '):
            out.append(f'<h3 class="scene"><span>{html.escape(t[3:].strip())}</span></h3>')
            after_scene = True
            continue
        cls = 'opener' if first else ('after' if after_scene else '')
        first, after_scene = False, False
        out.append(f'<p class="{cls}">{runs(t.replace(chr(10), " "))}</p>' if cls else f'<p>{runs(t.replace(chr(10), " "))}</p>')
    return '\n'.join(out)


def chapters(lang: str):
    for y in SEASONS:
        for f in sorted((SRC / 'content' / lang / str(y)).glob('*.md')):
            meta, body = front(f.read_text(encoding='utf8'))
            yield y, int(meta.get('number', f.stem)), meta.get('title', ''), body


# ── the plates (taken from the website's static export, inked down to grey for a black & white interior) ──────────
GREY = {'--art-paper': '#FFFFFF', '--art-deep': '#E2E2E2', '--art-ink': '#1E1E1E', '--art-soft': '#5A5A5A',
        '--art-sea': '#8A8A8A', '--art-red': '#3A3A3A', '--art-red-soft': '#C4C4C4', '--thread': '#3A3A3A',
        '--paper': '#FFFFFF', '--paper-deep': '#E2E2E2', '--ink': '#1E1E1E', '--ink-soft': '#5A5A5A', '--sea': '#8A8A8A', '--thread-soft': '#C4C4C4', '--rule': '#BDBDBD'}
COLOUR = {'--art-paper': '#F2EADB', '--art-deep': '#E6DAC4', '--art-ink': '#1D1A21', '--art-soft': '#46404D',
          '--art-sea': '#2A5A5D', '--art-red': '#A8101F', '--art-red-soft': '#E8B4AA', '--thread': '#A8101F',
          '--paper': '#F2EADB', '--paper-deep': '#E6DAC4', '--ink': '#1D1A21', '--ink-soft': '#46404D', '--sea': '#2A5A5D', '--thread-soft': '#E8B4AA', '--rule': '#CBBB9F'}


def ink(svg: str, palette: dict, prefix: str) -> str:
    svg = re.sub(r'var\((--[a-z-]+)\)', lambda m: palette.get(m.group(1), '#000'), svg)
    ids = set(re.findall(r'id="([^"]+)"', svg))
    for i in sorted(ids, key=len, reverse=True):
        svg = svg.replace(f'id="{i}"', f'id="{prefix}{i}"').replace(f'url(#{i})', f'url(#{prefix}{i})').replace(f'href="#{i}"', f'href="#{prefix}{i}"')
    svg = re.sub(r'\sclass="[^"]*"', '', svg)
    return svg


def svgs(page: Path) -> list[str]:
    return re.findall(r'<svg[\s\S]*?</svg>', page.read_text(encoding='utf8'))


def plate(lang: str, y: int, n: int, palette=GREY) -> str:
    page = EXPORT / lang / str(y) / str(n) / 'index.html'
    if not page.exists():
        return ''
    found = [s for s in svgs(page) if 'art-plate' in s]
    return ink(found[0], palette, f'p{y}{n}-') if found else ''


def emblems(lang: str, palette=GREY) -> dict[int, str]:
    found = [s for s in svgs(EXPORT / lang / 'index.html') if 'viewBox="0 0 120 120"' in s]
    return {y: ink(s, palette, f'e{y}-') for y, s in zip(SEASONS, found)}


def cover_art(lang: str) -> str:
    found = [s for s in svgs(EXPORT / lang / 'index.html') if 'viewBox="0 0 600 760"' in s]
    return ink(found[0], COLOUR, 'cv-') if found else ''


def qr(url: str, dark='#1E1E1E') -> str:
    q = segno.make(url, error='m')
    import io
    b = io.BytesIO()
    q.save(b, kind='svg', scale=1, border=0, dark=dark, xmldecl=False, svgns=True)
    return b.getvalue().decode()


# ── typesetting ────────────────────────────────────────────────────────────────────────────────────────────────
def font_faces() -> str:
    f = FONTS.as_uri()
    return f"""
@font-face{{font-family:Lit;src:url({f}/Literata-Text-Regular.ttf);font-weight:400;font-style:normal}}
@font-face{{font-family:Lit;src:url({f}/Literata-Text-Italic.ttf);font-weight:400;font-style:italic}}
@font-face{{font-family:Lit;src:url({f}/Literata-Text-SemiBold.ttf);font-weight:600;font-style:normal}}
@font-face{{font-family:LitD;src:url({f}/Literata-Display-Light.ttf);font-weight:300}}
@font-face{{font-family:Frank;src:url({f}/FrankRuhlLibre-400.ttf);font-weight:400}}
@font-face{{font-family:Frank;src:url({f}/FrankRuhlLibre-500.ttf);font-weight:500}}
@font-face{{font-family:Frank;src:url({f}/FrankRuhlLibre-700.ttf);font-weight:700}}
@font-face{{font-family:Kar;src:url({f}/Karantina-Regular.ttf);font-weight:400}}
@font-face{{font-family:Kar;src:url({f}/Karantina-Bold.ttf);font-weight:700}}
"""


def interior_css(lang: str) -> str:
    he = lang == 'he'
    body_font = 'Frank' if he else 'Lit'
    size, lead = ('11.6pt', '16.4pt') if he else ('10.4pt', '14.6pt')
    # :left pages have their spine on the right, :right pages on the left — true for both directions (see build notes)
    return font_faces() + f"""
@page {{ size: {TRIM_W + 2*BLEED}in {TRIM_H + 2*BLEED}in; margin: {BLEED+0.72}in {BLEED+0.6}in {BLEED+0.86}in {BLEED+0.6}in;
  @bottom-center {{ content: counter(page); font: 400 9pt/1 Kar; letter-spacing:.12em; color:#2a2a2a; vertical-align: top; padding-top: .16in }} }}
@page :left  {{ margin-right: {BLEED+0.82}in; margin-left: {BLEED+0.56}in;
  @top-center {{ content: {'string(running)' if he else '"' + T[lang]['title'] + '"'}; font: 400 9.5pt/1 Kar; letter-spacing: .32em; color:#4a4a4a; vertical-align: bottom; padding-bottom:.14in }} }}
@page :right {{ margin-left: {BLEED+0.82}in; margin-right: {BLEED+0.56}in;
  @top-center {{ content: {'"' + T[lang]['title'] + '"' if he else 'string(running)'}; font: 400 9.5pt/1 Kar; letter-spacing: .32em; color:#4a4a4a; vertical-align: bottom; padding-bottom:.14in }} }}
@page bare {{ @top-center{{content:none}} @bottom-center{{content:none}} }}
@page bare:left {{ @top-center{{content:none}} }}
@page bare:right {{ @top-center{{content:none}} }}
@page :nth(1 of opener) {{ @top-center{{content:none}} }}
@page :blank {{ @top-center{{content:none}} @bottom-center{{content:none}} }}

html {{ font-family: {body_font}, serif; font-size: {size}; line-height: {lead}; color: #141414;
  font-variant-ligatures: common-ligatures; font-kerning: normal; }}
body {{ margin:0 }}
.bare {{ page: bare }}
.opener-page {{ page: opener }}
.recto {{ break-before: {'left' if he else 'right'} }}
.page {{ break-before: page }}

p {{ margin:0; text-align: justify; text-indent: {'1.1em' if he else '1.25em'}; hyphens: {'manual' if he else 'auto'};
  orphans:2; widows:2; {'' if he else 'hyphenate-limit-chars: 6 3 3;'} }}
p.opener, p.after {{ text-indent: 0 }}
p.opener::first-line {{ {'font-weight:500' if he else 'font-variant-caps: small-caps; letter-spacing:.04em'} }}
strong {{ font-weight: {500 if he else 600} }}

/* scene line: date · place, in the display face, between two short threads */
h3.scene {{ font: 400 {'12.5pt' if he else '11.5pt'}/1.1 Kar; letter-spacing: .14em; text-align:center; margin: 1.35em 0 .9em;
  break-after: avoid; color:#1a1a1a }}
h3.scene span {{ padding: 0 .7em }}
h3.scene::before, h3.scene::after {{ content: ""; display:inline-block; width: .42in; border-top: .6pt solid #3a3a3a; vertical-align: middle }}
h3.scene:first-child {{ margin-top: 0 }}

/* chapter opener */
.chap {{ string-set: running attr(data-run) }}
.chap-head {{ text-align:center; padding-top: .05in; margin-bottom: .32in; break-inside: avoid }}
.chap-plate {{ width: 1.62in; height: 1.94in; margin: {c(1.62)}; margin-bottom:.2in }}
.chap-plate svg, .season .emb svg, .tbc .qr svg, .tp .crack svg {{ display:block }}
.chap-plate svg {{ width:100%; height:100% }}
.iso-rtl {{ direction: rtl; unicode-bidi: isolate }} .iso-ltr {{ direction: ltr; unicode-bidi: isolate }}
.chap-no {{ font: 400 10.5pt/1 Kar; letter-spacing:.42em; color:#3a3a3a; margin-bottom:.1in }}
.chap-title {{ font: 700 {'27pt' if he else '25pt'}/1 Kar; letter-spacing:.02em; margin:0; color:#111 }}
.thread {{ width: 1.1in; margin: {c(1.1)}; margin-top:.16in; border-top: 1.1pt solid #2a2a2a; position:relative }}
.thread::after {{ content:""; position:absolute; {'left' if he else 'right'}: -.06in; top:-2.6pt; width:4pt; height:4pt; background:#2a2a2a; transform: rotate(45deg) }}

/* season opener — a full recto, then a blank verso */
.season {{ text-align:center; padding-top: 1.05in; string-set: running attr(data-run) }}
.season .emb {{ width: 1.05in; height:1.05in; margin: {c(1.05)}; margin-bottom:.3in }}
.season .emb svg {{ width:100%; height:100% }}
.season .lbl {{ font: 400 11pt/1 Kar; letter-spacing: .5em }}
.season .yr {{ font: 700 86pt/0.9 Kar; letter-spacing:.02em; margin:.08in 0 .1in }}
.season .st {{ font: 400 {'15pt' if he else '14pt'}/1.25 {('Frank' if he else 'LitD')}; {'' if he else 'font-style:normal;'} margin: {c(3.2)} }}
.season-end {{ text-align:center; font: 400 10.5pt/1 Kar; letter-spacing:.3em; margin-top: 2.2em; color:#3a3a3a }}

/* front matter */
.half {{ text-align:center; padding-top: 2.4in; font: 700 30pt/1 Kar; letter-spacing:.04em }}
.tp {{ text-align:center; padding-top: 1.1in }}
.tp .t1 {{ font: 700 {'62pt' if he else '54pt'}/.92 Kar; letter-spacing:.01em }}
.tp .t2 {{ font: 400 15pt/1 Kar; letter-spacing:.36em; margin-top:.16in; color:#3a3a3a }}
.tp .tag {{ font: italic 400 11pt/1.4 {'Frank' if he else 'Lit'}; {'font-style:normal;' if he else ''} margin-top: .5in; color:#333 }}
.tp .au {{ font: 400 17pt/1 Kar; letter-spacing:.3em; margin-top: 1.1in }}
.tp .imp {{ font: 400 8.5pt/1 Kar; letter-spacing:.34em; margin-top: 1.25in; color:#4a4a4a }}
.tp .crack {{ width: 2.6in; height: .3in; margin: {c(2.6)}; margin-top:.22in }}
.copy {{ padding-top: 3.1in; font-size: 8.4pt; line-height: 12.4pt; color:#2a2a2a }}
.copy p {{ text-indent:0; text-align: {'right' if he else 'left'}; margin-bottom: .62em; hyphens: manual }}
.copy .u {{ font-family: Lit; direction:ltr; unicode-bidi: isolate }}
.toc h2, .dram h2 {{ font: 700 22pt/1 Kar; letter-spacing:.06em; text-align:center; margin: .55in 0 .38in }}
.toc ol {{ list-style:none; margin:0; padding:0 }}
.toc li {{ font-size: 9.8pt; line-height: 1.45 }}
.toc li.s {{ font: 700 11.5pt/1 Kar; letter-spacing:.2em; margin: .2in 0 .07in }}
.toc li a {{ color: inherit; text-decoration:none }}
.toc li a::after {{ content: leader('. ') target-counter(attr(href), page); }}
.toc li.c {{ padding-{'right' if he else 'left'}: .16in }}
.dram dl {{ margin: 0 }}
.dram dt {{ font: 700 16pt/1 Kar; letter-spacing:.1em; text-align:center; margin-top:.3in }}
.dram dd {{ margin: .06in .2in 0; text-align:center; font-style: {'normal' if he else 'italic'} }}
.pro h2 {{ font: 700 25pt/1 Kar; text-align:center; margin: .9in 0 .4in; string-set: running content() }}

/* the end of what is written */
.tbc {{ text-align:center; padding-top: 1.1in }}
.tbc .k {{ font: 400 10.5pt/1 Kar; letter-spacing:.46em; color:#3a3a3a }}
.tbc h2 {{ font: 700 30pt/1 Kar; margin: .18in 0 .34in }}
.tbc p {{ text-align:center; text-indent:0; margin: 0 .1in .7em; hyphens:manual }}
.tbc .qr {{ width: .95in; height:.95in; margin: {c(.95)}; margin-top:.34in; margin-bottom:.12in }}
.tbc .qr svg {{ width:100%; height:100% }}
.tbc .url {{ font: 400 8.6pt/1 Lit; direction: ltr; letter-spacing:.02em; color:#333 }}
.colo {{ padding-top: 4.2in; text-align:center; font-size: 8.2pt; line-height: 12pt; color:#333 }}
.colo p {{ text-align:center; text-indent:0; hyphens:manual }}
.colo .dt {{ font: 400 8pt/1 Kar; letter-spacing: .34em; margin-top: .25in }}
"""


CRACK = ('<svg viewBox="0 0 300 30" xmlns="http://www.w3.org/2000/svg"><path d="M0 15 L118 15 L130 6 L142 22 L154 9 L166 19 L178 15 L300 15" '
         'fill="none" stroke="#1E1E1E" stroke-width="1.4"/><circle cx="150" cy="15" r="2.4" fill="#1E1E1E"/></svg>')


def iso(text: str) -> str:
    rtl = bool(re.search(r'[\u0590-\u05FF]', text))
    return f'<span class="iso-{"rtl" if rtl else "ltr"}" dir="{"rtl" if rtl else "ltr"}">{html.escape(text)}</span>'


def ordinal(lang, n):
    return f"{T[lang]['chapter']} {n}"


def interior_html(lang: str) -> str:
    t = T[lang]
    emb = emblems(lang)
    parts = []
    # half title · blank · title page · copyright
    parts.append(f'<section class="bare"><div class="half">{t["title"]}</div></section>')
    parts.append(f'''<section class="bare recto"><div class="tp">
      <div class="t1">{t["title"]}</div><div class="crack">{CRACK}</div><div class="t2">{iso(t["other"])}</div>
      <div class="tag">{t["tagline"]}</div><div class="au">{t["author"]}</div><div class="imp">DUBEL TEAM</div></div></section>''')
    parts.append(f'''<section class="bare page"><div class="copy">
      <p>{t["rights"]}</p><p>{t["rights2"]}</p><p>{t["first"]}</p>
      <p>{t["online"]}<br><span class="u">dubelteam.com/broken-collective</span></p>
      <p>{t["set"]} {t["printed"]}</p><p>{t["credit"]}</p></div></section>''')
    # contents
    toc = []
    toc.append(f'<li class="c"><a href="#prologue">{t["prologue"]}</a></li>')
    for y in SEASONS:
        toc.append(f'<li class="s">{t["season"]} {y}</li>')
        for yy, n, title, _ in chapters(lang):
            if yy == y:
                toc.append(f'<li class="c"><a href="#c{y}-{n}">{n}. {html.escape(title)}</a></li>')
    parts.append(f'<section class="bare recto toc"><h2>{t["contents"]}</h2><ol>{"".join(toc)}</ol></section>')
    # dramatis personae
    dl = ''.join(f'<dt>{html.escape(a)}</dt><dd>{html.escape(b)}</dd>' for a, b in t['charsList'])
    parts.append(f'<section class="bare recto dram"><h2>{t["chars"]}</h2><dl>{dl}</dl></section>')
    # prologue
    meta, body = front((SRC / 'content' / lang / '00-intro.md').read_text(encoding='utf8'))
    parts.append(f'<section class="recto pro opener-page" id="prologue"><h2>{t["prologue"]}</h2>{body_html(body)}</section>')
    # seasons and chapters
    for y in SEASONS:
        run = f'{t["season"]} {y}'
        parts.append(f'''<section class="recto bare season" data-run="{run}"><div class="emb">{emb.get(y, "")}</div>
          <div class="lbl">{t["season"]}</div><div class="yr">{y}</div><div class="st">{t["seasonTitle"][y]}</div></section>''')
        chs = [c for c in chapters(lang) if c[0] == y]
        for i, (yy, n, title, body) in enumerate(chs):
            last = i == len(chs) - 1
            end = f'<div class="season-end">{t["seasonEnd"].format(y=y)}</div>' if last else ''
            parts.append(f'''<section class="recto chap opener-page" id="c{y}-{n}" data-run="{html.escape(title)}">
              <div class="chap-head"><div class="chap-plate">{plate(lang, y, n)}</div>
              <div class="chap-no">{y} · {ordinal(lang, n)}</div><h2 class="chap-title">{html.escape(title)}</h2><div class="thread"></div></div>
              {body_html(body)}{end}</section>''')
    # to be continued · colophon
    body = ''.join(f'<p>{html.escape(p)}</p>' for p in t['tbcBody'])
    parts.append(f'''<section class="recto bare tbc"><div class="k">{t["tbcKicker"]}</div><h2>{t["tbcTitle"]}</h2>{body}
      <div class="qr">{qr(f"{SITE}/{lang}/")}</div><p>{t["tbcScan"]}</p><div class="url">dubelteam.com/broken-collective</div></section>''')
    parts.append(f'''<section class="bare page colo"><p>{t["title"]} · {t["author"]}</p><p>{t["set"]}</p><p>{t["credit"]}</p>
      <div class="dt">{t["edition"]}</div></section>''')
    return f'''<!doctype html><html lang="{lang}" dir="{t["dir"]}"><head><meta charset="utf-8"><title>{t["title"]}</title>
      <style>{interior_css(lang)}</style></head><body>{"".join(parts)}</body></html>'''


def build_interior(lang: str) -> tuple[Path, int]:
    OUT.mkdir(exist_ok=True)
    doc = HTML(string=interior_html(lang), base_url=str(ROOT)).render()
    reading = OUT / f'broken-collective-{lang}-reading.pdf'
    doc.write_pdf(reading)
    r = PdfReader(str(reading))
    pages = list(r.pages)
    # perfect binding wants an even count; Lulu also quotes per page, so pad to a multiple of 2 with blank pages
    w = PdfWriter()
    order = pages
    if len(order) % 2:
        order = order + [None]
    if lang == 'he':
        order = list(reversed(order))  # right-to-left: Lulu binds left, so the book is fed back to front
    for p in order:
        if p is None:
            w.add_blank_page(width=float(pages[0].mediabox.width), height=float(pages[0].mediabox.height))
        else:
            w.add_page(p)
    w.add_metadata({'/Title': T[lang]['title'], '/Author': T[lang]['author'], '/Creator': 'Dubel Team · print/build.py'})
    out = OUT / f'broken-collective-{lang}-interior.pdf'
    with open(out, 'wb') as fh:
        w.write(fh)
    return out, len(order)


# ── the cover ───────────────────────────────────────────────────────────────────────────────────────────────────
def spine_in(pages: int) -> float:
    return round(pages / PPI + 0.06, 4)


def cover_html(lang: str, pages: int) -> tuple[str, float, float]:
    t = T[lang]
    he = lang == 'he'
    sp = spine_in(pages)
    W = 2 * TRIM_W + sp + 2 * BLEED
    H = TRIM_H + 2 * BLEED
    panel = TRIM_W + BLEED
    art = cover_art(lang)
    front = f'''<div class="panel front">
      <div class="plate">{art}</div>
      <div class="ft"><div class="kick">{t["novel"]}</div><div class="title">{t["title"]}</div>
        <div class="crack">{CRACK.replace('#1E1E1E', '#A8101F')}</div><div class="other">{iso(t["other"])}</div></div>
      <div class="au">{t["author"]}</div><div class="ed">{t["edition"]}</div></div>'''
    blurb = ''.join(f'<p>{html.escape(p)}</p>' for p in t['blurb'])
    back = f'''<div class="panel back"><div class="bk">
      <div class="tag">{t["tagline"]}</div>{blurb}
      <div class="qrrow"><div class="qr">{qr(f"{SITE}/{lang}/", '#1D1A21')}</div><div class="ql">{t["backLine"]}<br><span class="u">dubelteam.com/broken-collective</span></div></div>
      </div><div class="imp">DUBEL TEAM</div></div>'''
    spine = f'''<div class="spine"><div class="sp-in"><span class="sp-t">{t["title"]}</span><span class="sp-dot"></span><span class="sp-a">{t["author"]}</span></div></div>'''
    # LTR book: back | spine | front.  RTL (Hebrew, fed reversed): front | spine | back.
    row = (front + spine + back) if he else (back + spine + front)
    # spine text reads top-to-bottom for English (rotate 90), and for a right-bound Hebrew book likewise from the
    # front panel's side: rotate -90 keeps the text's head toward the front cover.
    rot = '-90deg' if he else '90deg'
    css = font_faces() + f"""
@page {{ size: {W}in {H}in; margin: 0 }}
html,body {{ margin:0; height:100% }}
body {{ background:#F2EADB; color:#1D1A21; font-family: {'Frank' if he else 'Lit'}; }}
.row {{ display:flex; width:{W}in; height:{H}in; direction:ltr }}
.panel {{ width:{panel}in; height:{H}in; position:relative; overflow:hidden; box-sizing:border-box }}
.spine {{ width:{sp}in; height:{H}in; background:#1D1A21; position:relative; overflow:hidden }}
.sp-in {{ position:absolute; left:50%; top:50%; width:{TRIM_H - 1.1}in; height:{max(sp - .1, .05)}in; margin-left:-{(TRIM_H - 1.1)/2}in;
  margin-top:-{max(sp - .1, .05)/2}in; transform: rotate({rot}); display:flex; align-items:center; justify-content:center; gap:.18in;
  color:#F2EADB; font: 700 {min(16, sp*72*.62):.1f}pt/1 Kar; letter-spacing:.14em; direction:{t['dir']} }}
.sp-dot {{ width:4pt; height:4pt; background:#E8B4AA; transform:rotate(45deg) }}
.sp-a {{ font-weight:400; letter-spacing:.24em }}
/* front: the website's cover plate, edge to edge, with the title cut out of a paper band */
.front .plate {{ position:absolute; inset:0 }}
.front .plate svg {{ width:100%; height:100%; display:block }} svg {{ display:block }}
.iso-rtl {{ direction: rtl; unicode-bidi: isolate }} .iso-ltr {{ direction: ltr; unicode-bidi: isolate }}
.front .ft {{ position:absolute; {'left' if he else 'right'}: {BLEED}in; {'right' if he else 'left'}: 0; top: 1.25in;
  background:#F2EADB; padding:.24in .36in .22in; text-align:center; border-top: 2.2pt solid #A8101F; border-bottom: .8pt solid #1D1A21 }}
.front .kick {{ font: 400 10pt/1 Kar; letter-spacing:.5em; color:#2A5A5D }}
.front .title {{ font: 700 {'58pt' if he else '50pt'}/.9 Kar; letter-spacing:.01em; margin-top:.08in }}
.front .crack {{ width:2.5in; height:.28in; margin:.1in auto .04in }}
.front .other {{ font: 400 13pt/1 Kar; letter-spacing:.36em; color:#46404D }}
.front .au {{ position:absolute; bottom: {BLEED + .62}in; {'left' if he else 'right'}: {BLEED + .5}in; background:#1D1A21; color:#F2EADB;
  font: 400 15pt/1 Kar; letter-spacing:.3em; padding:.11in .2in .09in }}
.front .ed {{ position:absolute; bottom: {BLEED + .36}in; {'left' if he else 'right'}: {BLEED + .5}in; color:#F2EADB;
  font: 400 8pt/1 Kar; letter-spacing:.34em }}
/* back */
.back {{ background:#F2EADB }}
.back .bk {{ position:absolute; top:{BLEED + .7}in; {'right' if he else 'left'}:{BLEED + .55}in; {'left' if he else 'right'}:{.55}in;
  direction:{t['dir']}; text-align:{'right' if he else 'left'} }}
.back .tag {{ font: 700 20pt/1.05 Kar; color:#A8101F; margin-bottom:.22in; letter-spacing:.02em }}
.back p {{ font-size: {'11pt' if he else '10pt'}; line-height:1.5; margin:0 0 .8em }}
.qrrow {{ display:flex; align-items:center; gap:.16in; margin-top:.32in }}
.qr {{ width:.8in; height:.8in; flex:none }} .qr svg {{ width:100%; height:100% }}
.ql {{ font: 400 9.5pt/1.5 Kar; letter-spacing:.12em }}
.u {{ font: 400 8pt/1 Lit; letter-spacing:0; direction:ltr; unicode-bidi:isolate }}
.back .imp {{ position:absolute; bottom:{BLEED + .5}in; {'right' if he else 'left'}:{BLEED + .55}in; font: 400 8pt/1 Kar; letter-spacing:.4em; color:#46404D }}
"""
    return (f'<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><style>{css}</style></head>'
            f'<body><div class="row">{row}</div></body></html>', W, H)


def build_cover(lang: str, pages: int) -> tuple[Path, float, float]:
    doc, W, H = cover_html(lang, pages)
    out = OUT / f'broken-collective-{lang}-cover.pdf'
    HTML(string=doc, base_url=str(ROOT)).write_pdf(out)
    return out, W, H


def main(langs):
    editions = {}
    for lang in langs:
        interior, pages = build_interior(lang)
        cover, W, H = build_cover(lang, pages)
        editions[lang] = {'sku': SKU, 'pages': pages, 'spine_in': spine_in(pages), 'cover_in': [round(W, 4), round(H, 4)],
                          'interior': interior.name, 'cover': cover.name, 'binding': 'right-to-left' if lang == 'he' else 'left-to-right'}
        print(lang, editions[lang])
    (OUT / 'editions.json').write_text(json.dumps(editions, ensure_ascii=False, indent=2), encoding='utf8')


if __name__ == '__main__':
    main(sys.argv[1:] or ['en', 'he'])
