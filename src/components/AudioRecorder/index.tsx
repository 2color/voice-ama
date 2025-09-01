// @ts-ignore
import * as React from 'react'
import AudioPlayer from '../AudioPlayer'
import Button, { DeleteButton, RecordingButton } from '../Button'
import Spinner from '../LoadingSpinner'
import { ErrorAlert } from '../Alert'
import { Trash } from 'react-feather'
import { useMutation } from '@tanstack/react-query'
import { signUpload, uploadToCloudinary } from '~/lib/api'

interface Props {
  id: string
  initialAudioUrl?: string
  initialWaveform?: number[]
  onRecordingStart?: Function
  onRecordingStop?: Function
  onRecordingError?: Function
  // onTranscriptionComplete?: (e: OnComplete) => void
  onDeleteAudio?: Function
  onUploadCompleteComplete: (e: { waveform: number[]; src: string }) => void
}

interface State {
  status:
    | 'idle'
    | 'recording'
    | 'recorded'
    | 'uploading'
    // | 'transcribing'
    | 'done'
  audioUrl: string | null
  audioBlob: Blob | null
  waveform: number[]
  // transcript: string | null
  error: string | null
}

type Action =
  | { type: 'reset' }
  | { type: 'start-recording' }
  | { type: 'stop-recording'; audioUrl: string; audioBlob: Blob }
  | { type: 'start-uploading' }
  // | { type: 'start-transcribing' }
  | { type: 'done'; transcript: string }
  | { type: 'set-waveform'; waveform: number[] }
  | { type: 'error'; error: string }
  | { type: 'delete' }

export default function AudioRecorder({
  id,
  initialAudioUrl = null,
  initialWaveform = [],
  onRecordingStart,
  onRecordingStop,
  onRecordingError,
  onDeleteAudio,
  onUploadCompleteComplete,
}: Props) {
  const initialState = {
    status: initialAudioUrl ? 'recorded' : 'idle',
    audioUrl: initialAudioUrl,
    audioBlob: null,
    waveform: initialWaveform,
    // transcript: null,
    error: null,
  }

  function reducer(state: State, action: Action) {
    switch (action.type) {
      case 'reset': {
        return initialState
      }
      case 'start-recording': {
        return {
          ...state,
          status: 'recording',
        }
      }
      case 'stop-recording': {
        return {
          ...state,
          status: 'recorded',
          audioUrl: action.audioUrl,
          audioBlob: action.audioBlob,
        }
      }
      case 'set-waveform': {
        return {
          ...state,
          waveform: action.waveform,
        }
      }
      case 'start-uploading': {
        return {
          ...state,
          status: 'uploading',
        }
      }
      // case 'start-transcribing': {
      //   return {
      //     ...state,
      //     status: 'transcribing',
      //   }
      // }
      case 'done': {
        return {
          ...state,
          // transcript: action.transcript,
          status: 'done',
        }
      }
      case 'error': {
        onRecordingError && onRecordingError()
        return {
          ...initialState,
          error: action.error,
        }
      }
      case 'delete': {
        return {
          ...initialState,
          audioUrl: null,
          audioBlob: null,
          waveform: [],
          // transcript: null,
          status: 'idle',
        }
      }
      default:
        throw new Error()
    }
  }

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [audioChunks, setAudioChunks] = React.useState([])
  const [mediaRecorder, setMediaRecorder] = React.useState(null)

  React.useEffect(() => {
    async function handleMediaSetup() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      try {
        let mr = new MediaRecorder(stream)
        console.log(`Recording with mimeType: ${mr.mimeType}`)
        setMediaRecorder(mr)
      } catch (e) {
        console.log(e)
      }
    }

    // navigator.getUserMedia =
    //   navigator.getUserMedia ||
    //   navigator.webkitGetUserMedia ||
    //   navigator.mozGetUserMedia ||
    //   navigator.msGetUserMedia

    if (navigator.mediaDevices) {
      handleMediaSetup()
    } else {
      dispatch({
        type: 'error',
        error: 'Media Decives will work only with SSL',
      })
    }
  }, [])

  React.useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          setAudioChunks((state) => [...state, e.data])
        }
      }
    }
  }, [mediaRecorder])

  function startRecording() {
    if (navigator.mediaDevices) {
      onRecordingStart && onRecordingStart()
      dispatch({ type: 'start-recording' })
      mediaRecorder.start(10)
    } else {
      dispatch({ type: 'error', error: 'Audio recording is not supported' })
    }
  }

  function stopRecording() {
    mediaRecorder.stop()
    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' })
    let audioUrl = window.URL.createObjectURL(audioBlob)
    onRecordingStop && onRecordingStop()
    dispatch({ type: 'stop-recording', audioUrl, audioBlob })
  }

  function reRecord() {
    dispatch({ type: 'reset' })
    setAudioChunks([])
    startRecording()
  }

  function handleDelete() {
    onDeleteAudio && onDeleteAudio()
    dispatch({ type: 'delete' })
    setAudioChunks([])
  }

  function handleUpload() {
    dispatch({ type: 'start-uploading' })
    signUploadMutation.mutate()
  }

  const signUploadMutation = useMutation({
    mutationFn: () => signUpload(),
    onSuccess: async (data, variables, context) => {
      const upload = await uploadToCloudinary(
        state.audioBlob,
        data.folder,
        `${data.timestamp}`,
        data.signature
      )
      onUploadCompleteComplete({
        waveform: state.waveform,
        src: upload.secure_url,
      })
    },
  })

  return (
    <div className="flex flex-col p-4 space-y-4 bg-gray-100 border border-gray-200 rounded-md dark:border-gray-800 dark:bg-gray-900">
      {state.status === 'idle' && (
        <Button onClick={startRecording}>
          {initialAudioUrl ? 'Re-record answer' : 'Record answer'}
        </Button>
      )}

      {state.status === 'recording' && (
        <RecordingButton onClick={stopRecording}>
          Stop recording...
        </RecordingButton>
      )}

      {state.audioUrl && state.status !== 'recording' && (
        <>
          <AudioPlayer
            id={null}
            isRecorder={true}
            waveform={state.waveform}
            setWaveformData={(waveform) =>
              dispatch({ type: 'set-waveform', waveform })
            }
            src={state.audioUrl}
          />
        </>
      )}

      {state.audioUrl && state.status !== 'uploading' && (
        <div className="flex justify-between w-full">
          {state.status !== 'recording' && (
            <DeleteButton onClick={handleDelete}>
              <Trash size={16} />
            </DeleteButton>
          )}

          {(state.status === 'recorded' || state.status === 'done') && (
            <div className="flex space-x-3">
              <Button onClick={reRecord}>Record again</Button>
              <Button onClick={handleUpload}>Upload audio</Button>
            </div>
          )}
        </div>
      )}

      {state.error && <ErrorAlert>{state.error}</ErrorAlert>}

      {state.status === 'uploading' && (
        <div className="flex items-center justify-center">
          <Spinner />
          <p className="text-primary">Uploading...</p>
        </div>
      )}

      {/* {state.status === 'transcribing' && (
        <div className="flex items-center justify-center">
          <Spinner />
          <p className="text-primary">Transcribing...</p>
        </div>
      )} */}
    </div>
  )
}
