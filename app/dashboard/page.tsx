import { redirect } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Clock, BarChart3, History, Settings } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  // Check if Clerk is configured
  const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'your_clerk_publishable_key';

  if (!isClerkConfigured) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Setup Required
            </h1>
            <p className="text-xl text-white/60 mb-8">
              To access the dashboard, you need to configure authentication.
            </p>
          </div>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Get Clerk API Keys</h3>
                    <p className="text-white/60 text-sm mb-2">
                      Visit <a href="https://dashboard.clerk.com" target="_blank" rel="noopener" className="text-white hover:underline">Clerk Dashboard</a> and create a new application.
                    </p>
                    <p className="text-white/60 text-sm">
                      Copy your Publishable Key and Secret Key.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Update Environment Variables</h3>
                    <p className="text-white/60 text-sm mb-2">
                      Edit your <code className="bg-white/10 px-2 py-1 rounded text-sm">.env.local</code> file and add:
                    </p>
                    <pre className="bg-white/10 p-3 rounded text-sm text-white overflow-x-auto">
{`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here`}
                    </pre>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Restart Development Server</h3>
                    <p className="text-white/60 text-sm">
                      Stop the current server (Ctrl+C) and run <code className="bg-white/10 px-2 py-1 rounded text-sm">npm run dev</code> again.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4 pt-6">
                <Link href="/">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Back to Home
                  </Button>
                </Link>
                <Link href="/report/AAPL">
                  <Button className="bg-white hover:bg-white/90 text-black">
                    Try Demo Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Full dashboard when Clerk is configured
  try {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = await auth()
    
    if (!userId) {
      redirect('/sign-in')
    }

    const { getUserReports, getUserSubscription, getReportCount } = await import('@/lib/db')
    const [reports, subscription, todayCount] = await Promise.all([
      getUserReports(userId),
      getUserSubscription(userId),
      getReportCount(userId, new Date().toISOString().split('T')[0])
    ])

    // Treat null subscription as Free user
    const isPro = subscription && subscription.status === 'active'
    const reportsRemaining = isPro ? 'Unlimited' : Math.max(0, 3 - todayCount)

    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-white/60">
              Track your stock analysis history and subscription status.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/10 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Total Reports</CardTitle>
                <BarChart3 className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{reports.length}</div>
                <p className="text-xs text-white/60">
                  All time analysis count
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Reports Today</CardTitle>
                <Clock className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{todayCount}</div>
                <p className="text-xs text-white/60">
                  {isPro ? 'Unlimited Pro access' : `${reportsRemaining} remaining today`}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Subscription</CardTitle>
                <TrendingUp className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {isPro ? 'Pro' : 'Free'}
                </div>
                <p className="text-xs text-white/60">
                  {isPro ? 'Unlimited reports' : '3 reports per day'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade Card */}
          {!isPro && (
            <Card className="bg-white/20 border-white/30 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Upgrade to Pro
                    </h3>
                    <p className="text-white/70 mb-4">
                      Get unlimited stock reports, advanced AI insights, and priority support.
                    </p>
                    <Button className="bg-white hover:bg-white/90 text-black">
                      Upgrade Now - $9/month
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">$9</div>
                    <div className="text-sm text-white/70">per month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Reports */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Recent Reports</CardTitle>
                <History className="h-5 w-5 text-white/60" />
              </div>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60 mb-4">No reports yet</p>
                  <Link href="/report/AAPL">
                    <Button className="bg-white hover:bg-white/90 text-black">Analyze Your First Stock</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {(isPro ? reports : reports.slice(0, 3)).map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {report.ticker}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{report.ticker}</p>
                          <p className="text-sm text-white/60">
                            {new Date(report.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          report.sentiment_score > 0.3 
                            ? 'bg-white/20 text-white'
                            : report.sentiment_score < -0.3
                            ? 'bg-white/20 text-white'
                            : 'bg-white/20 text-white'
                        }`}>
                          {report.sentiment_score > 0.3 ? 'Positive' : report.sentiment_score < -0.3 ? 'Negative' : 'Neutral'}
                        </span>
                        <Link href={`/report/${report.ticker}`}>
                          <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    // Fallback to home page if there's an error
    redirect('/')
  }
} 