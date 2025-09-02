import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '~/lib/prisma'

/**
 * NextAuth configuration for GitHub OAuth authentication
 * Uses Prisma adapter to store user sessions in the database
 * Adds admin role information to user sessions
 */
export const authOptions = {
  // Enable debug logging in development
  debug: process.env.NEXTAUTH_DEBUG === 'true',

  // Use Prisma adapter for database session storage
  adapter: PrismaAdapter(prisma),

  // Authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  // Custom callbacks to modify session data
  callbacks: {
    async session({ session, user }) {
      // Add admin flag to client-side session object
      // This allows UI to conditionally show admin features
      session.isAdmin = user.isAdmin
      return session
    },
  },
}

export default NextAuth(authOptions)
