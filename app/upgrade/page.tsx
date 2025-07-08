'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Zap, Brain, BarChart3, TrendingUp } from 'lucide-react'

export default function UpgradePage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await import('@stripe/stripe-js')
      const stripeInstance = await stripe.loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      )
      
      if (stripeInstance) {
        await stripeInstance.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Upgrade to MarketPulse Pro
          </h1>
          <p className="text-xl text-white/60">
            You&apos;ve reached your daily limit. Upgrade to unlock unlimited stock reports and advanced features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Free Plan</CardTitle>
              <div className="text-3xl font-bold text-white">$0</div>
              <p className="text-white/60">Current Plan</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-white" />
                  <span className="text-sm text-white/70">3 stock reports per day</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-white" />
                  <span className="text-sm text-white/70">Basic technical analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-white" />
                  <span className="text-sm text-white/70">Fundamental data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-white" />
                  <span className="text-sm text-white/70">Market sentiment</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-yellow-400/20 border-yellow-400/30">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Pro Plan</CardTitle>
              <div className="text-3xl font-bold text-yellow-400">$9</div>
              <p className="text-white/60">per month</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-white/70 font-medium">Unlimited stock reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-white/70 font-medium">Advanced AI insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-white/70 font-medium">SEC filing analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-white/70 font-medium">Priority support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-white/70">Export reports to PDF</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-white/70">Watchlist management</span>
                </div>
              </div>
              <Button 
                onClick={handleUpgrade}
                disabled={isLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                {isLoading ? 'Processing...' : 'Upgrade to Pro'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center">Why Upgrade to Pro?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Unlimited Reports</h3>
                <p className="text-white/60 text-sm">
                  Analyze as many stocks as you want without any daily limits.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">SEC Analysis</h3>
                <p className="text-white/60 text-sm">
                  AI-powered summaries of SEC filings and regulatory documents.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 