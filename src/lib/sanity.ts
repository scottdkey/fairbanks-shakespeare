import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'e2afdarw',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: true,
})
