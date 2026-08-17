# Dubel Team — Main Website (dubelteam.com)

Static site for **Dubel Team**, deployed on **GitHub Pages** at `www.dubelteam.com`.
No build step, no framework — plain HTML/CSS/JS. Push to the repo and GitHub Pages serves it.

---

## Structure

```
/
├── index.html            Homepage (routing hub + work preview).
├── services.html         The six practices.
├── build.html            Practice 06 — custom tech solutions (sales page).
├── platforms.html        The four in-house products (TakeMeOut!, Offsides, Retzach, Dubel Art).
├── work.html             Case studies (ARTHINA, hospitality, Hapoel B.C.).
├── about.html            The company. Founder-led.
├── contact.html          Contact form (Web3Forms) + mailto fallback → success.html
├── success.html          Thank-you page after a form submission.
├── events.html           Private events landing page (self-contained styles).
├── creators.html         The Muse Residency landing page (self-contained styles).
├── 404.html              Custom not-found page.
├── styles.css            Shared design system (index/services/work/about/contact/success).
├── app.js                Shared JS — sticky nav, mobile menu, fade-up, stat counters.
├── CNAME                 GitHub Pages custom domain → dubelteam.com
├── .nojekyll             Serve files as-is (disables Jekyll).
├── robots.txt            Indexing rules + sitemap link.
├── sitemap.xml           Public URLs for search engines.
├── _redirects            INERT on GitHub Pages (Netlify-only). Kept for reference.
├── hapoel-bc-campaign.svg  On-brand placeholder for the Hapoel case image.
└── [images]              Project photography (arthina-*, hosp-*, logo, favicon).
```

Note: `events.html` and `creators.html` keep their own inline `<style>` blocks (they
were built self-contained). Every other page shares `styles.css` + `app.js`.

---

## Subdomains (separate deployments)

The four apps are hosted **separately** and pointed at subdomains via DNS:

- `takemeout.dubelteam.com`
- `offsides.dubelteam.com`
- `retzach.dubelteam.com`
- `art.dubelteam.com`

They are linked from the footer of every page, marketed on `platforms.html`, and used
as proof on `build.html`. They are **not** part of this repo — each has its own
deployment. See the DNS guide handed over with this update.

---

## "Who's the team?" identity layer

A shared component, present on every page that uses `styles.css`:

- **Trigger** — `<button class="team-trigger" data-team-open>` (any number per page).
  Currently in the footer of every page, plus the manifesto on `index.html` /
  `platforms.html` and the final CTA on `build.html`.
- **Panel** — the `#teamModal` block just before `<script src="app.js">`.
- **Behaviour** — in `app.js`: open/close, Esc, backdrop click, focus trap,
  focus restore, body scroll lock.
- **Source of truth** — the full version lives inline on `about.html` (`#team`,
  `.team-band`). The modal is the short version.

Copy rule: one operator, real network, never invented people, never fake credentials.

---

## Forms

`contact.html`, `events.html` and `creators.html` POST to Web3Forms
(`https://api.web3forms.com/submit`). Every form includes
`cc = maordubel@gmail.com`, so submissions arrive there regardless of the
Web3Forms dashboard setting. On success the browser is redirected to
`https://www.dubelteam.com/success.html`.

Access key: `a0f6ad4b-9a68-48c2-bb9b-d4d132e1fc24`

**Email note:** all contact — form submissions (via `cc`) and every `mailto:`
link — routes to `maordubel@gmail.com`. To make Gmail the *primary* Web3Forms
recipient too (not just the cc), set the destination on the Web3Forms dashboard
for access key `a0f6ad4b-9a68-48c2-bb9b-d4d132e1fc24`.

---

## Deploy (GitHub Pages)

1. Push all files to the repository (root of the branch you publish from).
2. Repo → **Settings → Pages** → Source: `Deploy from a branch` → `main` / `(root)`.
3. Under **Custom domain**, enter `www.dubelteam.com` (the `CNAME` file already sets this).
4. Point DNS at GitHub Pages (see the DNS guide).
5. Enable **Enforce HTTPS** once the certificate is issued.

Always link internal pages with the `.html` extension — GitHub Pages does not
rewrite clean URLs.

## Brand voice

Founder-led operator company — never a personal portfolio.
- "Dubel Team is led by..." / "Every project shaped to the client." — yes.
- "I founded businesses..." — no.
