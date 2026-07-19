# Dubel Team — Website (v14 / 3 Israeli Service Tracks + Email migration)

Static website for Dubel Team. Hosted on any static host (Netlify, Vercel, etc.).

---

# What's new in v14

1. **VIP-IL upgraded → 3 service tracks for Israelis:**
   - Track 01 — VIP travel planning in Greece (existing)
   - Track 02 — Real estate consulting & renovation oversight (NEW) — led by Israeli partner based in Athens
   - Track 03 — Relocation support for Israelis moving to Greece (NEW)
   All gated through the same €50 / 45-min intro call.

2. **Email routing changes:**
   - Public-facing email (visible on site): `maor@dubel.team` — unchanged.
   - Form inquiries now route to `maordubel@gmail.com` (was `maor@har-tov.com`).
   - All mailto fallback buttons and JS-built emails now target `maordubel@gmail.com`.
   - All Web3Forms forms now include `<input type="hidden" name="cc" value="maordubel@gmail.com">` as a safety net.

---

# ⚠️ ONE-TIME ACTION REQUIRED on Web3Forms dashboard

The Web3Forms `access_key` (`a0f6ad4b-9a68-48c2-bb9b-d4d132e1fc24`) is bound to a **destination email on the Web3Forms server side**, not in the HTML. The HTML `cc` field copies submissions, but the *primary* destination is configured in the dashboard.

**To complete the email migration:**

1. Log in to https://web3forms.com
2. Find the access key `a0f6ad4b-9a68-48c2-bb9b-d4d132e1fc24`
3. Change the destination email from `maor@har-tov.com` → `maordubel@gmail.com`
4. (Optional but recommended) Send a test through `test-form.html` to confirm delivery.

If you can't change the destination on the existing key, generate a new access key tied to `maordubel@gmail.com` and replace it in these files:
- `contact.html` (1 occurrence)
- `events.html` (1 occurrence)
- `creators.html` (1 occurrence)
- `vip-il.html` (1 occurrence)
- `test-form.html` (1 occurrence, if not deleted)

---

# Forms — how they work

Forms POST to `https://api.web3forms.com/submit`. The `cc` field copies every submission to `maordubel@gmail.com` regardless of dashboard config — so even before you change the dashboard, you'll receive every form submission at the new address.

## Test it (before deploy)

1. Open `test-form.html` in your browser
2. Click "Send test"
3. Check `maordubel@gmail.com` within 60 seconds
4. After confirming → delete `test-form.html`

## Two-layer safety

- **Layer 1 — Web3Forms** (primary, automatic, free for 250 submissions/month). Now copies every submission to `maordubel@gmail.com` via `cc`.
- **Layer 2 — Mailto fallback** — every form has an "Or send by email" button that opens the user's mail app with all form data pre-filled, addressed to `maordubel@gmail.com`.

---

# Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      MAIN SITE (English)                        │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ index.html   │ services     │ work         │ about            │
├──────────────┼──────────────┴──────────────┴──────────────────┤
│ contact      │  Web3Forms (cc: maordubel@gmail.com) → success │
│              ├──────────────────────┬─────────────────────────┤
│              │ events.html          │ creators.html           │
└──────────────┴──────────────────────┴─────────────────────────┘

  ┌───────────────────────────────────────────────────────────┐
  │  VIP-IL (Hebrew, RTL) — 3 Service Tracks for Israelis     │
  │  ├─ Track 01: VIP travel planning                         │
  │  ├─ Track 02: Real estate (Athens-based Israeli partner)  │
  │  └─ Track 03: Relocation to Greece                        │
  │  Web3Forms (cc: maordubel@gmail.com) → success-vip.html   │
  └───────────────────────────────────────────────────────────┘
```

# File map

```
/
├── index.html              Trailer-style homepage.
├── services.html           5 service blocks.
├── work.html               4 case practices.
├── about.html              The company. Founder-led.
├── contact.html            Contact form (Web3Forms) + mailto fallback.
├── vip-il.html             ★ Hebrew RTL · 3 service tracks · €50 intro call.
├── success.html            Thank-you after contact submission.
├── success-vip.html        Thank-you after VIP-IL submission (Hebrew).
├── events.html             Private events landing page.
├── creators.html           Creator residency landing page.
├── test-form.html          ⚠️ TEST FILE — delete after confirming emails.
├── styles.css              Shared design system.
├── app.js                  Shared JS — sticky nav, mobile menu, fade-up.
├── _redirects              Netlify routing — clean URLs + subdomain mapping.
├── robots.txt              Indexing rules. Excludes vip-il and test-form.
├── README.md               This file.
└── [images]                Project photography.
```

# Deploy

Upload the entire folder to your static host. **No server configuration. No DNS changes. No environment variables.** Forms work immediately on the deployed site, and on local `file://` previews as long as you have an internet connection.

# Brand voice

The site is a **founder-led operator company**, never a personal portfolio.
- ✅ "Dubel Team is led by..."
- ✅ "Every project shaped to the client."
- ❌ "I founded businesses..."

# Mobile-first

Tuned for iOS:
- Form inputs use `font-size: 16px` (prevents iOS auto-zoom on focus)
- All tap targets ≥ 44×44px
- `viewport-fit=cover` for iPhone notch
- `prefers-reduced-motion` fully respected

# Contact

- **Public-facing email** (on site): `maor@dubel.team`
- **Form leads** (via Web3Forms cc + dashboard config): `maordubel@gmail.com`
