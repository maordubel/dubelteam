'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { FinaleBill, FinaleIntro, FinaleStamp, FinaleThread } from './SupportFinale'
import { voiceTier } from '@/lib/speech-he'
import { useSpeech } from './useSpeech'

export type BookLabels = {
  book: string
  contents: string
  settings: string
  close: string
  listen: string
  pause: string
  resume: string
  stop: string
  voice: string
  noVoice: string
  noVoiceHelp: string
  preview: string
  previewSample: string
  speed: string
  size: string
  smaller: string
  larger: string
  theme: string
  paper: string
  night: string
  mode: string
  modeBook: string
  modeScroll: string
  page: string
  of: string
  next: string
  prev: string
  swipeHint: string
  toBook: string
  minutes: string
  endNote: string
  nextChapter: string
  backToBook: string
  glyph: string
  tierNatural: string
  tierGood: string
  betterVoice: string
}

type NavTarget = { href: string; title: string; label: string } | null

const SIZES = [1.0625, 1.1875, 1.3125, 1.4375] as const
const GAP = 48
const RATES = [0.8, 1, 1.2, 1.5] as const

function store(key: string, value?: string): string | null {
  try {
    if (value === undefined) return window.localStorage.getItem(key)
    window.localStorage.setItem(key, value)
  } catch {
    /* storage unavailable */
  }
  return null
}

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Geometry = { spread: boolean; W: number; H: number; padX: number; padTop: number; padBottom: number }
type Flip = { dir: 'fwd' | 'back'; from: number; to: number }

/**
 * The book: the chapter laid out as real pages (CSS columns), turned with a 3D page flip.
 * Mobile: one page, swipe or tap the edges. Desktop: an open spread with a spine.
 * Read-aloud follows the text and turns the pages by itself.
 */
export function BookReader({
  lang,
  html,
  texts,
  kicker,
  title,
  minutes,
  art,
  bookTitle,
  chapterKey,
  href,
  contentsHref,
  prev,
  next,
  labels,
  finale = false,
}: {
  lang: 'he' | 'en'
  html: string
  texts: string[]
  kicker: string
  title: string
  minutes: string
  art: ReactNode
  bookTitle: string
  chapterKey: string
  href: string
  contentsHref: string
  prev: NavTarget
  next: NavTarget
  labels: BookLabels
  /** last published chapter: end with "to be continued", the bar tab and the red thread */
  finale?: boolean
}) {
  const rtl = lang === 'he'
  const router = useRouter()
  const [mode, setMode] = useState<'book' | 'scroll' | null>(null)
  const [geo, setGeo] = useState<Geometry | null>(null)
  const [textPages, setTextPages] = useState(1)
  const [pageOfBlock, setPageOfBlock] = useState<number[]>([])
  const [view, setView] = useState(0)
  const [flip, setFlip] = useState<Flip | null>(null)
  const [chrome, setChrome] = useState(true)
  const [sheet, setSheet] = useState(false)
  const [size, setSize] = useState(1)
  const [night, setNight] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const leafRef = useRef<HTMLDivElement>(null)
  const shadeRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<number>(-1) // first block on screen; -1 = the title page
  const chromeTimer = useRef<number | undefined>(undefined)

  /* ── mode: book by default, scroll if the reader chose it ── */
  useEffect(() => {
    const m = document.documentElement.dataset.mode === 'scroll' ? 'scroll' : 'book'
    setMode(m)
    const rawSize = store('bc:size')
    const s = rawSize === null ? NaN : Number(rawSize)
    if (Number.isInteger(s) && s >= 0 && s < SIZES.length) setSize(s)
    setNight(document.documentElement.dataset.theme === 'night')
    const raw = store(`bc:book:${chapterKey}`)
    const saved = raw === null ? -1 : Number(raw)
    anchorRef.current = Number.isFinite(saved) ? saved : -1
  }, [chapterKey])

  const switchMode = (m: 'book' | 'scroll') => {
    document.documentElement.dataset.mode = m
    store('bc:mode', m)
    setMode(m)
    setSheet(false)
    if (m === 'scroll' && anchorRef.current >= 0) {
      requestAnimationFrame(() => document.querySelector(`[data-scroll-i="${anchorRef.current}"]`)?.scrollIntoView())
    }
  }

  useEffect(() => {
    const el = document.documentElement
    el.classList.toggle('in-book', mode === 'book')
    return () => el.classList.remove('in-book')
  }, [mode])

  /* ── geometry & pagination ── */
  const measure = useCallback(() => {
    const stage = stageRef.current
    const m = measureRef.current
    if (!stage || !m) return
    const sw = stage.clientWidth
    const sh = stage.clientHeight
    const spread = sw >= 960 && sw > sh
    const padX = spread ? 44 : 22
    const padTop = spread ? 56 : 50
    const padBottom = spread ? 56 : 54
    const pageW = spread ? Math.min(520, (sw - 64) / 2) : sw
    const pageH = spread ? Math.min(sh - 48, 860) : sh
    const W = Math.floor(pageW - padX * 2)
    const H = Math.floor(pageH - padTop - padBottom)
    const flow = m.firstElementChild as HTMLElement | null
    if (!flow) return
    flow.style.width = `${W}px`
    flow.style.height = `${H}px`
    flow.style.columnWidth = `${W}px`
    flow.style.columnGap = `${GAP}px`
    const total = Math.max(1, Math.round((flow.scrollWidth + GAP) / (W + GAP)))
    const fr = flow.getBoundingClientRect()
    const pages: number[] = []
    flow.querySelectorAll<HTMLElement>('[data-i]').forEach((el) => {
      const r = el.getBoundingClientRect()
      const off = rtl ? fr.right - r.right : r.left - fr.left
      pages[Number(el.dataset.i)] = Math.max(0, Math.floor((off + 2) / (W + GAP)))
    })
    setGeo({ spread, W, H, padX, padTop, padBottom })
    setTextPages(total)
    setPageOfBlock(pages)
  }, [rtl])

  useLayoutEffect(() => {
    if (mode !== 'book') return
    measure()
    let t: number | undefined
    const onResize = () => {
      window.clearTimeout(t)
      t = window.setTimeout(measure, 160)
    }
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', onResize)
  }, [mode, measure, size])

  const endPage = textPages + 1
  const totalPages = textPages + 2 + (finale ? 2 : 0) // title page + text + end page (+ bill + thread)
  const perView = geo?.spread ? 2 : 1
  const views = Math.ceil(totalPages / perView)
  const pagesOf = useCallback((v: number) => (perView === 2 ? [2 * v, 2 * v + 1] : [v]), [perView])

  /* restore the reader's place once pagination is known */
  const restored = useRef(false)
  useEffect(() => {
    if (!geo || restored.current || pageOfBlock.length === 0) return
    restored.current = true
    const a = anchorRef.current
    if (a >= 0 && pageOfBlock[a] !== undefined) setView(Math.floor((pageOfBlock[a] + 1) / perView))
  }, [geo, pageOfBlock, perView])

  /* keep the anchor (first block on screen) so resizes and font changes don't lose the place */
  const firstBlockOn = useCallback(
    (v: number) => {
      const pages = pagesOf(v).filter((p) => p >= 1 && p <= textPages).map((p) => p - 1)
      if (pages.length === 0) return v === 0 ? -1 : texts.length - 1
      if (pagesOf(v)[0] === 0 && perView === 2) return 0
      const i = pageOfBlock.findIndex((p) => p >= pages[0])
      return i < 0 ? 0 : i
    },
    [pagesOf, textPages, pageOfBlock, texts.length, perView],
  )

  useEffect(() => {
    if (!geo || pageOfBlock.length === 0) return
    const a = firstBlockOn(view)
    anchorRef.current = a
    store(`bc:book:${chapterKey}`, String(a))
    store('bc:last', JSON.stringify({ href, title, p: views > 1 ? Number((view / (views - 1)).toFixed(3)) : 0 }))
  }, [view, geo, pageOfBlock, firstBlockOn, chapterKey, href, title, views])

  /* when pagination changes (font size, rotation), jump back to the anchored block */
  const lastLayout = useRef('')
  useEffect(() => {
    if (!geo) return
    const key = `${geo.W}x${geo.H}:${textPages}`
    if (lastLayout.current && lastLayout.current !== key) {
      const a = anchorRef.current
      const p = a >= 0 ? pageOfBlock[a] : undefined
      setView(p === undefined ? 0 : Math.floor((p + 1) / perView))
    }
    lastLayout.current = key
  }, [geo, textPages, pageOfBlock, perView])

  /* ── read-aloud ── */
  const goToBlock = useCallback(
    (i: number) => {
      const p = pageOfBlock[i]
      if (p === undefined) return
      const target = Math.floor((p + 1) / perView)
      setView((v) => (v === target ? v : target))
    },
    [pageOfBlock, perView],
  )
  const speech = useSpeech(lang, texts, goToBlock)

  useEffect(() => {
    const root = stageRef.current
    if (!root) return
    root.querySelectorAll('.is-reading').forEach((el) => el.classList.remove('is-reading'))
    if (speech.block !== null) root.querySelectorAll(`[data-i="${speech.block}"]`).forEach((el) => el.classList.add('is-reading'))
  }, [speech.block, view, flip, geo])

  const listen = () => {
    if (speech.status === 'playing') return speech.pause()
    if (speech.status === 'paused') return speech.resume()
    speech.play(firstBlockOn(view))
  }

  /* ── turning pages ── */
  const turn = useCallback(
    (dir: 'fwd' | 'back') => {
      if (flip) return
      const to = dir === 'fwd' ? view + 1 : view - 1
      if (to >= views) {
        if (next) router.push(next.href)
        return
      }
      if (to < 0) {
        if (prev) router.push(prev.href)
        return
      }
      if (reduceMotion()) {
        setView(to)
        return
      }
      setFlip({ dir, from: view, to })
    },
    [flip, view, views, next, prev, router],
  )

  useLayoutEffect(() => {
    if (!flip || !leafRef.current) return
    // s: the direction a forward page swings. LTR books turn right-to-left, Hebrew books left-to-right.
    const s = rtl ? 1 : -1
    const single = perView === 1
    const fwd = flip.dir === 'fwd'
    const [a0, a1] = fwd ? [0, s * 180] : single ? [s * 180, 0] : [0, -s * 180]
    const duration = single ? 620 : 760
    const leaf = leafRef.current.animate(
      [{ transform: `rotateY(${a0}deg)` }, { transform: `rotateY(${a1}deg)` }],
      { duration, easing: 'cubic-bezier(0.45, 0.05, 0.25, 1)' },
    )
    shadeRef.current?.animate([{ opacity: 0 }, { opacity: 0.5, offset: 0.5 }, { opacity: 0 }], { duration })
    let done = false
    leaf.finished
      .then(() => {
        done = true
        setView(flip.to)
        setFlip(null)
      })
      .catch(() => {})
    return () => {
      if (!done) leaf.cancel()
    }
  }, [flip, rtl, perView])

  /* gestures: swipe, edge taps, keyboard */
  const down = useRef<{ x: number; y: number; t: number } | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a,button,select,input,[role="dialog"]')) return
    down.current = { x: e.clientX, y: e.clientY, t: Date.now() }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const d = down.current
    down.current = null
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      // Hebrew books turn left-to-right; English right-to-left
      const forward = rtl ? dx > 0 : dx < 0
      turn(forward ? 'fwd' : 'back')
      return
    }
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && Date.now() - d.t < 500) {
      const w = window.innerWidth
      const zone = e.clientX < w * 0.3 ? 'left' : e.clientX > w * 0.7 ? 'right' : 'center'
      if (zone === 'center') {
        setChrome((c) => !c)
        return
      }
      const forward = rtl ? zone === 'left' : zone === 'right'
      turn(forward ? 'fwd' : 'back')
    }
  }

  useEffect(() => {
    if (mode !== 'book') return
    const onKey = (e: KeyboardEvent) => {
      if (sheet) {
        if (e.key === 'Escape') setSheet(false)
        return
      }
      if (e.key === 'ArrowLeft') turn(rtl ? 'fwd' : 'back')
      else if (e.key === 'ArrowRight') turn(rtl ? 'back' : 'fwd')
      else if (e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        turn('fwd')
      } else if (e.key === 'PageUp') turn('back')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, turn, rtl, sheet])

  /* chrome fades away on its own while reading */
  useEffect(() => {
    window.clearTimeout(chromeTimer.current)
    if (chrome && !sheet) chromeTimer.current = window.setTimeout(() => setChrome(false), 3200)
    return () => window.clearTimeout(chromeTimer.current)
  }, [chrome, sheet, view])

  /* settings */
  const changeSize = (d: number) =>
    setSize((s) => {
      const n = Math.min(SIZES.length - 1, Math.max(0, s + d))
      store('bc:size', String(n))
      document.documentElement.style.setProperty('--reader-size', `${SIZES[n]}rem`)
      return n
    })
  const toggleNight = (n: boolean) => {
    setNight(n)
    document.documentElement.dataset.theme = n ? 'night' : 'paper'
    store('bc:theme', n ? 'night' : 'paper')
  }

  /* ── rendering ── */
  const flowStyle = useMemo(
    () =>
      geo
        ? ({ width: geo.W, height: geo.H, columnWidth: `${geo.W}px`, columnGap: `${GAP}px`, columnFill: 'auto' } as const)
        : undefined,
    [geo],
  )

  const page = (n: number, side?: 'start' | 'end'): ReactNode => {
    if (!geo) return null
    const frame = {
      paddingInline: geo.padX,
      paddingTop: geo.padTop,
      paddingBottom: geo.padBottom,
    }
    const pageNo = n
    const edge = side === 'start' ? 'book-page--start' : side === 'end' ? 'book-page--end' : ''
    if (n === 0) {
      return (
        <div className={`book-page ${edge}`} style={frame}>
          <div className="flex h-full flex-col">
            <p className="kicker">{kicker}</p>
            <h1 className="mt-1 font-display text-[clamp(2.6rem,11vw,4.2rem)] leading-[0.9] text-ink">{title}</h1>
            <p className="mt-2 text-sm text-ink-faint">{minutes}</p>
            <div className="mt-5 min-h-0 flex-1 overflow-hidden border border-ink/80">{art}</div>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-faint">
              <span aria-hidden="true">{rtl ? '←' : '→'}</span>
              {labels.swipeHint}
            </p>
          </div>
        </div>
      )
    }
    if (finale && n === endPage) {
      return (
        <div className={`book-page ${edge}`} style={frame}>
          <FinaleIntro lang={lang} note={labels.endNote} compact />
        </div>
      )
    }
    if (finale && n === endPage + 1) {
      return (
        <div className={`book-page ${edge}`} style={frame}>
          <FinaleBill lang={lang} compact />
        </div>
      )
    }
    if (finale && n === endPage + 2) {
      return (
        <div className={`book-page ${edge}`} style={frame}>
          <FinaleThread lang={lang} backHref={contentsHref} compact />
        </div>
      )
    }
    if (n === endPage) {
      return (
        <div className={`book-page ${edge}`} style={frame}>
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            <svg viewBox="0 0 120 40" className="h-10 w-28" aria-hidden="true">
              <path d="M0 20 L34 18 L46 26 C 60 40, 74 2, 58 8 C 44 14, 66 34, 80 22 L120 20" fill="none" stroke="var(--thread)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p className="font-display text-2xl text-ink-soft">{labels.endNote}</p>
            {next ? (
              <Link href={next.href} className="mt-2 flex min-h-14 w-full flex-col justify-center bg-ink px-5 py-3 text-paper hover:bg-thread">
                <span className="text-sm opacity-80">{next.label}</span>
                <span className="font-display text-3xl leading-tight">{next.title}</span>
              </Link>
            ) : null}
            <Link href={contentsHref} className="inline-flex min-h-11 items-center underline decoration-rule underline-offset-4 hover:decoration-thread">
              {labels.backToBook}
            </Link>
          </div>
        </div>
      )
    }
    if (finale && n === totalPages)
      return (
        <div className={`book-page ${edge}`} style={frame}>
          <FinaleStamp lang={lang} />
        </div>
      )
    if (n < 0 || n >= totalPages) return <div className={`book-page book-page--blank ${edge}`} />
    const k = n - 1
    const shift = k * (geo.W + GAP) * (rtl ? 1 : -1)
    return (
      <div className={`book-page ${edge}`} style={frame}>
        <div className="book-runhead" aria-hidden="true">
          {n % 2 === 1 ? bookTitle : title}
        </div>
        <div className="h-full w-full overflow-hidden">
          <div className="prose-book book-flow" style={{ ...flowStyle, transform: `translateX(${shift}px)` }} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <div className="book-folio" aria-hidden="true">
          {pageNo}
        </div>
      </div>
    )
  }

  const spread = (a: number, b: number): ReactNode => (
    <div className="book-spread">
      <div className="book-half" key={`s-${a}`}>{page(a, 'start')}</div>
      <div className="book-half" key={`e-${b}`}>{page(b, 'end')}</div>
    </div>
  )
  const viewOf = (v: number): ReactNode => (perView === 2 ? spread(2 * v, 2 * v + 1) : page(v))

  if (mode === null) return null

  if (mode === 'scroll') {
    return <ToBookButton label={labels.toBook} onClick={() => switchMode('book')} />
  }

  const current = flip ? flip.from : view
  const pageNow = Math.min(totalPages - 1, pagesOf(current)[0])
  const progress = views > 1 ? current / (views - 1) : 0

  /* layers during a flip */
  let base: ReactNode = viewOf(current)
  let leaf: ReactNode = null
  let leafSide: 'full' | 'start' | 'end' = 'full'
  if (flip && geo) {
    if (perView === 1) {
      if (flip.dir === 'fwd') {
        base = page(flip.to)
        leaf = (
          <>
            <div className="leaf-face">{page(flip.from)}</div>
            <div className="leaf-face leaf-back"><div className="book-page book-page--blank" /></div>
          </>
        )
      } else {
        base = page(flip.from)
        leaf = (
          <>
            <div className="leaf-face">{page(flip.to)}</div>
            <div className="leaf-face leaf-back"><div className="book-page book-page--blank" /></div>
          </>
        )
      }
    } else {
      const [fA, fB] = pagesOf(flip.from)
      const [tA, tB] = pagesOf(flip.to)
      if (flip.dir === 'fwd') {
        base = spread(fA, tB)
        leafSide = 'end'
        leaf = (
          <>
            <div className="leaf-face">{page(fB, 'end')}</div>
            <div className="leaf-face leaf-back">{page(tA, 'start')}</div>
          </>
        )
      } else {
        base = spread(tA, fB)
        leafSide = 'start'
        leaf = (
          <>
            <div className="leaf-face">{page(fA, 'start')}</div>
            <div className="leaf-face leaf-back">{page(tB, 'end')}</div>
          </>
        )
      }
    }
  }

  const leafOrigin =
    leafSide === 'full'
      ? rtl
        ? 'right center'
        : 'left center'
      : leafSide === 'end'
        ? rtl
          ? 'right center'
          : 'left center'
        : rtl
          ? 'left center'
          : 'right center'

  return (
    <div className="book-root fixed inset-0 z-40" dir={rtl ? 'rtl' : 'ltr'} role="region" aria-label={labels.book}>
      {/* hidden measuring copy */}
      <div ref={measureRef} className="book-measure" aria-hidden="true">
        <div className="prose-book book-flow" dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      {/* reading progress thread */}
      <div className="fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden="true">
        <div className="h-full origin-left bg-thread transition-transform duration-500 rtl:origin-right" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div
        ref={stageRef}
        className="book-stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {geo && (
          <div className={`book ${geo.spread ? 'book--spread' : 'book--single'}`}>
            <div className="book-base">{base}</div>
            {leaf && (
              <div
                ref={leafRef}
                className={`book-leaf book-leaf--${leafSide}`}
                style={{ transformOrigin: leafOrigin }}
              >
                {leaf}
                <div ref={shadeRef} className="leaf-shade" />
              </div>
            )}
          </div>
        )}
        <p className="sr-only" aria-live="polite">
          {labels.page} {pageNow + 1} {labels.of} {totalPages}
        </p>
      </div>

      {/* top chrome */}
      <div className={`book-chrome book-chrome--top ${chrome || sheet ? 'is-on' : ''}`}>
        <Link href={contentsHref} className="inline-flex min-h-11 min-w-11 items-center gap-2 px-2 text-ink" aria-label={labels.contents}>
          <span aria-hidden="true">{rtl ? '→' : '←'}</span>
          <span className="font-display text-xl leading-none">{bookTitle}</span>
        </Link>
        <span className="hidden truncate font-display text-lg text-ink-soft desk:block">{title}</span>
        <button type="button" onClick={() => setSheet(true)} className="inline-flex min-h-11 min-w-11 items-center justify-center font-display text-2xl text-ink" aria-label={labels.settings} aria-haspopup="dialog">
          {labels.glyph}
          <span className="text-base">{labels.glyph}</span>
        </button>
      </div>

      {/* bottom chrome */}
      <div className={`book-chrome book-chrome--bottom justify-center gap-6 ${chrome || sheet ? 'is-on' : ''}`}>
        <button type="button" onClick={() => turn('back')} className="book-btn" aria-label={labels.prev}>
          <span aria-hidden="true">{rtl ? '→' : '←'}</span>
        </button>
        <span className="font-display text-lg tabular-nums text-ink-soft">
          {pageNow + 1} / {totalPages}
        </span>
        <button type="button" onClick={() => turn('fwd')} className="book-btn" aria-label={labels.next}>
          <span aria-hidden="true">{rtl ? '←' : '→'}</span>
        </button>
      </div>

      {/* listen — always reachable */}
      {speech.supported && (
        <div className="book-listen">
          <button
            type="button"
            onClick={listen}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink px-3 font-display text-lg leading-none shadow-[3px_3px_0_var(--ink)] ${speech.status === 'playing' ? 'bg-thread text-paper' : 'bg-paper text-ink'}`}
            aria-pressed={speech.status === 'playing'}
          >
            <span aria-hidden="true">{speech.status === 'playing' ? '❚❚' : '▶'}</span>
            <span>{speech.status === 'playing' ? labels.pause : speech.status === 'paused' ? labels.resume : labels.listen}</span>
          </button>
          {speech.status !== 'idle' && (
            <button type="button" onClick={speech.stop} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink" aria-label={labels.stop}>
              <span aria-hidden="true">■</span>
            </button>
          )}
        </div>
      )}

      {/* settings sheet */}
      {sheet && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 desk:items-center" onClick={() => setSheet(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={labels.settings}
            className="book-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl">{labels.settings}</h2>
              <button type="button" onClick={() => setSheet(false)} className="inline-flex min-h-11 min-w-11 items-center justify-center text-2xl" aria-label={labels.close}>
                ×
              </button>
            </div>

            <div className="sheet-row">
              <span>{labels.size}</span>
              <div className="flex gap-2">
                <button type="button" className="sheet-chip" onClick={() => changeSize(-1)} disabled={size === 0} aria-label={labels.smaller}>
                  <span className="text-base">{labels.glyph}−</span>
                </button>
                <button type="button" className="sheet-chip" onClick={() => changeSize(1)} disabled={size === SIZES.length - 1} aria-label={labels.larger}>
                  <span className="text-2xl">{labels.glyph}+</span>
                </button>
              </div>
            </div>

            <div className="sheet-row">
              <span>{labels.theme}</span>
              <div className="flex gap-2">
                <button type="button" className="sheet-chip" aria-pressed={!night} onClick={() => toggleNight(false)}>
                  {labels.paper}
                </button>
                <button type="button" className="sheet-chip" aria-pressed={night} onClick={() => toggleNight(true)}>
                  {labels.night}
                </button>
              </div>
            </div>

            <div className="sheet-row">
              <span>{labels.mode}</span>
              <div className="flex gap-2">
                <button type="button" className="sheet-chip" aria-pressed onClick={() => switchMode('book')}>
                  {labels.modeBook}
                </button>
                <button type="button" className="sheet-chip" aria-pressed={false} onClick={() => switchMode('scroll')}>
                  {labels.modeScroll}
                </button>
              </div>
            </div>

            <div className="mt-2 border-t border-rule pt-4">
              <p className="font-display text-2xl">{labels.voice}</p>
              {speech.voices.length === 0 ? (
                <p className="mt-2 text-sm text-ink-soft">
                  {labels.noVoice} {labels.noVoiceHelp}
                </p>
              ) : (
                <ul className="mt-2 flex max-h-[34vh] flex-col overflow-y-auto">
                  {speech.voices.map((v) => (
                    <li key={v.voiceURI} className="flex items-center gap-2 border-b border-rule">
                      <label className="flex min-h-12 flex-1 cursor-pointer items-center gap-3">
                        <input
                          type="radio"
                          name="voice"
                          className="h-5 w-5 accent-[var(--thread)]"
                          checked={speech.voiceURI === v.voiceURI}
                          onChange={() => speech.setVoice(v.voiceURI)}
                        />
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="truncate">{v.name.replace(/\s*\(.*?\)\s*/g, ' ').trim()}</span>
                            {voiceTier(v) !== 'basic' ? (
                              <span className={`voice-tier voice-tier--${voiceTier(v)}`}>
                                {voiceTier(v) === 'natural' ? labels.tierNatural : labels.tierGood}
                              </span>
                            ) : null}
                          </span>
                          <span className="block text-xs text-ink-faint" dir="ltr">
                            {v.lang}
                            {v.localService ? '' : ' · online'}
                          </span>
                        </span>
                      </label>
                      <button type="button" className="sheet-chip" onClick={() => speech.preview(v.voiceURI, labels.previewSample)} aria-label={`${labels.preview}: ${v.name}`}>
                        ▶
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {speech.voices.length > 0 && !speech.voices.some((v) => voiceTier(v) === 'natural') ? (
                <p className="mt-3 text-xs leading-relaxed text-ink-faint">{labels.betterVoice}</p>
              ) : null}
              <div className="sheet-row">
                <span>{labels.speed}</span>
                <div className="flex gap-2">
                  {RATES.map((r) => (
                    <button key={r} type="button" className="sheet-chip tabular-nums" aria-pressed={speech.rate === r} onClick={() => speech.setRate(r)}>
                      {r}×
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Scroll mode's way back into the book. Steps aside while you read down, returns when you scroll up. */
function ToBookButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - lastY) < 6) return
      setHidden(y > lastY && y > 240)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      type="button"
      onClick={onClick}
      className={`to-book fixed bottom-[4.5rem] start-3 z-30 inline-flex min-h-11 items-center gap-2 border border-ink bg-paper px-4 font-display text-xl text-ink shadow-[4px_4px_0_var(--ink)] desk:bottom-10 desk:start-6 ${hidden ? 'is-hidden' : ''}`}
    >
      <span aria-hidden="true">❦</span> {label}
    </button>
  )
}
