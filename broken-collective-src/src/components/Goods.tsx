'use client'

import { useState } from 'react'
import { BASE_PATH, GOODS, PAY_URL, PRINT, type Lang } from '@/lib/book'

/* ─────────────────────────────────────────────────────────────
   The book's own goods: one shirt, one cap. Made to order and posted.
   Plain GET forms to FAN LIFE's /api/book/goods; Stripe takes the address.
   Nothing here comes from, or goes to, the FAN LIFE shop.
   ───────────────────────────────────────────────────────────── */

type Item = keyof typeof GOODS
type Region = keyof typeof PRINT.regions

const COPY = {
  he: {
    kicker: 'מהספר אל הרחוב',
    title: 'החוט, לבוש.',
    lead: 'שני פריטים, מודפסים ונרקמים לפי הזמנה ונשלחים ישר אליכם.',
    tee: { name: 'החולצה', line: 'כותנה כבדה בצביעת בגד, שנהב. מקדימה הקשר, מאחור הסדק — תפור בחוט אדום.' },
    cap: { name: 'הכובע', line: 'כובע אבא רקום. חוט אדום אחד, קשר אחד.' },
    size: 'מידה',
    region: 'לאן?',
    post: 'משלוח',
    buy: 'להזמנה',
    secure: 'תשלום מאובטח ב־Stripe. את הכתובת ממלאים בעמוד התשלום.',
  },
  en: {
    kicker: 'From the book to the street',
    title: 'The thread, worn.',
    lead: 'Two pieces, printed and embroidered to order and posted straight to you.',
    tee: { name: 'The shirt', line: 'Heavy garment-dyed cotton, ivory. The knot on the chest, the crack on the back — stitched in red.' },
    cap: { name: 'The cap', line: 'Embroidered dad cap. One red thread, one knot.' },
    size: 'Size',
    region: 'Where to?',
    post: 'post',
    buy: 'Order',
    secure: 'Secure payment by Stripe. You enter the address on the payment page.',
  },
} as const

const eur = (c: number) => `€${(c / 100).toFixed(c % 100 ? 2 : 0)}`
const art = (f: string) => `${BASE_PATH}/merch/v1/${f}`

function TeeShape({ lang }: { lang: Lang }) {
  return (
    <div className="gd-figure gd-figure--tee" aria-hidden="true">
      <svg viewBox="0 0 400 420" className="gd-garment">
        <path d="M120 20 Q200 52 280 20 L380 70 L350 160 L310 145 L310 405 L90 405 L90 145 L50 160 L20 70 Z" fill="#F4EBDA" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M150 28 Q200 62 250 28" fill="none" stroke="var(--color-ink)" strokeWidth="3" />
      </svg>
      <img className="gd-print gd-print--back" src={art('show-tee-back.png')} alt="" loading="lazy" />
      <span className="gd-tag font-display">{lang === 'he' ? 'גב' : 'back'}</span>
    </div>
  )
}

function CapShape() {
  return (
    <div className="gd-figure gd-figure--cap" aria-hidden="true">
      <svg viewBox="0 0 400 300" className="gd-garment">
        <path d="M78 196 C 70 96, 140 52, 200 52 C 260 52, 330 96, 322 196 Z" fill="#CFC3A8" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M200 54 C 186 100, 182 150, 186 196 M200 54 C 214 100, 218 150, 214 196" fill="none" stroke="var(--color-ink)" strokeWidth="1.5" opacity=".35" />
        <path d="M66 196 C 130 214, 270 214, 334 196 C 344 222, 312 262, 200 266 C 88 262, 56 222, 66 196 Z" fill="#BFB295" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M86 216 C 150 232, 250 232, 314 216" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" strokeDasharray="4 5" opacity=".5" />
        <circle cx="200" cy="52" r="6" fill="#BFB295" stroke="var(--color-ink)" strokeWidth="2" />
      </svg>
      <img className="gd-print gd-print--cap" src={art('show-cap.png')} alt="" loading="lazy" />
    </div>
  )
}

function Card({ lang, item }: { lang: Lang; item: Item }) {
  const c = COPY[lang]
  const g = GOODS[item]
  const [size, setSize] = useState<string>(g.sizes.length > 1 ? 'M' : g.sizes[0])
  const [region, setRegion] = useState<Region>(lang === 'he' ? 'il' : 'eu')
  const post = g.ship[region]
  return (
    <form className="gd-card" method="get" action={`${PAY_URL}/goods`}>
      <input type="hidden" name="item" value={item} />
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="size" value={size} />
      {item === 'tee' ? <TeeShape lang={lang} /> : <CapShape />}
      <div className="gd-body">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-h3">{c[item].name}</h3>
          <span className="gd-price font-display" dir="ltr">{eur(g.cents)}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c[item].line}</p>
        {g.sizes.length > 1 ? (
          <fieldset className="pb-set">
            <legend>{c.size}</legend>
            <div className="pb-chips">
              {g.sizes.map((s) => (
                <button key={s} type="button" className="sheet-chip" aria-pressed={size === s} onClick={() => setSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}
        <label className="gd-region">
          <span>{c.region}</span>
          <select name="region" value={region} onChange={(e) => setRegion(e.target.value as Region)}>
            {(Object.keys(PRINT.regions) as Region[]).map((r) => (
              <option key={r} value={r}>
                {PRINT.regions[r].label[lang]} · {eur(g.ship[r])} {c.post}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="pb-buy font-display">
          <span>
            {c.buy} · <bdi dir="ltr">{eur(g.cents + post)}</bdi>
          </span>
          <span aria-hidden="true">{lang === 'he' ? '←' : '→'}</span>
        </button>
      </div>
    </form>
  )
}

export function Goods({ lang }: { lang: Lang }) {
  const c = COPY[lang]
  return (
    <div className="gd">
      <p className="kicker text-thread!">{c.kicker}</p>
      <h2 className="mt-1 font-display text-h1 text-ink">{c.title}</h2>
      <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-ink-soft">{c.lead}</p>
      <div className="gd-grid mt-8">
        <Card lang={lang} item="tee" />
        <Card lang={lang} item="cap" />
      </div>
      <p className="mt-3 text-fine text-ink-faint">{c.secure}</p>
    </div>
  )
}
