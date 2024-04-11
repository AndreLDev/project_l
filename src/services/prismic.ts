import * as Prismic from '@prismicio/client';

export function getPrismicClient(req?: unknown){
    const prismic = Prismic.createClient('https://project-l.cdn.prismic.io/api/v2');

    return prismic
}