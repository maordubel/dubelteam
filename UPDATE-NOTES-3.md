# Update 3 — "We turn ideas into reality" positioning + the product portfolio

Nothing was removed. Every existing service, practice, page, anchor and link is still
in place; this update reframes them and adds what was missing.

## 1. The positioning

Dubel Team is now presented as one company that takes an idea from concept to
execution — strategy, operations, creativity, technology, AI and execution — rather
than as an operator company with a tech practice bolted on.

- **Homepage hero:** "WE TURN IDEAS / ~~INTO DECKS.~~ / INTO REALITY."
- **Pipeline strip** (`.pipeline`) on `index.html`, `services.html`, `build.html`:
  Idea → Strategy → Product → Technology & AI → Launch → Operation.
- Tickers, titles and meta descriptions rewritten across the site to match.

## 2. Four capabilities, six practices — nothing dropped

The six practices are unchanged and still live at the same anchors. They are now
grouped:

| Capability | Practices (all pre-existing) |
| --- | --- |
| 01 Strategy | `#strategy` Brand & Strategy — **added** partnerships, business development |
| 02 Operations | `#hospitality` (+ guest experience), `#events`, `#sports` |
| 03 Markets | `#greece` — **added** local partnerships, EU expansion, market activation |
| 04 Build | `#tech` — renamed "Build — Product, Technology & AI" and expanded |

- `index.html` — each practice tile carries a capability chip (`.pt-group`) plus a
  legend row. Grid, links and anchors untouched.
- `services.html` — four group dividers (`.svc-group`) above the existing service
  blocks. No service block was edited except to add bullets.

## 3. BUILD

- New dark band on `index.html` (`#build`) — **BUILD / Ideas into reality /
  "We don't just advise. We build."** — with the five ways a project starts (rough
  idea · business problem · a business that needs automating · app or product idea ·
  AI concept) and the full capability list.
- The same band opens `build.html` as section /00, and the hero became
  **"BUILD. Ideas into reality."**
- `build.html` /02 gained two tracks: **05 AI Inside the Business** (integration,
  agents & assistants, intelligent workflows, custom AI systems) and **06 New
  Products & MVPs** (product development, prototypes, AI-powered products, launch).
- AI is positioned as a capability inside BUILD, never as the company's headline.
  No "AI consulting" / "AI transformation" / "cutting-edge AI" language anywhere.

## 4. The product portfolio — WE BUILD PRODUCTS

Two products were missing from the site entirely: **Dubid** and **Fuck You**.
Both are now first-class entries. All six in-house products appear on:

- `index.html` — new `#products` section, "WE BUILD **products.**", six cards with
  preview graphic, name, one-line pitch, description, live URL and CTA.
- `platforms.html` — now the full portfolio page ("BUILT BY **Dubel Team.**"),
  six long-form entries with previews. Filename kept so old links still work; the
  nav and footer label it **Products**.
- `build.html` /04 proof grid and `work.html` chapter /04 — both extended to six.

| Product | URL | What it is |
| --- | --- | --- |
| Offsides | offsides.dubelteam.com | Daily offside call — scoring, streaks, PWA |
| TakeMeOut! | takemeout.dubelteam.com | Three complete Athens day plans in ~30 seconds |
| Dubid | dubid.dubelteam.com | Israeli-league fantasy football, one player per club, captain ×3, Hebrew RTL |
| Retzach | retzach.dubelteam.com | Hebrew true-crime case archive, hand-verified |
| Fuck You | fuckyou.dubelteam.com | Anonymous public wall — "Say it. Don't send it." |
| Dubel Art | art.dubelteam.com | Private-sale catalogue, modern & contemporary |

**Copy for Dubid and Fuck You was written from the live sites**, not invented —
worth a read-through before pushing in case anything has changed since.

**Previews:** the live products could not be screenshotted from this environment, so
each card uses an original on-brand SVG motif (`prod-*.svg`) rather than a fake UI
screenshot. Drop in real screenshots later by replacing those six files — the markup
and sizing stay the same.

**Naming note:** "Fuck You" is used in full in on-page copy (it is the product name),
but is kept out of `<title>` and `<meta description>` on every page — the site carries
AdSense.

## 5. New CTA — HAVE AN IDEA?

- `index.html` final section replaced with `.idea-cta`:
  *"You don't need a business plan. You don't need a technical team. You don't even
  need to know exactly what you're building. Bring us the idea. We'll figure out what
  comes next."* → **Tell us the idea →** (the "Meet the founder" button was kept).
- Same framing closes `services.html`, `build.html` and `platforms.html`.
- `contact.html` — new first dropdown option **"I have an idea — not sure what it is
  yet"**, reachable as `contact.html?practice=idea`, which every new CTA links to.
  The old `?practice=tech` links still work.

## 6. Navigation

- **Products** added to the main nav on every shared-CSS page (between Build and
  Work) → `platforms.html`. Nothing was removed from the nav.
- Footer product strip now lists all six apps ("Built by us:").

## 7. Design

No redesign. The existing palette, typography, tickers, tiles, animations and
reduced-motion rules are untouched; the new components (`.pipeline`, `.pt-group`,
`.svc-group`, `.build-band`, `.prod-card`, `.idea-cta`) were appended to the end of
`styles.css` and reuse the existing tokens. Separate desktop and mobile layouts at
1180 / 980 / 860 / 400px.
