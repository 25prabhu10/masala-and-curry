import { useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { Spinner } from '@/components/spinner'

export function RouterLoader() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' })
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isLoading) {
      // Show loader only after 1 second of loading
      timer = setTimeout(() => {
        setShowLoader(true)
      }, 1000)
    } else {
      // Hide loader immediately when loading stops
      setShowLoader(false)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [isLoading])

  if (!showLoader) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner show={isLoading} />
      </div>
    </div>
  )
}
