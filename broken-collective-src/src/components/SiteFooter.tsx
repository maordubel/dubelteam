import Link from 'next/link'
import { type Lang } from '@/lib/book'
import { t } from '@/lib/i18n'
import { ThreadRule } from './Thread'

export function SiteFooter({ lang }: { lang: Lang }) {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 pb-28 desk:pb-10">
      <ThreadRule className="opacity-70" />
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pt-6 text-sm text-ink-soft desk:flex-row desk:items-center desk:justify-between desk:px-10">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-display text-h3 text-ink">{t(lang, 'book.title')}</span>
          <Link href={`/${lang}/about/`} className="inline-flex min-h-11 items-center underline decoration-rule hover:decoration-thread">
            {t(lang, 'nav.about')}
          </Link>
          <span>{t(lang, 'about.rights', { year })}</span>
        </div>
        <a
          href="https://DubelTeam.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t(lang, 'credit.aria')}
          className="inline-flex min-h-11 items-center gap-2 py-2 pe-1 ps-1 text-ink-soft transition-opacity hover:opacity-80 motion-reduce:transition-none"
        >
          <span>{t(lang, 'credit.label')}</span>
          <span lang="en" dir="ltr" className="font-semibold text-ink">
            Dubel Team
          </span>
          {/* the Dubel Team emblem already lives at the root of dubelteam.com */}
          <img src="/logo.png" alt="" aria-hidden="true" width={20} height={20} className="h-5 w-5 shrink-0 rounded-full" />
        </a>
      </div>
    </footer>
  )
}
