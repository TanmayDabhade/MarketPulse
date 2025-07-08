# 🧠 PRD — MarketPulse (for Cursor AI Build)

**Name:** MarketPulse
**Type:** SaaS Web App
**Stack:** Cursor (Next.js + Tailwind + Shadcn), Clerk, Supabase, Stripe
**Goal:** Launch MVP in 24h, monetize within 7d, hit \$1K MRR fast.

---

## 🎯 Problem

Retail investors and creators waste time scraping financial info from multiple tools. Bloomberg is expensive, Finviz is outdated, and AI is missing. They want a clean, AI-enhanced dashboard that gives **actionable, real-time analysis** for any stock — in one click.

---

## 🚀 Core Value Prop (MVP)

> Enter a stock ticker → Get a full, interactive report with:

* Technical analysis (charts + indicators)
* Fundamentals (valuation, growth, financials)
* News + sentiment (Reddit/Twitter/NewsAI)
* SEC filing summaries
* AI Buy/Hold/Sell recommendation with reasoning

---

## 🧩 Feature Scope — MVP in 24h

### 1. **Auth & User Access**

* Clerk.dev for signup/login
* Store user + subscription status in Supabase
* Free Tier: 3 stock reports/day
* Pro Tier: Unlimited reports + AI insights

### 2. **Search Page**

**Route:** `/report/[ticker]`
**User Action:** Enter ticker → see 5 auto-loaded sections

#### 🧱 Section Components:

| Component          | Source/API                 | UI Output                         |
| ------------------ | -------------------------- | --------------------------------- |
| `Technical.tsx`    | Yahoo Finance / Polygon.io | Candlestick + RSI/SMA/Vol chart   |
| `Fundamentals.tsx` | Yahoo / Alpha Vantage      | Valuation, margins, ratios table  |
| `Sentiment.tsx`    | NewsAPI + OpenAI           | Top 3 headlines + AI sentiment    |
| `SEC.tsx`          | SEC EDGAR API + OpenAI     | Recent filing summary (AI)        |
| `Summary.tsx`      | GPT-4 / Gemini             | Buy/Hold/Sell + 3-point reasoning |

---

### 3. **Payments via Stripe**

* Use Stripe Checkout for subscription
* Store `stripe_customer_id`, `subscription_status` in Supabase
* Free users blocked after 3 reports/day
* Paid users = unlimited + full AI summaries

---

## 🛠 Cursor-Friendly Stack

| Layer    | Tool                                 |
| -------- | ------------------------------------ |
| UI       | Cursor (Next.js + Tailwind + Shadcn) |
| Auth     | Clerk                                |
| DB       | Supabase                             |
| Payments | Stripe Checkout + Webhooks           |
| LLMs     | OpenAI GPT-4 or Gemini Pro           |
| APIs     | Yahoo Finance, NewsAPI, SEC.gov      |
| Charts   | TradingView Widget                   |
| Hosting  | Vercel                               |

---

## 🧪 Cursor AI Coding Prompts (Use in Cursor sidebar)

**Prompt 1 – Layout Scaffold**

> Build a clean, dark-themed layout using Shadcn UI with a top nav (Login, Upgrade), sidebar (Dashboard, Search), and main content view for stock report sections.

**Prompt 2 – Auth & Gating**

> Implement Clerk login/signup and gate `/report/[ticker]` route. Limit free users to 3 views/day using Supabase row count logic.

**Prompt 3 – Ticker Route**

> On `/report/[ticker]`, fetch and display sections: Technicals, Fundamentals, Sentiment, SEC, Summary. Fetch in parallel, show skeletons while loading.

**Prompt 4 – Stripe Integration**

> Implement `/api/create-checkout-session` for Pro plan. On success, update `subscriptions` table in Supabase. Add webhooks for subscription lifecycle.

**Prompt 5 – AI Summary**

> Use GPT-4 to summarize ticker report into Buy/Hold/Sell rating. Use system prompt to consider valuation, sentiment, technical trends, and risks.

---

## 📦 Database Schema (Supabase)

### `users`

```sql
id UUID (Clerk)
email TEXT
created_at TIMESTAMP
```

### `reports`

```sql
id UUID
user_id UUID
ticker TEXT
created_at TIMESTAMP
ai_summary TEXT
sentiment_score FLOAT
fundamentals JSONB
technicals JSONB
sec_summary TEXT
```

### `subscriptions`

```sql
id UUID
user_id UUID
stripe_customer_id TEXT
status TEXT
created_at TIMESTAMP
```

---

## 💸 Monetization Plan (0 → \$1K MRR in 1 Week)

| Day | Action                                              |
| --- | --------------------------------------------------- |
| 1   | MVP live on Vercel (landing + report page + Stripe) |
| 2   | Add Stripe + Upgrade button + limit free usage      |
| 3   | Post to Reddit (r/stocks, r/Finance), Indie Hackers |
| 4   | DM 50 creators/finance newsletters on Twitter/X     |
| 5   | Offer \$9 lifetime deal to first 20 users           |
| 6   | Add viral loop (share report → watermark link)      |
| 7   | Convert 25 users at \$9/mo → \$225 MRR base         |

**Goal:** 100 Pro users × \$10 = **\$1,000 MRR**
Secondary revenue: Finance influencers, whitelabel dashboards

---

## 🧠 AI Prompts for GPT-4 Summary

```plaintext
You are a stock analyst. A user entered ticker: TSLA.
Here are the sections:
- Valuation: P/E 90, P/S 12, ROE 20%
- Technicals: RSI 72 (overbought), MACD crossover bearish
- Sentiment: Neutral from news, positive on Reddit
- SEC: No red flags in latest 10-K

Output a rating (Buy/Hold/Sell) with 3 bullet points explaining why.
```

---

## 🖼 UI Pages

| Route              | Purpose                           |
| ------------------ | --------------------------------- |
| `/`                | Hero, features, CTA, demo ticker  |
| `/dashboard`       | User history, subscription status |
| `/report/[ticker]` | Main experience (stock report)    |
| `/api/checkout`    | Stripe session handler            |
| `/api/webhook`     | Stripe → Supabase sync            |

---

## ✅ Deliverables Today (MVP Completion List)

* [ ] Clerk setup + login/signup
* [ ] Supabase schema + report writes
* [ ] `/report/[ticker]` page with all 5 sections
* [ ] Free/pro user gating (limit)
* [ ] Stripe payment flow
* [ ] AI summaries via OpenAI or Gemini
* [ ] Vercel deployment + Stripe live keys


