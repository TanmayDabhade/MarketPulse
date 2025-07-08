import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { headers } from 'next/headers'
import Stripe from 'stripe'

interface CheckoutSessionCompletedEvent {
  id: string
  customer: string
  metadata?: {
    userId?: string
  }
}

interface SubscriptionEvent {
  id: string
  customer: string
  status: string
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as CheckoutSessionCompletedEvent
        const userId = session.metadata?.userId

        if (userId) {
          // Create subscription record
          await supabase
            .from('subscriptions')
            .insert({
              user_id: userId,
              stripe_customer_id: session.customer,
              status: 'active',
            })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as SubscriptionEvent
        const customerId = subscription.customer

        // Update subscription status
        await supabase
          .from('subscriptions')
          .update({ status: subscription.status })
          .eq('stripe_customer_id', customerId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as SubscriptionEvent
        const customerId = subscription.customer

        // Update subscription status to canceled
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_customer_id', customerId)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
} 