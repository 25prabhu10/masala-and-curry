import { createDb } from '@mac/db'
import type { UpdateMenuItemDB } from '@mac/db/schemas'
import { DrizzleQueryError } from '@mac/db/types'
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemById,
  getMenuItems,
  updateMenuItem,
} from '@mac/repository/menu-item'
import {
  CREATED,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  NOT_FOUND,
  OK,
} from '@mac/resources/http-status-codes'
import { readMenuItemsValidator, readMenuItemValidator } from '@mac/validators/menu-item'
import { HTTPException } from 'hono/http-exception'

import createRouter from '@/lib/create-router'

import * as routes from './menu-items.openapi'

const router = createRouter()
  .openapi(routes.getMenuItems, async (c) => {
    const query = c.req.valid('query')

    try {
      const db = await createDb(c.env.DB)
      const queryData = await getMenuItems(db, query)

      const result = await readMenuItemsValidator.safeParseAsync({
        result: queryData,
        rowCount: queryData.length,
      })

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
  .openapi(routes.getMenuItemById, async (c) => {
    const { id } = c.req.valid('param')

    try {
      const db = await createDb(c.env.DB)

      const queryData = await getMenuItemById(db, id)

      if (!queryData) {
        return c.json({ message: routes.entityNotFoundDesc }, NOT_FOUND)
      }

      const result = await readMenuItemValidator.safeParseAsync(queryData)

      if (!result.success) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: routes.entityFailedToGetDesc,
        })
      }

      return c.json(result.data, OK)
    } catch (error) {
      if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: routes.entityFailedToGetDesc,
      })
    }
  })
  .openapi(routes.createMenuItem, async (c) => {
    const reqData = c.req.valid('json')

    try {
      const db = await createDb(c.env.DB)

      const queryData = await createMenuItem(db, reqData)

      if (queryData.length === 0) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: 'Failed to create menu item',
        })
      }

      const result = await readMenuItemValidator.safeParseAsync(queryData[0])

      if (!result.success) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: routes.entityFailedToGetDesc,
        })
      }
      return c.json(result.data, CREATED)
    } catch (error) {
      if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: 'Failed to create menu item',
      })
    }
  })
  .openapi(routes.updateMenuItem, async (c) => {
    const { id } = c.req.valid('param')
    const reqData = c.req.valid('json')

    try {
      const db = await createDb(c.env.DB)

      // Check if menu item exists
      const existingItem = await getMenuItemById(db, id)
      if (!existingItem) {
        return c.json({ message: routes.entityNotFoundDesc }, NOT_FOUND)
      }

      const queryData = await updateMenuItem(db, id, reqData as UpdateMenuItemDB)

      if (queryData.length === 0) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: routes.entityUpdateFailedDesc,
        })
      }

      const result = await readMenuItemValidator.safeParseAsync(queryData[0])

      if (!result.success) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: routes.entityFailedToGetDesc,
        })
      }

      return c.json(result.data, OK)
    } catch (error) {
      if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: routes.entityUpdateFailedDesc,
      })
    }
  })
  .openapi(routes.deleteMenuItem, async (c) => {
    const { id } = c.req.valid('param')

    try {
      const db = await createDb(c.env.DB)

      // Check if menu item exists
      const existingItem = await getMenuItemById(db, id)
      if (!existingItem) {
        return c.json({ message: routes.entityNotFoundDesc }, NOT_FOUND)
      }

      await deleteMenuItem(db, id)
      return c.body(null, NO_CONTENT)
    } catch (error) {
      if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: 'Failed to delete menu item',
      })
    }
  })

export default router
