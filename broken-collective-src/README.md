# Broken Collective · קולקטיב שבור

The online edition of Maor Harel's novel — free to read in Hebrew and English, one season at a time.

- **Stack:** Next.js (static export) · TypeScript · Tailwind CSS v4 · self-hosted fonts (Karantina, Frank Ruhl Libre, Literata)
- **Hosting:** Vercel → `brokencollective.dubelteam.com`; `dubelteam.com/broken-collective/` redirects here
- **Content:** `content/{he,en}/` — one Markdown file per chapter. `## ` starts a scene (date · place).

## Publishing the next season
1. Add `content/he/2021/01.md…` and `content/en/2021/01.md…` (same front-matter as 2020).
2. In `src/lib/book.ts`, set the season's `status` to `'published'` and map its chapter illustrations in `CHAPTER_ART`.
3. Commit — Vercel rebuilds automatically.

## Design
Concept: a printed book cracked down the middle, mended with one red thread. Risograph territory: two inks (ink + sea) on warm paper, one accent (thread red). All colours are tokens in `src/styles/globals.css`; illustrations are original SVG in `src/components/Illustrations.tsx`.

Built by [Dubel Team](https://DubelTeam.com).
