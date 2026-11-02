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
  { year: 2024, status: 'editing', art: 'war' },
  { year: 2025, status: 'editing', art: 'river' },
]

/** Chapter illustrations, keyed by `${season}-${number}`. */
export type ChapterArtKey =
  | 'terrace' | 'tea' | 'bar' | 'raid'
  | 'isolation' | 'nightmatch' | 'sky' | 'athens' | 'screens' | 'antenna'
  | 'tornphoto' | 'story'
  | 'lights' | 'static' | 'silence'

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
}

export const ORIGIN = 'https://www.dubelteam.com'
export const BASE_PATH = '/broken-collective'
export const SITE_URL = `${ORIGIN}${BASE_PATH}`

/** Absolute URL for a path inside the book (paths start with '/'). */
export const abs = (path: string) => `${SITE_URL}${path}`
