/**
 * Hebrew read-aloud preparation.
 * Device voices stumble on unvocalised Hebrew conventions: prefixed numbers (ב־5),
 * acronyms with gershayim (צה״ל), dashes, scores (1:2) and English words inside Hebrew.
 * This turns the text into something a speech engine reads naturally, and splits
 * Latin runs out so they can be spoken by an English voice.
 */

export type Segment = { text: string; lang: 'he' | 'en' }

/* ── numbers → Hebrew words ── */
const UNITS_F = ['אפס', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע']
const UNITS_M = ['אפס', 'אחד', 'שניים', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה']
const TEENS_F = ['עשר', 'אחת עשרה', 'שתים עשרה', 'שלוש עשרה', 'ארבע עשרה', 'חמש עשרה', 'שש עשרה', 'שבע עשרה', 'שמונה עשרה', 'תשע עשרה']
const TEENS_M = ['עשרה', 'אחד עשר', 'שנים עשר', 'שלושה עשר', 'ארבעה עשר', 'חמישה עשר', 'שישה עשר', 'שבעה עשר', 'שמונה עשר', 'תשעה עשר']
const TENS = ['', '', 'עשרים', 'שלושים', 'ארבעים', 'חמישים', 'שישים', 'שבעים', 'שמונים', 'תשעים']
const HUNDREDS = ['', 'מאה', 'מאתיים', 'שלוש מאות', 'ארבע מאות', 'חמש מאות', 'שש מאות', 'שבע מאות', 'שמונה מאות', 'תשע מאות']
const THOUSANDS = ['', 'אלף', 'אלפיים', 'שלושת אלפים', 'ארבעת אלפים', 'חמשת אלפים', 'ששת אלפים', 'שבעת אלפים', 'שמונת אלפים', 'תשעת אלפים']

/** Hebrew number words; the last word gets "ו" when it stands alone (אלפיים ועשרים, עשרים ואחת). */
export function heNumber(n: number, masc = false): string {
  if (!Number.isFinite(n) || n < 0 || n > 999_999) return String(n)
  if (n < 10) return (masc ? UNITS_M : UNITS_F)[n]
  const parts: string[] = []
  const th = Math.floor(n / 1000)
  let r = n % 1000
  if (th) parts.push(th < 10 ? THOUSANDS[th] : `${heNumber(th, true)} אלף`)
  const h = Math.floor(r / 100)
  r %= 100
  if (h) parts.push(HUNDREDS[h])
  if (r >= 10 && r < 20) parts.push((masc ? TEENS_M : TEENS_F)[r - 10])
  else if (r >= 20) {
    const t = Math.floor(r / 10)
    const u = r % 10
    parts.push(u ? `${TENS[t]} ו${(masc ? UNITS_M : UNITS_F)[u]}` : TENS[t])
  } else if (r > 0) parts.push((masc ? UNITS_M : UNITS_F)[r])
  if (parts.length > 1 && !parts[parts.length - 1].includes(' ')) parts[parts.length - 1] = `ו${parts[parts.length - 1]}`
  return parts.join(' ')
}

const MONTHS = 'ינואר|פברואר|מרץ|מרס|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר'

/* ── acronyms & abbreviations ── */
const LEXICON: [RegExp, string][] = [
  [/צה["״]ל/g, 'צהל'],
  [/ארה["״]ב/g, 'ארצות הברית'],
  [/ת["״]א/g, 'תל אביב'],
  [/ד["״]ר/g, 'דוקטור'],
  [/עו["״]ד/g, 'עורך דין'],
  [/ש["״]ח/g, 'שקלים'],
  [/בי["״]ס/g, 'בית ספר'],
  [/קמ["״]ר/g, 'קילומטר רבוע'],
  [/מחו["״]ל/g, 'מחוץ לארץ'],
  [/וכו['׳]/g, 'וכולי'],
  [/האו["״]ם/g, 'האום'],
  [/או["״]ם/g, 'אום'],
]

const FINAL: Record<string, string> = { כ: 'ך', מ: 'ם', נ: 'ן', פ: 'ף', צ: 'ץ' }
const PREFIX_SOUND: Record<string, string> = { ב: 'בֶּ', ל: 'לֶ', מ: 'מִ', ה: 'הַ', ו: 'וְ', ש: 'שֶׁ', כ: 'כְּ' }

const HEB = 'א-ת'

export function normalizeHebrew(input: string): string {
  let s = input
  for (const [re, to] of LEXICON) s = s.replace(re, to)
  // remaining acronyms: בית"ר → ביתר, רע"מ → רעם
  s = s.replace(new RegExp(`([${HEB}]+)["״]([${HEB}])(?![${HEB}])`, 'g'), (_, a: string, b: string) => a + (FINAL[b] ?? b))
  s = s.replace(new RegExp(`([${HEB}]+)["״]([${HEB}]+)`, 'g'), '$1$2')
  // thousands separators
  s = s.replace(/(\d),(\d{3})\b/g, '$1$2')
  // scores 1:2 → אחת שתיים
  s = s.replace(/\b(\d):(\d)\b(?!\d)/g, (_, a: string, b: string) => `${UNITS_F[+a]} ${UNITS_F[+b]}`)
  // times 21:30 → עשרים ואחת ושלושים
  s = s.replace(/\b(\d{1,2}):(\d{2})\b/g, (_, h: string, m: string) => (+m ? `${heNumber(+h)} ו${heNumber(+m)}` : heNumber(+h)))
  // percent
  s = s.replace(/(\d+)\s?%/g, (_, n: string) => `${heNumber(+n)} אחוז`)
  // dates: (ב־)23 במרץ → בעשרים ושלושה במרץ (days are masculine)
  s = s.replace(new RegExp(`(^|[^${HEB}\\d])([והבלמשכ]{0,3})[־\\-]?(\\d{1,2})(\\s+ב(?:${MONTHS}))`, 'g'), (_, pre: string, px: string, d: string, rest: string) => `${pre}${px}${heNumber(+d, true)}${rest}`)
  // prefixed numbers: ב־2020 / מ־5 → words attached to the prefix
  s = s.replace(new RegExp(`(^|[^${HEB}])([והבלמשכ]{1,3})[־\\-](\\d+)`, 'g'), (_, pre: string, px: string, n: string) => `${pre}${px}${heNumber(+n)}`)
  // bare integers
  s = s.replace(/\b\d+\b/g, (n) => heNumber(+n))
  // prefix glued to a Latin word: ב־The One → בֶּ The One
  s = s.replace(new RegExp(`(^|[^${HEB}])([והבלמשכ]{1,3})[־\\-](?=[A-Za-z])`, 'g'), (_, pre: string, px: string) => pre + [...px].map((c) => PREFIX_SOUND[c] ?? c).join('') + ' ')
  // maqaf between Hebrew words reads as a join
  s = s.replace(/־/g, ' ')
  // dashes and separators → pauses
  s = s.replace(/\s*[–—]\s*/g, ', ').replace(/\s*·\s*/g, '. ')
  // quotation marks are not spoken
  s = s.replace(/["“”„״«»]/g, '').replace(/(^|\s)['‘’]/g, '$1').replace(/(?<![גזצחת])['’](\s|$)/g, '$1')
  return s.replace(/\s+([,.!?])/g, '$1').replace(/\s{2,}/g, ' ').trim()
}

/** Split into Hebrew / English runs, so English can be read by an English voice. */
export function segmentHebrew(text: string): Segment[] {
  const out: Segment[] = []
  const re = /[A-Za-z][A-Za-z0-9'’&.\- ]*[A-Za-z0-9.!?]|[A-Za-z]/g
  let last = 0
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0
    if (m[0].replace(/[^A-Za-z]/g, '').length < 2) continue
    const before = text.slice(last, i)
    if (before.trim()) out.push({ text: before.trim(), lang: 'he' })
    out.push({ text: m[0].trim(), lang: 'en' })
    last = i + m[0].length
  }
  const rest = text.slice(last)
  if (rest.trim()) out.push({ text: rest.trim(), lang: 'he' })
  // glue punctuation-only Hebrew leftovers onto neighbours
  return out.filter((seg) => /[\p{L}\p{N}]/u.test(seg.text))
}

/* ── voice quality ── */
export function voiceScore(v: SpeechSynthesisVoice): number {
  const n = v.name.toLowerCase()
  let s = 0
  if (/natural|neural/.test(n)) s += 6
  if (/premium/.test(n)) s += 5
  if (/enhanced|משופר/.test(n)) s += 4
  if (/online/.test(n)) s += 2
  if (/google/.test(n)) s += 2
  if (/siri/.test(n)) s += 3
  if (/compact|eloquence|espeak/.test(n)) s -= 3
  if (v.localService === false) s += 1
  return s
}

export const voiceTier = (v: SpeechSynthesisVoice): 'natural' | 'good' | 'basic' => {
  const s = voiceScore(v)
  return s >= 5 ? 'natural' : s >= 2 ? 'good' : 'basic'
}
