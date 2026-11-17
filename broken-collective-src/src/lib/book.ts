export const LANGS = ['he', 'en'] as const
export type Lang = (typeof LANGS)[number]

export function isLang(v: string): v is Lang {
  return (LANGS as readonly string[]).includes(v)
}

export const dirOf = (lang: Lang) => (lang === 'he' ? 'rtl' : 'ltr')

export type SeasonStatus = 'published' | 'editing'

export type Season = {
  year: number
  status: SeasonStatus
  /** Index into the illustration set (see components/Illustrations). */
  art: 'lockdown' | 'vaccine' | 'drift' | 'fracture' | 'war' | 'river'
}

/** The book is released season by season. Flip `status` to publish the next one. */
export const SEASONS: Season[] = [
  { year: 2020, status: 'published', art: 'lockdown' },
  { year: 2021, status: 'published', art: 'vaccine' },
  { year: 2022, status: 'published', art: 'drift' },
  { year: 2023, status: 'published', art: 'fracture' },
  { year: 2024, status: 'published', art: 'war' },
  { year: 2025, status: 'published', art: 'river' },
]

/** Chapter illustrations, keyed by `${season}-${number}`. */
export type ChapterArtKey =
  | 'terrace' | 'tea' | 'bar' | 'raid'
  | 'isolation' | 'nightmatch' | 'sky' | 'athens' | 'screens' | 'antenna'
  | 'tornphoto' | 'story'
  | 'lights' | 'static' | 'silence'
  | 'sparks' | 'relegation' | 'radio' | 'candles'
  | 'river' | 'pages' | 'notebook' | 'deal'

export const CHAPTER_ART: Record<string, ChapterArtKey> = {
  '2020-1': 'terrace',
  '2020-2': 'tea',
  '2020-3': 'bar',
  '2020-4': 'raid',
  '2021-1': 'isolation',
  '2021-2': 'nightmatch',
  '2021-3': 'sky',
  '2021-4': 'athens',
  '2021-5': 'screens',
  '2021-6': 'antenna',
  '2022-1': 'tornphoto',
  '2022-2': 'story',
  '2023-1': 'lights',
  '2023-2': 'static',
  '2023-3': 'silence',
  '2024-1': 'sparks',
  '2024-2': 'relegation',
  '2024-3': 'radio',
  '2024-4': 'candles',
  '2025-1': 'river',
  '2025-2': 'pages',
  '2025-3': 'notebook',
  '2025-4': 'deal',
}

export const ORIGIN = 'https://www.dubelteam.com'
export const BASE_PATH = '/broken-collective'
export const SITE_URL = `${ORIGIN}${BASE_PATH}`

/** Absolute URL for a path inside the book (paths start with '/'). */
export const abs = (path: string) => `${SITE_URL}${path}`

/**
 * Payments run on FAN LIFE's server and its Stripe account (the book site is static): plain links/forms to these doors.
 * PRINT mirrors fanlife/lib/book/catalog.ts (PAPERBACK + REGIONS) for the running total only — the server's numbers are
 * what Stripe charges. Change both together.
 */
export const PAY_URL = 'https://fanlife.dubelteam.com/api/book'
export const PRINT = {
  cents: 1800,
  regions: {
    il: { label: { he: 'ישראל', en: 'Israel' }, ship: { standard: { cents: 1100, days: [12, 25] }, express: { cents: 2600, days: [5, 9] } } },
    eu: { label: { he: 'אירופה ובריטניה', en: 'Europe & UK' }, ship: { standard: { cents: 700, days: [7, 14] }, express: { cents: 1900, days: [3, 6] } } },
    na: { label: { he: 'ארה״ב וקנדה', en: 'USA & Canada' }, ship: { standard: { cents: 700, days: [6, 12] }, express: { cents: 1900, days: [3, 5] } } },
    world: { label: { he: 'שאר העולם', en: 'Rest of the world' }, ship: { standard: { cents: 1300, days: [12, 28] }, express: { cents: 3000, days: [5, 9] } } },
  },
} as const

/** the book's own goods (mirrors fanlife/lib/book/catalog.ts GOODS — the server's numbers are what Stripe charges).
 * Photos are Printify's own mockups of the two real products in the "Broken Collective" store. */
const MOCK = 'https://images.printify.com/mockup'
export const GOODS = {
  tee: {
    cents: 4500,
    colours: ['Ivory'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    ship: { il: 1500, eu: 1100, na: 700, world: 1500 },
    photos: [`${MOCK}/6afc0ca1fd4d7f230d0ac10b/78993/98446/broken-collective-tee.jpg`, `${MOCK}/6afc0ca1fd4d7f230d0ac10b/78993/126094/broken-collective-tee.jpg`],
  },
  cap: {
    cents: 3500,
    colours: ['Khaki', 'Black'],
    sizes: ['One size'],
    ship: { il: 1300, eu: 1000, na: 700, world: 1300 },
    photos: [`${MOCK}/6afc0ecbf17cef87cb02ee8e/105375/102307/broken-collective-cap.jpg`, `${MOCK}/6afc0ecbf17cef87cb02ee8e/105375/102724/broken-collective-cap.jpg`],
  },
} as const
