import * as React from 'react'
import { Textarea } from '~/components/Input'
import Button, { DeleteButton } from '../Button'
import AudioRecorder from '../AudioRecorder'
import toast from 'react-hot-toast'
import { AmaQuestion } from '~/types/Ama'
import { deleteAma, updateAMAQuestion } from '~/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Props {
  question: AmaQuestion
  onDone: any
}

interface State {
  question: string
  answer: string
  error: string
  waveform: number[]
  src: string
  isRecording: boolean
}

type Action =
  | { type: 'edit-question'; value: string }
  | { type: 'edit-answer'; value: string }
  | { type: 'error'; value: string }
  | { type: 'is-recording'; value: boolean }
  | { type: 'remove-audio' }
  | { type: 'add-waveform'; value: { waveform: number[]; src: string } }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'edit-question': {
      return {
        ...state,
        error: '',
        question: action.value,
      }
    }
    case 'edit-answer': {
      return {
        ...state,
        answer: action.value,
      }
    }
    case 'add-waveform': {
      return {
        ...state,
        waveform: action.value.waveform,
        src: action.value.src,
      }
    }
    case 'is-recording': {
      return {
        ...state,
        isRecording: action.value,
      }
    }
    case 'remove-audio': {
      return {
        ...state,
        waveform: null,
        src: null,
      }
    }
    case 'error': {
      return {
        ...state,
        error: action.value,
      }
    }
    default:
      throw new Error()
  }
}

export default function EditQuestion({ question, onDone }: Props) {
  const queryClient = useQueryClient()
  const initialState = {
    question: question.question,
    answer: question.answer || '',
    waveform: question.audioWaveform,
    src: question.audioUrl,
    error: '',
    isRecording: false,
  }

  const [state, dispatch] = React.useReducer(reducer, initialState)

  const deleteQuestion = useMutation({
    mutationFn: () => deleteAma(question.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['questions', question.status],
      })
      return onDone()
    },
    onError: (error) => {
      toast(`Error deleting question: ${error}`)
    },
  })

  const updateQuestion = useMutation<AmaQuestion>({
    mutationFn: () => {
      // Status is ANSWERED if there's a text answer or audio url
      const status =
        state.answer.length > 0 || state.src ? 'ANSWERED' : 'UNANSWERED'

      return updateAMAQuestion(question.id, {
        answer: state.answer,
        status: status,
        question: state.question,
        audioUrl: state.src,
        audioWaveform: state.waveform,
      })
    },
    onSuccess: async () => {
      // Invalidate to refetch both answered and unanswered questions in case the status changes
      // awaiting the invalidate ensures that the new waveform is re-rendered
      onDone()
      await queryClient.invalidateQueries({
        queryKey: ['questions'],
      })
      return
    },
    onError: (error) => {
      toast(`Error deleting question: ${error}`)
    },
  })

  function handleSave(e) {
    e.preventDefault()
    updateQuestion.mutate()
  }

  function onQuestionChange(e) {
    return dispatch({ type: 'edit-question', value: e.target.value })
  }

  function onAnswerChange(e) {
    return dispatch({ type: 'edit-answer', value: e.target.value })
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      updateQuestion.mutate()
    }
  }

  // async function onTranscriptionComplete({ transcript, waveform, src }) {
  //   dispatch({ type: 'edit-answer', value: transcript })
  //   dispatch({ type: 'add-waveform', value: { waveform, src } })
  //   dispatch({ type: 'is-recording', value: false })
  // }

  async function onUploadCompleteComplete({ waveform, src }) {
    dispatch({ type: 'add-waveform', value: { waveform, src } })
    dispatch({ type: 'is-recording', value: false })
    updateQuestion.mutate()
  }

  function onRecordingStart() {
    // signUploadMutation.mutate()
    dispatch({ type: 'is-recording', value: true })
  }

  function onRecordingStop() {
    // signUploadMutation.mutate()
    dispatch({ type: 'is-recording', value: false })
  }

  function onDeleteAudio() {
    dispatch({ type: 'remove-audio' })
  }

  return (
    <>
      <div className="p-4 space-y-6 bg-white border border-gray-200 rounded-md shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-semibold text-primary">Question</p>
          <Textarea
            placeholder="Question"
            value={state.question}
            onChange={onQuestionChange}
            onKeyDown={onKeyDown}
          />
        </div>

        <div className="flex flex-col space-y-2 ">
          <p className="text-sm font-semibold text-primary">Record answer</p>
          <AudioRecorder
            id={question.id}
            initialAudioUrl={state.src}
            initialWaveform={state.waveform}
            onUploadCompleteComplete={onUploadCompleteComplete}
            // onTranscriptionComplete={onTranscriptionComplete}
            onRecordingStart={onRecordingStart}
            onRecordingStop={onRecordingStop}
            onDeleteAudio={onDeleteAudio}
          />
        </div>

        {
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-semibold text-primary">
              {/* {state.waveform ? 'Transcript' : 'Answer'} */}
              {'Answer'}
            </p>
            <Textarea
              placeholder="Answer..."
              value={state.answer}
              onChange={onAnswerChange}
              onKeyDown={onKeyDown}
              rows={5}
            />
          </div>
        }

        {state.error && <p className="text-red-500">{state.error}</p>}

        {state.isRecording && (
          <div className="flex justify-between space-between">
            <Button onClick={onDone}>Cancel</Button>
          </div>
        )}

        {!state.isRecording && (
          <div className="flex justify-between space-between">
            <DeleteButton onClick={() => deleteQuestion.mutate()}>
              Delete question
            </DeleteButton>
            <div className="flex space-x-3">
              <Button onClick={onDone}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// const [editQuestion] = useEditAmaQuestionMutation({
//   variables: {
//     question: state.question,
//     id: question.id,
//     answer: state.answer,
//     status:
//       state.answer.length > 0 || state.waveform?.length > 0
//         ? AmaStatus.Answered
//         : AmaStatus.Pending,
//     audioWaveform: state.waveform,
//   },
//   optimisticResponse: {
//     __typename: 'Mutation',
//     editAMAQuestion: {
//       __typename: 'AMA',
//       ...question,
//       question: state.question,
//       answer: state.answer,
//       status:
//         state.answer.length > 0 ? AmaStatus.Answered : AmaStatus.Pending,
//       updatedAt: `${new Date().getTime()}`,
//       audioWaveform: state.waveform,
//       audioUrl: state.src,
//     },
//   },
//   refetchQueries: [
//     {
//       query: GET_AMA_QUESTIONS,
//       variables: {
//         status: AmaStatus.Answered,
//       },
//     },
//   ],
//   update(cache) {
//     const { amaQuestions } = cache.readQuery({
//       query: GET_AMA_QUESTIONS,
//       variables: {
//         status: AmaStatus.Pending,
//       },
//     })
//     cache.writeQuery({
//       query: GET_AMA_QUESTIONS,
//       variables: {
//         status: AmaStatus.Pending,
//       },
//       data: {
//         amaQuestions: amaQuestions.filter((o) => o.id !== question.id),
//       },
//     })
//   },
//   onCompleted() {
//     toast.success('Saved!')
//   },
// })
