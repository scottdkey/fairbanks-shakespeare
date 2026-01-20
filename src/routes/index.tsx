import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-400 via-slate-400 to-slate-900">
      <h1 className="text-white text-3xl font-bold p-8">Fairbanks Shakespeare</h1>
      <div className="p-8">
        <p className="text-white text-lg">
          Welcome to the Fairbanks Shakespeare!
        </p>
      </div>
    </div >
  )
}
