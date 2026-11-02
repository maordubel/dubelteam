import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SeasonEmblem } from '@/components/Illustrations'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { LANGS, isLang, type Lang } from '@/lib/book'
import { t } from '@/lib/i18n'

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  return { title: t(lang, 'about.title') }
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const other: Lang = lang === 'he' ? 'en' : 'he'
  return (
    <>
      <SiteHeader lang={lang} altHref={`/${other}/about/`} />
      <main id="main" className="mx-auto max-w-3xl px-5 pt-8 desk:px-10 desk:pt-16">
        <SeasonEmblem art="river" className="h-16 w-16" />
        <h1 className="mt-4 font-display text-title">{t(lang, 'about.title')}</h1>
        <div className="prose-book mt-8">
          <p>{t(lang, 'about.body1')}</p>
          <p>{t(lang, 'about.body2')}</p>
          <p>{t(lang, 'about.body3')}</p>
        </div>
      </main>
      <SiteFooter lang={lang} />
    </>
  )
}
