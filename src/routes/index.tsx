import { Title, Meta } from '@solidjs/meta'
import { createAsync, query } from '@solidjs/router'
import { sanityClient } from '@/lib/sanity'

type HomePageData = {
  title: string
  description: string | null
  heroHeading: string | null
  heroSubheading: string | null
}

const getHomePage = query(async () => {
  const data = await sanityClient.fetch<HomePageData | null>(
    `*[_type == "homePage"][0]{
      title,
      description,
      heroHeading,
      heroSubheading
    }`
  )
  return data
}, 'homePage')

export const route = {
  preload: () => getHomePage(),
}

export default function Home() {
  const data = createAsync(() => getHomePage())

  return (
    <main class="min-h-screen bg-linear-to-b from-slate-400 via-slate-400 to-slate-900">
      <Title>{data()?.title ?? 'Fairbanks Shakespeare'}</Title>
      {data()?.description && <Meta name="description" content={data()!.description!} />}
      <h1 class="text-white text-3xl font-bold p-8">
        {data()?.heroHeading ?? 'Fairbanks Shakespeare'}
      </h1>
      <div class="p-8">
        <p class="text-white text-lg">
          {data()?.heroSubheading ?? 'Welcome to the Fairbanks Shakespeare!'}
        </p>
      </div>
    </main>
  )
}
