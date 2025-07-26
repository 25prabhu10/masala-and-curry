import type { APIErrorResponse } from '@mac/api-client'

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatDate(dateString: string | Date): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return 'Unknown'
  }
}

export function formatFormErrors(data: APIErrorResponse) {
  const convertedObject: Record<string, string | string[]> = {}

  for (const key in data.properties) {
    if (Object.prototype.hasOwnProperty.call(data.properties, key)) {
      if (data.properties[key] && data.properties[key].errors) {
        convertedObject[key] = data.properties[key].errors
      }
    }
  }
  return convertedObject
}
