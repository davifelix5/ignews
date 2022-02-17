
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useSubscribe } from '../hooks/useSubscription'

import styles from '../styles/SubscribeButton.module.scss'

export function SubscribeButton() {
  
  const { data } = useSession()
  const router = useRouter()

  const { handleSubscribe } = useSubscribe()

  function handleSeePosts() {
    router.push('/posts')
  }
  
  return data?.subscription ? (
    <button onClick={handleSeePosts} className={styles.button}>
      Ver posts
    </button>
  ) : (
  <button onClick={handleSubscribe} className={styles.button}>
    Subscribe Now
  </button>
  )
}