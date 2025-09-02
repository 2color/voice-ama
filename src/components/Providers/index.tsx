import * as React from 'react'
// Provider components
import SEO from './SEO'
import Toast from './Toaster'
import ReactQuery from './ReactQuery'
// Authentication
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

/**
 * Props for the main Providers wrapper component
 */
interface Props {
  children?: React.ReactNode // App content to wrap with providers
  session: Session // NextAuth session data from server
}

/**
 * Main providers wrapper component
 * Sets up global application context providers in the correct order:
 * 1. SEO - Global meta tags and Open Graph data
 * 2. Toast - Global notification system
 * 3. SessionProvider - NextAuth authentication context
 * 4. ReactQuery - Data fetching and caching context
 */
export default function Providers({ session, children }: Props) {
  return (
    <>
      {/* Global SEO configuration */}
      <SEO />
      {/* Global toast notification system */}
      <Toast />
      {/* Authentication provider with session data */}
      <SessionProvider session={session}>
        {/* Data fetching and caching provider */}
        <ReactQuery>{children}</ReactQuery>
      </SessionProvider>
    </>
  )
}
