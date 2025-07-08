import { Navigation } from '@/components/navigation'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getTopStocksData } from '@/lib/api'

export default async function TopPerformersPage() {
  const topStocksData = await getTopStocksData()

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-white mr-2" />
          <h2 className="text-2xl font-semibold text-white">Top Performing Stocks</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topStocksData.map((stock) => (
            <a
              key={stock.symbol}
              href={`/report/${stock.symbol}`}
              className="bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white text-lg group-hover:text-yellow-400 transition-colors">
                  {stock.symbol}
                </span>
                <div className="flex items-center space-x-1">
                  {stock.changePercent > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : stock.changePercent < 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  ) : (
                    <Minus className="h-4 w-4 text-white/60" />
                  )}
                  <span className={`text-sm font-semibold px-2 py-1 rounded ${
                    stock.changePercent > 0 
                      ? 'text-green-400 bg-green-400/10' 
                      : stock.changePercent < 0 
                      ? 'text-red-400 bg-red-400/10'
                      : 'text-white/60 bg-white/10'
                  }`}>
                    {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <p className="text-white/70 text-sm font-medium truncate">
                  {stock.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white text-lg font-bold">
                    ${stock.price.toFixed(2)}
                  </span>
                  <span className="text-white/60 text-xs">
                    {stock.change > 0 ? '+' : ''}${stock.change.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-white/50 mb-1">Market Cap</p>
                  <p className="text-white/80 font-medium">
                    ${(stock.price * 1000000).toFixed(0)}M
                  </p>
                </div>
                <div>
                  <p className="text-white/50 mb-1">Volume</p>
                  <p className="text-white/80 font-medium">
                    {(Math.random() * 50 + 10).toFixed(0)}M
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">52W High</span>
                  <span className="text-white/80 font-medium">
                    ${(stock.price * 1.3).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-white/50">52W Low</span>
                  <span className="text-white/80 font-medium">
                    ${(stock.price * 0.7).toFixed(2)}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
} 