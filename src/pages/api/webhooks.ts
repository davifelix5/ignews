import { NextApiHandler } from 'next'
import Stripe from 'stripe'

import { buffer } from '../../utils/buffer'
import { stripe } from '../../services/stripe'

import { saveSubscription } from './_lib/saveSubscription'

const PAYMENT_SUCCED_STATUS = 'invoice.payment_succeeded'
const SUBSCRIPTION_CREATED_STATUS = 'customer.subscription.created'
const SUBSCRIPTION_UPDATED_STATUS = 'customer.subscription.updated'
const SUBSCRIPTION_DELETED_STATUS = 'customer.subscription.deleted'

const relevantEvents = new Set([
  PAYMENT_SUCCED_STATUS,
  SUBSCRIPTION_CREATED_STATUS,
  SUBSCRIPTION_UPDATED_STATUS,
  SUBSCRIPTION_DELETED_STATUS,
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
      case SUBSCRIPTION_CREATED_STATUS:
      case SUBSCRIPTION_UPDATED_STATUS:
      case SUBSCRIPTION_DELETED_STATUS:
        
        const subscription = event.data.object as Stripe.Subscription

        await saveSubscription({
          subscriptionId: subscription.id.toString(),
          customerId: subscription.customer.toString(),
          shoudCreateSubscription: event.type === 'customer.subscription.created'
        })

        return res.json({
          message: 'Subscription modified succesfully'
        })

      default: {
        return res.json({message: 'Unhandled webhook event'})
      }
    }

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: 'Error on stripe webhooks listener'
    })

  }
  
}

export default webhooks