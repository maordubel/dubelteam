import { CHAPTER_ART, type Lang } from './book'
import { getSeasonChapters, publishedSeasons } from './content'
import { t } from './i18n'

export type Entry = { href: string; season: number | null; number: number | null; title: string }

/** The linear reading order: prologue, then every chapter of every published season. */
export function readingOrder(lang: Lang): Entry[] {
  const list: Entry[] = [{ href: `/${lang}/prologue/`, season: null, number: null, title: t(lang, 'prologue.title') }]
  for (const year of publishedSeasons()) {
    for (const c of getSeasonChapters(lang, year)) {
      list.push({ href: `/${lang}/${year}/${c.number}/`, season: year, number: c.number ?? null, title: c.title })
    }
  }
  return list
}

export function neighbours(lang: Lang, href: string) {
  const order = readingOrder(lang)
  const i = order.findIndex((e) => e.href === href)
  return { prev: i > 0 ? order[i - 1] : null, next: i >= 0 && i < order.length - 1 ? order[i + 1] : null }
}

export function chapterArtKey(season: number, number: number) {
  return CHAPTER_ART[`${season}-${number}`]
}
