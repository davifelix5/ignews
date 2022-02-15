import styles from '../styles/Header.module.scss'

import { ActiveLink } from './ActiveLink'

import { SignInButton } from './SignInButton'

export function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
          <img src="/logo.svg" alt="ig.news" />
          <nav className={styles.navBar}>
            <ActiveLink activeClassName={styles.active} href="/">
              <a>Home</a>
            </ActiveLink>
            <ActiveLink activeClassName={styles.active} href="/posts">
              <a>Posts</a>
            </ActiveLink>
          </nav>
          <SignInButton />
      </div>
    </header>
  )
}