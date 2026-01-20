import { betterAuth } from 'better-auth'
import { admin } from 'better-auth/plugins'
import { Pool } from '@neondatabase/serverless'

let _auth: ReturnType<typeof betterAuth> | undefined

export function getAuth() {
  if (!_auth) {
    _auth = betterAuth({
      database: new Pool({
        connectionString: process.env.VITE_DATABASE_URL,
      }),
      baseURL: process.env.BETTER_AUTH_URL,
      secret: process.env.BETTER_AUTH_SECRET,
      emailAndPassword: {
        enabled: true,
      },
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      },
      user: {
        additionalFields: {
          approved: {
            type: 'boolean',
            defaultValue: false,
            required: false,
          },
        },
      },
      plugins: [
        admin({
          defaultRole: 'user',
        }),
      ],
    })
  }
  return _auth
}

// For backwards compatibility - lazily initialized
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(_, prop) {
    return (getAuth() as any)[prop]
  },
})
