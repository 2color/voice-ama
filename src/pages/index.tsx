import * as React from 'react'
// UI Components
import Page, { PageHeader } from '~/components/Page'
import AMAQuestions from '~/components/AMAQuestions'
import { CenteredColumn } from '~/components/Layouts'
import { Highlighter } from '~/components/Highlighter'
// Data fetching and state management
import { useQuery } from '@tanstack/react-query'
import { NextSeo } from 'next-seo'
// Configuration and utilities
import routes from '~/config/routes'
import { prisma } from '~/lib/prisma'
import { AmaQuestion } from '~/types/Ama'
// Authentication
import { signIn, signOut, useSession } from 'next-auth/react'
// API functions
import { getVisitors } from '~/lib/api'
// Next.js types
import { GetStaticProps } from 'next'

/**
 * Props for the main AMA page
 * Note: dates are serialized as strings due to JSON serialization limitations
 */
interface AMAProps {
  questions: AmaQuestion[]
  visitors: number // Current online visitor count
}

/**
 * Main AMA (Ask Me Anything) page component
 * Displays answered questions and handles user authentication
 */
const AMA: React.FC<AMAProps> = ({ questions, visitors: initialVisitors }) => {
  // Real-time visitor count with React Query (updates from server periodically)
  const { data: visitors } = useQuery({
    queryKey: ['visitors'],
    queryFn: getVisitors,
    refetchInterval: false, // No auto-refresh to reduce server load
    initialData: initialVisitors, // Use SSG data as fallback
  })

  // NextAuth session management
  const { status, data: session } = useSession({ required: false })

  return (
    <Page>
      {/* SEO meta tags */}
      <NextSeo
        title={routes.ama.seo.title}
        description={routes.ama.seo.description}
        openGraph={routes.ama.seo.openGraph}
      />

      <CenteredColumn>
        <div className="space-y-8">
          {/* Header with authentication and visitor count */}
          <div className="flex items-center">
            {/* Authenticated user menu */}
            {status === 'authenticated' && (
              <div className="flex flex-row items-center gap-2 content-center">
                <img
                  className="w-8 h-8 rounded-full"
                  src={session.user.image}
                  alt=""
                  width="200"
                  height="200"
                />
                <button
                  onClick={() => signOut()}
                  className="leading-snug text-tertiary hover:text-gray-1000 dark:hover:text-gray-100 "
                >
                  Logout
                </button>
              </div>
            )}
            {/* Login button for unauthenticated users */}
            {status === 'unauthenticated' && (
              <button
                onClick={signIn.bind(signIn, 'github')}
                className="leading-snug text-tertiary hover:text-gray-1000 dark:hover:text-gray-100"
              >
                Login
              </button>
            )}
            {/* Live visitor counter with green indicator */}
            <div className={`ml-auto ${Number(visitors) === 0 && `hidden`}`}>
              <Highlighter count={visitors}>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <div className="ml-2">
                    {visitors} {people(visitors)} online
                  </div>
                </div>
              </Highlighter>
            </div>
          </div>
          <PageHeader
            title="Ask Daniel Anything"
            subtitle="Just for fun! Questions will be visible after I’ve answered."
          />
          <AMAQuestions questions={questions} />
        </div>
      </CenteredColumn>
    </Page>
  )
}

/**
 * Utility function to pluralize "person" vs "people"
 */
function people(visitors: number): string {
  return visitors === 1 ? 'person' : 'people'
}

/**
 * Static Site Generation (SSG) with Incremental Static Regeneration (ISR)
 * Fetches answered questions and current visitor count at build time
 * Regenerates every 1 second to keep content fresh
 */
export const getStaticProps: GetStaticProps = async () => {
  // Parallel database queries for optimal performance
  const [questions, visitors] = await Promise.all([
    // Get all answered questions, newest first
    prisma.ama.findMany({
      where: {
        status: 'ANSWERED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    // Count active visitors (visited in last 5 minutes)
    prisma.visitor.count({
      where: {
        // Track people that visited the website in the last 5 minutes
        lastSeen: {
          gt: new Date(new Date().getTime() - 5 * 60000),
        },
      },
    }),
  ])

  return {
    props: {
      // Convert Date objects to ISO strings for JSON serialization
      // This avoids the need for superjson or similar libraries
      questions: questions.map((q) => ({
        ...q,
        createdAt: q.createdAt.toISOString(),
        updatedAt: q.updatedAt.toISOString(),
      })),
      visitors,
    },
    // Revalidate every 1 second to keep content up-to-date
    revalidate: 1,
  }
}

export default AMA
