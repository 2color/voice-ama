import { PrismaClient } from '@prisma/client'

const isProduction = process.env.NODE_ENV === 'production'
export const prisma =
  globalThis.prisma || new PrismaClient({ log: isProduction ? ['query'] : [] })

if (!isProduction) globalThis.prisma = prisma
