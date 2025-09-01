import * as React from 'react'
import Page, { PageHeader } from '~/components/Page'
import AMAQuestions from '~/components/AMAQuestions'
import { CenteredColumn } from '~/components/Layouts'
import { Highlighter } from '~/components/Highlighter'
import { useQuery } from '@tanstack/react-query'
import { NextSeo } from 'next-seo'
import routes from '~/config/routes'
import { prisma } from '~/lib/prisma'
import { AmaQuestion } from '~/types/Ama'
import { signIn, signOut, useSession } from 'next-auth/react'
import { getVisitors } from '~/lib/api'
import { GetStaticProps, GetStaticPropsContext } from 'next'

interface AMAProps {
  questions: AmaQuestion[]
  visitors: number
}

const AMA: React.FC<AMAProps> = ({ questions, visitors: initialVisitors }) => {
  const { data: visitors } = useQuery({
    queryKey: ['visitors'],
    queryFn: getVisitors,
    refetchInterval: false,
    initialData: initialVisitors,
  })

  const { status, data: session } = useSession({ required: false })
  const isAuthenticated = status === 'authenticated'

  return (
    <Page>
      <NextSeo
        title={routes.ama.seo.title}
        description={routes.ama.seo.description}
        openGraph={routes.ama.seo.openGraph}
      />

      <CenteredColumn>
        <div className="space-y-8">
          <div className="flex items-center">
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
            {status === 'unauthenticated' && (
              <button
                onClick={signIn.bind(signIn, 'github')}
                className="leading-snug text-tertiary hover:text-gray-1000 dark:hover:text-gray-100"
              >
                Login
              </button>
            )}
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

function people(visitors: number): string {
  return visitors === 1 ? 'person' : 'people'
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const [questions, visitors] = await Promise.all([
    prisma.ama.findMany({
      where: {
        status: 'ANSWERED',
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
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
      questions,
      visitors,
    },
    revalidate: 1,
  }
}

export default AMA
