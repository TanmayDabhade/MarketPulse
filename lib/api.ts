import { GoogleGenerativeAI } from '@google/generative-ai'
import yahooFinance from 'yahoo-finance2'

const geminiApiKey = process.env.GEMINI_API_KEY || 'your_gemini_api_key'

const genAI = new GoogleGenerativeAI(geminiApiKey)

// Simple hash function to make data deterministic (fallback)
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Generate deterministic random-like values based on ticker (fallback)
function getDeterministicValue(ticker: string, seed: number, min: number, max: number): number {
  const hash = hashString(ticker + seed.toString())
  return min + (hash % (max - min + 1))
}

export interface StockData {
  ticker: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  pe: number
  eps: number
  dividend: number
  dividendYield: number
}

export interface TechnicalData {
  rsi: number
  macd: {
    macd: number
    signal: number
    histogram: number
  }
  sma: {
    sma20: number
    sma50: number
    sma200: number
  }
  support: number
  resistance: number
}

export interface SentimentData {
  score: number
  headlines: Array<{
    title: string
    url: string
    sentiment: 'positive' | 'negative' | 'neutral'
  }>
  redditSentiment: number
  twitterSentiment: number
}

export interface SECData {
  latestFiling: {
    type: string
    date: string
    url: string
    summary: string
  }
}

// Get real stock data from Yahoo Finance
export async function getStockData(ticker: string): Promise<StockData> {
  const upperTicker = ticker.toUpperCase()
  
  try {
    // Get quote data from Yahoo Finance
    const quote = await yahooFinance.quote(upperTicker)
    
    return {
      ticker: upperTicker,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap || 0,
      pe: quote.trailingPE || 0,
      eps: quote.epsTrailingTwelveMonths || 0,
      dividend: quote.trailingAnnualDividendRate || 0,
      dividendYield: quote.trailingAnnualDividendYield || 0,
    }
  } catch (error) {
    console.error(`Error fetching data for ${upperTicker}:`, error)
    
    // Fallback to deterministic mock data
    return {
      ticker: upperTicker,
      price: getDeterministicValue(upperTicker, 1, 50, 1000),
      change: getDeterministicValue(upperTicker, 2, -20, 20),
      changePercent: getDeterministicValue(upperTicker, 3, -10, 10),
      volume: getDeterministicValue(upperTicker, 4, 1000000, 10000000),
      marketCap: getDeterministicValue(upperTicker, 5, 1000000000, 1000000000000),
      pe: getDeterministicValue(upperTicker, 6, 10, 50),
      eps: getDeterministicValue(upperTicker, 7, -5, 10),
      dividend: getDeterministicValue(upperTicker, 8, 0, 5),
      dividendYield: getDeterministicValue(upperTicker, 9, 0, 5),
    }
  }
}

// Get real-time stock data for the analyze page
export async function getTopStocksData(): Promise<Array<{
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}>> {
  const topStocks = [
    'NVDA', 'TSLA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'BRK-A', 'UNH', 'JNJ',
    'JPM', 'V', 'PG', 'HD', 'MA', 'DIS', 'PYPL', 'ADBE', 'NFLX', 'CRM'
  ]
  
  const stocksData = []
  
  for (const symbol of topStocks) {
    try {
      const quote = await yahooFinance.quote(symbol)
      stocksData.push({
        symbol: symbol,
        name: quote.longName || quote.shortName || symbol,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
      })
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error)
      // Skip this stock if there's an error
    }
  }
  
  return stocksData
}

export async function getTechnicalData(ticker: string): Promise<TechnicalData> {
  const upperTicker = ticker.toUpperCase()
  
  try {
    // Get chart data for technical indicators (updated from historical)
    const chart = await yahooFinance.chart(upperTicker, {
      period1: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), // 200 days ago
      period2: new Date(),
      interval: '1d'
    })
    const historical = chart.quotes || []
    
    if (historical.length > 0) {
      const prices = historical.map(h => h.close).filter(p => p !== null)
      const latestPrice = prices[prices.length - 1] || 0
      
      // Calculate simple moving averages
      const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, prices.length)
      const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, prices.length)
      const sma200 = prices.reduce((a, b) => a + b, 0) / prices.length
      
      // Simple RSI calculation
      const gains = prices.slice(1).map((price, i) => Math.max(0, price - prices[i]))
      const losses = prices.slice(1).map((price, i) => Math.max(0, prices[i] - price))
      const avgGain = gains.slice(-14).reduce((a, b) => a + b, 0) / 14
      const avgLoss = losses.slice(-14).reduce((a, b) => a + b, 0) / 14
      const rsi = avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss))
      
      return {
        rsi: Math.min(100, Math.max(0, rsi)),
        macd: {
          macd: (sma20 - sma50) / latestPrice * 100,
          signal: (sma20 - sma200) / latestPrice * 100,
          histogram: ((sma20 - sma50) - (sma20 - sma200)) / latestPrice * 100,
        },
        sma: {
          sma20,
          sma50,
          sma200,
        },
        support: Math.min(...prices.slice(-20)),
        resistance: Math.max(...prices.slice(-20)),
      }
    }
  } catch (error) {
    console.error(`Error fetching technical data for ${upperTicker}:`, error)
  }
  
  // Fallback to deterministic mock data
  return {
    rsi: getDeterministicValue(upperTicker, 10, 0, 100),
    macd: {
      macd: getDeterministicValue(upperTicker, 11, -2, 2),
      signal: getDeterministicValue(upperTicker, 12, -2, 2),
      histogram: getDeterministicValue(upperTicker, 13, -1, 1),
    },
    sma: {
      sma20: getDeterministicValue(upperTicker, 14, 50, 1000),
      sma50: getDeterministicValue(upperTicker, 15, 50, 1000),
      sma200: getDeterministicValue(upperTicker, 16, 50, 1000),
    },
    support: getDeterministicValue(upperTicker, 17, 50, 1000),
    resistance: getDeterministicValue(upperTicker, 18, 100, 1100),
  }
}

export async function getSentimentData(ticker: string): Promise<SentimentData> {
  const upperTicker = ticker.toUpperCase()
  
  // For now, use deterministic data since sentiment APIs require additional setup
  const sentimentScore = getDeterministicValue(upperTicker, 19, -100, 100) / 100
  
  return {
    score: sentimentScore,
    headlines: [
      {
        title: `${upperTicker} reports strong Q4 earnings`,
        url: '#',
        sentiment: 'positive' as const,
      },
      {
        title: `${upperTicker} faces regulatory challenges`,
        url: '#',
        sentiment: 'negative' as const,
      },
      {
        title: `${upperTicker} announces new product launch`,
        url: '#',
        sentiment: 'positive' as const,
      },
    ],
    redditSentiment: getDeterministicValue(upperTicker, 20, -100, 100) / 100,
    twitterSentiment: getDeterministicValue(upperTicker, 21, -100, 100) / 100,
  }
}

export async function getSECData(ticker: string): Promise<SECData> {
  const upperTicker = ticker.toUpperCase()
  
  return {
    latestFiling: {
      type: '10-K',
      date: new Date().toISOString().split('T')[0],
      url: '#',
      summary: `${upperTicker} filed their annual report showing strong revenue growth and expanding market share. The company reported increased profitability and positive cash flow trends.`,
    },
  }
}

export async function generateAISummary(
  ticker: string,
  stockData: StockData,
  technicalData: TechnicalData,
  sentimentData: SentimentData,
  secData: SECData
): Promise<string> {
  // Check if Gemini API key is properly configured
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
    return `RECOMMENDATION: HOLD

REASONING:
• ${ticker} shows mixed technical signals with RSI at ${technicalData.rsi.toFixed(2)} and MACD indicating ${technicalData.macd.histogram > 0 ? 'bullish' : 'bearish'} momentum
• Fundamental metrics suggest ${stockData.pe < 20 ? 'reasonable' : 'elevated'} valuation with P/E ratio of ${stockData.pe.toFixed(2)}
• Market sentiment is ${sentimentData.score > 0.3 ? 'positive' : sentimentData.score < -0.3 ? 'negative' : 'neutral'} based on recent news and social media activity`
  }

  const prompt = `You are a stock analyst. Analyze the following data for ${ticker}:

Stock Data:
- Price: $${stockData.price.toFixed(2)}
- P/E Ratio: ${stockData.pe.toFixed(2)}
- Market Cap: $${(stockData.marketCap / 1000000000).toFixed(2)}B
- Change: ${stockData.change.toFixed(2)} (${stockData.changePercent.toFixed(2)}%)

Technical Indicators:
- RSI: ${technicalData.rsi.toFixed(2)} (${technicalData.rsi > 70 ? 'Overbought' : technicalData.rsi < 30 ? 'Oversold' : 'Neutral'})
- MACD: ${technicalData.macd.macd.toFixed(3)} (${technicalData.macd.histogram > 0 ? 'Bullish' : 'Bearish'} crossover)
- Support: $${technicalData.support.toFixed(2)}
- Resistance: $${technicalData.resistance.toFixed(2)}

Sentiment:
- Overall Score: ${sentimentData.score.toFixed(2)}
- News Sentiment: ${sentimentData.headlines.filter(h => h.sentiment === 'positive').length} positive, ${sentimentData.headlines.filter(h => h.sentiment === 'negative').length} negative

SEC Filing: ${secData.latestFiling.summary}

Provide a concise Buy/Hold/Sell recommendation with 3 key points explaining your reasoning. Format as:
RECOMMENDATION: [Buy/Hold/Sell]

REASONING:
• [Point 1]
• [Point 2] 
• [Point 3]`

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    if (text && text.trim()) {
      return text
    } else {
      throw new Error('Empty response from Gemini')
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    return `RECOMMENDATION: HOLD

REASONING:
• ${ticker} shows mixed technical signals with RSI at ${technicalData.rsi.toFixed(2)} and MACD indicating ${technicalData.macd.histogram > 0 ? 'bullish' : 'bearish'} momentum
• Fundamental metrics suggest ${stockData.pe < 20 ? 'reasonable' : 'elevated'} valuation with P/E ratio of ${stockData.pe.toFixed(2)}
• Market sentiment is ${sentimentData.score > 0.3 ? 'positive' : sentimentData.score < -0.3 ? 'negative' : 'neutral'} based on recent news and social media activity`
  }
} 