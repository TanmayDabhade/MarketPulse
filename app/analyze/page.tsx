import { Navigation } from '@/components/navigation'
import { StockSearch } from '@/components/stock-search'
import { Search } from 'lucide-react'

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-xl mx-auto mt-16">
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white/20">
            <Search className="h-10 w-10 text-white mb-4 opacity-80" />
            <h2 className="text-2xl font-semibold text-white mb-2 text-center">
              Search Any Stock
            </h2>
            <p className="text-white/60 mb-6 text-center">
              Enter a stock ticker symbol to get instant analysis
            </p>
            <StockSearch />
          </div>
          <div className="text-center text-white/40 mt-8 text-sm">
            Start by searching for a stock above to view its analysis.
          </div>
        </div>
      </main>
    </div>
  )
} 