import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rhwfzzbodtupknfiojjm.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod2Z6emJvZHR1cGtuZmlvamptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODA0NjcsImV4cCI6MjA2NzM1NjQ2N30.Jl6OWVXJ4fepktG02cW7ES2ELlzXtiNu7B2jweQuEkA'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          status?: string
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          ticker: string
          sentiment_score: number
          fundamentals: any
          technicals: any
          sec_summary: string
          ai_summary: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ticker: string
          sentiment_score: number
          fundamentals: any
          technicals: any
          sec_summary: string
          ai_summary: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ticker?: string
          sentiment_score?: number
          fundamentals?: any
          technicals?: any
          sec_summary?: string
          ai_summary?: string
          created_at?: string
        }
      }
    }
  }
} 