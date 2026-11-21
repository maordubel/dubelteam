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

/* ── acronyms, abbreviations & vocalised words (niqqud) ── */
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
  // Add any book-specific names or ambiguous words with niqqud here:
  [/(?<![א-ת])שאטי(?![א-ת])/g, 'שָׁאטִי'],
  [/(?<![א-ת])יפו(?![א-ת])/g, 'יָפוֹ'],
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
  // prefixed numbers: ב־2020 /
