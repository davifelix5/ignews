
import { useSubscribe } from '../hooks/useSubscription'
import styles from '../styles/SubscribeButton.module.scss'

export function SubscribeButton() {
  
  const { handleSubscribe } = useSubscribe()
  
  return (
    <button onClick={handleSubscribe} className={styles.button}>
      Subscribe Now
    </button>
  )
}