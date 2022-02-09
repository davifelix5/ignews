import styles from '../styles/Header.module.scss'

import { SignInButton } from './SignInButton'

export function Header() {

  return (
    <header className={styles.container}>
      <div className={styles.content}>
          <img src="/logo.svg" alt="ig.news" />
          <nav className={styles.navBar}>
            <a href="#" className={styles.active}>Home</a>
            <a href="#" >Posts</a>
          </nav>
          <SignInButton />
      </div>
    </header>
  )
}