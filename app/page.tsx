'use client'

import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Brain, BarChart3, Zap, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Check if Clerk is properly configured
const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'your_clerk_publishable_key';

export default function HomePage() {
  let SignInButton: any = null
  let useUser: any = null
  let UserButton: any = null
  
  if (isClerkConfigured) {
    // Dynamically require Clerk only if configured
    const clerk = require('@clerk/nextjs')
    SignInButton = clerk.SignInButton
    useUser = clerk.useUser
    UserButton = clerk.UserButton
  }

  // Get user authentication status
  const { isSignedIn, user } = useUser ? useUser() : { isSignedIn: false, user: null }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI-Powered Stock
              <span className="text-yellow-400">
                {' '}Analysis
              </span>
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
              Get comprehensive stock analysis in seconds. Technical indicators, fundamentals, 
              sentiment analysis, and AI-powered recommendations - all in one dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isClerkConfigured ? (
                isSignedIn ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-white hover:bg-white/90 text-black">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <Button size="lg" className="bg-white hover:bg-white/90 text-black">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </SignInButton>
                )
              ) : (
                <Link href="/report/AAPL">
                  <Button size="lg" className="bg-white hover:bg-white/90 text-black">
                    Try Demo Report
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything You Need for Smart Investing
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              MarketPulse combines cutting-edge AI with comprehensive market data to give you 
              actionable insights for better investment decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-white mb-2" />
                <CardTitle className="text-white">Technical Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm">
                  RSI, MACD, moving averages, and support/resistance levels with interactive charts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-white mb-2" />
                <CardTitle className="text-white">Fundamentals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm">
                  P/E ratios, valuation metrics, growth indicators, and financial health analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <Zap className="h-8 w-8 text-white mb-2" />
                <CardTitle className="text-white">Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm">
                  News sentiment, social media analysis, and market mood indicators.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <Brain className="h-8 w-8 text-white mb-2" />
                <CardTitle className="text-white">AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm">
                  Gemini AI powered Buy/Hold/Sell recommendations with detailed reasoning.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-white/60">
              Start free, upgrade when you need more power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Free</CardTitle>
                <div className="text-3xl font-bold text-white">$0</div>
                <p className="text-white/60">Perfect for getting started</p>
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
                {isClerkConfigured ? (
                  isSignedIn ? (
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                        Get Started
                      </Button>
                    </SignInButton>
                  )
                ) : (
                  <Link href="/report/AAPL">
                    <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                      Try Demo
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="bg-yellow-400/20 border-yellow-400/30">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Pro</CardTitle>
                <div className="text-3xl font-bold text-yellow-400">$9</div>
                <p className="text-white/60">For serious investors</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-white/70">Unlimited stock reports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-white/70">Advanced AI insights</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-white/70">SEC filing analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-white/70">Priority support</span>
                  </div>
                </div>
                {isClerkConfigured ? (
                  isSignedIn ? (
                    <Link href="/upgrade">
                      <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                        Upgrade to Pro
                      </Button>
                    </Link>
                  ) : (
                    <SignInButton mode="modal">
                      <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                        Sign In to Upgrade
                      </Button>
                    </SignInButton>
                  )
                ) : (
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white" disabled>
                    Setup Auth First
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make Smarter Investment Decisions?
          </h2>
          <p className="text-white/60 mb-8">
            Join thousands of investors who trust MarketPulse for their stock analysis needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isClerkConfigured ? (
              isSignedIn ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white hover:bg-white/90 text-black">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <Button size="lg" className="bg-white hover:bg-white/90 text-black">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </SignInButton>
              )
            ) : (
              <Link href="/report/AAPL">
                <Button size="lg" className="bg-white hover:bg-white/90 text-black">
                  Try Demo Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">MarketPulse</span>
            </div>
            <p className="text-white/60 text-sm">
              © 2024 MarketPulse. AI-powered stock analysis for smarter investing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
