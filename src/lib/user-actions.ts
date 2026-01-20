import { createServerFn } from '@tanstack/react-start'
import { Pool } from '@neondatabase/serverless'

const getPool = () =>
  new Pool({
    connectionString: process.env.VITE_DATABASE_URL,
  })

export const approveUser = createServerFn({ method: 'POST' })
  .inputValidator((d: { userId: string }) => d)
  .handler(async ({ data }) => {
    const pool = getPool()
    await pool.query('UPDATE "user" SET approved = true WHERE id = $1', [
      data.userId,
    ])
    return { success: true }
  })
