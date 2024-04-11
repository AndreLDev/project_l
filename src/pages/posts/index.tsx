import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "./styles.module.scss";
import Link from "next/link";
import Image from "next/image";
import {FiChevronLeft, FiChevronsLeft, FiChevronRight, FiChevronsRight} from "react-icons/fi";
import {RichText} from 'prismic-dom';
import { getPrismicClient } from "../../services/prismic";
import { useState } from "react";


type Post = {
    slug: string | null,
    title: string,
    description: string,
    cover: string,
    updateAt: string
}

interface PostsProps{
    posts:Post[],
    page: string,
    totalPage: string
}

export default function Posts({posts: postsBlog, page, totalPage}: PostsProps){
    const [currentPage, setCurrentPage] = useState(Number(page))
    const [posts, setPosts] = useState(postsBlog || [])



    async function reqPost(pageNumber: number) {
        const prismic = getPrismicClient();
        const response = await prismic.getByType('post',{
            orderings: {
                field: 'document.first_publication_date',
                direction: 'desc',
            },
            fetch: ['post.title', 'post.description', 'post.cover'],
            pageSize: 3,
            page: pageNumber
        });

        return response
    }

    async function navigatePage(pageNumber : number) {
        const response = await reqPost(pageNumber)

        if(response.results.length == 0){
            return;
        }

        const getPosts = response.results.map(post => {
            return{
                slug: post.uid,
                title: RichText.asText(post.data.title),
                description: post.data.description.find( (content: { type: string; }) => content.type === 'paragraph')?.text ?? '',
                cover: post.data.cover.url,
                updateAt: new Date(post.last_publication_date).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
            }
        })
        
        setCurrentPage(pageNumber)
        setPosts(getPosts);
    }

    return(
        <>
            <Head>
                <title>Blog | Aquila Capital</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map( post => (
                        <Link key={post.slug} href={`/posts/${post.slug}`} className={styles.linkContainer}>
                            <Image src={post.cover} alt={post.title} width={720} height={410} quality={100} layout="responsive" placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO0tTVeCwACyAFcwiB+6wAAAABJRU5ErkJggg=="/>
                            <strong>{post.title}</strong>
                            <time>{post.updateAt}</time>
                            <p>{post.description}</p>
                        </Link>
                    ))}


                    <div className={styles.buttonNavigate}>
                        {currentPage >= 2 && (
                            <div>
                                <button onClick={ () => navigatePage(1)}>
                                    <FiChevronsLeft size={25} color="#FFF" />
                                </button>
                                <button onClick={ () => navigatePage(currentPage -1)}>
                                    <FiChevronLeft size={25} color="#FFF" />
                                </button>
                            </div>
                        )}
                        
                        {currentPage < Number(totalPage) && (
                            <div>
                                <button onClick={ () => navigatePage(currentPage + 1)}>
                                    <FiChevronsRight size={25} color="#FFF" />
                                </button>
                                <button onClick={ () => navigatePage(Number(totalPage))}>
                                    <FiChevronRight size={25} color="#FFF" />
                                </button>
                            </div>
                        )}
                    </div>
                    
                </div>
            </main>
        </>
    )
}


export const getStaticProps: GetStaticProps = async () => {

    const prismic = getPrismicClient();
    const response = await prismic.getByType('post',{
        orderings: {
            field: 'document.first_publication_date',
            direction: 'desc',
          },
        fetch: ['post.title', 'post.description', 'post.cover'],
        pageSize: 3
    });


    //console.log(JSON.stringify(response, null, 2)) 

    const posts = response.results.map(post => {
        return{
            slug: post.uid,
            title: RichText.asText(post.data.title),
            description: post.data.description.find( (content: { type: string; }) => content.type === 'paragraph')?.text ?? '',
            cover: post.data.cover.url,
            updateAt: new Date(post.last_publication_date).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return{
        props:{
            posts,
            page: response.page,
            totalPage: response.total_pages
        },
        revalidate: 60 * 30
      }
}