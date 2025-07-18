import type { ReactNode } from 'react'
import { Button } from '@mac/web-ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <main className="flex-1 py-8">
      <div className="container text-center mx-auto px-4">
        {children ?? (
          <p className="text-xl text-muted-foreground leading-relaxed">
            The page you are looking for does not exist.
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
          <Button asChild variant="outline">
            <Link
              onClick={(e) => {
                e.preventDefault()
                globalThis.history.back()
              }}
              to="/"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
