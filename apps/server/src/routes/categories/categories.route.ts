import { createDb } from '@mac/db'
import { DrizzleQueryError } from '@mac/db/types'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getTotalCategoriesCount,
  updateCategory,
} from '@mac/repository/category'
import {
  CREATED,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  NOT_FOUND,
  OK,
} from '@mac/resources/http-status-codes'
import { readCategoryValidator, type UpdateCategory } from '@mac/validators/category'
import { HTTPException } from 'hono/http-exception'

import { UPDATE_NO_CHANGES_RES } from '@/lib/constants'
import createRouter from '@/lib/create-router'

import * as routes from './categories.openapi'

const router = createRouter()
  .openapi(routes.getCategories, async (c) => {
    const { pageIndex, pageSize, activeOnly, sortBy } = c.req.valid('query')

    try {
      const db = await createDb(c.env.DB)

      const categories = await getCategories(db, { activeOnly, pageIndex, pageSize, sortBy })
      const totalCount = await getTotalCategoriesCount(db, { activeOnly })
      return c.json(
        {
          result: categories,
          rowCount: totalCount[0]?.rowCount ?? 0,
        },
        OK
      )
    } catch {
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: routes.entityFailedToGetDesc,
      })
    }
  })
  .openapi(routes.getCategoryById, async (c) => {
    const { id } = c.req.valid('param')

    try {
      const db = await createDb(c.env.DB)

      const queryData = await getCategoryById(db, id)

      if (!queryData) {
        return c.json({ message: routes.entityNotFoundDesc }, NOT_FOUND)
      }

      const result = await readCategoryValidator.safeParseAsync(queryData)

      if (!result.success) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: routes.entityFailedToGetDesc,
        })
      }

      return c.json(result.data, OK)
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: routes.entityFailedToGetDesc,
      })
    }
  })
  .openapi(routes.createCategory, async (c) => {
    const reqData = c.req.valid('json')

    try {
      const db = await createDb(c.env.DB)

      const queryData = await createCategory(db, reqData)

      if (queryData.length === 0) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: routes.entityCreateFailedDesc,
        })
      }

      const result = await readCategoryValidator.safeParseAsync(queryData[0])

      if (!result.success) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: routes.entityCreateFailedDesc,
        })
      }

      return c.json(result.data, CREATED)
    } catch (error) {
      if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: routes.entityFailedToGetDesc,
      })
    }
  })
  .openapi(routes.updateCategory, async (c) => {
    const { id } = c.req.valid('param')
    const reqData = c.req.valid('json')

    try {
      const db = await createDb(c.env.DB)

      const existingCategory = await getCategoryById(db, id)

      if (!existingCategory) {
        return c.json({ message: routes.entityNotFoundDesc }, NOT_FOUND)
      }

      const dataToUpdate: UpdateCategory = {}

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

      if (Object.keys(dataToUpdate).length === 0) {
        return c.json(UPDATE_NO_CHANGES_RES, OK)
      }

      const result = await updateCategory(db, id, dataToUpdate)

      if (result.length === 0) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: routes.entityUpdateFailedDesc,
        })
      }

      const category = await readCategoryValidator.safeParseAsync(result[0])

      if (!category.success) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: routes.entityUpdateFailedDesc,
        })
      }

      return c.json(category.data, OK)
    } catch (error) {
      if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: routes.entityFailedToGetDesc,
      })
    }
  })
  .openapi(routes.deleteCategory, async (c) => {
    const { id } = c.req.valid('param')

    try {
      const db = await createDb(c.env.DB)

      const existingCategory = await getCategoryById(db, id)

      if (!existingCategory) {
        return c.json({ message: routes.entityNotFoundDesc }, NOT_FOUND)
      }

      await deleteCategory(db, id)

      return c.body(null, NO_CONTENT)
    } catch (error) {
      if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: routes.entityFailedToGetDesc,
      })
    }
  })

export default router
