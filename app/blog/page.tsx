import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import BlogIndexClient from "./BlogIndexClient";

type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  audience: string;
  country: string;
  province?: string;
  state?: string;
  tldr: string[];
  coverImage?: any;
};

export default async function BlogIndexPage() {
  const posts: PostListItem[] = await client.fetch(POSTS_QUERY);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <BlogIndexClient posts={posts} />
    </main>
  );
}
