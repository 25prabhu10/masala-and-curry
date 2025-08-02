export function cleanEmptyParams<T extends Record<string, unknown>>(search: T) {
  const newSearch = { ...search }
  Object.keys(newSearch).forEach((key) => {
    const value = newSearch[key]
    if (value === undefined || value === '' || (typeof value === 'number' && Number.isNaN(value))) {
      // oxlint-disable-next-line no-dynamic-delete
      delete newSearch[key]
    }
  })

  return newSearch
}
