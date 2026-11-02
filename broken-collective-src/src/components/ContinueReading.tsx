'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Last = { href: string; title: string; p: number }

/** Shows "continue where you left off" only if this reader has a saved place in this language. */
export function ContinueReading({ lang, label }: { lang: string; label: string }) {
  const [last, setLast] = useState<Last | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('bc:last')
      if (!raw) return
      const v = JSON.parse(raw) as Last
      if (typeof v?.href === 'string' && v.href.startsWith(`/${lang}/`) && v.p < 0.98) setLast(v)
    } catch {
      /* no saved place */
    }
  }, [lang])

  if (!last) return null
  return (
    <Link
      href={last.href}
      className="group mt-4 flex min-h-11 items-center gap-3 border-s-[3px] border-thread ps-4 text-ink-soft hover:text-ink"
    >
      <span>{label}</span>
      <span className="font-display text-h3 text-ink">{last.title}</span>
      <span className="text-sm tabular-nums">{Math.round(last.p * 100)}%</span>
    </Link>
  )
}
