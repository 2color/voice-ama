import React, { useState, useRef, useEffect } from 'react'

/**
 * Props for the Highlighter component
 */
type Props = {
  count: number // The count value to watch for changes
  children: React.ReactNode // Content to highlight when count changes
}

/**
 * Visual highlight component that briefly highlights content when count changes
 * Uses a yellow fade animation to draw attention to updated values
 */
export const Highlighter: React.FC<Props> = (props) => {
  const [highlightClass, setHighlightClass] = useState('')
  const updateTimer = useRef<NodeJS.Timeout | null>(null)

  /**
   * Triggers the highlight animation for 1 second
   */
  function setUpdate() {
    setHighlightClass('highlight')
    updateTimer.current = setTimeout(() => {
      setHighlightClass('')
      updateTimer.current = null
    }, 1000) // Animation duration: 1 second
  }

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (updateTimer.current) {
        clearTimeout(updateTimer.current)
      }
    }
  }, [])

  // Trigger highlight animation when count changes
  useEffect(() => {
    if (!updateTimer.current) setUpdate()
  }, [props.count])

  return (
    <div className={`py-1 px-2 rounded ${highlightClass}`}>
      {props.children}
      {/* Inline CSS for the highlight animation - yellow fade effect */}
      <style>{`
        @keyframes yellowfade {
          from {
            background: #FEF3C7; /* Tailwind yellow-100 */
          }
          to {
            background: transparent;
          }
        }

        .highlight {
          animation: yellowfade 1s ease-out;
        }
      `}</style>
    </div>
  )
}
