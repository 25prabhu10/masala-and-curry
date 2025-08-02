import { createDb } from '@mac/db'
import { DrizzleQueryError } from '@mac/db/types'
import { getAllergens } from '@mac/repository/allergen'
import { INTERNAL_SERVER_ERROR, OK } from '@mac/resources/http-status-codes'
import { HTTPException } from 'hono/http-exception'

import createRouter from '@/lib/create-router'

import * as routes from './allergens.openapi'

const router = createRouter().openapi(routes.getAllergens, async (c) => {
  try {
    const db = await createDb(c.env.DB)

    const allergens = await getAllergens(db, true)
    return c.json(allergens, OK)
  } catch (error) {
    if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
      throw error
    }
    throw new HTTPException(INTERNAL_SERVER_ERROR, {
      message: routes.entityFailedToGetDesc,
    })
  }
})
// .openapi(routes.getMenuItemAllergens, async (c) => {
//   const { menuItemId } = c.req.valid('param')

//   try {
//     const db = await createDb(c.env.DB)

//     // Check if menu item exists
//     const existingItem = await getMenuItemById(db, menuItemId)
//     if (!existingItem) {
//       return c.json({ message: routes.menuItemNotFoundDesc }, NOT_FOUND)
//     }

//     const allergens = await getMenuItemAllergens(db, menuItemId)
//     return c.json(allergens, OK)
//   } catch (error) {
//     if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
//       throw error
//     }
//     throw new HTTPException(INTERNAL_SERVER_ERROR, {
//       message: routes.entityFailedToGetDesc,
//     })
//   }
// })
// .openapi(routes.addMenuItemAllergen, async (c) => {
//   const { menuItemId } = c.req.valid('param')
//   const { allergenId, severity = 'contains' } = c.req.valid('json')

//   try {
//     const db = await createDb(c.env.DB)

//     // Check if menu item exists
//     const existingItem = await getMenuItemById(db, menuItemId)
//     if (!existingItem) {
//       return c.json({ message: routes.menuItemNotFoundDesc }, NOT_FOUND)
//     }

//     await addMenuItemAllergen(db, menuItemId, allergenId, severity)
//     return c.body(null, CREATED)
//   } catch (error) {
//     // Check if it's a duplicate constraint error
//     if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
//       return c.json({ message: 'Allergen already exists for this menu item' }, CONFLICT)
//     }

//     if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
//       throw error
//     }

//     throw new HTTPException(INTERNAL_SERVER_ERROR, {
//       message: 'Failed to add allergen',
//     })
//   }
// })
// .openapi(routes.removeMenuItemAllergen, async (c) => {
//   const { menuItemId, allergenId } = c.req.valid('param')

//   try {
//     const db = await createDb(c.env.DB)

//     await removeMenuItemAllergen(db, menuItemId, allergenId)
//     return c.body(null, NO_CONTENT)
//   } catch (error) {
//     if (error instanceof HTTPException || error instanceof DrizzleQueryError) {
//       throw error
//     }
//     throw new HTTPException(INTERNAL_SERVER_ERROR, {
//       message: 'Failed to remove allergen',
//     })
//   }
// })

export default router
