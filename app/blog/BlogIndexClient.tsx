"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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
};

const audienceLabel: Record<string, string> = {
  personal_trainer: "Personal Trainer",
  online_coach: "Coach / Online Trainer",
  studio_owner: "Studio / Gym Owner",
  contractor_studio: "Contractor-based Studio",
  all: "All fitness businesses",
};

const countryLabel: Record<string, string> = {
  CA: "Canada",
  US: "United States",
};

export default function BlogIndexClient({ posts }: { posts: PostListItem[] }) {
  const [audience, setAudience] = useState<string>("all");
  const [country, setCountry] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return posts.filter((p) => {
      const matchesAudience =
        audience === "all" ? true : p.audience === audience;
      const matchesCountry = country === "all" ? true : p.country === country;

      const haystack = `${p.title} ${(p.tldr ?? []).join(" ")}`.toLowerCase();
      const matchesSearch = q ? haystack.includes(q) : true;

      return matchesAudience && matchesCountry && matchesSearch;
    });
  }, [posts, audience, country, search]);

  return (
    <>
      {/* Filters */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title / TL;DR…"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All audiences</option>
          <option value="personal_trainer">Personal Trainer</option>
          <option value="online_coach">Coach / Online Trainer</option>
          <option value="studio_owner">Studio / Gym Owner</option>
          <option value="contractor_studio">Contractor-based Studio</option>
        </select>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All countries</option>
          <option value="CA">Canada</option>
          <option value="US">United States</option>
        </select>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        Showing {filtered.length} of {posts.length}
      </div>

      {/* List */}
      <div className="mt-6 space-y-6">
        {filtered.map((p) => {
          const region = p.country === "US" ? p.state : p.province;
          const loc = [countryLabel[p.country] ?? p.country, region]
            .filter(Boolean)
            .join(" · ");

          return (
            <article key={p._id} className="rounded-xl border p-5">
              <div className="text-xs text-gray-600">
                Useful for: {audienceLabel[p.audience] ?? p.audience} • {loc}
              </div>

              <h2 className="mt-2 text-xl font-semibold">
                <Link href={`/blog/${p.slug}`} className="hover:underline">
                  {p.title}
                </Link>
              </h2>

              <ul className="mt-3 list-disc pl-5 text-sm text-gray-800">
                {(p.tldr ?? []).slice(0, 4).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </>
  );
}
