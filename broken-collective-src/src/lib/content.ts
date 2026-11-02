import fs from 'node:fs'
import path from 'node:path'
import { SEASONS, type Lang } from './book'

/** A parsed block of chapter text. The manuscript uses a deliberately tiny Markdown subset. */
export type Block =
  | { kind: 'scene'; text: string; id: string }
  | { kind: 'p'; runs: Run[] }

export type Run = { text: string; strong?: boolean }

export type ChapterDoc = {
  id: string
  title: string
  kicker?: string
  season?: number
  number?: number
  blocks: Block[]
  words: number
}

const CONTENT_DIR = path.join(process.cwd(), 'content')

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { meta: {}, body: raw }
  const meta: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: raw.slice(match[0].length) }
}

function parseRuns(text: string): Run[] {
  const runs: Run[] = []
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  for (const part of parts) {
    if (!part) continue
    if (part.startsWith('**') && part.endsWith('**')) runs.push({ text: part.slice(2, -2), strong: true })
    else runs.push({ text: part })
  }
  return runs
}

function parseBody(body: string): Block[] {
  const blocks: Block[] = []
  let scene = 0
  for (const chunk of body.split(/\n{2,}/)) {
    const text = chunk.trim()
    if (!text) continue
    if (text.startsWith('## ')) {
      scene += 1
      blocks.push({ kind: 'scene', text: text.slice(3).trim(), id: `scene-${scene}` })
    } else {
      blocks.push({ kind: 'p', runs: parseRuns(text.replace(/\n/g, ' ')) })
    }
  }
  return blocks
}

function countWords(blocks: Block[]): number {
  let n = 0
  for (const b of blocks) {
    const t = b.kind === 'p' ? b.runs.map((r) => r.text).join('') : b.text
    n += t.split(/\s+/).filter(Boolean).length
  }
  return n
}

function load(file: string): ChapterDoc {
  const raw = fs.readFileSync(file, 'utf8')
  const { meta, body } = parseFrontmatter(raw)
  const blocks = parseBody(body)
  return {
    id: meta.id ?? path.basename(file, '.md'),
    title: meta.title ?? '',
    kicker: meta.kicker,
    season: meta.season ? Number(meta.season) : undefined,
    number: meta.number ? Number(meta.number) : undefined,
    blocks,
    words: countWords(blocks),
  }
}

export function getPrologue(lang: Lang): ChapterDoc {
  return load(path.join(CONTENT_DIR, lang, '00-intro.md'))
}

export function getChapter(lang: Lang, season: number, number: number): ChapterDoc {
  const file = path.join(CONTENT_DIR, lang, String(season), `${String(number).padStart(2, '0')}.md`)
  return load(file)
}

/** Chapter list for a published season, read from disk so adding a file publishes it. */
export function getSeasonChapters(lang: Lang, season: number): ChapterDoc[] {
  const dir = path.join(CONTENT_DIR, lang, String(season))
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{2}\.md$/.test(f))
    .sort()
    .map((f) => load(path.join(dir, f)))
}

export function publishedSeasons(): number[] {
  return SEASONS.filter((s) => s.status === 'published').map((s) => s.year)
}

/** Reading time at ~200 words/min (Hebrew words are denser, so the same rate works for both). */
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200))
}
