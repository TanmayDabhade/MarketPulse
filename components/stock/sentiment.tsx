'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SentimentData } from '@/lib/api'
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react'

interface SentimentProps {
  data: SentimentData
  ticker: string
}

export function Sentiment({ data, ticker }: SentimentProps) {
  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-500'
    if (score < -0.3) return 'text-red-500'
    return 'text-yellow-500'
  }

  const getSentimentIcon = (score: number) => {
    if (score > 0.3) return TrendingUp
    if (score < -0.3) return TrendingDown
    return Minus
  }

  const getSentimentLabel = (score: number) => {
    if (score > 0.3) return 'Positive'
    if (score < -0.3) return 'Negative'
    return 'Neutral'
  }

  const sentimentIcon = getSentimentIcon(data.score)
  const sentimentColor = getSentimentColor(data.score)

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Market Sentiment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Sentiment Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/70">Overall Sentiment</span>
            <div className="flex items-center space-x-2">
              {React.createElement(sentimentIcon, { className: `h-5 w-5 ${sentimentColor}` })}
              <span className={`text-lg font-bold ${sentimentColor}`}>
                {getSentimentLabel(data.score)}
              </span>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                data.score > 0.3 ? 'bg-green-500' : data.score < -0.3 ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              style={{ 
                width: `${Math.abs(data.score) * 100}%`,
                marginLeft: data.score < 0 ? 'auto' : '0'
              }}
            />
          </div>
          <p className="text-xs text-white/60">Score: {data.score.toFixed(2)}</p>
        </div>

        {/* Social Media Sentiment */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/70">Social Media</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Reddit</span>
                <span className={`text-sm font-medium ${getSentimentColor(data.redditSentiment)}`}>
                  {data.redditSentiment > 0 ? '+' : ''}{data.redditSentiment.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Twitter</span>
                <span className={`text-sm font-medium ${getSentimentColor(data.twitterSentiment)}`}>
                  {data.twitterSentiment > 0 ? '+' : ''}{data.twitterSentiment.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* News Headlines */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/70">Recent News</h4>
          <div className="space-y-3">
            {data.headlines.map((headline, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex-1">
                    <p className="text-sm text-white line-clamp-2">{headline.title}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        headline.sentiment === 'positive' 
                          ? 'bg-green-500/20 text-green-400'
                          : headline.sentiment === 'negative'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {headline.sentiment.charAt(0).toUpperCase() + headline.sentiment.slice(1)}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/60 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/70">Sentiment Breakdown</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-green-500/20 rounded">
              <p className="text-green-400 font-medium">
                {data.headlines.filter(h => h.sentiment === 'positive').length}
              </p>
              <p className="text-white/60">Positive</p>
            </div>
            <div className="text-center p-2 bg-yellow-500/20 rounded">
              <p className="text-yellow-400 font-medium">
                {data.headlines.filter(h => h.sentiment === 'neutral').length}
              </p>
              <p className="text-white/60">Neutral</p>
            </div>
            <div className="text-center p-2 bg-red-500/20 rounded">
              <p className="text-red-400 font-medium">
                {data.headlines.filter(h => h.sentiment === 'negative').length}
              </p>
              <p className="text-white/60">Negative</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 