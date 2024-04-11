import type { AppProps } from "next/app";
import '../styles/global.scss';
import { PrismicProvider } from '@prismicio/react'
import {Header} from '../components/Header'
import { getPrismicClient } from "../services/prismic";

function App({ Component, pageProps }: AppProps) {
  const prismic = getPrismicClient();
  return(
    <>
      <PrismicProvider client={prismic}>
        <Header/>
        <Component {...pageProps} />
      </PrismicProvider>
      
    </>
  )
}

export default App
