import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContinueReading } from '@/components/ContinueReading'
import { CoverArt, SeasonEmblem } from '@/components/Illustrations'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { ThreadRule } from '@/components/Thread'
import { SEASONS, abs, isLang, type Lang } from '@/lib/book'
import { getPrologue, getSeasonChapters, readingMinutes } from '@/lib/content'
import { seasonTitle, t } from '@/lib/i18n'

export { generateStaticParams } from './layout'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const other: Lang = lang === 'he' ? 'en' : 'he'
  return { alternates: { canonical: abs(`/${lang}/`), languages: { [other]: abs(`/${other}/`) } } }
}

const CHARS = ['alex', 'natalie', 'mehran'] as const

export default async function BookHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  const other: Lang = lang === 'he' ? 'en' : 'he'
  const prologue = getPrologue(lang)

  return (
    <>
      <SiteHeader lang={lang} altHref={`/${other}/`} />
      <main id="main">
        {/* ── hero ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 desk:grid desk:grid-cols-[1.05fr_1fr] desk:items-center desk:gap-14 desk:px-10 desk:pt-6">
          <div className="pt-4 desk:order-1">
            <p className="kicker">{t(lang, 'book.author')}</p>
            <h1 className="mt-2 font-display text-display text-ink">
              {lang === 'he' ? (
                <>
                  קולקטיב
                  <br />
                  <span className="text-thread">שבור</span>
                </>
              ) : (
                <>
                  Broken
                  <br />
                  <span className="text-thread">Collective</span>
                </>
              )}
            </h1>
            <p className="mt-4 font-display text-[1.75rem] leading-tight text-ink-soft desk:text-[2.25rem]">{t(lang, 'book.tagline')}</p>
            <p className="mt-5 max-w-[34em] text-[1.0625rem] leading-relaxed text-ink-soft">{t(lang, 'book.pitch')}</p>

            <div className="mt-7 flex flex-col gap-1">
              <Link
                href={`/${lang}/prologue/`}
                className="inline-flex min-h-14 w-full items-center justify-between gap-6 bg-ink px-6 font-display text-[1.75rem] leading-none text-paper transition-colors hover:bg-thread motion-reduce:transition-none desk:w-fit"
              >
                <span>{t(lang, 'nav.read')}</span>
                <span aria-hidden="true">{lang === 'he' ? '←' : '→'}</span>
              </Link>
              <ContinueReading lang={lang} label={t(lang, 'nav.continue')} />
              <p className="mt-3 text-sm text-ink-faint">{t(lang, 'book.free')}</p>
            </div>
          </div>

          {/* mobile: full-bleed cover shards; desktop: a tilted print */}
          <div className="-mx-5 mt-10 aspect-[600/760] desk:order-2 desk:mx-0 desk:mt-0 desk:rotate-[1.5deg] desk:shadow-[18px_22px_0_var(--paper-deep)]">
            <CoverArt className="h-full w-full" title={t(lang, 'book.title')} />
          </div>
        </section>

        {/* ── characters ───────────────────────────────────── */}
        <section className="mx-auto mt-16 max-w-6xl px-5 desk:mt-28 desk:px-10" aria-labelledby="chars">
          <h2 id="chars" className="kicker">
            {t(lang, 'chars.title')}
          </h2>
          <ol className="mt-4 grid gap-0 desk:grid-cols-3 desk:gap-0">
            {CHARS.map((c, i) => (
              <li
                key={c}
                className="flex gap-4 border-t border-ink py-5 desk:flex-col desk:gap-2 desk:border-t-0 desk:border-s desk:px-6 desk:py-2 desk:first:border-s-0 desk:first:ps-0"
              >
                <span className="font-display text-5xl leading-none text-thread tabular-nums desk:text-6xl" aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-[2.25rem] leading-none">{t(lang, `chars.${c}.name` as const)}</h3>
                  <p className="mt-2 text-ink-soft">{t(lang, `chars.${c}.line` as const)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── contents ─────────────────────────────────────── */}
        <section id="contents" className="mx-auto mt-16 max-w-6xl scroll-mt-6 px-5 desk:mt-28 desk:px-10" aria-labelledby="contents-h">
          <ThreadRule />
          <h2 id="contents-h" className="mt-6 font-display text-title">
            {t(lang, 'nav.contents')}
          </h2>

          <Link
            href={`/${lang}/prologue/`}
            className="mt-6 flex min-h-14 items-baseline justify-between gap-4 border-b border-rule py-3 hover:text-thread"
          >
            <span className="font-display text-[2rem] leading-none">{t(lang, 'prologue.title')}</span>
            <span className="text-sm text-ink-faint">{t(lang, 'chapter.minutes', { n: readingMinutes(prologue.words) })}</span>
          </Link>

          <div className="mt-10 flex flex-col gap-10 desk:grid desk:grid-cols-[1.4fr_1fr] desk:items-start desk:gap-14">
            <div className="flex flex-col gap-14">
            {SEASONS.filter((s) => s.status === 'published').map((s) => {
              const chapters = getSeasonChapters(lang, s.year)
              return (
                <article key={s.year}>
                  <header className="flex items-end gap-4">
                    <SeasonEmblem art={s.art} className="h-20 w-20 shrink-0 desk:h-28 desk:w-28" />
                    <div>
                      <p className="kicker">
                        {t(lang, 'season.label')} {s.year}
                      </p>
                      <h3 className="font-display text-[2.5rem] leading-[0.95] desk:text-[3.25rem]">{seasonTitle(lang, s.year)}</h3>
                    </div>
                  </header>
                  <ol className="mt-5">
                    {chapters.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/${lang}/${s.year}/${c.number}/`}
                          className="group flex min-h-16 items-center gap-4 border-b border-rule py-3 hover:border-ink"
                        >
                          <span className="w-8 font-display text-3xl leading-none text-thread tabular-nums">{c.number}</span>
                          <span className="flex-1 font-display text-[1.75rem] leading-none group-hover:text-thread">{c.title}</span>
                          <span className="text-sm text-ink-faint">{t(lang, 'chapter.minutes', { n: readingMinutes(c.words) })}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </article>
              )
            })}
            </div>

            <ul className="grid grid-cols-2 gap-3 desk:grid-cols-1 desk:gap-0">
              {SEASONS.filter((s) => s.status !== 'published').map((s) => (
                <li
                  key={s.year}
                  className="flex flex-col items-start gap-2 border border-dashed border-rule p-3 desk:flex-row desk:items-center desk:gap-4 desk:border-0 desk:border-b desk:border-solid desk:px-0 desk:py-3"
                >
                  <SeasonEmblem art={s.art} muted className="h-12 w-12 opacity-70" />
                  <div>
                    <p className="font-display text-[2rem] leading-none text-ink-soft">{s.year}</p>
                    <p className="text-sm text-ink-faint">{t(lang, 'season.editing')}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} />
    </>
  )
}
