import { useSession, signIn } from 'next-auth/react'

import { toast } from 'react-toastify'
import { getStripeJs } from '../services/stripejs'

import { api } from '../services/api'

export function useSubscribe() {
  const { status } = useSession()

  async function handleSubscribe() {

    if (status !== 'authenticated') {
      signIn('github')
      return
    }
    try {
      const response = await api.post('subscribe')
      
      const { checkoutSessionId: sessionId } = response.data

      const stripeJs = await getStripeJs()

      stripeJs.redirectToCheckout({ sessionId })
    } catch {
      toast.error('There was an error. Try again later!')
    }

  }

  return { handleSubscribe }
}