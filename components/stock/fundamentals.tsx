'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StockData } from '@/lib/api'
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'

interface FundamentalsProps {
  data: StockData
  ticker: string
}

export function Fundamentals({ data, ticker }: FundamentalsProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  const getValuationColor = (pe: number) => {
    if (pe < 15) return 'text-green-500'
    if (pe > 25) return 'text-red-500'
    return 'text-yellow-500'
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500'
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? TrendingUp : TrendingDown
  }

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Fundamentals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price & Change */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">${data.price.toFixed(2)}</span>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${getChangeColor(data.change)}`}>
                {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}
              </span>
              <span className={`text-sm font-medium ${getChangeColor(data.changePercent)}`}>
                ({data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%)
              </span>
              {React.createElement(getChangeIcon(data.change), { className: `h-4 w-4 ${getChangeColor(data.change)}` })}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/70">Valuation</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Market Cap</span>
                <span className="text-white font-medium">{formatCurrency(data.marketCap)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">P/E Ratio</span>
                <span className={`font-medium ${getValuationColor(data.pe)}`}>
                  {data.pe.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">EPS</span>
                <span className={`text-white font-medium ${getChangeColor(data.eps)}`}>
                  ${data.eps.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white/70">Dividend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Dividend</span>
                <span className="text-white font-medium">${data.dividend.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Yield</span>
                <span className="text-white font-medium">{data.dividendYield.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Volume</span>
                <span className="text-white font-medium">{formatCurrency(data.volume)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Ratios */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/70">Financial Ratios</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-white/60">ROE</p>
              <p className="text-white font-medium text-lg">{(Math.random() * 30 + 10).toFixed(1)}%</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-white/60">ROA</p>
              <p className="text-white font-medium text-lg">{(Math.random() * 15 + 5).toFixed(1)}%</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-white/60">Debt/Equity</p>
              <p className="text-white font-medium text-lg">{(Math.random() * 2 + 0.5).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/70">Growth Metrics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/60">Revenue Growth</span>
              <span className="text-green-500 font-medium">+{(Math.random() * 20 + 5).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/60">EPS Growth</span>
              <span className="text-green-500 font-medium">+{(Math.random() * 25 + 8).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 