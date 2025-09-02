import * as React from 'react'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { defaultSEO } from '~/config/seo'

export default function SEO() {
  return (
    <React.Fragment>
      <DefaultSeo {...defaultSEO} />
      <Head>
        <meta name="theme-color" content={'#fefefe'} />
        <link rel="apple-touch-icon" href="/static/meta/apple-touch-icon.png" />
        <link
          rel="mask-icon"
          href="/static/meta/mask-icon.svg"
          color={'#050505'}
        />
        <link rel="manifest" href="/static/meta/manifest.json" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/favicon-32x32.png"
        />
      </Head>
    </React.Fragment>
  )
}
