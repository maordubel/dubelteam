'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { normalizeHebrew, segmentHebrew, voiceScore } from '@/lib/speech-he'

type Chunk = { block: number; text: string; lang: 'he' | 'en' }

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
 * Split paragraphs into sentence-sized chunks (some engines stop after ~15s of one utterance).
 * Hebrew is normalised for speech and English runs are split out for an English voice.
 */
function chunk(texts: string[], from: number, lang: 'he' | 'en'): Chunk[] {
  const out: Chunk[] = []
  for (let i = from; i < texts.length; i++) {
    const text = lang === 'he' ? normalizeHebrew(texts[i]) : texts[i]
    const parts = text.match(/[^.!?…:;]+[.!?…:;]*["”']?\s*/g) ?? [text]
    const sentences: string[] = []
    let buf = ''
    for (const s of parts) {
      if ((buf + s).length > 200 && buf) {
        sentences.push(buf.trim())
        buf = ''
      }
      buf += s
    }
    if (buf.trim()) sentences.push(buf.trim())
    for (const sentence of sentences) {
      if (lang === 'he') for (const seg of segmentHebrew(sentence)) out.push({ block: i, ...seg })
      else out.push({ block: i, text: sentence, lang })
    }
  }
  return out
}

const byQuality = (a: SpeechSynthesisVoice, b: SpeechSynthesisVoice) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name)

export type SpeechState = {
  supported: boolean
  voices: SpeechSynthesisVoice[]
  voiceURI: string | null
  rate: number
  status: 'idle' | 'playing' | 'paused'
  block: number | null
}

/**
 * Read-aloud on the device's own voices (Web Speech API): free, offline-capable,
 * and the reader picks the voice. Hebrew voices come from the OS (iOS "Carmit",
 * Android/Chrome Hebrew, Windows "Asaf"/"Hila").
 */
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
  const onBlockRef = useRef(onBlock)
  onBlockRef.current = onBlock
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const synth = window.speechSynthesis
    const load = () => {
      const all = synth.getVoices()
      const mine = all
        .filter((v) => v.lang.toLowerCase().startsWith(lang === 'he' ? 'he' : 'en') || (lang === 'he' && v.lang.toLowerCase().startsWith('iw')))
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
      synth.cancel()
    }
  }, [lang])

  const speakFrom = useCallback(
    (index: number) => {
      const synth = window.speechSynthesis
      const id = ++runId.current
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
        u.rate = rate
        u.onstart = () => {
          if (id !== runId.current) return
          setState((s) => (s.block === c.block ? s : { ...s, block: c.block }))
          onBlockRef.current(c.block)
        }
        u.onend = () => {
          const nxt = queue.current[k + 1]
          // a breath between paragraphs, like a reader turning to the next one
          if (nxt && nxt.block !== c.block) window.setTimeout(() => run(k + 1), 320)
          else run(k + 1)
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
    window.speechSynthesis.cancel()
    setState((s) => ({ ...s, status: 'paused' }))
  }, [])

  const resume = useCallback(() => speakFrom(pos.current), [speakFrom])

  const stop = useCallback(() => {
    runId.current++
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
