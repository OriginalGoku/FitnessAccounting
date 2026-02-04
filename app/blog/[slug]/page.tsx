import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "next-sanity";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(POST_SLUGS_QUERY);
  return slugs.map((s) => ({ slug: s.slug }));
}



type Post = {
  title: string;
  publishedAt: string;
  audience: string;
  country: string;
  province?: string;
  state?: string;
  tldr: string[];
  body: any[];
  cta?: string;
  coverImage?: any;
};

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value) return null;
      return (
        <div className="my-6 overflow-hidden rounded-xl border">
          <Image
            src={urlFor(value).width(1400).url()}
            alt={value?.alt ?? ""}
            width={1400}
            height={800}
            className="h-auto w-full"
          />
        </div>
      );
    },
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post: Post | null = await client.fetch(POST_BY_SLUG_QUERY, { slug });

  if (!post) return notFound();

  const region = post.country === "US" ? post.state : post.province;
  const loc = [post.country, region].filter(Boolean).join(" · ");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-xs text-gray-600">Location: {loc}</div>

      <h1 className="mt-2 text-3xl font-semibold">{post.title}</h1>

      <section className="mt-6 rounded-xl border p-5">
        <h2 className="text-sm font-semibold">TL;DR</h2>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {post.tldr?.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>

      <article className="prose prose-gray mt-8 max-w-none">
        {post.coverImage ? (
          <div className="mt-6 overflow-hidden rounded-xl border">
            <Image
              src={urlFor(post.coverImage).width(1600).height(900).url()}
              alt={post.title}
              width={1600}
              height={900}
              className="h-auto w-full"
              priority
            />
          </div>
        ) : null}
        <PortableText  value={post.body} components={portableTextComponents} />
      </article>

      {post.cta ? (
        <div className="mt-8 rounded-xl border p-5">
          <div className="text-sm font-semibold">Next step</div>
          <div className="mt-1 text-sm">{post.cta}</div>
        </div>
      ) : null}

      <footer className="mt-10 text-xs text-gray-600">
        Disclaimer: I’m not a tax advisor. This is general information and
        bookkeeping education; it isn’t tax advice.
      </footer>
    </main>
  );
}
// import { notFound } from "next/navigation";
// import { client } from "@/sanity/lib/client";
// import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";
// import { PortableText } from "next-sanity";

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

// export async function generateStaticParams() {
//   // Optional, but fine even without export-mode; improves caching.
//   const slugs: { slug: string }[] = await client.fetch(POST_SLUGS_QUERY);
//   return slugs.map((s) => ({ slug: s.slug }));
// }

// type Post = {
//   title: string;
//   publishedAt: string;
//   audience: string;
//   country: string;
//   region?: string;
//   tldr: string[];
//   body: any[];
//   cta?: string;
// };

// export default async function BlogPostPage({ params }: { params: { slug: string } }) {
//   const post: Post | null = await client.fetch(POST_BY_SLUG_QUERY, { slug: params.slug });

//   if (!post) return notFound();

//   const region = post.country === "US" ? post.state : post.province;
//   const loc = [countryLabel[post.country] ?? post.country, region].filter(Boolean).join(" · ");
//   // const loc = [countryLabel[post.country] ?? post.country, post.region].filter(Boolean).join(" · ");

//   return (
//     <main className="mx-auto max-w-3xl px-4 py-10">
//       <div className="text-xs text-gray-600">
//         Useful for: {audienceLabel[post.audience] ?? post.audience} • {loc}
//       </div>

//       <h1 className="mt-2 text-3xl font-semibold">{post.title}</h1>

//       <section className="mt-6 rounded-xl border p-5">
//         <h2 className="text-sm font-semibold">TL;DR</h2>
//         <ul className="mt-2 list-disc pl-5 text-sm">
//           {post.tldr?.map((b, i) => <li key={i}>{b}</li>)}
//         </ul>
//       </section>

//       <article className="prose prose-gray mt-8 max-w-none">
//         <PortableText value={post.body} />
//       </article>

//       {post.cta ? (
//         <div className="mt-8 rounded-xl border p-5">
//           <div className="text-sm font-semibold">Next step</div>
//           <div className="mt-1 text-sm">{post.cta}</div>
//         </div>
//       ) : null}

//       <footer className="mt-10 text-xs text-gray-600">
//         Disclaimer: I’m not a tax advisor. This is general information and bookkeeping education; it isn’t tax advice.
//       </footer>
//     </main>
//   );
// }
