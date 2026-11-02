import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChapterView } from '@/components/ChapterView'
import { ChapterArt, CoverArt } from '@/components/Illustrations'
import { LANGS, abs, isLang, type Lang } from '@/lib/book'
import { getChapter, getSeasonChapters, publishedSeasons } from '@/lib/content'
import { t } from '@/lib/i18n'
import { chapterArtKey, neighbours } from '@/lib/nav'

type Params = { lang: string; season: string; chapter: string }

export function generateStaticParams(): Params[] {
  const out: Params[] = []
  for (const lang of LANGS)
    for (const year of publishedSeasons())
      for (const c of getSeasonChapters(lang, year)) out.push({ lang, season: String(year), chapter: String(c.number) })
  return out
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, season, chapter } = await params
  if (!isLang(lang)) return {}
  const doc = getChapter(lang, Number(season), Number(chapter))
  const other: Lang = lang === 'he' ? 'en' : 'he'
  return {
    title: `${doc.title} · ${t(lang, 'season.label')} ${season}`,
    alternates: {
      canonical: abs(`/${lang}/${season}/${chapter}/`),
      languages: { [other]: abs(`/${other}/${season}/${chapter}/`) },
    },
  }
}

export default async function ChapterPage({ params }: { params: Promise<Params> }) {
  const { lang, season, chapter } = await params
  if (!isLang(lang)) notFound()
  const year = Number(season)
  const num = Number(chapter)
  const doc = getChapter(lang, year, num)
  const href = `/${lang}/${year}/${num}/`
  const other: Lang = lang === 'he' ? 'en' : 'he'
  const { prev, next } = neighbours(lang, href)
  const label = (e: typeof prev) =>
    e ? { href: e.href, title: e.title, label: e.season ? `${t(lang, 'chapter.label')} ${e.number}` : t(lang, 'prologue.title') } : null
  const artKey = chapterArtKey(year, num)
  const Art = artKey ? ChapterArt[artKey] : CoverArt
  const seasonEnds = !next || next.season !== year

  return (
    <ChapterView
      lang={lang}
      doc={doc}
      kicker={`${t(lang, 'season.label')} ${year} · ${t(lang, 'chapter.label')} ${num}`}
      art={<Art className="h-full w-full" />}
      href={href}
      altHref={`/${other}/${year}/${num}/`}
      prev={label(prev)}
      next={next ? { ...label(next)!, label: next.season !== year ? `${t(lang, 'season.label')} ${next.season}` : t(lang, 'nav.next') } : null}
      endNote={!next ? t(lang, 'chapter.seasonEnd', { year }) : seasonEnds ? t(lang, 'chapter.seasonDone', { year }) : undefined}
      sideList={getSeasonChapters(lang, year).map((c) => ({
        href: `/${lang}/${year}/${c.number}/`,
        label: `${c.number}. ${c.title}`,
        current: c.number === num,
      }))}
    />
  )
}
