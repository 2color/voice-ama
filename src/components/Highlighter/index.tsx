import React, { useState, useRef, useEffect } from 'react'

type Props = {
  count: number
  children: React.ReactNode
}

export const Highlighter: React.FC<Props> = (props) => {
  const [highlightClass, setHighlightClass] = useState('')
  const updateTimer = useRef(null)

  function setUpdate() {
    setHighlightClass('highlight')
    updateTimer.current = setTimeout(() => {
      setHighlightClass('')
      updateTimer.current = null
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (updateTimer.current) {
        clearTimeout(updateTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!updateTimer.current) setUpdate()
  }, [props.count])

  return (
    <div className={`py-1 px-2 rounded ${highlightClass}`}>
      {props.children}
      <style>{`
        @keyframes yellowfade {
          from {
            background: #FEF3C7;
          }
          to {
            background: transparent;
          }
        }

        .highlight {
          animation: yellowfade 1s;
        }
      `}</style>
    </div>
  )
}
