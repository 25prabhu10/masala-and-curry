export type APIErrorResponse = {
  errors?: string[]
  properties?: Record<
    string,
    {
      errors?: string[]
      items?: (null | { errors?: string[] })[]
    }
  >
}
