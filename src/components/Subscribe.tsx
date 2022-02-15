import { useSubscribe } from '../hooks/useSubscription'
import styles from '../styles/Subscribe.module.scss'

export function Subscribe() {

  const { handleSubscribe } = useSubscribe()

  return (
    <div className={styles.container}>
      <button onClick={handleSubscribe}>
        Want to continue reading? <span>Subscribe now!</span> <img src="/emoji.png" alt="Emoji Subscribe" />
      </button>
    </div>
  )
}