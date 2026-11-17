'use client'

import { useEffect, useState } from 'react'
import { BASE_PATH, PAY_URL, PRINT, type Lang } from '@/lib/book'

/* ─────────────────────────────────────────────────────────────
   The paperback. The book you read here, printed on cream paper and posted.
   A plain GET form to FAN LIFE's /api/book/paperback (works without script);
   the script only adds the running total. Stripe collects the address.
   ───────────────────────────────────────────────────────────── */

type Region = keyof typeof PRINT.regions
type Ship = 'standard' | 'express'

const COPY = {
  he: {
    kicker: 'הספר המודפס',
    title: 'להחזיק אותו ביד.',
    lead: 'מהדורה ראשונה בכריכה רכה: כל שש העונות, מודפס על נייר קרם, נכרך ונשלח עד אליכם.',
    specs: ['עונות \u20662020–2025\u2069', '14×21.6 ס״מ', 'נייר קרם · כריכה מט'],
    edition: 'מהדורה',
    region: 'לאן שולחים?',
    ship: 'משלוח',
    standard: 'דואר רגיל',
    express: 'מהיר',
    days: 'ימי עסקים',
    book: 'הספר',
    post: 'משלוח',
    total: 'סה״כ',
    buy: 'להזמנה',
    secure: 'תשלום מאובטח ב־Stripe. את הכתובת ממלאים בעמוד התשלום.',
    note: 'מודפס לפי הזמנה — כל עותק נולד בשבילכם.',
    langs: { he: 'עברית', en: 'English' },
  },
  en: {
    kicker: 'The paperback',
    title: 'Hold it in your hands.',
    lead: 'First paperback edition: all six seasons, printed on cream paper, bound and posted to your door.',
    specs: ['Seasons 2020–2025', '5.5 × 8.5 in', 'Cream paper · matte cover'],
    edition: 'Edition',
    region: 'Where to?',
    ship: 'Post',
    standard: 'Standard',
    express: 'Express',
    days: 'business days',
    book: 'Book',
    post: 'Post',
    total: 'Total',
    buy: 'Order the paperback',
    secure: 'Secure payment by Stripe. You enter the address on the payment page.',
    note: 'Printed on demand — every copy is made for you.',
    langs: { he: 'עברית', en: 'English' },
  },
} as const

const eur = (cents: number) => `€${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`

function BookPhoto({ edition }: { edition: Lang }) {
  return (
    <div className="pb-photo">
      <img
        src={`${BASE_PATH}/print/book-${edition}.webp`}
        alt={edition === 'he' ? 'קולקטיב שבור — הספר המודפס' : 'Broken Collective — the paperback'}
        width={687}
        height={900}
        loading="lazy"
      />
    </div>
  )
}

export function Paperback({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  const c = COPY[lang]
  const [edition, setEdition] = useState<Lang>(lang)
  const [region, setRegion] = useState<Region>(lang === 'he' ? 'il' : 'eu')
  const [ship, setShip] = useState<Ship>('standard')
  const [error, setError] = useState(false)
  useEffect(() => {
    try {
      setError(new URLSearchParams(location.search).get('pay') === 'error')
    } catch {}
  }, [])
  const post = PRINT.regions[region].ship[ship]
  const total = PRINT.cents + post.cents

  return (
    <div className={`pb ${compact ? 'pb--compact' : ''}`}>
      <BookPhoto edition={edition} />
      <form className="pb-form" method="get" action={`${PAY_URL}/paperback`}>
        <p className="kicker text-thread!">{c.kicker}</p>
        <h2 className={`mt-1 font-display ${compact ? 'text-h2' : 'text-h1'} text-ink`}>{c.title}</h2>
        {!compact ? <p className="mt-3 max-w-[38ch] text-base leading-relaxed text-ink-soft">{c.lead}</p> : null}
        <ul className="pb-specs mt-3" aria-label={c.kicker}>
          {c.specs.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <input type="hidden" name="lang" value={edition} />

        <fieldset className="pb-set">
          <legend>{c.edition}</legend>
          <div className="pb-chips">
            {(['he', 'en'] as const).map((l) => (
              <button key={l} type="button" className="sheet-chip" aria-pressed={edition === l} onClick={() => setEdition(l)} lang={l}>
                {c.langs[l]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="pb-set">
          <legend>{c.region}</legend>
          <div className="pb-chips">
            {(Object.keys(PRINT.regions) as Region[]).map((r) => (
              <label key={r} className="pb-radio">
                <input type="radio" name="region" value={r} checked={region === r} onChange={() => setRegion(r)} />
                <span>{PRINT.regions[r].label[lang]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="pb-set">
          <legend>{c.ship}</legend>
          <div className="pb-chips">
            {(['standard', 'express'] as const).map((s) => {
              const o = PRINT.regions[region].ship[s]
              return (
                <label key={s} className="pb-radio pb-radio--wide">
                  <input type="radio" name="ship" value={s} checked={ship === s} onChange={() => setShip(s)} />
                  <span>
                    <span>
                      {c[s]} · <bdi dir="ltr">{eur(o.cents)}</bdi>
                    </span>
                    <small>
                      {o.days[0]}–{o.days[1]} {c.days}
                    </small>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <dl className="pb-sum">
          <div>
            <dt>{c.book}</dt>
            <dd dir="ltr">{eur(PRINT.cents)}</dd>
          </div>
          <div>
            <dt>{c.post}</dt>
            <dd dir="ltr">{eur(post.cents)}</dd>
          </div>
          <div className="pb-sum__total">
            <dt>{c.total}</dt>
            <dd dir="ltr">{eur(total)}</dd>
          </div>
        </dl>

        <button type="submit" className="pb-buy font-display">
          {c.buy}
          <span aria-hidden="true">{lang === 'he' ? '←' : '→'}</span>
        </button>
        <p className="mt-2 text-fine text-ink-faint">{error ? (lang === 'he' ? 'משהו נתקע בדרך לתשלום. נסו שוב.' : 'Something got stuck on the way to payment. Try again.') : c.secure}</p>
        {!compact ? <p className="mt-1 text-fine text-ink-faint">{c.note}</p> : null}
      </form>
    </div>
  )
}

/** the home page's "thank you" after Stripe sends the reader back (?thanks=tip|paperback) */
export function ThanksNote({ lang }: { lang: Lang }) {
  const [kind, setKind] = useState<string | null>(null)
  useEffect(() => {
    try {
      setKind(new URLSearchParams(location.search).get('thanks'))
    } catch {}
  }, [])
  if (kind !== 'tip' && kind !== 'paperback' && kind !== 'goods') return null
  const text =
    lang === 'he'
      ? kind === 'tip'
        ? 'תודה. החשבון שולם — ממשיכים לכתוב.'
        : kind === 'goods'
          ? 'ההזמנה התקבלה ונכנסת להכנה. מספר מעקב יגיע במייל.'
          : 'ההזמנה התקבלה. העותק שלך יוצא לדפוס, ומספר מעקב יגיע במייל.'
      : kind === 'tip'
        ? 'Thank you. The bill is paid — the writing goes on.'
        : kind === 'goods'
          ? 'Order received and being made. A tracking number will follow by email.'
          : 'Order received. Your copy goes to print; a tracking number will follow by email.'
  return (
    <div className="pb-thanks" role="status">
      <svg viewBox="0 0 120 40" className="h-6 w-16 shrink-0" aria-hidden="true">
        <path d="M0 20 L34 18 L46 26 C 60 40, 74 2, 58 8 C 44 14, 66 34, 80 22 L120 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <p>{text}</p>
      <button type="button" onClick={() => setKind(null)} aria-label={lang === 'he' ? 'סגירה' : 'Close'}>
        ×
      </button>
    </div>
  )
}
