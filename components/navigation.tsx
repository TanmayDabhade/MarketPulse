'use client'

import { Button } from '@/components/ui/button'
import { TrendingUp, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Check if Clerk is properly configured
const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'your_clerk_publishable_key';

function DemoNavigation() {
  const pathname = usePathname()
  
  return (
    <nav className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">MarketPulse</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/analyze"
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/analyze'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Analyze Stocks
              </Link>
              <Link
                href="/dashboard"
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/top-performers"
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/top-performers'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Top Performers
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-white bg-white/10 px-3 py-1 rounded-full">
              Demo Mode
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Setup Auth
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function ClerkNavigation() {
  const pathname = usePathname()
  
  // Clerk navigation - always call useUser if configured
  const { UserButton, SignInButton, useUser } = require('@clerk/nextjs')
  const { isSignedIn } = useUser()

  return (
    <nav className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">MarketPulse</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/dashboard"
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/analyze"
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/analyze'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Analyze
              </Link>
              <Link
                href="/top-performers"
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/top-performers'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Top Performers
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button size="sm">
                    Get Started
                  </Button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export function Navigation() {
  if (!isClerkConfigured) {
    return <DemoNavigation />
  }
  
  return <ClerkNavigation />
} 