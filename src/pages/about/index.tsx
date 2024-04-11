import { GetStaticProps } from "next";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";
import Head from "next/head";
import { RichText } from 'prismic-dom';
import Image from "next/image";
import { FaFacebook, FaInstagram, FaWhatsapp, FaLinkedin, FaXing } from "react-icons/fa"


type Content = {
    title: string,
    description: string,
    banner: string,
    hasFacebook: boolean,
    linkFacebook: string,
    hasInstagram: string,
    linkInstagram: string,
    hasWhastsApp: boolean,
    linkWhatsApp: string,
    hasLinkedIn: boolean,
    linkLinkedIn: string,
    hasXing: boolean,
    linkXing: string
}

interface ContentProps {
    content: Content
}

export default function About({ content }: ContentProps) {
    return (
        <>
            <Head>
                <title>About Us</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.about}>
                    <Image
                        src={content.banner}
                        alt={content.title}
                        width={720}
                        height={410}
                        quality={100}
                        layout="responsive"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO0tTVeCwACyAFcwiB+6wAAAABJRU5ErkJggg=="
                    />
                    <h1>{content.title}</h1>
                    <div className={styles.aboutContent} dangerouslySetInnerHTML={{ __html: content.description }}></div>

                    {content.hasFacebook && (
                        <a href={content.linkFacebook}>
                            <FaFacebook size={40} />
                        </a>
                    )}

                    {content.hasInstagram && (
                        <a href={content.linkInstagram}>
                            <FaInstagram size={40} />
                        </a>
                    )}

                    {content.hasWhastsApp && (
                        <a href={content.linkWhatsApp}>
                            <FaWhatsapp size={40} />
                        </a>
                    )}
                    {content.hasLinkedIn && (
                        <a href={content.linkLinkedIn}>
                            <FaLinkedin size={40} />
                        </a>
                    )}
                    {content.hasXing && (
                        <a href={content.linkXing}>
                            <FaXing size={40} />
                        </a>
                    )}
                </article>



            </main>
        </>
    )
}



export const getStaticProps: GetStaticProps = async () => {

    const prismic = getPrismicClient();
    const response = await prismic.getByType('about');

    const {
        title,
        description,
        banner,
        has_facebook,
        link_facebook,
        has_instagram,
        link_instagram,
        has_whatsapp,
        link_whatsapp,
        has_linkedin,
        link_linkedin,
        has_xing,
        link_xing
    } = response.results[0].data;

    const content = {
        title: RichText.asText(title),
        description: RichText.asHtml(description),
        banner: banner.url,
        hasFacebook: has_facebook,
        linkFacebook: !has_facebook || link_facebook.link_type == 'Any' ? '' : link_facebook.url,
        hasInstagram: has_instagram,
        linkInstagram: !has_instagram || link_instagram.link_type == 'Any' ? '' : link_instagram.url,
        hasWhastsApp: has_whatsapp,
        linkWhatsApp: !has_whatsapp || link_whatsapp.link_type == 'Any' ? '' : link_whatsapp.url,
        hasLinkedIn: has_linkedin,
        linkLinkedIn: !has_linkedin || link_whatsapp.link_type == 'Any' ? '' : link_linkedin.url,
        hasXing: has_xing,
        linkXing: has_xing ? link_xing.url : ''
    }

    return {
        props: {
            content
        },
        revalidate: 60
    }
}