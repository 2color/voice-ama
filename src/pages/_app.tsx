import * as React from 'react'
import Providers from '~/components/Providers'
import '~/styles/tailwind.css'
import '~/styles/custom-styles.css'
import '~/styles/syntax-highlighting.css'
import '~/styles/prose-styles.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <Providers session={session}>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
      <Component session={session} {...pageProps} />
    </Providers>
  )
}

export default MyApp
