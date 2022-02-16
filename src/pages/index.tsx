import Head from 'next/head'

import { GetStaticProps } from 'next'

import { SubscribeButton } from '../components/SubscribeButton'

import { stripe } from '../services/stripe'

import styles from '../styles/Home.module.scss'

interface HomeProps {
  price: string
  interval: string
  error: boolean
}

export default function Home({ price, interval, error }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.main}>
        <section className={`${styles.hero} ${error ? styles.error : ''}`}>
          <span>👏 Hey, welcome</span>
          <h1>News about <br /> the <span>React</span> world</h1>

          {error ? (
            <>
              <p>There was an error with the subscription section</p>
              <p>Please try again later</p>
            </>
          ) : (
              <>
                <p>
                  Get access to all publications <br /> 
                  <span>for {price} / {interval}</span>
                </p>
                <SubscribeButton />
              </>
            )
          }

        </section>
        <img src="/woman.svg" alt="Woman coding in React" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const priceId = process.env.STRIPE_PRICE_ID

    const {
      unit_amount: priceInCents,
      recurring: { interval },
    } = await stripe.prices.retrieve(priceId)

    const priceNumber = priceInCents / 100
  
    const price = Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(priceNumber)
  
    return {
      props: { price, interval, error: false },
      revalidate: 60 * 60 * 24 // 24 hours
    }
  } catch {
    return {
      props: { price: null, interval: null, error: true },
      revalidate: 60 * 60 * 24 // 24 hours
    }
  }

}