import { A } from '@solidjs/router'

export default function Nav() {
  return (
    <nav class="bg-gray-800 p-4">
      <div class="flex items-center gap-6">
        <A href="/" class="text-white text-xl font-semibold hover:text-gray-300">
          Fairbanks Shakespeare
        </A>
        <div class="flex gap-4">
          <A
            href="/"
            class="text-gray-300 hover:text-white"
            activeClass="text-white font-medium"
            end
          >
            Home
          </A>
          <A
            href="/about"
            class="text-gray-300 hover:text-white"
            activeClass="text-white font-medium"
          >
            About
          </A>
        </div>
      </div>
    </nav>
  )
}
