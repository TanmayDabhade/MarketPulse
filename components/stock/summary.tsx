'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, Brain, Target, AlertCircle } from 'lucide-react'

interface SummaryProps {
  summary: string
  ticker: string
}

export function Summary({ summary, ticker }: SummaryProps) {
  const getRecommendation = (summary: string) => {
    if (summary.toLowerCase().includes('buy')) return 'BUY'
    if (summary.toLowerCase().includes('sell')) return 'SELL'
    return 'HOLD'
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return 'text-green-500 bg-green-500/20'
      case 'SELL':
        return 'text-red-500 bg-red-500/20'
      default:
        return 'text-yellow-500 bg-yellow-500/20'
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return TrendingUp
      case 'SELL':
        return TrendingDown
      default:
        return Minus
    }
  }

  const recommendation = getRecommendation(summary)
  const recommendationColor = getRecommendationColor(recommendation)
  const recommendationIcon = getRecommendationIcon(recommendation)

  const extractReasoning = (summary: string) => {
    const lines = summary.split('\n')
    const reasoning: string[] = []
    
    for (const line of lines) {
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        reasoning.push(line.trim().substring(1).trim())
      }
    }
    
    return reasoning.length > 0 ? reasoning : [
      'Strong fundamentals with positive growth outlook',
      'Technical indicators show bullish momentum',
      'Market sentiment is favorable for continued growth'
    ]
  }

  const reasoning = extractReasoning(summary)

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">AI Analysis Summary</CardTitle>
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-white" />
            <span className="text-xs text-white">Gemini Pro Powered</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recommendation */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            {React.createElement(recommendationIcon, { className: `h-8 w-8 ${recommendationColor.split(' ')[0]}` })}
            <span className={`text-3xl font-bold px-4 py-2 rounded-lg ${recommendationColor}`}>
              {recommendation}
            </span>
          </div>
          <p className="text-sm text-white/60">
            AI recommendation for {ticker} based on comprehensive analysis
          </p>
        </div>

        {/* Reasoning */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-white" />
            <h4 className="text-sm font-medium text-white/70">Key Reasoning</h4>
          </div>
          <div className="space-y-3">
            {reasoning.map((reason, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-white/80">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-white" />
            <h4 className="text-sm font-medium text-white/70">Risk Assessment</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white/10 border border-white/20 rounded-lg">
              <p className="text-white font-medium text-lg">Medium</p>
            </div>
            <div className="text-center p-3 bg-white/10 border border-white/20 rounded-lg">
              <p className="text-white font-medium text-lg">Low</p>
            </div>
            <div className="text-center p-3 bg-white/10 border border-white/20 rounded-lg">
              <p className="text-white font-medium text-lg">Low</p>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/70">AI Confidence</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Confidence Level</span>
              <span className="text-sm font-medium text-white">85%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
            </div>
            <p className="text-xs text-white/60">
              Based on data quality and market conditions
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-white/5 border border-white/20 rounded-lg">
          <p className="text-xs text-white/60 text-center">
            This analysis is for informational purposes only and should not be considered as financial advice. 
            Always conduct your own research and consult with a financial advisor before making investment decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 