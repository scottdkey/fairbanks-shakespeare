import { Title, Meta } from '@solidjs/meta'
import { createAsync, query } from '@solidjs/router'
import { For, Show } from 'solid-js'
import { sanityClient } from '@/lib/sanity'

type TeamMember = {
  name: string
  jobTitle: string
  blurb: string | null
  image: {
    asset: {
      url: string
    }
  } | null
}

type AboutPageData = {
  title: string
  description: string | null
  teamMembers: TeamMember[] | null
}

const getAboutPage = query(async () => {
  const data = await sanityClient.fetch<AboutPageData | null>(
    `*[_type == "aboutPage"][0]{
      title,
      description,
      teamMembers[]{
        name,
        jobTitle,
        blurb,
        image{
          asset->{
            url
          }
        }
      }
    }`
  )
  return data
}, 'aboutPage')

export const route = {
  preload: () => getAboutPage(),
}

export default function About() {
  const data = createAsync(() => getAboutPage())

  return (
    <main class="min-h-screen bg-linear-to-b from-slate-400 via-slate-400 to-slate-900 p-8">
      <Title>{data()?.title ?? 'About'} - Fairbanks Shakespeare</Title>
      {data()?.description && <Meta name="description" content={data()!.description!} />}
      <h1 class="text-white text-3xl font-bold mb-4">{data()?.title ?? 'About'}</h1>
      <p class="text-white text-lg mb-8">
        {data()?.description ?? 'Fairbanks Shakespeare brings the timeless works of William Shakespeare to the Fairbanks community.'}
      </p>

      <Show when={data()?.teamMembers && data()!.teamMembers!.length > 0}>
        <h2 class="text-white text-2xl font-bold mb-6">Our Team</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <For each={data()?.teamMembers}>
            {(member) => (
              <div class="bg-white/10 rounded-lg p-6">
                <Show when={member.image?.asset?.url}>
                  <img
                    src={member.image!.asset.url}
                    alt={member.name}
                    class="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                  />
                </Show>
                <h3 class="text-white text-xl font-semibold text-center">{member.name}</h3>
                <p class="text-slate-300 text-center mb-2">{member.jobTitle}</p>
                <Show when={member.blurb}>
                  <p class="text-slate-200 text-sm">{member.blurb}</p>
                </Show>
              </div>
            )}
          </For>
        </div>
      </Show>
    </main>
  )
}
