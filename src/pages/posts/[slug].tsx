import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { getSession } from "next-auth/react"
import Head from "next/head"

import { RichText } from 'prismic-dom'
import { createPrismicClient } from "../../services/prismic"

import ReactHTMLParser from 'html-react-parser'

import styles from '../../styles/Post.module.scss'

import { Subscribe } from "../../components/Subscribe"

interface PostProps {
  post: {
    title: string
    content: string
    date: string
  },
  subscribed: boolean
}

export default function Posts({ post, subscribed }: PostProps) {

  const { isFallback } = useRouter()
  
  if (isFallback) {
    return <p>Loading</p>
  }

  return (
    <>
    <Head>
      <title>{post.title} | Ignews</title>
    </Head>
    {!subscribed && <Subscribe />}
    <article className={styles.container}>
      <h1>{post.title}</h1>
      <time>{post.date}</time>
      <div className={styles.content}>
        {ReactHTMLParser(post.content)}
      </div>
    </article>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (req) => {

  const { slug } = req.params
  
  const session = await getSession(req)
  
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  
  const isUserSubscribed = session.subscription

  const prismicClient = createPrismicClient(req)
  const response = await prismicClient.getByUID('post', slug as string, {
    fetch: ['post.title', 'post.content']
  })

  const post = {
    title: RichText.asText(response.data.title),
    content: isUserSubscribed ? RichText.asHtml(response.data.content) : RichText.asHtml(response.data.content.slice(0, 4)),
    date: new Date(response.last_publication_date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: {
      subscribed: isUserSubscribed,
      post,
    },
  }
}