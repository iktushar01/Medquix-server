import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Create the pool for PostgreSQL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

// Create the adapter for PostgreSQL
const adapter = new PrismaPg(pool)

// Singleton pattern for serverless/dev
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter, // <-- correctly passing the adapter here
    log: ['query', 'info', 'warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
