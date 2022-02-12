import { NextApiHandler } from 'next'
import Stripe from 'stripe'

import { buffer } from '../../utils/buffer'
import { stripe } from '../../services/stripe'

import { saveSubscription } from './_lib/saveSubscription'

const PAYMENT_SUCCED_STATUS = 'invoice.payment_succeeded'

const relevantEvents = new Set([
  PAYMENT_SUCCED_STATUS
])

export const config = {
  api: {
    bodyParser: false,
  },
}

const webhooks: NextApiHandler = async (req, res) => {

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
    return
  }

  const buff = await buffer(req) // parsing a stream
  const signature = req.headers['stripe-signature']

  try {

    const event = stripe.webhooks.constructEvent(buff, signature, process.env.STRIPE_ENDPOINT_SECRET)
    
    if (!relevantEvents.has(event.type)) {
      return res.json({ message: 'Evenet received but no relevant' })
    }

    switch (event.type) {
      case PAYMENT_SUCCED_STATUS: {
        
        const {
          billing_reason,
          subscription,
          customer
        } = event.data.object as Stripe.Invoice

        if (billing_reason === 'subscription_create') {
          saveSubscription(subscription.toString(), customer.toString())
        }

        return res.json({message: 'Subscription validated successfully'})

      }

      default: {
        return res.json({message: 'Unhandled webhook event'})
      }
    }

  } catch {

    res.status(500).json({
      message: 'Error on stripe webhooks listener'
    })

  }
  
}

export default webhooks