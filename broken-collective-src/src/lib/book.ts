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
 * Made in the EU: Stanley/Stella Creator 2.0 by OPT OnDemand, the distressed dad cap embroidered by Printful.
 * Photos are Printify's mockups of the two real products in the "Broken Collective" store. */
const MOCK = 'https://images.printify.com/mockup'
export const GOODS = {
  tee: {
    cents: 2900,
    colours: ['Natural Raw'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    ship: { il: 1000, eu: 500, na: 900, world: 1100 },
    photos: [`${MOCK}/6afc1aa78235d40d740c8687/106014/102331/broken-collective-tee.jpg`, `${MOCK}/6afc1aa78235d40d740c8687/106014/103511/broken-collective-tee.jpg`],
  },
  cap: {
    cents: 2900,
    colours: ['Black', 'Khaki'],
    sizes: ['One size'],
    ship: { il: 1000, eu: 500, na: 900, world: 1100 },
    photos: [`${MOCK}/6afc1c5655472a51c00eeb8e/118238/109493/broken-collective-cap.jpg`, `${MOCK}/6afc1c5655472a51c00eeb8e/118238/110016/broken-collective-cap.jpg`],
  },
} as const

/** The Kypseli Tapes — the book read as a series on YouTube, one tape every Sunday at 19:00 (Athens). Newest last. */
export const CHANNEL = { url: 'https://www.youtube.com/@TheKypseliTapes', uploads: 'UUEfldw4qlzEAxBoNmgaWd7g' }
export type Tape = { n: number; id: string; chapter: string; title: { he: string; en: string }; date: string }
export const TAPES: Tape[] = [
  { n: 0, id: 'Ya1CSJyEF1g', chapter: 'intro', title: { he: 'מבוא', en: 'Prologue' }, date: '2026-11-13' },
  { n: 1, id: 'TsEOmP-VLgU', chapter: '2020-01', title: { he: 'הסדק במראה', en: 'The Crack in the Mirror' }, date: '2026-11-15' },
]
export const tapeFor = (chapterId: string) => TAPES.find((x) => x.chapter === chapterId) ?? null
/** the player: Hebrew pages open with the Hebrew subtitles on */
export const tapeEmbed = (id: string, lang: Lang) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&cc_load_policy=1&cc_lang_pref=${lang}&hl=${lang}`
