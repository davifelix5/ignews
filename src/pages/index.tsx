import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'

import styles from '../styles/Home.module.scss'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <br /> <span>React</span> world</h1>
          <p>Get access to all publication <br /> <span>for $9.90 / month</span></p>
          <SubscribeButton />
        </section>
        <img src="/woman.svg" alt="Woman coding in React" />
      </main>
    </>
  )
}
