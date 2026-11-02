'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Labels = {
  label: string
  smaller: string
  larger: string
  theme: string
  paper: string
  night: string
  share: string
  copied: string
  progress: string
  glyph: string
}

const SIZES = [1.0625, 1.1875, 1.3125, 1.4375] as const
const KEY_SIZE = 'bc:size'
const KEY_THEME = 'bc:theme'
const KEY_LAST = 'bc:last'
const KEY_POS = 'bc:pos:'

function store(key: string, value?: string): string | null {
  try {
    if (value === undefined) return window.localStorage.getItem(key)
    window.localStorage.setItem(key, value)
  } catch {
    /* storage may be unavailable (private mode, embedded) — settings just won't persist */
  }
  return null
}

/**
 * Reading chrome for a chapter: the red progress thread, text size, paper/night, share,
 * and remembering the reader's place. Mobile: a bottom bar. Desktop: a vertical rail.
 */
export function ReaderTools({
  labels,
  chapterKey,
  chapterTitle,
  href,
}: {
  labels: Labels
  chapterKey: string
  chapterTitle: string
  href: string
}) {
  const [size, setSize] = useState(1)
  const [night, setNight] = useState(false)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const saveTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const rawSize = store(KEY_SIZE)
    const s = rawSize === null ? NaN : Number(rawSize)
    if (Number.isInteger(s) && s >= 0 && s < SIZES.length) setSize(s)
    setNight(document.documentElement.dataset.theme === 'night')
    const pos = Number(store(KEY_POS + chapterKey))
    if (pos > 0.02 && pos < 0.98 && !window.location.hash) {
      const max = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: pos * max })
    }
  }, [chapterKey])

  useEffect(() => {
    document.documentElement.style.setProperty('--reader-size', `${SIZES[size]}rem`)
  }, [size])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      setProgress(p)
      window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => {
        store(KEY_POS + chapterKey, p.toFixed(3))
        store(KEY_LAST, JSON.stringify({ href, title: chapterTitle, p: Number(p.toFixed(3)) }))
      }, 400)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [chapterKey, chapterTitle, href])

  const changeSize = (d: number) => {
    setSize((s) => {
      const n = Math.min(SIZES.length - 1, Math.max(0, s + d))
      store(KEY_SIZE, String(n))
      return n
    })
  }

  const toggleTheme = () => {
    const next = !night
    setNight(next)
    document.documentElement.dataset.theme = next ? 'night' : 'paper'
    store(KEY_THEME, next ? 'night' : 'paper')
  }

  const share = useCallback(async () => {
    const url = window.location.href.split('#')[0]
    try {
      if (navigator.share) {
        await navigator.share({ title: chapterTitle, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      /* user cancelled the share sheet */
    }
  }, [chapterTitle])

  const pct = Math.round(progress * 100)
  const btn =
    'inline-flex min-h-11 min-w-11 items-center justify-center font-display text-h4 text-ink transition-colors hover:text-thread disabled:opacity-35 motion-reduce:transition-none'

  return (
    <>
      {/* progress — mobile: a thread across the top; desktop: a thread down the inline-start edge */}
      <div
        role="progressbar"
        aria-label={labels.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="fixed inset-x-0 top-0 z-30 h-[3px] desk:inset-x-auto desk:start-0 desk:top-0 desk:h-dvh desk:w-[3px]"
      >
        <div
          className="h-full origin-left bg-thread rtl:origin-right desk:hidden"
          style={{ transform: `scaleX(${progress})` }}
        />
        <div className="hidden w-full bg-thread desk:block" style={{ height: `${pct}%` }} />
      </div>

      {/* mobile bottom bar */}
      <div
        role="toolbar"
        aria-label={labels.label}
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-rule bg-paper/95 px-3 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur desk:hidden"
      >
        <div className="flex items-center">
          <button type="button" className={btn} onClick={() => changeSize(-1)} disabled={size === 0} aria-label={labels.smaller}>
            <span aria-hidden="true" className="text-base">{labels.glyph}</span>
          </button>
          <button type="button" className={btn} onClick={() => changeSize(1)} disabled={size === SIZES.length - 1} aria-label={labels.larger}>
            <span aria-hidden="true" className="text-[1.6rem]">{labels.glyph}</span>
          </button>
        </div>
        <span className="font-display text-lg tabular-nums text-ink-soft" aria-hidden="true">
          {pct}%
        </span>
        <div className="flex items-center">
          <button type="button" className={btn} onClick={toggleTheme} aria-pressed={night} aria-label={labels.theme}>
            <span aria-hidden="true">{night ? '☼' : '☾'}</span>
          </button>
          <button type="button" className={btn} onClick={share} aria-label={labels.share}>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>

      {/* desktop rail */}
      <div
        role="toolbar"
        aria-label={labels.label}
        className="fixed bottom-10 end-6 z-30 hidden flex-col items-center gap-1 border border-rule bg-paper/90 p-1 backdrop-blur desk:flex"
      >
        <button type="button" className={btn} onClick={() => changeSize(1)} disabled={size === SIZES.length - 1} aria-label={labels.larger}>
          <span aria-hidden="true" className="text-[1.6rem]">{labels.glyph}+</span>
        </button>
        <button type="button" className={btn} onClick={() => changeSize(-1)} disabled={size === 0} aria-label={labels.smaller}>
          <span aria-hidden="true" className="text-base">{labels.glyph}−</span>
        </button>
        <span className="block h-px w-6 bg-rule" />
        <button type="button" className={btn} onClick={toggleTheme} aria-pressed={night} aria-label={labels.theme}>
          <span aria-hidden="true">{night ? '☼' : '☾'}</span>
        </button>
        <button type="button" className={btn} onClick={share} aria-label={labels.share}>
          <span aria-hidden="true">↗</span>
        </button>
        <span className="pt-1 font-display text-base tabular-nums text-ink-soft" aria-hidden="true">
          {pct}%
        </span>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {copied ? labels.copied : ''}
      </p>
      {copied && (
        <div className="fixed inset-x-0 bottom-20 z-40 mx-auto w-fit bg-ink px-4 py-2 text-paper desk:bottom-10" aria-hidden="true">
          {labels.copied}
        </div>
      )}
    </>
  )
}
