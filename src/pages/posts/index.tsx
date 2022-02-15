import Head from 'next/head'
import styles from '../../styles/Posts.module.scss'

export default function Posts() {
	return (
		<>
			<Head>
				<title>Posts | Ignews</title>
			</Head>
			<section className={styles.container}>
				<ul>
					<li>
						<a href="">
							<time>12/03/2022</time>
							<h2>Creating a Monorepo with Lerna {"&"} Yarn Workspaces</h2>
							<p>In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build, test, and release process.</p>
						</a>
					</li>
					<li>
						<a href="#">
							<time>08/03/2022</time>
							<h2>How Stripe Designs Beautiful Websites</h2>
							<p>Examining the tips and tricks used to make Stripe's website design a notch above the rest.</p>
						</a>
					</li>
					<li>
						<a href="">
							<time>04/03/2022</time>
							<h2>Past, Present, and Future of React State Management</h2>
							<p>Learn about the history of state management in React and what the preferred solutions are today.</p>
						</a>
					</li>
				</ul>
			</section>
		</>
  )
}