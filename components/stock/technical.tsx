'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TechnicalData } from '@/lib/api'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TechnicalProps {
  data: TechnicalData
  ticker: string
}

export function Technical({ data, ticker }: TechnicalProps) {
  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return 'text-red-500'
    if (rsi < 30) return 'text-green-500'
    return 'text-yellow-500'
  }

  const getRSIStatus = (rsi: number) => {
    if (rsi > 70) return 'Overbought'
    if (rsi < 30) return 'Oversold'
    return 'Neutral'
  }

  const getMACDStatus = (histogram: number) => {
    if (histogram > 0) return { status: 'Bullish', icon: TrendingUp, color: 'text-green-500' }
    if (histogram < 0) return { status: 'Bearish', icon: TrendingDown, color: 'text-red-500' }
    return { status: 'Neutral', icon: Minus, color: 'text-yellow-500' }
  }

  const macdStatus = getMACDStatus(data.macd.histogram)

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">
          Technical Analysis {ticker && <span className="text-white/50 text-xs ml-2">({ticker})</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* RSI */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/70">RSI (14)</span>
            <span className={`text-sm font-bold ${getRSIColor(data.rsi)}`}>
              {data.rsi.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                data.rsi > 70 ? 'bg-red-500' : data.rsi < 30 ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${data.rsi}%` }}
            />
          </div>
          <p className="text-xs text-white/60">{getRSIStatus(data.rsi)}</p>
        </div>

        {/* MACD */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/70">MACD</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-white/60">MACD Line</p>
              <p className="text-white font-medium">{data.macd.macd.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-white/60">Signal Line</p>
              <p className="text-white font-medium">{data.macd.signal.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-white/60">Histogram</p>
              <p className={`font-medium ${macdStatus.color}`}>
                {data.macd.histogram.toFixed(3)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <macdStatus.icon className={`h-4 w-4 ${macdStatus.color}`} />
            <span className={`text-sm ${macdStatus.color}`}>{macdStatus.status}</span>
          </div>
        </div>

        {/* Moving Averages */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/70">Moving Averages</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-white/60">SMA 20</p>
              <p className="text-white font-medium">${data.sma.sma20.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-white/60">SMA 50</p>
              <p className="text-white font-medium">${data.sma.sma50.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-white/60">SMA 200</p>
              <p className="text-white font-medium">${data.sma.sma200.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Support & Resistance */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/70">Key Levels</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/60">Support</p>
              <p className="text-green-500 font-medium">${data.support.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-white/60">Resistance</p>
              <p className="text-red-500 font-medium">${data.resistance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-center h-32 text-white/60">
            <p className="text-sm">Interactive Chart Coming Soon</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}