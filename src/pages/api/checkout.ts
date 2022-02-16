import Stripe from "stripe";
import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

import { query as q } from 'faunadb'
import { fauna } from '../../services/fauna';
import { stripe } from "../../services/stripe";

interface User {
  ref: {
    id: string
  }
  data: {
    email: string
    stripe_customer_id?: string
  }
}

const subscribe: NextApiHandler = async (req, res) => {
  
  const isMethodAllowed = req.method === 'POST'
  if (!isMethodAllowed) {
    res.setHeader('Allow', 'POST').status(405).end('Method not allowed')
    return
  }
  
  try {
    const { user } = await getSession({ req })

    const { data: userData, ref } = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(user.email)
        )
      )
    )

    const stripeCheckoutSessionOptions: Stripe.Checkout.SessionCreateParams = {
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      mode: 'subscription',
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      line_items: [
        { price: process.env.STRIPE_PRICE_ID, quantity: 1}
      ],
      payment_method_types: ['card'],
    }

    const stripeCustumerId = userData.stripe_customer_id

    if (stripeCustumerId) {

      stripeCheckoutSessionOptions.customer = stripeCustumerId

    } else {

      const custumer = await stripe.customers.create({
        email: userData.email
      })

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), ref.id),
          {
            data: {
              stripe_customer_id: custumer.id
            }
          }
        )
      )

      stripeCheckoutSessionOptions.customer = custumer.id
    }

    const checkoutSession = await stripe
      .checkout.sessions.create(stripeCheckoutSessionOptions)

    res.status(201).json({ checkoutSessionId: checkoutSession.id })
  
  } catch {
    res
      .status(500)
      .end('There was an error while creating checkout session')
  }
  
}

export default subscribe