import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@mac/resources/constants'

export function cleanEmptyParams<T extends Record<string, unknown>>(search: T) {
  const newSearch = { ...search }
  Object.keys(newSearch).forEach((key) => {
    const value = newSearch[key]
    if (value === undefined || value === '' || (typeof value === 'number' && Number.isNaN(value))) {
      // oxlint-disable-next-line no-dynamic-delete
      delete newSearch[key]
    }
  })

  if (search.pageIndex === DEFAULT_PAGE_INDEX) {
    delete newSearch.pageIndex
  }
  if (search.pageSize === DEFAULT_PAGE_SIZE) {
    delete newSearch.pageSize
  }

  return newSearch
}
