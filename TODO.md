# TODO — Landing & Flows (next session)

## 🔧 Buttons to (re)wire on the landing page (pages/index.js)
- [ ] **Get the Tracker app** (top nav): scroll/jump to Pricing section
- [ ] **Start for free**: start **free sign-up** and begin **7-day trial**
- [ ] **See How It Works**: open/scroll to the demo section (we’ll add the demo component)
- [ ] **Lite Template – Notion**: send to a **paywalled** Notion template (create template + gated link)
- [ ] **Lite Template – Google Sheets**: send to a **paywalled** Google Sheet (create template + gated link)
- [ ] **Launch the Web app**: same as **Start for free** (free sign-up + 7-day trial)
- [ ] **Compare plans**: scroll/jump to Pricing section
- [ ] Ensure all pricing CTAs use `/api/create-checkout-session` with correct `priceId`

## 🧪 7-day free trial plan
- [ ] **Option A (Stripe-native)**: set `trial_period_days: 7` on the **Monthly** price in Stripe (preferred)
- [ ] **Option B (app-managed)**: create `profiles.trial_started_at` + `trial_ends_at`, guard premium routes until end, switch to paid upon successful checkout

## 💸 Templates paywall
- [ ] Create Stripe **one-time** price(s) for templates
- [ ] Add `/api/template-license` to verify purchase → return gated Notion/Sheets URLs
- [ ] Simple UI on landing: “Unlock Notion” / “Unlock Sheets” → Stripe → redirect back → unlock link

## 📅 Calendar + 🧾 Tax (follow-ups)
- [ ] Calendar day modal: verify both **income** and **expenses** are listed and totals match dashboard
- [ ] Tax Planning: double-check calculations mirror dashboard/net profit; confirm estimates visible and consistent

## 📄 Export PDF
- [ ] Allow user to **select sections** (Income / Expenses / Brand Deals / Tax Summary / Calendar snapshot)
- [ ] Implement export (client-side print-to-PDF or html2pdf); ensure it matches the UI styling

## 🔄 Plan realtime
- [ ] Re-check profiles **Realtime** subscription works on `/app` (no manual refresh after Stripe webhook)
- [ ] Keep polling fallback (already added) for resilience

## ✅ Prod readiness checklist (later)
- [ ] Vercel (Production) env vars set (Supabase, Stripe keys, webhook secret, `NEXT_PUBLIC_SITE_URL`)
- [ ] Stripe Dashboard webhook points to `/api/stripe-webhook` (prod), secret matches Vercel
- [ ] Supabase Auth → Redirect URLs include production callback
- [ ] Full test checkout (subscription + lifetime); plan flips to `premium` automatically

## Notes / state
- Landing page restored (hero, features, pricing, FAQ)
- Pricing buttons now call `/api/create-checkout-session` via `landingCheckout` helpers
- **Lifetime** pricing button fixed to open lifetime checkout
- App `/app/flow` UI: income/expenses/brand deals CRUD with Supabase persistence
- Edits & deletes now persist; refresh returns to last active tab (stored)
- Brand deal "Paid" → moves to Income + recalculations updated
