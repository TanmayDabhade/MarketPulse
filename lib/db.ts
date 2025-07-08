import { supabase } from './supabase'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

// Create a server-side Supabase client with service role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function getUser() {
  const { userId } = await auth()
  if (!userId) return null

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  return user
}

export async function createUser(userId: string, email: string) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      email,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserSubscription(userId: string) {
  const { data: subscription, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching user subscription:', error)
    return null
  }

  return subscription
}

export async function getReportCount(userId: string, date: string) {
  const { count, error } = await supabaseAdmin
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', `${date}T00:00:00`)
    .lte('created_at', `${date}T23:59:59`)

  if (error) {
    console.error('Error fetching report count:', error)
    return 0
  }

  return count || 0
}

export async function createReport(reportData: {
  user_id: string
  ticker: string
  sentiment_score: number
  fundamentals: any
  technicals: any
  sec_summary: string
  ai_summary: string
}, userEmail?: string) {
  console.log('Creating report for user:', reportData.user_id)
  
  // First, ensure the user exists in the users table
  const { data: existingUser, error: userCheckError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('id', reportData.user_id)
    .single()

  if (userCheckError && userCheckError.code !== 'PGRST116') {
    console.error('Error checking user:', userCheckError)
  }

  if (!existingUser) {
    console.log('User does not exist, creating user:', reportData.user_id)
    // Create the user if they don't exist
    const { error: userCreateError } = await supabaseAdmin
      .from('users')
      .insert({
        id: reportData.user_id,
        email: userEmail || `${reportData.user_id}@clerk.user`, // Use provided email or placeholder
      })
      .single()
    
    if (userCreateError) {
      console.error('Error creating user:', userCreateError)
      throw userCreateError
    }
    console.log('User created successfully')
  } else {
    console.log('User already exists')
  }

  // Now create the report
  console.log('Creating report...')
  const { data, error } = await supabaseAdmin
    .from('reports')
    .insert(reportData)
    .select()
    .single()

  if (error) {
    console.error('Error creating report:', error)
    throw error
  }
  
  console.log('Report created successfully')
  return data
}

export async function getUserReports(userId: string) {
  const { data: reports, error } = await supabaseAdmin
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user reports:', error)
    return []
  }

  return reports || []
}

export async function canUserAccessReport(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId)
  
  if (subscription?.status === 'active') {
    return true
  }

  const today = new Date().toISOString().split('T')[0]
  const reportCount = await getReportCount(userId, today)
  
  return reportCount < 3
} 