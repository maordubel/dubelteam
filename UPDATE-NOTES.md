# Update — Tech practice, platform marketing & the "Who's the team?" layer

Everything below is already in the files. Drop the folder into the repo (overwrite),
push, done. No build step, no new dependencies.

---

## 1. New page — `build.html` (Practice 06: Tech & Digital Builds)

The sales page for custom tech solutions for businesses and independents.

Structure, in order:

| Section | Job it does |
| --- | --- |
| Hero — *"We build the thing you keep doing by hand."* | Names the pain in the headline instead of the service |
| Stat strip — 4 live products / 0 templates / 1 operator / 15+ yrs | Turns "one person" into a selling point |
| `/01` Where it hurts | Six rhetorical questions — the reader recognises themselves |
| `/02` What we build | Four tracks: sites, apps, automation & AI, internal systems |
| `/03` How it works | Map → Scope → Build → Run. Free first call, fixed price, you own it |
| `/04` We built ours first | The four platforms as proof, live and clickable |
| `/05` Who this is for | Split: businesses / independents — both get their own language |
| `/06` Before you ask | Seven objections killed: cost, ownership, timeline, "what if you vanish" |
| Final CTA | *"Tell us what's eating your week."* |

CTAs link to `contact.html?practice=tech`, which now **preselects** the right option
in the enquiry dropdown.

**Positioning choice:** the page sells *end-to-end custom fit* — scoped, built and
maintained by the same operator — rather than a list of technologies. Every proof
point is real: four shipped products, no invented clients, no fake numbers.

## 2. New page — `platforms.html` (marketing your four projects)

TakeMeOut!, Offsides, Retzach and Dubel Art, each with its own voice:

- **TakeMeOut!** — the local-knowledge angle. Ties directly to the Team philosophy.
- **Offsides** — the argument, the banter, the streak. Football culture, not scores.
- **Retzach** — restrained and serious. Credit to the podcast hosts, emphasis on
  hand-documented verification. No sensational language, per the brief.
- **Dubel Art** — quiet, formal, no auction theatre.

Framing line: *"Nobody commissioned these."* The portfolio is public and usable —
which is a far stronger proof than a case-study PDF.

## 3. "Who's the team?" — the identity layer

A shared, reusable component, not four copy-pasted About boxes.

- **Trigger** — `<button class="team-trigger" data-team-open>`. In the footer of
  every page, plus the manifesto on `index.html` / `platforms.html` and the final
  CTA on `build.html` (*"Who actually builds this?"*).
- **Panel** — `#teamModal`, just before `<script src="app.js">`.
- **Behaviour** — `app.js`: open, close, Esc, backdrop click, focus trap, focus
  restore, scroll lock. Fully keyboard-accessible.
- **Source of truth** — the long version lives inline on `about.html` (`#team`).
  The modal is the short version.

Copy rule held throughout: one operator, a real network, **no invented people, no
fake credentials, no implied employees.** The line the whole thing hangs on:

> We don't know everything. We know people who do.

## 4. Changes to existing pages

- **`index.html`** — sixth practice tile (dark, flagged "New") → `build.html`.
  Grid is now 3 × 2 on desktop, 2-up on tablet, stacked on mobile. Platforms
  section rebuilt: four cards including Retzach, an intro line, and a footer
  strip that turns the products into a pitch (*"These are the portfolio"*) with
  **Inside the platforms** / **Build mine** buttons. Ticker gained a build line.
- **`services.html`** — Practice 06 added; "Five practices" → "Six" everywhere;
  title and meta description updated.
- **`about.html`** — full Team band added; a paragraph on how the tech practice
  grew out of the operating work.
- **`contact.html`** — "Tech & Digital Builds" option added to the dropdown +
  `?practice=` preselect script.
- **Every page** — nav gained **Build**; footer gained **Build**, **Platforms**,
  **Retzach ↗** and the Team trigger.
- **`styles.css`** — new shared components appended (team layer, build page,
  platforms page). Nothing existing was removed.
- **`sitemap.xml`, `README.md`** — updated.

## 5. Checked before handover

Rendered every page at 1440px and 390px in a real browser: no horizontal overflow,
no JavaScript errors, no broken internal links or anchors, modal opens/closes by
click, backdrop and Esc. Reduced-motion rules still apply.
