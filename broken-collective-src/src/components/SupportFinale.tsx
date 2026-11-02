'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SITE_URL, type Lang } from '@/lib/book'

/* ─────────────────────────────────────────────────────────────
   The end of what is written so far.
   Three beats: "to be continued" → the bar tab (PayPal) → the red thread (free).
   Works as three book pages, or stacked at the end of the scroll view.
   ───────────────────────────────────────────────────────────── */

const PAYPAL_BUSINESS = 'maor@har-tov.com'

const COPY = {
  he: {
    kicker: 'המשך יבוא',
    title: 'רגע. זה לא נגמר.',
    lead: 'כפי שהבנתם, אם קראתם עד כאן — הספר הזה נכתב בהתאם למציאות של כולנו.',
    body: 'ההמשך, וסיום הספר, עדיין נמצאים בכתיבה. המציאות עוד לא הגישה את הפרק הבא, ואנחנו מחכים לה עם עט ביד.',
    turn: 'דפדפו. יש לנו הצעה',
    billKicker: 'תדלוק לפרק הבא',
    billTitle: 'החשבון, בבקשה.',
    billBar: 'THE ONE · שולחן 7',
    billFoot: '* טיפ לא חובה. הקריאה כאן חינם, תמיד.',
    billSecure: 'התשלום ב־PayPal, מאובטח. נפתח בחלון חדש.',
    tiers: [
      { amount: 3, item: 'אספרסו בפסירי', gets: 'פסקה אחת קדימה' },
      { amount: 6, item: 'בירה ב־The One', gets: 'סצנה שלמה' },
      { amount: 15, item: 'כרטיס לבלומפילד', gets: 'פרק, עם תוספת זמן' },
      { amount: 0, item: 'סכום משלכם', gets: 'אתם קובעים את התוצאה' },
    ],
    ppItem: 'קולקטיב שבור — להמשך הכתיבה',
    freeKicker: 'תמיכה בלי כסף',
    freeTitle: 'אין כסף? יש חוט.',
    freeBody: 'החוט האדום עובר בין אנשים. תמשכו אותו הלאה.',
    tie: 'אני בפנים לעונה הבאה',
    tied: 'נקשר. ממשיכים לכתוב.',
    share: 'שלחו לחבר',
    copy: 'העתיקו קישור',
    copied: 'הועתק',
    write: 'כתבו לכותב',
    shareText: 'קולקטיב שבור — רומן שנכתב בזמן אמת, עונה אחרי עונה. תקראו.',
    mailSubject: 'קולקטיב שבור — קראתי עד הסוף',
    back: 'חזרה לספר',
    currency: '€',
  },
  en: {
    kicker: 'To be continued',
    title: 'Wait. It isn’t over.',
    lead: 'As you’ve figured out, if you’ve read this far — this book is written along the reality we all share.',
    body: 'The rest of it, and the ending, are still being written. Reality hasn’t handed in the next chapter yet; we’re waiting for it, pen in hand.',
    turn: 'Turn the page. We have an offer',
    billKicker: 'Fuel the next chapter',
    billTitle: 'The bill, please.',
    billBar: 'THE ONE · TABLE 7',
    billFoot: '* Tipping optional. Reading here is free, always.',
    billSecure: 'Secure via PayPal. Opens in a new tab.',
    tiers: [
      { amount: 3, item: 'An espresso in Psiri', gets: 'one more paragraph' },
      { amount: 6, item: 'A beer at The One', gets: 'a whole scene' },
      { amount: 15, item: 'A ticket to Bloomfield', gets: 'a chapter, with stoppage time' },
      { amount: 0, item: 'Your own amount', gets: 'you set the score' },
    ],
    ppItem: 'Broken Collective — keep the writing going',
    freeKicker: 'Support without money',
    freeTitle: 'No money? Pull a thread.',
    freeBody: 'The red thread runs between people. Pass it on.',
    tie: 'I’m in for the next season',
    tied: 'Tied. The writing goes on.',
    share: 'Send to a friend',
    copy: 'Copy the link',
    copied: 'Copied',
    write: 'Write to the writer',
    shareText: 'Broken Collective — a novel written in real time, season by season. Read it.',
    mailSubject: 'Broken Collective — I read to the end',
    back: 'Back to the book',
    currency: '€',
  },
} as const

const paypalHref = (item: string, amount: number) => {
  const q = new URLSearchParams({
    cmd: '_donations',
    business: PAYPAL_BUSINESS,
    item_name: item,
    currency_code: 'EUR',
    no_shipping: '1',
  })
  if (amount > 0) q.set('amount', String(amount))
  return `https://www.paypal.com/cgi-bin/webscr?${q.toString()}`
}

const KNOT = 'M0 20 L34 18 L46 26 C 60 40, 74 2, 58 8 C 44 14, 66 34, 80 22 L120 20'

/* ── beat 1: to be continued ── */
export function FinaleIntro({ lang, note, compact = false }: { lang: Lang; note?: string; compact?: boolean }) {
  const c = COPY[lang]
  return (
    <div className={`finale-intro flex flex-col items-center text-center ${compact ? 'h-full justify-center gap-4' : 'gap-5'}`}>
      <svg viewBox="0 0 120 40" className="h-10 w-28" aria-hidden="true">
        <path d={KNOT} fill="none" stroke="var(--thread)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {note ? <p className="text-sm text-ink-faint">{note}</p> : null}
      <p className="kicker text-thread!">{c.kicker}</p>
      <h2 className="font-display text-[clamp(2.2rem,12vw,4rem)] leading-[0.9] text-ink">{c.title}</h2>
      <p className="max-w-[30ch] font-display text-[clamp(1.1rem,5.4vw,1.35rem)] leading-snug text-ink-soft">{c.lead}</p>
      <p className="max-w-[34ch] text-[clamp(0.9rem,4.2vw,0.98rem)] leading-relaxed text-ink-soft">{c.body}</p>
      {compact ? (
        <p className="finale-nudge mt-2 flex items-center gap-2 text-xs text-ink-faint">
          {c.turn}
          <span aria-hidden="true">{lang === 'he' ? '←' : '→'}</span>
        </p>
      ) : null}
    </div>
  )
}

/* ── beat 2: the bar tab ── */
export function FinaleBill({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  const c = COPY[lang]
  return (
    <div className={`flex flex-col ${compact ? 'h-full justify-center' : ''}`}>
      <p className="kicker text-center">{c.billKicker}</p>
      <h2 className="mt-1 text-center font-display text-[clamp(2.3rem,10vw,3.4rem)] leading-[0.95] text-ink">{c.billTitle}</h2>
      <div className="finale-bill mt-4" role="list">
        <p className="finale-bill__bar" aria-hidden="true">
          <span>{c.billBar}</span>
          <span>№ 2026</span>
        </p>
        {c.tiers.map((tier) => (
          <a
            key={tier.item}
            role="listitem"
            className="finale-tier"
            href={paypalHref(c.ppItem, tier.amount)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex min-w-0 flex-col">
              <span className="font-display text-[1.3rem] leading-tight">{tier.item}</span>
              <span className="text-xs text-ink-faint">= {tier.gets}</span>
            </span>
            <span className="finale-tier__dots" aria-hidden="true" />
            <span className="finale-tier__price tabular-nums" dir="ltr">
              {tier.amount > 0 ? `${c.currency}${tier.amount}` : '€ ?'}
            </span>
          </a>
        ))}
        <p className="finale-bill__foot">{c.billFoot}</p>
      </div>
      <p className="mt-3 flex items-center justify-center gap-2 text-[0.72rem] text-ink-faint">
        <PayPalMark />
        {c.billSecure}
      </p>
    </div>
  )
}

function PayPalMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.3 21.2H3.9a.5.5 0 0 1-.5-.6L6.1 3.5c.1-.4.4-.7.8-.7h6.4c3.3 0 5.4 1.6 4.9 4.8-.6 3.7-3 5.4-6.6 5.4H9.4c-.4 0-.7.3-.8.7l-1.3 7.5Zm11.6-12.6c.9.8 1.2 2 .9 3.7-.6 3.6-3 5.2-6.4 5.2h-1.1c-.4 0-.7.3-.8.7l-.7 4.1a.5.5 0 0 1-.5.4H7.9l.2-1.3 1-5.9h1.8c4 0 6.9-2 7.6-6.2l.1-.6.3-.1Z"
      />
    </svg>
  )
}

/* ── beat 3: the red thread ── */
export function FinaleThread({ lang, backHref, compact = false }: { lang: Lang; backHref: string; compact?: boolean }) {
  const c = COPY[lang]
  const [tied, setTied] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = `${SITE_URL}/${lang}/`

  useEffect(() => {
    try {
      setTied(localStorage.getItem('bc:tied') === '1')
    } catch {}
  }, [])

  const tie = () => {
    setTied(true)
    try {
      localStorage.setItem('bc:tied', '1')
    } catch {}
    try {
      navigator.vibrate?.(18)
    } catch {}
  }

  const share = async () => {
    const data = { title: lang === 'he' ? 'קולקטיב שבור' : 'Broken Collective', text: c.shareText, url }
    try {
      if (navigator.share) {
        await navigator.share(data)
        return
      }
    } catch {
      return
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${c.shareText} ${url}`)}`, '_blank', 'noopener')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'h-full justify-center' : ''}`}>
      <p className="kicker">{c.freeKicker}</p>
      <h2 className="mt-1 font-display text-[clamp(2.3rem,10vw,3.4rem)] leading-[0.95] text-ink">{c.freeTitle}</h2>
      <p className="mt-2 max-w-[30ch] text-[0.98rem] leading-relaxed text-ink-soft">{c.freeBody}</p>

      <button type="button" onClick={tie} className={`finale-knot mt-4 ${tied ? 'is-tied' : ''}`} aria-pressed={tied}>
        <svg viewBox="0 0 240 70" className="h-16 w-full" aria-hidden="true">
          <path className="finale-knot__loose" d="M0 35 C 40 30, 70 44, 110 34 S 170 30, 240 36" />
          <path className="finale-knot__tight" d="M0 35 L84 32 L98 44 C 120 66, 142 6, 116 14 C 92 22, 130 58, 150 38 L240 35" />
        </svg>
        <span className="font-display text-xl leading-tight">{tied ? c.tied : c.tie}</span>
      </button>

      <div className="mt-4 grid w-full grid-cols-3 gap-2">
        <button type="button" onClick={share} className="finale-act">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {c.share}
        </button>
        <button type="button" onClick={copy} className="finale-act" aria-live="polite">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {copied ? c.copied : c.copy}
        </button>
        <a href={`mailto:${PAYPAL_BUSINESS}?subject=${encodeURIComponent(c.mailSubject)}`} className="finale-act">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M4 19l2-5L16 4l4 4-10 10-6 1ZM14 6l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {c.write}
        </a>
      </div>

      <Link href={backHref} className="mt-4 inline-flex min-h-11 items-center underline decoration-rule underline-offset-4 hover:decoration-thread">
        {c.back}
      </Link>
    </div>
  )
}

/* ── scroll view: all three beats, stacked ── */
export function SupportFinale({ lang, backHref, note }: { lang: Lang; backHref: string; note?: string }) {
  return (
    <section className="finale-scroll mt-14" aria-label={COPY[lang].kicker}>
      <FinaleIntro lang={lang} note={note} />
      <div className="mx-auto mt-12 max-w-md">
        <FinaleBill lang={lang} />
      </div>
      <div className="finale-free mx-auto mt-12 max-w-md">
        <FinaleThread lang={lang} backHref={backHref} />
      </div>
    </section>
  )
}

/* ── desktop spread: the facing page after the last beat ── */
export function FinaleStamp({ lang }: { lang: Lang }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-center" aria-hidden="true">
      <p className="finale-stamp font-display">{lang === 'he' ? 'לעת עתה' : 'for now'}</p>
      <svg viewBox="0 0 120 40" className="h-10 w-28 opacity-70">
        <path d={KNOT} fill="none" stroke="var(--thread)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}
