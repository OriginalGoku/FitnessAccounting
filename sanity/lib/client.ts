import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-01-01",
  useCdn: true,
});
// import { createClient } from 'next-sanity'

// import { apiVersion, dataset, projectId } from '../env'

// export const client = createClient({
//   projectId,
//   dataset,
//   apiVersion,
//   useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
// })
