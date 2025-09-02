import * as React from 'react'
import { QuestionItem } from './QuestionItem'
import AskQuestion from './AskQuestion'
import PendingQuestions from './PendingQuestions'
import FullscreenLoading from '../FullscreenLoading'
import { AmaQuestion } from '~/types/Ama'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { getQuestions } from '~/lib/api'

const QuestionsList: React.FC<{ questions: AmaQuestion[] }> = (props) => {
  const { status, data: session } = useSession({ required: false })
  const isAuthenticated = status === 'authenticated'

  const { isLoading, data: questions } = useQuery({
    queryKey: ['questions', 'ANSWERED'],
    queryFn: () => getQuestions(true),
    initialData: props.questions,
    staleTime: 1000 * 60 * 5,
  })

  // const [showLoadMore, setShowLoadMore] = React.useState(true)
  // const [loading, setLoading] = React.useState(false)

  // pre-populate data from the cache, but check for any new ones after
  // the page loads
  // const { data, fetchMore, error } = useGetAmaQuestionsQuery({
  //   variables: { status: AmaStatus.Answered },
  // })

  // this can happen if the route is navigated to from the client or if the
  // cache fails to populate for whatever reason
  // if (!data || !data.amaQuestions) return <FullscreenLoading />
  // if (error) return null

  // React.useEffect(() => {
  //   if (questions.length < PAGINATION_AMOUNT) {
  //     setShowLoadMore(false)
  //   }
  // }, [questions])

  // function handleLoadMore() {
  //   if (loading) return

  //   setLoading(true)

  //   try {
  //     fetchMore({
  //       variables: {
  //         skip: questions.length,
  //       },
  //       updateQuery: (prev, { fetchMoreResult }) => {
  //         setLoading(false)

  //         if (!fetchMoreResult) return prev

  //         if (fetchMoreResult.amaQuestions.length < PAGINATION_AMOUNT) {
  //           // at the end of the list
  //           setShowLoadMore(false)
  //         }

  //         return Object.assign({}, prev, {
  //           amaQuestions: [
  //             ...prev.amaQuestions,
  //             ...fetchMoreResult.amaQuestions,
  //           ],
  //         })
  //       },
  //     })
  //   } catch (err) {
  //     setLoading(false)
  //   }
  // }

  if (isLoading) {
    return <FullscreenLoading />
  }

  return (
    <div className="mt-8 space-y-8 ">
      <AskQuestion />

      {isAuthenticated && session?.isAdmin && <PendingQuestions />}

      <div className="space-y-16">
        {questions.map((question) => (
          <QuestionItem
            editable={session?.isAdmin}
            key={question.id}
            question={question}
          />
        ))}
      </div>

      {questions.length === 0 && <p>No questions yet!</p>}

      {/* {showLoadMore && (
        <Button className="w-full" onClick={handleLoadMore}>
          {loading ? <LoadingSpinner /> : 'Show me more'}
        </Button>
      )} */}
    </div>
  )
}

export default QuestionsList
