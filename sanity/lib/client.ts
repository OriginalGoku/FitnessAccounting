import { createClient } from "next-sanity";
export const SANITY_API_VERSION = "2026-02-04";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
});
