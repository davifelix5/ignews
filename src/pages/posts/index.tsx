import { GetStaticProps } from 'next'
import Head from 'next/head'

import styles from '../../styles/Posts.module.scss'

import * as prismic from '@prismicio/client'
import { createPrismicClient } from '../../services/prismic'
import { RichText } from 'prismic-dom'

interface Post {
	slug: string
	title: string
	summary: string
	updatedAt: string
}

interface PostsProps {
	posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
	return (
		<>
			<Head>
				<title>Posts | Ignews</title>
			</Head>
			<section className={styles.container}>
				<ul>
					{posts.map(post => (
						<li>
							<a href="">
								<time>{post.updatedAt}</time>
								<h2>{post.title}</h2>
								<summary>{post.title}</summary>
							</a>
						</li>
					))}
				</ul>
			</section>
		</>
  )
}

export const getStaticProps: GetStaticProps = async (req) => {
	
	const prismicClient = createPrismicClient(req)
	
	const response = await prismicClient.get({
		predicates: prismic.predicate.at('document.type', 'post'),
		pageSize: 100,
	})

	const posts = response.results.map(post => {
		return {
			slug: post.uid,
			title: RichText.asText(post.data.title),
			summary: post.data.content.find(content => content.type === 'paragraph')?.text || '',
			updatedAt: new Date(post.last_publication_date).toLocaleDateString('en-US', {
				day: '2-digit',
				month: 'long',
				year: 'numeric'
			})
		}
	})

	return {
		props: {
			posts
		},
		revalidate: 60 * 30 // 30 minutes
	}
}