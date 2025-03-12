'use client'

import React from 'react'
import { animate } from 'framer-motion'

interface CounterProps {
  value: string
  className?: string
}

export const Counter = ({ value, className }: CounterProps) => {
  const nodeRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    const numericValue = parseInt(value.replace(/\D/g, ''))

    const controls = animate(0, numericValue, {
      duration: 2,
      onUpdate(value) {
        node.textContent = `${Math.floor(value)}${value.toString().includes('+') ? '+' : ''}`
      },
    })

    return () => controls.stop()
  }, [value])

  return (
    <span ref={nodeRef} className={className}>
      0
    </span>
  )
}
