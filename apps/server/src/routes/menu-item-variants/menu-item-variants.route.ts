import { createDb } from '@mac/db'
import type { UpdateMenuItemVariantDB } from '@mac/db/schemas'
import { DrizzleQueryError } from '@mac/db/types'
import { getMenuItemById, getMenuItemVariants } from '@mac/repository/menu-item'
import {
  createMenuItemVariant,
  deleteMenuItemVariant,
  updateMenuItemVariant,
} from '@mac/repository/menu-item-variants'
import {
  CREATED,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  NOT_FOUND,
  OK,
} from '@mac/resources/http-status-codes'
import { HTTPException } from 'hono/http-exception'

import createRouter from '@/lib/create-router'

import * as routes from './menu-item-variants.openapi'

const router = createRouter()
  .openapi(routes.getMenuItemVariants, async (c) => {
    const { id } = c.req.valid('param')

    try {
      const db = await createDb(c.env.DB)

      // Check if menu item exists
      const existingItem = await getMenuItemById(db, id)
      if (!existingItem) {
        return c.json({ message: routes.menuItemNotFoundDesc }, NOT_FOUND)
      }

      const variants = await getMenuItemVariants(db, id)
      return c.json(variants, OK)
    } catch (error) {
      if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: routes.entityFailedToGetDesc,
      })
    }
  })
  .openapi(routes.createMenuItemVariant, async (c) => {
    const { id } = c.req.valid('param')
    const reqData = c.req.valid('json')

    try {
      const db = await createDb(c.env.DB)

      // Check if menu item exists
      const existingItem = await getMenuItemById(db, id)
      if (!existingItem) {
        return c.json({ message: routes.menuItemNotFoundDesc }, NOT_FOUND)
      }

      const result = await createMenuItemVariant(db, reqData)

      if (result.length === 0) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: 'Failed to create variant',
        })
      }

      return c.json(result, CREATED)
    } catch (error) {
      if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: 'Failed to create variant',
      })
    }
  })
  .openapi(routes.updateMenuItemVariant, async (c) => {
    const { id } = c.req.valid('param')
    const reqData = c.req.valid('json')

    try {
      const db = await createDb(c.env.DB)

      const result = await updateMenuItemVariant(db, id, reqData as UpdateMenuItemVariantDB)

      if (result.length === 0) {
        return c.json({ message: routes.entityNotFoundDesc }, NOT_FOUND)
      }

      return c.json(result, OK)
    } catch (error) {
      if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: routes.entityUpdateFailedDesc,
      })
    }
  })
  .openapi(routes.deleteMenuItemVariant, async (c) => {
    const { id } = c.req.valid('param')

    try {
      const db = await createDb(c.env.DB)

      await deleteMenuItemVariant(db, id)
      return c.body(null, NO_CONTENT)
    } catch (error) {
      if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: 'Failed to delete variant',
      })
    }
  })

export default router
