import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { approveUser } from '@/lib/user-actions'
import { useEffect, useState } from 'react'
import { Check, X, Shield, UserX, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

type User = {
  id: string
  name: string
  email: string
  image: string | null
  role: string | null
  banned: boolean | null
  banReason: string | null
  banExpires: Date | null
  approved: boolean | null
  createdAt: Date
}

function UsersPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const isAdmin = session?.user?.role === 'admin'

  useEffect(() => {
    if (!sessionPending && !session?.user) {
      navigate({ to: '/sign-in' })
    }
  }, [session, sessionPending, navigate])

  useEffect(() => {
    if (!sessionPending && session?.user && !isAdmin) {
      navigate({ to: '/' })
    }
  }, [session, sessionPending, isAdmin, navigate])

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin])

  const fetchUsers = async () => {
    setLoading(true)
    const response = await authClient.admin.listUsers({
      query: {
        limit: 100,
      },
    })
    if (response.data?.users) {
      setUsers(response.data.users as User[])
    }
    setLoading(false)
  }

  const handleApprove = async (userId: string) => {
    setActionLoading(userId)
    await approveUser({ data: { userId } })
    await fetchUsers()
    setActionLoading(null)
  }

  const handleSetAdmin = async (userId: string) => {
    setActionLoading(userId)
    await authClient.admin.setRole({
      userId,
      role: 'admin',
    })
    await fetchUsers()
    setActionLoading(null)
  }

  const handleSetUser = async (userId: string) => {
    setActionLoading(userId)
    await authClient.admin.setRole({
      userId,
      role: 'user',
    })
    await fetchUsers()
    setActionLoading(null)
  }

  const handleBan = async (userId: string) => {
    setActionLoading(userId)
    await authClient.admin.banUser({
      userId,
      banReason: 'Removed by admin',
    })
    await fetchUsers()
    setActionLoading(null)
  }

  const handleUnban = async (userId: string) => {
    setActionLoading(userId)
    await authClient.admin.unbanUser({
      userId,
    })
    await fetchUsers()
    setActionLoading(null)
  }

  const handleRevoke = async (userId: string) => {
    setActionLoading(userId)
    await authClient.admin.revokeUserSessions({
      userId,
    })
    await fetchUsers()
    setActionLoading(null)
  }

  if (sessionPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="animate-pulse text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">
            Approve new users, manage roles, and revoke access
          </p>
        </div>

        <div className=" border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold ">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold ">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold ">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt=""
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-300">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${user.role === 'admin'
                          ? 'bg-purple-900 text-purple-300'
                          : 'bg-gray-700 text-gray-300'
                        }`}
                    >
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.banned ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-red-900 text-red-300">
                        Banned
                      </span>
                    ) : user.approved ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-green-900 text-green-300">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-yellow-900 text-yellow-300">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {actionLoading === user.id ? (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      ) : (
                        <>
                          {!user.approved && !user.banned && (
                            <button
                              onClick={() => handleApprove(user.id)}
                              className="p-2 text-green-400 hover:bg-green-900/50 transition-colors"
                              title="Approve user"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleSetAdmin(user.id)}
                              className="p-2 text-purple-400 hover:bg-purple-900/50 transition-colors"
                              title="Make admin"
                            >
                              <Shield className="w-5 h-5" />
                            </button>
                          )}
                          {user.role === 'admin' &&
                            user.id !== session?.user?.id && (
                              <button
                                onClick={() => handleSetUser(user.id)}
                                className="p-2 text-gray-400 hover:bg-gray-700 transition-colors"
                                title="Remove admin"
                              >
                                <Shield className="w-5 h-5" />
                              </button>
                            )}
                          {!user.banned && user.id !== session?.user?.id && (
                            <button
                              onClick={() => handleBan(user.id)}
                              className="p-2 text-red-400 hover:bg-red-900/50 transition-colors"
                              title="Ban user"
                            >
                              <UserX className="w-5 h-5" />
                            </button>
                          )}
                          {user.banned && (
                            <button
                              onClick={() => handleUnban(user.id)}
                              className="p-2 text-green-400 hover:bg-green-900/50 transition-colors"
                              title="Unban user"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          {user.id !== session?.user?.id && (
                            <button
                              onClick={() => handleRevoke(user.id)}
                              className="p-2 text-orange-400 hover:bg-orange-900/50 transition-colors"
                              title="Revoke all sessions"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-8 text-center text-gray-400">No users found</div>
          )}
        </div>
      </div>
    </div>
  )
}
