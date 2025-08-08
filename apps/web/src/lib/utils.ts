import type { CategoryFilters } from '@mac/validators/category'
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

export function stateToSortBy(sorting: SortingState | undefined): string {
  if (!sorting || sorting.length === 0) {
    return ''
  }

  return sorting.map((sort) => `${sort.id}:${sort.desc ? 'desc' : 'asc'}` as const).join(',')
}

export function sortByToState(sortBy: CategoryFilters['sortBy'] | undefined) {
  if (!sortBy || typeof sortBy !== 'string') {
    return []
  }

  return sortBy.split(',').map((item) => {
    const [id, desc] = item.split('.')
    return { desc: desc === 'desc', id: id ?? '' }
  })
}
