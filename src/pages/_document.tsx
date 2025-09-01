import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html
        lang="en"
        className="text-base antialiased bg-gray-300 bg-opacity-5 dark:bg-gray-1000 dark:bg-opacity-100"
      >
        <Head></Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
