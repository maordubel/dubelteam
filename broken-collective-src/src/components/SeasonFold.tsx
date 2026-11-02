'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * A season in the contents. On phones the chapter list folds away so six seasons
 * don't become one endless scroll: the season you're reading (or the first one) opens.
 * On desktop every season stays open. Without JS everything is open.
 */
export function SeasonFold({
  year,
  lang,
  first,
  count,
  countLabel,
  header,
  children,
}: {
  year: number
  lang: string
  first: boolean
  count: number
  countLabel: string
  header: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    let last: string | null = null
    try {
      last = JSON.parse(window.localStorage.getItem('bc:last') ?? 'null')?.href ?? null
    } catch {}
    const mine = last?.startsWith(`/${lang}/${year}/`)
    setOpen(last ? !!mine : first)
  }, [lang, year, first])

  return (
    <article className="season-fold" data-open={open}>
      <h3 className="m-0">
      <button type="button" className="season-fold__head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {header}
        <span className="season-fold__count" aria-hidden="true">
          <span className="tabular-nums">{count}</span> {countLabel}
          <svg viewBox="0 0 24 24" className="season-fold__chev h-5 w-5">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      </h3>
      <div className="season-fold__body">{children}</div>
    </article>
  )
}
