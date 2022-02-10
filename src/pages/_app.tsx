import { AppProps } from 'next/app'

import '../styles/global.scss'
import 'react-toastify/dist/ReactToastify.css';

import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'

import { Header } from '../components/Header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ToastContainer />
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
