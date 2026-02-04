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
      {/*<h1 className="text-3xl font-semibold">Blog</h1>
      <p className="mt-2 text-sm text-gray-600">
        Short, TL;DR posts for fitness businesses.
      </p>*/}

      <BlogIndexClient posts={posts} />
    </main>
  );
}
// import Link from "next/link";
// import { client } from "@/sanity/lib/client";
// import { POSTS_QUERY } from "@/sanity/lib/queries";
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";

// const audienceLabel: Record<string, string> = {
//   personal_trainer: "Personal Trainer",
//   online_coach: "Coach / Online Trainer",
//   studio_owner: "Studio / Gym Owner",
//   contractor_studio: "Contractor-based Studio",
//   all: "All fitness businesses",
// };

// const countryLabel: Record<string, string> = {
//   CA: "Canada",
//   US: "United States",
// };

// type PostListItem = {
//   _id: string;
//   title: string;
//   slug: string;
//   publishedAt: string;
//   audience: string;
//   country: string;
//   province?: string;
//   state?: string;
//   tldr: string[];
//   coverImage?: any;
// };

// export default async function BlogIndexPage() {
//   const posts: PostListItem[] = await client.fetch(POSTS_QUERY);

//   return (
//     <main className="mx-auto max-w-3xl px-4 py-10">
//       <h1 className="text-3xl font-semibold">Blog</h1>
//       <p className="mt-2 text-sm text-gray-600">
//         Short, TL;DR posts for fitness businesses.
//       </p>

//       <div className="mt-8 space-y-6">
//         {posts.map((p) => {
//           const region = p.country === "US" ? p.state : p.province;
//           const loc = [countryLabel[p.country] ?? p.country, region].filter(Boolean).join(" · ");
//           // const loc = [countryLabel[p.country] ?? p.country, p.region]
//           //   .filter(Boolean)
//           //   .join(" · ");
//           return (
//             <article key={p._id} className="rounded-xl border p-5">
//               {p.coverImage ? (
//                 <div className="mt-3 overflow-hidden rounded-lg border">
//                   <Image
//                     src={urlFor(p.coverImage).width(1200).height(630).url()}
//                     alt={p.title}
//                     width={1200}
//                     height={630}
//                     className="h-auto w-full"
//                     priority={false}
//                   />
//                 </div>
//               ) : null}
//               <div className="text-xs text-gray-600">
//                 Useful for: {audienceLabel[p.audience] ?? p.audience} • {loc}
//               </div>

//               <h2 className="mt-2 text-xl font-semibold">
//                 <Link href={`/blog/${p.slug}`} className="hover:underline">
//                   {p.title}
//                 </Link>
//               </h2>

//               <ul className="mt-3 list-disc pl-5 text-sm text-gray-800">
//                 {p.tldr?.slice(0, 4).map((b, i) => (
//                   <li key={i}>{b}</li>
//                 ))}
//               </ul>
//             </article>
//           );
//         })}
//       </div>
//     </main>
//   );
// }
