import React from 'react'
import Link from 'next/link'
import { CenteredColumn } from '../Layouts'

export function Footer() {
  return (
    <CenteredColumn>
      <div className="h-px bg-gray-200 dark:bg-gray-800 timeline-stroke" />
      <div className="grid grid-cols-1 gap-4 p-6 py-24 bg-gray-100 sm:grid-cols-3 dark:bg-gray-900 sm:bg-gray-50 sm:dark:bg-gray-1000">
        <div className="space-y-4 ">
          <Link href="/" as="/" passHref className="black-link">
            Home
          </Link>

          <Link href="/about" as="/about" passHref className="black-link">
            About
          </Link>

          <a href="https://twitter.com/daniel2color" className="black-link">
            @daniel2color
          </a>
        </div>

        <div className="space-y-4 ">
          <Link href="/writing" as="/writing" passHref className="black-link">
            Writing
          </Link>
          <Link
            href="/app-dissection"
            as="/app-dissection"
            passHref
            className="black-link"
          >
            App Dissection
          </Link>
          <Link href="/ama" as="/ama" passHref className="black-link">
            AMA
          </Link>
        </div>

        <div className="space-y-4 ">
          <Link
            href="/bookmarks"
            as="/bookmarks"
            passHref
            className="black-link"
          >
            Bookmarks
          </Link>

          <Link href="/hn" as="/hn" passHref className="black-link">
            Hacker News
          </Link>

          <Link href="/stack" as="/stack" passHref className="black-link">
            My Stack
          </Link>

          <Link href="/security" as="/security" passHref className="black-link">
            Security Checklist
          </Link>
        </div>
      </div>
    </CenteredColumn>
  )
}
