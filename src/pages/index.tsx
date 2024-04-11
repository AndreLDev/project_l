import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "../styles/home.module.scss";
import { getPrismicClient } from "../services/prismic";
import {RichText, Link} from 'prismic-dom';


type Content = {
  title: string,
  titleContent: string,
  titleBaner: string,
  linkAction: string,
  mobileTitle: string,
  mobileContent: string,
  mobileBanner: string,
  linkMobile: string,
  webTitle: string,
  webContent: string,
  webBanner: string,
  linkWeb: string
}

interface ContentProps{
  content: Content
}

export default function Home({content} : ContentProps) {

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>t
            <h1>{content.title}</h1>
            <span>{content.titleContent}</span>
            <a href={content.linkAction}>
              <button>
                READ MORE
              </button>
            </a>
          </section>
        
          <img src={content.titleBaner} alt="contents" />
        </div>

        <hr className={styles.divisor} />

        <div className={styles.sectionContent}>
          <section className={styles.ctaText}>
            <h2>{content.mobileTitle}</h2>
            <span>{content.mobileContent}</span>
            <a href={content.linkMobile}>
              <button>
                READ MORE
              </button>
            </a>
          </section>
          <img src={content.mobileBanner} alt="" />
        </div>


        <hr className={styles.divisor} />

        <div className={styles.sectionContent}>
          <img src={content.webBanner} alt="" />

          <section className={styles.ctaText}>
            <h2>{content.webTitle}</h2>
            <span>{content.webContent}</span>
            <a href={content.linkWeb}>
              <button>
                READ MORE
              </button>
            </a>
          </section>
        </div>

      </main>
    </>
  );
}


export const getStaticProps: GetStaticProps = async () => {
  
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('home', 'aquila-clean-energy--part-of-the-solution-to-decar');

  console.log(response)

  const {
    title, sub_title, title_banner, link_action, mobile, mobile_content, mobile_banner, link_mobile, title_web, web_content, web_banner, link_web
  } = response.data

  const content = {
    title: RichText.asText(title),
    titleContent: RichText.asText(sub_title),
    titleBaner: title_banner.url,
    linkAction: Link.url(link_action),
    mobileTitle: RichText.asText(mobile),
    mobileContent: RichText.asText(mobile_content),
    mobileBanner: mobile_banner.url,
    linkMobile: link_mobile.url,
    webTitle: RichText.asText(title_web),
    webContent: RichText.asText(web_content),
    webBanner: web_banner.url,
    linkWeb: link_web
  }

  return{
    props:{
      content
    },
    revalidate: 60 * 2
  }
}
