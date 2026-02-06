export const POSTS_QUERY = /* groq */ `
*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  audience,
  country,
  province,
  state,
  tldr,
  cta,
  coverImage
}
`;


export const POST_BY_SLUG_QUERY = /* groq */ `
*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  audience,
  country,
  province,
  state,
  tldr,
  cta,
  coverImage,
  body,
  sources[]{
    title,
    url,
    publisher,
    publishedAt,
    note
  },
  hasCitations
}
`;

export const POST_SLUGS_QUERY = /* groq */ `
*[_type == "post" && defined(slug.current)][]{
  "slug": slug.current
}
`;
