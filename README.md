# MarketPulse - AI-Powered Stock Analysis

MarketPulse is a comprehensive SaaS platform that provides AI-enhanced stock analysis with technical indicators, fundamentals, sentiment analysis, and SEC filing summaries.

## 🚀 Features

- **Technical Analysis**: RSI, MACD, moving averages, support/resistance levels
- **Fundamentals**: P/E ratios, valuation metrics, growth indicators
- **Market Sentiment**: News sentiment, social media analysis
- **SEC Filings**: AI-powered summaries of regulatory documents
- **AI Recommendations**: Gemini Pro powered Buy/Hold/Sell recommendations
- **User Management**: Authentication with Clerk, subscription tiers
- **Payment Processing**: Stripe integration for Pro subscriptions

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **AI**: Google Gemini Pro
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd market-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with the following variables:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Supabase Database
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stripe Payments
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase Database**
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY,
     email TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Subscriptions table
   CREATE TABLE subscriptions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     stripe_customer_id TEXT NOT NULL,
     status TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Reports table
   CREATE TABLE reports (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     ticker TEXT NOT NULL,
     sentiment_score FLOAT NOT NULL,
     fundamentals JSONB,
     technicals JSONB,
     sec_summary TEXT,
     ai_summary TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

   -- RLS Policies
   CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
   CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

   CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid()::text = user_id::text);
   CREATE POLICY "Users can insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
   CREATE POLICY "Users can update own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid()::text = user_id::text);

   CREATE POLICY "Users can view own reports" ON reports FOR SELECT USING (auth.uid()::text = user_id::text);
   CREATE POLICY "Users can insert own reports" ON reports FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
   ```

5. **Set up Clerk Authentication**
   - Create a Clerk account and application
   - Configure your domain and redirect URLs
   - Add the Clerk keys to your environment variables

6. **Set up Stripe**
   - Create a Stripe account
   - Get your API keys
   - Set up webhook endpoints for subscription events
   - Add the Stripe keys to your environment variables

7. **Set up Google Gemini**
   - Get a Gemini API key from Google AI Studio
   - Add it to your environment variables

8. **Run the development server**
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

```
market-pulse/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── report/[ticker]/   # Stock report pages
│   ├── upgrade/           # Upgrade page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── stock/            # Stock analysis components
│   ├── navigation.tsx    # Main navigation
│   └── stock-search.tsx  # Stock search component
├── lib/                  # Utility functions
│   ├── api.ts           # Stock data API functions
│   ├── db.ts            # Database utilities
│   ├── stripe.ts        # Stripe configuration
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # General utilities
└── public/              # Static assets
```

## 🎯 Key Components

### Stock Analysis Components
- **Technical**: RSI, MACD, moving averages, support/resistance
- **Fundamentals**: Valuation metrics, financial ratios
- **Sentiment**: News sentiment, social media analysis
- **SEC**: Filing summaries and risk analysis
- **Summary**: AI-powered Buy/Hold/Sell recommendations

### Authentication & Payments
- **Clerk Integration**: User authentication and management
- **Stripe Integration**: Subscription payments and webhooks
- **Supabase**: User data, subscriptions, and reports storage

## 🚀 Deployment

1. **Deploy to Vercel**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Configure environment variables** in your Vercel dashboard

3. **Set up webhooks** for Stripe and Clerk

## 📊 Usage

1. **Sign up/Login** using Clerk authentication
2. **Search for stocks** using the search bar
3. **View comprehensive analysis** including:
   - Technical indicators
   - Fundamental metrics
   - Market sentiment
   - SEC filing summaries
   - AI recommendations
4. **Upgrade to Pro** for unlimited reports and advanced features

## 🔧 Development

- **Free Tier**: 3 reports per day
- **Pro Tier**: Unlimited reports, advanced AI insights, SEC analysis
- **Mock Data**: Currently uses mock data for demonstration
- **Real APIs**: Ready for integration with real financial APIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

