import { defineField, defineType } from "sanity";

const audienceOptions = [
  { title: "Personal Trainer (solo)", value: "personal_trainer" },
  { title: "Coach / Online Trainer", value: "online_coach" },
  { title: "Studio / Gym Owner", value: "studio_owner" },
  { title: "Contractor-based Studio", value: "contractor_studio" },
  { title: "All fitness businesses", value: "all" },
] as const;

const countryOptions = [
  { title: "Canada", value: "CA" },
  { title: "United States", value: "US" },
] as const;

// Phase 1: keep the list small; expand later.
const CA_REGIONS = [
  { title: "Ontario (ON)", value: "ON" },
  { title: "British Columbia (BC)", value: "BC" },
  { title: "Alberta (AB)", value: "AB" },
  { title: "Quebec (QC)", value: "QC" },
] as const;

const US_REGIONS = [
  { title: "California (CA)", value: "CA" },
  { title: "New York (NY)", value: "NY" },
  { title: "Texas (TX)", value: "TX" },
] as const;

export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "audience",
      title: "Useful for",
      type: "string",
      options: { list: [...audienceOptions], layout: "radio" },
      initialValue: "all",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "country",
      title: "Country",
      type: "string",
      options: { list: [...countryOptions], layout: "radio" },
      initialValue: "CA",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "province",
      title: "Province (Canada)",
      type: "string",
      options: {
        list: [
          { title: "Ontario (ON)", value: "ON" },
          { title: "British Columbia (BC)", value: "BC" },
          { title: "Alberta (AB)", value: "AB" },
          { title: "Quebec (QC)", value: "QC" },
          // expand later
        ],
      },
      hidden: ({ parent }) => parent?.country !== "CA",
      description: "Optional. Only set if the post is province-specific.",
    }),
    defineField({
      name: "state",
      title: "State (US)",
      type: "string",
      options: {
        list: [
          { title: "California (CA)", value: "CA" },
          { title: "New York (NY)", value: "NY" },
          { title: "Texas (TX)", value: "TX" },
          // expand later
        ],
      },
      hidden: ({ parent }) => parent?.country !== "US",
      description: "Optional. Only set if the post is state-specific.",
    }),

    defineField({
      name: "tldr",
      title: "TL;DR",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(2).max(4),
    }),

    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "cta",
      title: "CTA (optional)",
      type: "string",
      description: "Example: Book a free financial health check.",
    }),
    defineField({
      name: "hasCitations",
      title: "Has citations",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "sources",
      title: "Sources",
      type: "array",
      of: [
        {
          type: "object",
          name: "source",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "url", title: "URL", type: "url" },
            { name: "publisher", title: "Publisher", type: "string" },
            { name: "publishedAt", title: "Published date", type: "date" },
            {
              name: "note",
              title: "Note (optional)",
              type: "string",
              description: "What we used this source for",
            },
          ],
          preview: {
            select: { title: "title", subtitle: "publisher" },
          },
        },
      ],
    }),
  ],

  orderings: [
    {
      title: "Published date (newest first)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      title: "title",
      publishedAt: "publishedAt",
      audience: "audience",
      country: "country",
      region: "region",
      media: "coverImage",
    },
    prepare(selection) {
      const { title, publishedAt, audience, country, region, media } =
        selection as any;
      const loc = [country, region].filter(Boolean).join(" · ");
      const sub = [
        audience,
        loc,
        publishedAt ? new Date(publishedAt).toLocaleDateString() : "",
      ]
        .filter(Boolean)
        .join(" | ");
      return { title, subtitle: sub, media };
    },
  },
});
