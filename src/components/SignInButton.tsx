import styles from '../styles/SignInButton.module.scss'

import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

export function SignInButton() {
  const isUserLoggedIn = false

  return isUserLoggedIn ? (
    <button className={`${styles.button} ${styles.loggedIn}`}>
      <FaGithub size={25} color="#04D361" />
      <span>davifelix5</span>
      <FiX size={20} color="#a8a8b3" />
    </button>
  ) : (
    <button className={`${styles.button} ${styles.loggedOff}`}>
      <FaGithub size={25} color="#eba417" />
      <span>Sign in with GitHub</span>
    </button>
  )
}