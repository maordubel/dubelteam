'use client'

import { useState } from 'react'
import { GOODS, PAY_URL, PRINT, type Lang } from '@/lib/book'

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
    tee: { name: 'החולצה', line: 'כותנה אורגנית של Stanley/Stella בצבע נייר. מקדימה הקשר, מאחור הסדק — תפור בחוט אדום. מיוצרת באירופה.' },
    cap: { name: 'הכובע', line: 'כובע אבא רקום. חוט אדום אחד, קשר אחד.' },
    size: 'מידה',
    colour: 'צבע',
    colours: { Khaki: 'חאקי', Black: 'שחור', 'Natural Raw': 'נייר' },
    region: 'לאן?',
    post: 'משלוח',
    buy: 'להזמנה',
    secure: 'תשלום מאובטח ב־Stripe. את הכתובת ממלאים בעמוד התשלום.',
  },
  en: {
    kicker: 'From the book to the street',
    title: 'The thread, worn.',
    lead: 'Two pieces, printed and embroidered to order and posted straight to you.',
    tee: { name: 'The shirt', line: 'Organic Stanley/Stella cotton in paper white. The knot on the chest, the crack on the back — stitched in red. Made in Europe.' },
    cap: { name: 'The cap', line: 'Distressed dad cap, embroidered, black or khaki. One red thread, one knot. Made in Europe.' },
    size: 'Size',
    colour: 'Colour',
    colours: { Khaki: 'Khaki', Black: 'Black', 'Natural Raw': 'Natural' },
    region: 'Where to?',
    post: 'post',
    buy: 'Order',
    secure: 'Secure payment by Stripe. You enter the address on the payment page.',
  },
} as const

const eur = (c: number) => `€${(c / 100).toFixed(c % 100 ? 2 : 0)}`

function Photos({ item, lang }: { item: Item; lang: Lang }) {
  const [main, second] = GOODS[item].photos
  return (
    <div className="gd-figure">
      <img className="gd-photo" src={main} alt={lang === 'he' ? (item === 'tee' ? 'החולצה, מאחור' : 'הכובע') : item === 'tee' ? 'The shirt, back' : 'The cap'} loading="lazy" width={1200} height={1200} />
      <img className="gd-photo gd-photo--alt" src={second} alt="" aria-hidden="true" loading="lazy" width={1200} height={1200} />
    </div>
  )
}

function Card({ lang, item }: { lang: Lang; item: Item }) {
  const c = COPY[lang]
  const g = GOODS[item]
  const [size, setSize] = useState<string>(g.sizes.length > 1 ? 'M' : g.sizes[0])
  const [region, setRegion] = useState<Region>(lang === 'he' ? 'il' : 'eu')
  const [colour, setColour] = useState<string>(g.colours[0])
  const post = g.ship[region]
  return (
    <form className="gd-card" method="get" action={`${PAY_URL}/goods`}>
      <input type="hidden" name="item" value={item} />
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="size" value={size} />
      <input type="hidden" name="colour" value={colour} />
      <Photos item={item} lang={lang} />
      <div className="gd-body">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-h3">{c[item].name}</h3>
          <span className="gd-price font-display" dir="ltr">{eur(g.cents)}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{c[item].line}</p>
        {g.colours.length > 1 ? (
          <fieldset className="pb-set">
            <legend>{c.colour}</legend>
            <div className="pb-chips">
              {g.colours.map((x) => (
                <button key={x} type="button" className="sheet-chip" aria-pressed={colour === x} onClick={() => setColour(x)}>
                  {c.colours[x as keyof typeof c.colours] ?? x}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}
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
