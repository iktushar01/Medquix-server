import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from '@neondatabase/serverless'
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Please ensure it is defined in your environment variables.')
}

// Serverless-safe Neon pool
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
