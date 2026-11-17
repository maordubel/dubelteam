'use client'

import Link from 'next/link'
import { useState } from 'react'
import { tapeEmbed, type Lang, type Tape } from '@/lib/book'

/* the newest tape plays first; the list beside it (under it on a phone) swaps the player */
const chapterHref = (lang: Lang, chapter: string) => {
  if (chapter === 'intro') return `/${lang}/prologue/`
  const [y, n] = chapter.split('-')
  return `/${lang}/${y}/${Number(n)}/`
}

export function TapesPlayer({ lang, tapes, labels }: { lang: Lang; tapes: Tape[]; labels: { tape: string; read: string; all: string; next: string } }) {
  const [now, setNow] = useState(tapes[0])
  if (!now) return null
  const num = (x: Tape) => String(x.n).padStart(2, '0')
  return (
    <div className="tp-wrap mt-8">
      <div>
        <div className="tp-frame">
          <iframe
            key={now.id}
            src={tapeEmbed(now.id, lang)}
            title={`The Kypseli Tapes · ${num(now)} · ${now.title.en}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-h2">
            {labels.tape} {num(now)} · {now.title[lang]}
          </h2>
          <Link href={chapterHref(lang, now.chapter)} className="inline-flex min-h-11 items-center underline decoration-rule underline-offset-4 hover:decoration-thread">
            {labels.read}
          </Link>
        </div>
        <p className="mt-1 text-sm text-ink-faint">{labels.next}</p>
      </div>
      <div className="mt-10 desk:mt-0">
        <h2 className="kicker mb-4">{labels.all}</h2>
        <ul className="tp-list">
          {tapes.map((x) => (
            <li key={x.id}>
              <button type="button" className="tp-card w-full text-start" aria-current={x.id === now.id} onClick={() => setNow(x)}>
                <img src={`https://i.ytimg.com/vi/${x.id}/mqdefault.jpg`} alt="" width={132} height={74} loading="lazy" />
                <span>
                  <span className="block font-display text-[1rem] tracking-[0.18em] text-ink-faint">
                    {labels.tape} {num(x)}
                  </span>
                  <h3 className="font-display text-h4">{x.title[lang]}</h3>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
