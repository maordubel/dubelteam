import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { TapesPlayer } from '@/components/TapesPlayer'
import { ThreadRule } from '@/components/Thread'
import { CHANNEL, LANGS, TAPES, abs, isLang, type Lang } from '@/lib/book'

const COPY = {
  he: {
    title: 'קלטות קיפסלי',
    kicker: 'הספר, כסדרה',
    lead: 'הספר נקרא כסדרה ביוטיוב, על גבי קלטות מצלמת הווידאו הישנה שלי. קלטת חדשה בכל יום ראשון ב־19:00 (שעון אתונה). הכתוביות בעברית נפתחות אוטומטית.',
    channel: 'לערוץ ביוטיוב',
    subscribe: 'הירשמו לערוץ',
    tape: 'קלטת',
    read: 'לקרוא את הפרק',
    next: 'קלטת חדשה בכל יום ראשון · 19:00',
    all: 'כל הקלטות',
  },
  en: {
    title: 'The Kypseli Tapes',
    kicker: 'The book, as a series',
    lead: 'The book read as a series on YouTube, over the tapes of my old camcorder. A new tape every Sunday at 19:00 (Athens time).',
    channel: 'Open the channel',
    subscribe: 'Subscribe',
    tape: 'Tape',
    read: 'Read the chapter',
    next: 'A new tape every Sunday · 19:00',
    all: 'All tapes',
  },
} as const

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const c = COPY[lang]
  return {
    title: c.title,
    description: c.lead,
    alternates: { canonical: abs(`/${lang}/tapes/`), languages: { he: abs('/he/tapes/'), en: abs('/en/tapes/') } },
  }
}

export default async function Tapes({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const other: Lang = lang === 'he' ? 'en' : 'he'
  const c = COPY[lang]
  const tapes = [...TAPES].reverse()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tapes.map((x, i) => ({
      '@type': 'VideoObject',
      position: i + 1,
      name: `The Kypseli Tapes · ${String(x.n).padStart(2, '0')} · ${x.title.en}`,
      uploadDate: x.date,
      thumbnailUrl: `https://i.ytimg.com/vi/${x.id}/hqdefault.jpg`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${x.id}`,
      description: c.lead,
    })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader lang={lang} altHref={`/${other}/tapes/`} />
      <main id="main" className="mx-auto max-w-6xl px-5 pt-6 desk:px-10 desk:pt-12">
        <p className="tp-rec">REC · {c.kicker}</p>
        <h1 className="mt-2 font-display text-title" lang="en" dir="ltr">
          {COPY.en.title}
        </h1>
        <p className="mt-4 max-w-[46ch] text-lead text-ink-soft">{c.lead}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a className="tp-cta" href={`${CHANNEL.url}?sub_confirmation=1`} target="_blank" rel="noopener noreferrer">
            {c.subscribe}
          </a>
          <a className="tp-cta" href={CHANNEL.url} target="_blank" rel="noopener noreferrer">
            {c.channel} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="mt-10">
          <ThreadRule />
        </div>
        <TapesPlayer lang={lang} tapes={tapes} labels={{ tape: c.tape, read: c.read, all: c.all, next: c.next }} />
        <p className="mt-10 text-sm text-ink-faint">
          <Link href={`/${lang}/`} className="underline decoration-rule underline-offset-4 hover:decoration-thread">
            {lang === 'he' ? 'חזרה לספר' : 'Back to the book'}
          </Link>
        </p>
      </main>
      <SiteFooter lang={lang} />
    </>
  )
}
