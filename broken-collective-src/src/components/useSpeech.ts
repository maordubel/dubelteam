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
    /* storage unavailable */
  }
  return null
}

/**
 * Calculate storytelling pause & subtle pacing modulation per sentence.
 */
function analyzeBeat(sentence: string): { pauseAfter: number; rateMod: number } {
  const trimmed = sentence.trim()
  let pauseAfter = 180
  let rateMod = 1

  if (/(\.\.\.|…)\s*["”']?$/.test(trimmed)) {
    pauseAfter = 520
    rateMod = 0.93 // slow down slightly for trailing suspense
  } else if (/[?!]\s*["”']?$/.test(trimmed)) {
    pauseAfter = 320
  } else if (/[:;]\s*$/.test(trimmed)) {
    pauseAfter = 260
  }

  // Short, punchy literary lines get a touch more weight
  if (trimmed.length > 0 && trimmed.length <= 35) {
    rateMod = Math.min(rateMod, 0.95)
    pauseAfter = Math.max(pauseAfter, 280)
  }

  return { pauseAfter, rateMod }
}

/**
 * Split paragraphs into individual sentences for natural breathing and dramatic pauses.
 */
function chunk(texts: string[], from: number, lang: 'he' | 'en'): Chunk[] {
  const out: Chunk[] = []
  for (let i = from; i < texts.length; i++) {
    const raw = texts[i].trim()
    if (!raw) continue

    const text = lang === 'he' ? normalizeHebrew(raw) : raw
    const parts = text.match(/[^.!?…:;]+(?:\.\.\.|[.!?…:;])*["”']?\s*/g) ?? [text]

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
            // Only pause after the last segment of the sentence
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
    rate: 0.94, // warmer storytelling default
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
      const rate = Number(store('bc:rate')) || 0.94
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
          const delay = Math.round((isNewParagraph ? 700 : c.pauseAfter) * scale)

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
      u.rate = stateRef.current.rate
      synth.speak(u)
      setState((s) => ({ ...s, status: s.status === 'playing' ? 'paused' : s.status }))
    },
    [lang],
  )

  return { ...state, play, pause, resume, stop, setVoice, setRate, preview }
}
