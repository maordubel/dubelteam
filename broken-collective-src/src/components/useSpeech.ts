'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { normalizeHebrew, segmentHebrew, voiceScore } from '@/lib/speech-he'

type Chunk = {
  block: number
  text: string
  lang: 'he' | 'en'
  pauseAfter: number
  rateMod: number
}

function store(key: string, value?: string): string | null {
  try {
    if (value === undefined) return window.localStorage.getItem(key)
    window.localStorage.setItem(key, value)
  } catch {
    /* storage unavailable — choices just won't persist */
  }
  return null
}

/**
 * Storytelling pacing: calmer base tempo + deeper pauses on punctuation.
 */
function analyzeBeat(sentence: string): { pauseAfter: number; rateMod: number } {
  const trimmed = sentence.trim()
  let pauseAfter = 260 // standard period
  let rateMod = 0.9 // calmer storytelling base speed

  if (/(\.\.\.|…)\s*["”']?$/.test(trimmed)) {
    pauseAfter = 680
    rateMod = 0.84 // slow down for suspense
  } else if (/[?!]\s*["”']?$/.test(trimmed)) {
    pauseAfter = 420
    rateMod = 0.88
  } else if (/[:;—–]\s*$/.test(trimmed)) {
    pauseAfter = 340
  } else if (/,\s*$/.test(trimmed)) {
    pauseAfter = 150 // quick breath on long-sentence commas
  }

  // Short, punchy literary lines get extra weight
  if (trimmed.length > 0 && trimmed.length <= 35 && !/,\s*$/.test(trimmed)) {
    rateMod = Math.min(rateMod, 0.85)
    pauseAfter = Math.max(pauseAfter, 360)
  }

  return { pauseAfter, rateMod }
}

/**
 * Split paragraphs by punctuation, and break long sentences on commas for natural breathing.
 */
function chunk(texts: string[], from: number, lang: 'he' | 'en'): Chunk[] {
  const out: Chunk[] = []
  for (let i = from; i < texts.length; i++) {
    const raw = texts[i].trim()
    if (!raw) continue

    const text = lang === 'he' ? normalizeHebrew(raw) : raw
    const rawParts = text.match(/[^.!?…:;—–]+(?:\.\.\.|[.!?…:;—–])*["”']?\s*/g) ?? [text]

    // If a sentence is long (> 95 chars), also allow a breath at commas
    const parts: string[] = []
    for (const p of rawParts) {
      if (p.length > 95 && p.includes(',')) {
        const sub = p.match(/[^,]+,?\s*/g) ?? [p]
        parts.push(...sub)
      } else {
        parts.push(p)
      }
    }

    for (const part of parts) {
      const sentence = part.trim()
      if (!sentence) continue

      const { pauseAfter, rateMod } = analyzeBeat(sentence)

      if (lang === 'he') {
        const segs = segmentHebrew(sentence)
        segs.forEach((seg, idx) => {
          out.push({
            block: i,
            ...seg,
            pauseAfter: idx === segs.length - 1 ? pauseAfter : 40,
            rateMod,
          })
        })
      } else {
        out.push({ block: i, text: sentence, lang, pauseAfter, rateMod })
      }
    }
  }
  return out
}

const byQuality = (a: SpeechSynthesisVoice, b: SpeechSynthesisVoice) =>
  voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name)

export type SpeechState = {
  supported: boolean
  voices: SpeechSynthesisVoice[]
  voiceURI: string | null
  rate: number
  status: 'idle' | 'playing' | 'paused'
  block: number | null
}

export function useSpeech(lang: 'he' | 'en', texts: string[], onBlock: (i: number) => void) {
  const [state, setState] = useState<SpeechState>({
    supported: false,
    voices: [],
    voiceURI: null,
    rate: 1,
    status: 'idle',
    block: null,
  })
  const queue = useRef<Chunk[]>([])
  const english = useRef<SpeechSynthesisVoice | null>(null)
  const pos = useRef(0)
  const runId = useRef(0)
  const timerRef = useRef<number | null>(null)
  const onBlockRef = useRef(onBlock)
  onBlockRef.current = onBlock
  const stateRef = useRef(state)
  stateRef.current = state

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const synth = window.speechSynthesis
    const load = () => {
      const all = synth.getVoices()
      const mine = all
        .filter(
          (v) =>
            v.lang.toLowerCase().startsWith(lang === 'he' ? 'he' : 'en') ||
            (lang === 'he' && v.lang.toLowerCase().startsWith('iw')),
        )
        .sort(byQuality)
      english.current =
        all.filter((v) => /^en[-_](gb|us|ie|au)/i.test(v.lang)).sort(byQuality)[0] ??
        all.find((v) => v.lang.toLowerCase().startsWith('en')) ??
        null
      const saved = store(`bc:voice:${lang}`)
      const rate = Number(store('bc:rate')) || 1
      setState((s) => ({
        ...s,
        supported: true,
        voices: mine,
        rate,
        voiceURI: mine.find((v) => v.voiceURI === saved)?.voiceURI ?? mine[0]?.voiceURI ?? null,
      }))
    }
    load()
    synth.addEventListener('voiceschanged', load)
    return () => {
      synth.removeEventListener('voiceschanged', load)
      runId.current++
      clearTimer()
      synth.cancel()
    }
  }, [lang])

  const speakFrom = useCallback(
    (index: number) => {
      const synth = window.speechSynthesis
      const id = ++runId.current
      clearTimer()
      synth.cancel()

      const run = (k: number) => {
        if (id !== runId.current) return
        const c = queue.current[k]
        if (!c) {
          setState((s) => ({ ...s, status: 'idle', block: null }))
          return
        }
        pos.current = k
        const u = new SpeechSynthesisUtterance(c.text)
        const { voices, voiceURI, rate } = stateRef.current
        const own = voices.find((x) => x.voiceURI === voiceURI)
        const v = c.lang !== lang && english.current ? english.current : own
        if (v) u.voice = v
        u.lang = v?.lang ?? (c.lang === 'he' ? 'he-IL' : 'en-GB')
        // Apply subtle dramatic rate modulation clamped to safe bounds
        u.rate = Math.max(0.6, Math.min(2, Number((rate * c.rateMod).toFixed(2))))

        u.onstart = () => {
          if (id !== runId.current) return
          setState((s) => (s.block === c.block ? s : { ...s, block: c.block }))
          onBlockRef.current(c.block)
        }

        u.onend = () => {
          if (id !== runId.current) return
          const nxt = queue.current[k + 1]
          if (!nxt) {
            setState((s) => ({ ...s, status: 'idle', block: null }))
            return
          }
          // Scale pauses inversely with user's chosen speed
          const scale = 1 / Math.max(0.75, rate)
          const isNewParagraph = nxt.block !== c.block
          const delay = Math.round((isNewParagraph ? 850 : c.pauseAfter) * scale)

          if (delay > 0) {
            timerRef.current = window.setTimeout(() => run(k + 1), delay)
          } else {
            run(k + 1)
          }
        }

        u.onerror = (e) => {
          if (e.error === 'interrupted' || e.error === 'canceled') return
          run(k + 1)
        }
        synth.speak(u)
      }

      setState((s) => ({ ...s, status: 'playing' }))
      run(index)
    },
    [lang],
  )

  const play = useCallback(
    (fromBlock: number) => {
      queue.current = chunk(texts, Math.max(0, fromBlock), lang)
      speakFrom(0)
    },
    [texts, speakFrom, lang],
  )

  const pause = useCallback(() => {
    runId.current++
    clearTimer()
    window.speechSynthesis.cancel()
    setState((s) => ({ ...s, status: 'paused' }))
  }, [])

  const resume = useCallback(() => speakFrom(pos.current), [speakFrom])

  const stop = useCallback(() => {
    runId.current++
    clearTimer()
    window.speechSynthesis.cancel()
    setState((s) => ({ ...s, status: 'idle', block: null }))
  }, [])

  const setVoice = useCallback(
    (uri: string) => {
      store(`bc:voice:${lang}`, uri)
      setState((s) => ({ ...s, voiceURI: uri }))
      if (stateRef.current.status === 'playing') setTimeout(() => speakFrom(pos.current), 0)
    },
    [lang, speakFrom],
  )

  const setRate = useCallback(
    (r: number) => {
      store('bc:rate', String(r))
      setState((s) => ({ ...s, rate: r }))
      if (stateRef.current.status === 'playing') setTimeout(() => speakFrom(pos.current), 0)
    },
    [speakFrom],
  )

  const preview = useCallback(
    (uri: string, sample: string) => {
      runId.current++
      clearTimer()
      const synth = window.speechSynthesis
      synth.cancel()
      const v = stateRef.current.voices.find((x) => x.voiceURI === uri)
      const u = new SpeechSynthesisUtterance(lang === 'he' ? normalizeHebrew(sample) : sample)
      if (v) u.voice = v
      u.lang = v?.lang ?? (lang === 'he' ? 'he-IL' : 'en-GB')
      u.rate = Math.max(0.6, Math.min(2, Number((stateRef.current.rate * 0.9).toFixed(2))))
      synth.speak(u)
      setState((s) => ({ ...s, status: s.status === 'playing' ? 'paused' : s.status }))
    },
    [lang],
  )

  return { ...state, play, pause, resume, stop, setVoice, setRate, preview }
}
