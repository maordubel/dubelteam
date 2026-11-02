import type { Block } from './content'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * The chapter body as one HTML string for the book view. Every block carries
 * data-i (its index) so pagination and read-aloud can find it in any page copy.
 */
export function blocksToHtml(blocks: Block[]): string {
  let first = true
  return blocks
    .map((b, i) => {
      if (b.kind === 'scene') return `<h2 class="scene${i === 0 ? ' scene-first' : ''}" data-i="${i}">${esc(b.text)}</h2>`
      const inner = b.runs.map((r) => (r.strong ? `<strong>${esc(r.text)}</strong>` : esc(r.text))).join('')
      const cls = first ? ' class="opener"' : ''
      first = false
      return `<p data-i="${i}"${cls}>${inner}</p>`
    })
    .join('')
}

/** Plain text per block, for read-aloud. */
export function blocksToSpeech(blocks: Block[]): string[] {
  return blocks.map((b) => (b.kind === 'scene' ? b.text.replace(/·/g, ',') : b.runs.map((r) => r.text).join('')))
}
