import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChapterView } from '@/components/ChapterView'
import { CoverArt } from '@/components/Illustrations'
import { LANGS, abs, isLang, type Lang } from '@/lib/book'
import { getPrologue } from '@/lib/content'
import { t } from '@/lib/i18n'
import { neighbours } from '@/lib/nav'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const other: Lang = lang === 'he' ? 'en' : 'he'
  return {
    title: t(lang, 'prologue.title'),
    alternates: { canonical: abs(`/${lang}/prologue/`), languages: { [other]: abs(`/${other}/prologue/`) } },
  }
}

export default async function ProloguePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const doc = getPrologue(lang)
  const href = `/${lang}/prologue/`
  const other: Lang = lang === 'he' ? 'en' : 'he'
  const { next } = neighbours(lang, href)
  return (
    <ChapterView
      lang={lang}
      doc={doc}
      kicker={doc.kicker ?? t(lang, 'book.title')}
      art={<CoverArt className="h-full w-full" />}
      href={href}
      altHref={`/${other}/prologue/`}
      prev={null}
      next={next ? { href: next.href, title: next.title, label: t(lang, 'nav.next') } : null}
    />
  )
}
