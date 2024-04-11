import { GetServerSideProps } from "next"
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import Head from "next/head";
import styles from "./post.module.scss"
import Image from "next/image";


type Post = {
    slug: string,
    title: string,
    description: string,
    cover: string,
    updateAt: string
}

interface PostProps{
    post: Post
}

export default function Post({post} : PostProps){


    return(
        <>
            <Head>
                <title>{post.title}</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                <Image 
                    src={post.cover} 
                    alt={post.title} 
                    width={720} 
                    height={410} 
                    quality={100}
                    layout="responsive"
                    placeholder="blur" 
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO0tTVeCwACyAFcwiB+6wAAAABJRU5ErkJggg=="
                />
                <h1>{post.title}</h1>
                <time>{post.updateAt}</time>
                <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.description}}></div>
                </article>
            </main>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async ({req, params}) => {

    const prismic = getPrismicClient(req);

    try{
        const response = await prismic.getByUID('post', String(params?.slug));


        const post = {
            slug: String(params?.slug),
            title: RichText.asText(response.data.title),
            description: RichText.asHtml(response.data.description),
            cover: response.data.cover.url,
            updateAt: new Date(response.last_publication_date).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }

        return {
            props:{
                post
            }
        }


    }catch{
        return{
            redirect:{
                destination: '/posts',
                permanent: false
            }
        }
    }

}