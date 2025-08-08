import { createDb } from '@mac/db'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getTotalCategoriesCount,
  updateCategory,
} from '@mac/repository/category'
import { CREATED, NO_CONTENT, OK } from '@mac/resources/http-status-codes'
import {
  type Category,
  readCategoriesWithPaginationValidator,
  readCategoryValidator,
  type UpdateCategoryParsed,
} from '@mac/validators/category'

import { InternalServerError } from '@/lib/api-errors'
import createRouter from '@/lib/create-router'
import { handleApiError } from '@/lib/handle-errors'
import { notFound } from '@/lib/response-helpers'

import * as routes from './categories.openapi'

const router = createRouter()
  .openapi(routes.getCategories, async (c) => {
    const { pageIndex, pageSize, activeOnly, sortBy } = c.req.valid('query')

    try {
      const db = await createDb(c.env.DB)

      const categories = await getCategories(db, { activeOnly, pageIndex, pageSize, sortBy })
      const totalCount = await getTotalCategoriesCount(db, { activeOnly })

      const result = await readCategoriesWithPaginationValidator.safeParseAsync({
        result: categories,
        rowCount: totalCount[0]?.rowCount,
      })

      if (!result.success) {
        throw new InternalServerError(routes.entityFailedToGetDesc)
      }

      return c.json(result.data, OK)
    } catch (error) {
      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityFailedToGetDesc)
    }
  })
  .openapi(routes.getCategoryById, async (c) => {
    const { id } = c.req.valid('param')

    try {
      const db = await createDb(c.env.DB)

      const queryData = await getCategoryById(db, id)

      if (!queryData) {
        return c.json(...notFound(routes.entity))
      }

      const result = await readCategoryValidator.safeParseAsync(queryData)

      if (!result.success) {
        throw new InternalServerError(routes.entityFailedToGetDesc)
      }

      return c.json(result.data, OK)
    } catch (error) {
      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityFailedToGetDesc)
    }
  })
  .openapi(routes.createCategory, async (c) => {
    const reqData = c.req.valid('json')

    try {
      const db = await createDb(c.env.DB)

      const queryData = await createCategory(db, reqData)

      const result = await readCategoryValidator.safeParseAsync(queryData[0])

      if (!result.success) {
        throw new InternalServerError(routes.entityCreateFailedDesc)
      }

      return c.json(result.data, CREATED)
    } catch (error) {
      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityCreateFailedDesc)
    }
  })
  .openapi(routes.updateCategory, async (c) => {
    const { id } = c.req.valid('param')
    const reqData = c.req.valid('json')

    try {
      const db = await createDb(c.env.DB)

      const existingCategory = await getCategoryById(db, id)

      if (!existingCategory) {
        return c.json(...notFound(routes.entity))
      }

      const dataToUpdate: UpdateCategoryParsed = {}

      console.error(reqData)

      if (reqData.name !== undefined && reqData.name !== existingCategory.name) {
        // Only add fields to update if they are provided and different from the current value
        dataToUpdate.name = reqData.name
      }
      if (
        reqData.description !== undefined &&
        reqData.description !== existingCategory.description
      ) {
        dataToUpdate.description = reqData.description
      }
      if (
        reqData.displayOrder !== undefined &&
        reqData.displayOrder !== existingCategory.displayOrder
      ) {
        dataToUpdate.displayOrder = reqData.displayOrder
      }
      if (reqData.isActive !== undefined && reqData.isActive !== existingCategory.isActive) {
        dataToUpdate.isActive = reqData.isActive
      }

      let result: Category | undefined

      if (Object.keys(dataToUpdate).length === 0) {
        const queryData = await getCategoryById(db, id)

        if (!queryData) {
          return c.json(...notFound(routes.entity))
        }
        result = queryData
      } else {
        result = (await updateCategory(db, id, dataToUpdate))[0]
      }

      const category = await readCategoryValidator.safeParseAsync(result)

      if (!category.success) {
        throw new InternalServerError(routes.entityUpdateFailedDesc)
      }

      return c.json(category.data, OK)
    } catch (error) {
      console.error(error)
      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityUpdateFailedDesc)
    }
  })
  .openapi(routes.deleteCategory, async (c) => {
    const { id } = c.req.valid('param')

    try {
      const db = await createDb(c.env.DB)

      const existingCategory = await getCategoryById(db, id)

      if (!existingCategory) {
        return c.json(...notFound(routes.entity))
      }

      await deleteCategory(db, id)

      return c.body(null, NO_CONTENT)
    } catch (error) {
      console.error(error)
      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityDeleteFailedDesc)
    }
  })

export default router
