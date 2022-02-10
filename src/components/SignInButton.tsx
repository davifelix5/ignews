import styles from '../styles/SignInButton.module.scss'

import { signIn, signOut, useSession } from 'next-auth/react'

import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

export function SignInButton() {
  const { status, data } = useSession()

  const isUserLoggedIn = status === 'authenticated'

  function handleAuthenticateClientWithGithub() {
    signIn('github')
  }

  function handleUserSignOff() {
    signOut()
  }

  return isUserLoggedIn ? (
    <div className={`${styles.button} ${styles.loggedIn}`}>
      <FaGithub size={25} color="#04D361" />
      <span>{ data.user.name }</span>
      <button onClick={handleUserSignOff}>
        <FiX size={20} color="#a8a8b3" />
      </button>
    </div>
  ) : (
    <button 
      className={`${styles.button} ${styles.loggedOff}`} 
      onClick={handleAuthenticateClientWithGithub}
    >
      <FaGithub size={25} color="#eba417" />
      <span>Sign in with GitHub</span>
    </button>
  )
}