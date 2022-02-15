import { getEndpoint, createClient } from '@prismicio/client'

export function createPrismicClient(req: unknown) {
  const endpoint = getEndpoint('ignite-news-next')
  const client = createClient(endpoint, { accessToken: process.env.PRISMIC_ACCESS_TOKEN })
  client.enableAutoPreviewsFromReq(req)
  return client
}