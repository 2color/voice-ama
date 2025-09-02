import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function ReactQuery({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
