'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SECData } from '@/lib/api'
import { FileText, Calendar, ExternalLink, AlertTriangle } from 'lucide-react'

interface SECProps {
  data: SECData
  ticker: string
}

export function SEC({ data, ticker }: SECProps) {
  const getFilingTypeColor = (type: string) => {
    if (type === '10-K') {
      return 'bg-white/20 text-white'
    } else if (type === '10-Q') {
      return 'bg-white/20 text-white'
    } else {
      return 'bg-white/20 text-white'
    }
  }

  const getFilingTypeIcon = (type: string) => {
    switch (type) {
      case '10-K':
        return '📊'
      case '10-Q':
        return '📈'
      case '8-K':
        return '⚠️'
      default:
        return '📄'
    }
  }

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white">SEC Filings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Latest Filing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white/70">Latest Filing</h4>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getFilingTypeColor(data.latestFiling.type)}`}>
                {getFilingTypeIcon(data.latestFiling.type)} {data.latestFiling.type}
              </span>
            </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/60">{data.latestFiling.date}</span>
                </div>
                <p className="text-sm text-white font-medium">
                  {ticker} - {data.latestFiling.type} Report
                </p>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-white/60" />
                  <span className="text-xs text-white hover:underline cursor-pointer">
                    View Full Filing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-white/70">AI Summary</h4>
            <span className="text-xs px-2 py-1 bg-white/20 text-white rounded-full">
              Gemini Pro Analysis
            </span>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-sm text-white/80 leading-relaxed">
              {data.latestFiling.summary}
            </p>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/70">Key Highlights</h4>
          <div className="space-y-2">
            <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-white/80">
                Strong revenue growth of 15% year-over-year driven by expanding market share
              </p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-white/80">
                Improved profit margins through operational efficiency and cost optimization
              </p>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-white/80">
                Increased R&D investment for future product development and innovation
              </p>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-white/70">Risk Factors</h4>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-white/10 border border-white/20 rounded-lg">
              <p className="text-sm text-white">
                Regulatory changes in key markets may impact future growth
              </p>
            </div>
            <div className="p-3 bg-white/10 border border-white/20 rounded-lg">
              <p className="text-sm text-white">
                Increased competition from new market entrants
              </p>
            </div>
          </div>
        </div>

        {/* Filing History */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/70">Recent Filings</h4>
          <div className="space-y-2">
            {[
              { type: '10-Q', date: '2024-01-15', title: 'Quarterly Report' },
              { type: '8-K', date: '2024-01-10', title: 'Material Event' },
              { type: '10-K', date: '2023-12-31', title: 'Annual Report' },
            ].map((filing, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getFilingTypeColor(filing.type)}`}>
                    {filing.type}
                  </span>
                  <span className="text-sm text-white/70">{filing.title}</span>
                </div>
                <span className="text-xs text-white/60">{filing.date}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 