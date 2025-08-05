import { z } from '@hono/zod-openapi'
import { DEFAULT_PAGE_SIZE, MAX_NUMBER_IN_APP } from '@mac/resources/constants'
import { invalidIdDesc, minLengthDesc, PAGINATION_ERROR_DESC } from '@mac/resources/general'
import { USER_ID_PARAM } from '@mac/resources/user'

export const paginationValidator = z.object({
  pageIndex: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z
      .int(PAGINATION_ERROR_DESC)
      .positive(PAGINATION_ERROR_DESC)
      .max(MAX_NUMBER_IN_APP)
      .optional()
      .openapi({ description: 'Page number', example: 1 })
  ),
  pageSize: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z
      .int(PAGINATION_ERROR_DESC)
      .positive(PAGINATION_ERROR_DESC)
      .max(MAX_NUMBER_IN_APP)
      .optional()
      .openapi({ description: 'Items per page', example: DEFAULT_PAGE_SIZE })
  ),
})

export const rowCountValidator = z.int().nonnegative()

export const orderByValidator = z.enum(['asc', 'desc'], {
  error: (issue) => `Order must be one of: ${issue.options}`,
})
export type OrderBy = z.infer<typeof orderByValidator>

export type SortingObject<TColumns extends string> = {
  column: TColumns
  direction: OrderBy
}

export type ColumnsOf<T> = readonly (keyof T & string)[]

export function createSortingValidator<
  T extends Record<string, unknown>,
  TColumns extends ColumnsOf<T>,
>(validColumns: TColumns, defaultSortColumns: string, urlSafe: boolean = false) {
  type ColumnUnion = TColumns[number]
  return z.coerce
    .string()
    .trim()
    .min(1, minLengthDesc('Sort By'))
    .optional()
    .default(defaultSortColumns)
    .transform((val, ctx): SortingObject<ColumnUnion>[] | string => {
      const parsedData = val
        .split(',')
        .map((sortItem) => {
          const parts = sortItem.split(':')
          const column = parts[0]?.trim()

          if (
            !column ||
            !(typeof column === 'string' && validColumns.includes(column as ColumnUnion))
          ) {
            ctx.addIssue({
              code: 'custom',
              message:
                'Sort column is invalid. Please use a valid column name or the format `columnName:orderBy`',
            })
            return null
          }

          let direction: OrderBy = 'asc'

          if (parts.length > 1) {
            const parsedDirection = parts[1]?.trim().toLowerCase()
            const result = orderByValidator.safeParse(parsedDirection)
            if (result.success) {
              direction = result.data
            } else {
              ctx.addIssue({
                code: 'custom',
                message: `Invalid direction for column '${column}': '${parsedDirection}'. Must be 'asc' or 'desc'.`,
              })
              return null
            }
          }

          return urlSafe ? sortItem : { column: column as ColumnUnion, direction }
        })
        .filter((item): item is SortingObject<ColumnUnion> => Boolean(item))

      return urlSafe ? parsedData.join(',') : parsedData
    })
    .openapi({
      description: 'Sort by columns',
      example: 'name,id:desc',
    })
}

export function createIdParamsOpenapiSchema(entity: Readonly<string>) {
  return z
    .object({
      id: z
        .string(invalidIdDesc(entity))
        .trim()
        .openapi({
          description: USER_ID_PARAM,
          example: 'fbaefaadebc4a0b8b9c1d2e3f4g5h6i',
          param: {
            name: 'id',
          },
          required: ['id'],
        }),
    })
    .openapi({
      description: `${entity} ID parameter schema`,
    })
    .openapi(`${entity} ID`)
}

export type Pagination = z.infer<typeof paginationValidator>
export type UserIdParams = z.input<ReturnType<typeof createIdParamsOpenapiSchema>>
export type Filters<T extends Record<string, unknown>> = Partial<
  T & Pagination & ReturnType<typeof createSortingValidator<T, ColumnsOf<T>>>
>
