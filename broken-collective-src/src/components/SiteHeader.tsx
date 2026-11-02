import Link from 'next/link'
import { type Lang } from '@/lib/book'
import { t } from '@/lib/i18n'

/** `altHref` is the same page in the other language. */
export function SiteHeader({ lang, altHref }: { lang: Lang; altHref: string }) {
  const other: Lang = lang === 'he' ? 'en' : 'he'
  return (
    <header className="relative z-20">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-3 focus:top-3 focus:bg-paper focus:px-3 focus:py-2"
      >
        {t(lang, 'nav.skip')}
      </a>
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 desk:px-10 desk:py-6">
        <Link href={`/${lang}/`} className="group flex min-h-11 items-center gap-3">
          <span className="block h-6 w-[3px] -rotate-6 bg-thread transition-transform group-hover:rotate-6 motion-reduce:transition-none" />
          <span className="font-display text-[1.75rem] leading-none tracking-wide desk:text-[2.25rem]">
            {t(lang, 'book.title')}
          </span>
        </Link>
        <div className="flex items-center gap-1 desk:gap-4">
          <Link
            href={`/${lang}/#contents`}
            className="hidden min-h-11 items-center px-2 text-ink-soft underline-offset-4 hover:text-ink hover:underline desk:inline-flex"
          >
            {t(lang, 'nav.contents')}
          </Link>
          <Link
            href={altHref}
            hrefLang={other}
            lang={other}
            aria-label={t(lang, 'nav.langSwitchLabel')}
            className="inline-flex min-h-11 min-w-11 items-center justify-center border border-ink px-3 font-display text-h4 transition-colors hover:bg-ink hover:text-paper motion-reduce:transition-none"
          >
            {t(lang, 'nav.langSwitch')}
          </Link>
        </div>
      </nav>
    </header>
  )
}
