"use client"
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

interface ErrorProps {
  error: string;
}

export default function Error({ error }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => window.location.reload()}>
        Try again
      </button>
    </div>
  )
} 