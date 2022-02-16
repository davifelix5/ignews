import { query as q } from 'faunadb'
import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

interface SaveSubscriptionOptions {
  subscriptionId: string,
  customerId: string,
  shoudCreateSubscription?: boolean
}

export async function saveSubscription({
  subscriptionId,
  customerId,
  shoudCreateSubscription = false
}: SaveSubscriptionOptions) {
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'), customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id
  }

  if (shoudCreateSubscription) {
    
    const whereSubscriptionIdMatches = q.Match(
      q.Index('subscription_by_id'), subscriptionId
    )

    await fauna.query(
      q.If(
        q.Not(
          q.Exists(
            whereSubscriptionIdMatches
          )
        ),
        q.Create(
          q.Collection('subscriptions'),
          { data: subscriptionData }
        ),
        q.Get(
          whereSubscriptionIdMatches
        )
      )
    )
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          'ref',
          q.Get(
            q.Match(
              q.Index('subscription_by_id'), subscriptionId
            )
          )
        ),
        { data: subscriptionData }
      )
    )
  }

}