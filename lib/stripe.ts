import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
})

export const getStripe = () => {
  if (typeof window !== 'undefined') {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
    // Use type assertion to unknown first, then to the correct type
    return new ((window as unknown) as { Stripe: StripeConstructor }).Stripe(publishableKey)
  }
  return null
}

// Define the StripeConstructor type
interface StripeConstructor {
  (publishableKey: string, options?: StripeConstructorOptions): Stripe
  new (publishableKey: string, options?: StripeConstructorOptions): Stripe
}

interface StripeConstructorOptions {
  apiVersion?: string
  betas?: string[]
  locale?: string
  stripeAccount?: string
} 