import type { SortingObject } from '@mac/validators/general'
import type { SortingState } from '@tanstack/react-table'

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatDate(dateString: string | undefined): string | null {
  if (!dateString) {
    return null
  }
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return null
  }
}

export function formatPrepTime(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

export function stateToSortBy(sorting: SortingState | undefined): string {
  if (!sorting || sorting.length === 0) {
    return ''
  }

  return sorting.map((sort) => `${sort.id}.${sort.desc ? 'desc' : 'asc'}` as const).join(',')
}

export function sortByToState<TColumns extends string>(
  sortBy: SortingObject<TColumns>[] | string | undefined
): SortingState {
  if (!sortBy || typeof sortBy !== 'string') {
    return []
  }

  return sortBy.split(',').map((item) => {
    const [id, desc] = item.split('.')
    return { desc: desc === 'desc', id: id ?? '' }
  })
}

export function formatCurrencyUSD(value: number | null | undefined, currency = 'USD'): string {
  if (value == null || Number.isNaN(value)) {
    return '$0.00'
  }
  try {
    return new Intl.NumberFormat('en-US', {
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: 'currency',
    }).format(value)
  } catch {
    return `$${Number(value).toFixed(2)}`
  }
}

export function getImageURL(path?: string | null): string | undefined {
  return path
    ? `${window.location.origin}${import.meta.env.VITE_BASE_PATH}/images/${path}`
    : undefined
}
