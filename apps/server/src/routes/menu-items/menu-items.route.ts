import { createDb } from '@mac/db'
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItemById,
  getMenuItems,
  getTotalMenuItemsCount,
  updateMenuItem,
} from '@mac/repository/menu-item'
import { CREATED, NO_CONTENT, OK } from '@mac/resources/http-status-codes'
import { readMenuItemsValidator, readMenuItemValidator } from '@mac/validators/menu-item'

import { InternalServerError } from '@/lib/api-errors'
import createRouter from '@/lib/create-router'
import { handleApiError } from '@/lib/handle-errors'
import { notFound } from '@/lib/response-helpers'

import {
  deleteAllUnderPrefix,
  generateAndPersistVariants,
  parseKeysFromPublicUrl,
} from '../images/utils/variants'
import * as routes from './menu-items.openapi'

const router = createRouter()
  .openapi(routes.getMenuItems, async (c) => {
    const query = c.req.valid('query')

    try {
      const db = await createDb(c.env.DB)
      const queryData = await getMenuItems(db, query)
      const [totalCount] = await getTotalMenuItemsCount(db, query)

      const result = await readMenuItemsValidator.safeParseAsync({
        result: queryData,
        rowCount: totalCount?.rowCount,
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
  .openapi(routes.getMenuItemById, async (c) => {
    const { id } = c.req.valid('param')

    try {
      const db = await createDb(c.env.DB)

      const queryData = await getMenuItemById(db, id)

      if (!queryData) {
        return c.json(...notFound(routes.entity))
      }

      const result = await readMenuItemValidator.safeParseAsync(queryData)

      if (!result.success) {
        throw new InternalServerError(routes.entityFailedToGetDesc)
      }

      return c.json(result.data, OK)
    } catch (error) {
      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityFailedToGetDesc)
    }
  })
  .openapi(routes.createMenuItem, async (c) => {
    const reqData = c.req.valid('json')

    try {
      const db = await createDb(c.env.DB)
      const queryData = await createMenuItem(db, reqData)

      const result = await readMenuItemValidator.safeParseAsync(queryData)

      if (!result.success) {
        throw new InternalServerError(routes.entityCreateFailedDesc)
      }

      // Fire-and-forget variant generation if image provided
      if (reqData.image) {
        const parsed = parseKeysFromPublicUrl(reqData.image)
        if (parsed.originalKey && parsed.imageKey) {
          generateAndPersistVariants(
            c.env as CloudflareBindings,
            parsed.originalKey,
            parsed.imageKey
          ).catch((error: unknown) => {
            console.error('Variant generation failed:', error)
          })
        }
      }

      return c.json(result.data, CREATED)
    } catch (error) {
      console.error('newMenuItem', error)

      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityCreateFailedDesc)
    }
  })
  .openapi(routes.updateMenuItem, async (c) => {
    const { id } = c.req.valid('param')
    const reqData = c.req.valid('json')

    try {
      const db = await createDb(c.env.DB)

      const existingItem = await getMenuItemById(db, id)

      if (!existingItem) {
        return c.json(...notFound(routes.entity))
      }

      const result = await updateMenuItem(db, id, reqData, existingItem)

      const menuItem = await readMenuItemValidator.safeParseAsync(result)

      if (!menuItem.success) {
        throw new InternalServerError(routes.entityUpdateFailedDesc)
      }

      // If image changed, cleanup old and generate new variants
      const oldUrl = existingItem.image
      const newUrl = (reqData as { image?: string }).image
      if (newUrl && newUrl !== oldUrl) {
        const oldParsed = oldUrl ? parseKeysFromPublicUrl(oldUrl) : null
        const newParsed = parseKeysFromPublicUrl(newUrl)
        if (oldParsed?.folderPrefix) {
          deleteAllUnderPrefix(c.env as CloudflareBindings, oldParsed.folderPrefix).catch(
            (error: unknown) => console.error('Image cleanup failed:', error)
          )
        }
        if (newParsed.originalKey && newParsed.imageKey) {
          generateAndPersistVariants(
            c.env as CloudflareBindings,
            newParsed.originalKey,
            newParsed.imageKey
          ).catch((error: unknown) => console.error('Variant generation failed:', error))
        }
      }

      return c.json(menuItem.data, OK)
    } catch (error) {
      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityUpdateFailedDesc)
    }
  })
  .openapi(routes.deleteMenuItem, async (c) => {
    const { id } = c.req.valid('param')

    try {
      const db = await createDb(c.env.DB)

      const existingItem = await getMenuItemById(db, id)

      if (!existingItem) {
        return c.json(...notFound(routes.entity))
      }

      await deleteMenuItem(db, id)

      // Cleanup any images under the item's folder
      if (existingItem.image) {
        const parsed = parseKeysFromPublicUrl(existingItem.image)
        if (parsed.folderPrefix) {
          await deleteAllUnderPrefix(c.env as CloudflareBindings, parsed.folderPrefix)
        }
      }

      return c.body(null, NO_CONTENT)
    } catch (error) {
      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityDeleteFailedDesc)
    }
  })

export default router
