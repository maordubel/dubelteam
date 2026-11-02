import Link from 'next/link'
import type { ReactNode } from 'react'
import { type Lang } from '@/lib/book'
import type { ChapterDoc } from '@/lib/content'
import { readingMinutes } from '@/lib/content'
import { blocksToHtml, blocksToSpeech } from '@/lib/html'
import { t } from '@/lib/i18n'
import { BookReader } from './BookReader'
import { ReaderTools } from './ReaderTools'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { SupportFinale } from './SupportFinale'
import { ThreadKnot } from './Thread'

export type NavLink = { href: string; label: string; title: string } | null

export function ChapterView({
  lang,
  doc,
  kicker,
  art,
  href,
  altHref,
  prev,
  next,
  sideList,
  endNote,
}: {
  lang: Lang
  doc: ChapterDoc
  kicker: string
  art: ReactNode
  href: string
  altHref: string
  prev: NavLink
  next: NavLink
  sideList?: { href: string; label: string; current: boolean }[]
  endNote?: string
}) {
  const finale = !next
  const back = lang === 'he' ? '→' : '←'
  const fwd = lang === 'he' ? '←' : '→'
  const scenes = doc.blocks.filter((b) => b.kind === 'scene')
  let firstPara = true

  const minutes = t(lang, 'chapter.minutes', { n: readingMinutes(doc.words) })
  const contentsHref = `/${lang}/#contents`

  return (
    <>
      <BookReader
        lang={lang}
        html={blocksToHtml(doc.blocks)}
        texts={blocksToSpeech(doc.blocks)}
        kicker={kicker}
        title={doc.title}
        minutes={minutes}
        art={art}
        bookTitle={t(lang, 'book.title')}
        chapterKey={`${lang}:${doc.id}`}
        href={href}
        contentsHref={contentsHref}
        prev={prev}
        next={next}
        finale={finale}
        labels={{
          book: t(lang, 'book.region'),
          contents: t(lang, 'nav.contents'),
          settings: t(lang, 'book.settings'),
          close: t(lang, 'book.close'),
          listen: t(lang, 'book.listen'),
          pause: t(lang, 'book.pause'),
          resume: t(lang, 'book.resume'),
          stop: t(lang, 'book.stop'),
          voice: t(lang, 'book.voice'),
          noVoice: t(lang, 'book.noVoice'),
          noVoiceHelp: t(lang, 'book.noVoiceHelp'),
          preview: t(lang, 'book.preview'),
          previewSample: t(lang, 'book.previewSample'),
          speed: t(lang, 'book.speed'),
          size: t(lang, 'tools.size'),
          smaller: t(lang, 'tools.smaller'),
          larger: t(lang, 'tools.larger'),
          theme: t(lang, 'tools.theme'),
          paper: t(lang, 'tools.paper'),
          night: t(lang, 'tools.night'),
          mode: t(lang, 'book.mode'),
          modeBook: t(lang, 'book.modeBook'),
          modeScroll: t(lang, 'book.modeScroll'),
          page: t(lang, 'book.page'),
          of: t(lang, 'book.of'),
          next: t(lang, 'nav.next'),
          prev: t(lang, 'nav.prev'),
          swipeHint: t(lang, 'book.swipeHint'),
          toBook: t(lang, 'book.toBook'),
          minutes,
          endNote: endNote ?? t(lang, 'chapter.end'),
          nextChapter: t(lang, 'nav.next'),
          backToBook: t(lang, 'nav.backToBook'),
          glyph: lang === 'he' ? 'א' : 'A',
          tierNatural: t(lang, 'book.tierNatural'),
          tierGood: t(lang, 'book.tierGood'),
          betterVoice: t(lang, 'book.betterVoice'),
        }}
      />
      <div className="scroll-only">
      <SiteHeader lang={lang} altHref={altHref} />
      <main id="main" className="mx-auto max-w-6xl px-5 desk:grid desk:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] desk:gap-16 desk:px-10">
        {/* desktop margin: plate, scene index, season chapters */}
        <aside className="hidden desk:block">
          <div className="sticky top-8 flex flex-col gap-8">
            <div className="aspect-[5/6] w-full -rotate-1">{art}</div>
            {scenes.length > 0 && (
              <ol className="flex flex-col gap-1 text-sm">
                {scenes.map((s) =>
                  s.kind === 'scene' ? (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="flex min-h-9 items-center gap-2 text-ink-soft hover:text-ink">
                        <span className="h-px w-4 bg-thread" aria-hidden="true" />
                        {s.text}
                      </a>
                    </li>
                  ) : null,
                )}
              </ol>
            )}
            {sideList && (
              <ul className="flex flex-col border-t border-rule pt-4">
                {sideList.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      aria-current={c.current ? 'page' : undefined}
                      className={`flex min-h-10 items-center font-display text-xl leading-none ${c.current ? 'text-thread' : 'text-ink-soft hover:text-ink'}`}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <article className="min-w-0">
          <header className="pt-6 desk:pt-2">
            <p className="kicker">{kicker}</p>
            <h1 className="mt-2 font-display text-title text-ink">{doc.title}</h1>
            <p className="mt-3 text-sm text-ink-faint">{minutes}</p>
          </header>

          {/* mobile plate */}
          <div className="-mx-5 mt-6 aspect-square overflow-hidden desk:hidden">{art}</div>

          <div className="prose-book mt-8 desk:mt-12">
            {doc.blocks.map((b, i) => {
              if (b.kind === 'scene') {
                return (
                  <h2 key={i} id={b.id} data-scroll-i={i} className={`scene scroll-mt-8 ${i === 0 ? 'scene-first mt-0!' : ''}`}>
                    {b.text}
                  </h2>
                )
              }
              const cls = firstPara ? 'opener' : undefined
              firstPara = false
              return (
                <p key={i} className={cls} data-scroll-i={i}>
                  {b.runs.map((r, j) => (r.strong ? <strong key={j}>{r.text}</strong> : <span key={j}>{r.text}</span>))}
                </p>
              )
            })}
          </div>

          {finale ? (
            <SupportFinale lang={lang} backHref={contentsHref} note={endNote} />
          ) : (
            <div className="mt-14 flex flex-col items-center gap-3 text-ink-faint">
              <ThreadKnot />
              <p className="font-display text-xl">{endNote ?? t(lang, 'chapter.end')}</p>
            </div>
          )}

          <nav className="mt-12 grid gap-3 desk:grid-cols-2" aria-label={t(lang, 'nav.contents')}>
            {prev ? (
              <Link href={prev.href} className="group flex min-h-20 flex-col justify-center border border-rule p-4 hover:border-ink">
                <span className="text-sm text-ink-faint">{back} {prev.label}</span>
                <span className="font-display text-2xl leading-tight">{prev.title}</span>
              </Link>
            ) : (
              <span className="hidden desk:block" />
            )}
            {next ? (
              <Link
                href={next.href}
                className="group flex min-h-20 flex-col justify-center border border-ink bg-ink p-4 text-paper hover:bg-thread hover:border-thread desk:text-end"
              >
                <span className="text-sm opacity-80">{next.label} {fwd}</span>
                <span className="font-display text-2xl leading-tight">{next.title}</span>
              </Link>
            ) : (
              <Link href={`/${lang}/#contents`} className="flex min-h-20 items-center justify-center border border-rule p-4 font-display text-2xl hover:border-ink">
                {t(lang, 'nav.backToBook')}
              </Link>
            )}
          </nav>
        </article>
      </main>
      <SiteFooter lang={lang} />
      <ReaderTools
        chapterKey={`${lang}:${doc.id}`}
        chapterTitle={doc.title}
        href={href}
        labels={{
          label: t(lang, 'tools.label'),
          smaller: t(lang, 'tools.smaller'),
          larger: t(lang, 'tools.larger'),
          theme: t(lang, 'tools.theme'),
          paper: t(lang, 'tools.paper'),
          night: t(lang, 'tools.night'),
          share: t(lang, 'tools.share'),
          copied: t(lang, 'tools.copied'),
          progress: t(lang, 'tools.progress'),
          glyph: lang === 'he' ? 'א' : 'A',
        }}
      />
      </div>
    </>
  )
}
