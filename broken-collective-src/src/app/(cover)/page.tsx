import Link from 'next/link'
import { CoverArt } from '@/components/Illustrations'
import { t } from '@/lib/i18n'

/**
 * The threshold: two shores, one book. Hebrew on one side, English on the other,
 * the cover between them. Mobile stacks; desktop is a true three-column spread.
 */
export default function Threshold() {
  return (
    <main className="flex min-h-dvh flex-col desk:grid desk:grid-cols-[1fr_minmax(0,26rem)_1fr] desk:items-center desk:gap-10 desk:px-10">
      <h1 className="sr-only">Broken Collective · קולקטיב שבור</h1>
      {/* Hebrew shore */}
      <section lang="he" dir="rtl" className="order-2 px-5 pt-8 font-he desk:order-3 desk:px-0 desk:pt-0">
        <p className="kicker">{t('he', 'book.author')}</p>
        <h2 className="mt-1 font-display text-[clamp(3.5rem,16vw,6.5rem)] leading-[0.85]">
          קולקטיב <span className="text-thread">שבור</span>
        </h2>
        <p className="mt-3 max-w-[22em] text-ink-soft">{t('he', 'book.tagline')}</p>
        <Link
          href="/he/"
          hrefLang="he"
          className="mt-5 inline-flex min-h-14 w-full items-center justify-between bg-ink px-6 font-display text-h3 text-paper hover:bg-thread desk:w-auto desk:gap-10"
        >
          <span>לקריאה בעברית</span>
          <span aria-hidden="true">←</span>
        </Link>
      </section>

      {/* the cover, between the shores */}
      <div className="order-1 aspect-[600/760] w-full desk:order-2">
        <CoverArt className="h-full w-full" title={`${t('en', 'book.title')} – ${t('he', 'book.title')}`} />
      </div>

      {/* English shore */}
      <section className="order-3 px-5 pb-12 pt-10 font-en desk:order-1 desk:px-0 desk:pb-0 desk:pt-0 desk:text-end">
        <p className="kicker">{t('en', 'book.author')}</p>
        <h2 className="mt-1 font-display text-[clamp(3.5rem,16vw,6.5rem)] leading-[0.85]">
          Broken <span className="text-thread">Collective</span>
        </h2>
        <p className="mt-3 text-ink-soft desk:ms-auto desk:max-w-[22em]">{t('en', 'book.tagline')}</p>
        <Link
          href="/en/"
          hrefLang="en"
          className="mt-5 inline-flex min-h-14 w-full items-center justify-between bg-ink px-6 font-display text-h3 text-paper hover:bg-thread desk:w-auto desk:gap-10"
        >
          <span>Read in English</span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  )
}
