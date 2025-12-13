
import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey)

  const body = await readBody(event)
  const amount = Math.round(Number(body.amount) * 100)

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    receipt_email: body.donorEmail || undefined,
    metadata: {
      anonymous: body.anonymous ? 'yes' : 'no'
    }
  })

  return { clientSecret: intent.client_secret }
})
