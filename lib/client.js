import createClient from '@sanity/client';
import createImageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: 'x3pnb3iq',
    dataset: 'production',
    apiVersion: '2023-05-25',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
})

const builder = createImageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);