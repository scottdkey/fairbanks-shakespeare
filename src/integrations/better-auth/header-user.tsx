import { authClient } from '@/lib/auth-client'
import { Link } from '@tanstack/react-router'
import { Shield } from 'lucide-react'

export default function BetterAuthHeader() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="h-8 w-8 bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
    )
  }

  if (session?.user) {
    const isAdmin = session.user.role === 'admin'

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {session.user.image ? (
            <img src={session.user.image} alt="" className="h-8 w-8 rounded-full" />
          ) : (
            <div className="h-8 w-8 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-full">
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                {session.user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {session.user.name}
            </div>
            {isAdmin && (
              <div className="text-xs text-purple-400">Admin</div>
            )}
          </div>
        </div>
        {isAdmin && (
          <Link
            to="/users"
            className="flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            <Shield className="w-4 h-4" />
            Manage Users
          </Link>
        )}
        <button
          onClick={() => authClient.signOut()}
          className="h-9 px-4 text-sm font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <Link
      to="/sign-in"
      className="h-9 px-4 text-sm font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors inline-flex items-center justify-center"
    >
      Sign in
    </Link>
  )
}
