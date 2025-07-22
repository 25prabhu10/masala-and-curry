import { LoaderCircle } from 'lucide-react'

export function Spinner({
  show,
  wait,
  size = 'default',
}: {
  show?: boolean
  wait?: `delay-${number}`
  size?: 'sm' | 'default' | 'lg'
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div
      className={`inline-flex items-center justify-center transition-all duration-300 ${
        (show ?? true)
          ? `opacity-100 scale-100 ${wait ?? 'delay-200'}`
          : 'opacity-0 scale-95 delay-0'
      }`}
    >
      <LoaderCircle
        className={`motion-safe:animate-spin text-primary motion-reduce:hidden ${sizeClasses[size]} drop-shadow-sm`}
      />
      <div className="hidden motion-reduce:flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div
            className="w-2 h-2 bg-primary/70 rounded-full animate-pulse"
            style={{ animationDelay: '0.1s' }}
          />
          <div
            className="w-2 h-2 bg-primary/40 rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          />
        </div>
        <span className="text-sm font-medium text-primary">Loading...</span>
      </div>
    </div>
  )
}
