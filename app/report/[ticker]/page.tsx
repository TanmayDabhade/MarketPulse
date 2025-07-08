import { Suspense } from 'react'
import { Navigation } from '@/components/navigation'
import { Technical } from '@/components/stock/technical'
import { Fundamentals } from '@/components/stock/fundamentals'
import { Sentiment } from '@/components/stock/sentiment'
import { SEC } from '@/components/stock/sec'
import { Summary } from '@/components/stock/summary'
import { StockSearch } from '@/components/stock-search'
import { 
  getStockData, 
  getTechnicalData, 
  getSentimentData, 
  getSECData, 
  generateAISummary
} from '@/lib/api'

interface ReportPageProps {
  params: Promise<{
    ticker: string
  }>
}

async function StockReport({ ticker }: { ticker: string }) {
  // Fetch all data in parallel
  const [stockData, technicalData, sentimentData, secData] = await Promise.all([
    getStockData(ticker),
    getTechnicalData(ticker),
    getSentimentData(ticker),
    getSECData(ticker),
  ])

  // Generate AI summary
  const aiSummary = await generateAISummary(
    ticker,
    stockData,
    technicalData,
    sentimentData,
    secData
  )

  // Check if Clerk is configured
  const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'your_clerk_publishable_key';

  // Save report to database only if Clerk is configured
  if (isClerkConfigured) {
    try {
      const { auth, currentUser } = await import('@clerk/nextjs/server')
      const { userId } = await auth()
      if (userId) {
        const user = await currentUser()
        const { createReport } = await import('@/lib/db')
        await createReport({
          user_id: userId,
          ticker: ticker.toUpperCase(),
          sentiment_score: sentimentData.score,
          fundamentals: stockData,
          technicals: technicalData,
          sec_summary: secData.latestFiling.summary,
          ai_summary: aiSummary,
        }, user?.emailAddresses?.[0]?.emailAddress)
        console.log(`Report saved for ${ticker} by user ${userId}`)
      } else {
        console.log('User not authenticated - skipping database save')
      }
    } catch (error) {
      console.error('Error saving report to database:', error)
    }
  } else {
    console.log('Clerk not configured - skipping database save')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Technical data={technicalData} ticker={ticker} />
      <Fundamentals data={stockData} />
      <Sentiment data={sentimentData} />
      <SEC data={secData} ticker={ticker} />
      <div className="lg:col-span-2">
        <Summary summary={aiSummary} ticker={ticker} />
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white/10 border border-white/20 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-white/20 rounded"></div>
              <div className="h-4 bg-white/20 rounded w-5/6"></div>
              <div className="h-4 bg-white/20 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { ticker } = await params
  const upperTicker = ticker.toUpperCase()

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stock Selection Interface */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Stock Analysis
          </h1>
          {/* Search Bar */}
          <div className="mb-6">
            <StockSearch />
          </div>
          {/* Current Stock Analysis */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {upperTicker} Analysis
            </h2>
            <p className="text-white/60">
              Comprehensive AI-powered analysis including technical indicators, fundamentals, sentiment, and SEC filings.
            </p>
            {(!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 
              process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'your_clerk_publishable_key') && (
              <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-lg">
                <p className="text-white/80 text-sm">
                  🚀 Demo Mode: This is a preview. Add Clerk authentication to save reports and access the full dashboard.
                </p>
              </div>
            )}
          </div>
        </div>
        <Suspense fallback={<LoadingSkeleton />}>
          <StockReport ticker={upperTicker} />
        </Suspense>
      </main>
    </div>
  )
} 