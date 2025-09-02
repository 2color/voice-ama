import * as React from 'react'
import Providers from '~/components/Providers'
// Global styles - Tailwind base, components, utilities + custom styles
import '~/styles/globals.css'
// Code syntax highlighting for markdown content
import '~/styles/syntax-highlighting.css'
// Prose typography styles for markdown rendering
import '~/styles/prose-styles.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

/**
 * Main App component that wraps all pages
 * Provides global providers and development tools
 */
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <Providers session={session}>
      {/* Show React Query devtools only in development */}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
      <Component session={session} {...pageProps} />
    </Providers>
  )
}

export default MyApp
