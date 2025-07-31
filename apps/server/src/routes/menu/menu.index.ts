// import { createDb } from '@mac/db'
// import {
//   addMenuItemAllergen,
//   createCategory,
//   createMenuItem,
//   createMenuItemVariant,
//   deleteCategory,
//   deleteMenuItem,
//   deleteMenuItemVariant,
//   getAllergens,
//   getCategories,
//   getCategoryById,
//   getMenuItemAllergens,
//   getMenuItemById,
//   getMenuItems,
//   getMenuItemsByCategory,
//   getMenuItemVariants,
//   isMenuItemAvailable,
//   removeMenuItemAllergen,
//   updateCategory,
//   updateMenuItem,
//   updateMenuItemVariant,
// } from '@mac/db/repository'
// import { getDataFailedDesc, notFoundDesc, updateFailedDesc } from '@mac/resources/general'
// import {
//   CONFLICT,
//   CREATED,
//   INTERNAL_SERVER_ERROR,
//   NO_CONTENT,
//   NOT_FOUND,
//   OK,
// } from '@mac/resources/http-status-codes'
// import { HTTPException } from 'hono/http-exception'

// import createRouter from '@/lib/create-router'

// import * as routes from './menu.route'

// const router = createRouter()
//   // ===== MENU ITEM ROUTES =====
//   .openapi(routes.getMenuItems, async (c) => {
//     const queryParams = c.req.valid('query')
//     const db = await createDb(c.env.DB)

//     try {
//       const menuItems = await getMenuItems(db, queryParams)
//       return c.json(menuItems, OK)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: getDataFailedDesc(routes.menuItemEntity),
//       })
//     }
//   })

//   .openapi(routes.getMenuItemById, async (c) => {
//     const { menuItemId } = c.req.valid('param')
//     const { includeVariants, includeAllergens } = c.req.valid('query')
//     const db = await createDb(c.env.DB)

//     try {
//       const menuItem = await getMenuItemById(db, menuItemId, includeVariants, includeAllergens)

//       if (!menuItem) {
//         return c.json({ message: notFoundDesc(routes.menuItemEntity) }, NOT_FOUND)
//       }

//       return c.json(menuItem, OK)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: getDataFailedDesc(routes.menuItemEntity),
//       })
//     }
//   })

//   .openapi(routes.createMenuItem, async (c) => {
//     const reqData = c.req.valid('json')
//     const db = await createDb(c.env.DB)

//     try {
//       const menuItemData: InsertMenuItemDB = {
//         ...reqData,
//         id: generatePublicId(),
//       }

//       const result = await createMenuItem(db, menuItemData)

//       if (result.length === 0) {
//         throw new HTTPException(INTERNAL_SERVER_ERROR, {
//           message: 'Failed to create menu item',
//         })
//       }

//       return c.json(result, CREATED)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: 'Failed to create menu item',
//       })
//     }
//   })

//   .openapi(routes.updateMenuItem, async (c) => {
//     const { menuItemId } = c.req.valid('param')
//     const reqData = c.req.valid('json')
//     const db = await createDb(c.env.DB)

//     try {
//       // Check if menu item exists
//       const existingItem = await getMenuItemById(db, menuItemId)
//       if (!existingItem) {
//         return c.json({ message: notFoundDesc(routes.menuItemEntity) }, NOT_FOUND)
//       }

//       const result = await updateMenuItem(db, menuItemId, reqData as UpdateMenuItemDB)

//       if (result.length === 0) {
//         throw new HTTPException(INTERNAL_SERVER_ERROR, {
//           message: updateFailedDesc(routes.menuItemEntity),
//         })
//       }

//       return c.json(result, OK)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: updateFailedDesc(routes.menuItemEntity),
//       })
//     }
//   })

//   .openapi(routes.deleteMenuItem, async (c) => {
//     const { menuItemId } = c.req.valid('param')
//     const db = await createDb(c.env.DB)

//     try {
//       // Check if menu item exists
//       const existingItem = await getMenuItemById(db, menuItemId)
//       if (!existingItem) {
//         return c.json({ message: notFoundDesc(routes.menuItemEntity) }, NOT_FOUND)
//       }

//       await deleteMenuItem(db, menuItemId)
//       return c.body(null, NO_CONTENT)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: 'Failed to delete menu item',
//       })
//     }
//   })

//   // ===== VARIANT ROUTES =====
//   .openapi(routes.getMenuItemVariants, async (c) => {
//     const { menuItemId } = c.req.valid('param')
//     const db = await createDb(c.env.DB)

//     try {
//       // Check if menu item exists
//       const existingItem = await getMenuItemById(db, menuItemId)
//       if (!existingItem) {
//         return c.json({ message: notFoundDesc(routes.menuItemEntity) }, NOT_FOUND)
//       }

//       const variants = await getMenuItemVariants(db, menuItemId)
//       return c.json(variants, OK)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: getDataFailedDesc(routes.variantEntity),
//       })
//     }
//   })

//   .openapi(routes.createMenuItemVariant, async (c) => {
//     const { menuItemId } = c.req.valid('param')
//     const reqData = c.req.valid('json')
//     const db = await createDb(c.env.DB)

//     try {
//       // Check if menu item exists
//       const existingItem = await getMenuItemById(db, menuItemId)
//       if (!existingItem) {
//         return c.json({ message: notFoundDesc(routes.menuItemEntity) }, NOT_FOUND)
//       }

//       const variantData: InsertMenuItemVariantDB = {
//         ...reqData,
//         id: generatePublicId(),
//         menuItemId,
//       }

//       const result = await createMenuItemVariant(db, variantData)

//       if (result.length === 0) {
//         throw new HTTPException(INTERNAL_SERVER_ERROR, {
//           message: 'Failed to create variant',
//         })
//       }

//       return c.json(result, CREATED)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: 'Failed to create variant',
//       })
//     }
//   })

//   .openapi(routes.updateMenuItemVariant, async (c) => {
//     const { variantId } = c.req.valid('param')
//     const reqData = c.req.valid('json')
//     const db = await createDb(c.env.DB)

//     try {
//       const result = await updateMenuItemVariant(db, variantId, reqData as UpdateMenuItemVariantDB)

//       if (result.length === 0) {
//         return c.json({ message: notFoundDesc(routes.variantEntity) }, NOT_FOUND)
//       }

//       return c.json(result, OK)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: updateFailedDesc(routes.variantEntity),
//       })
//     }
//   })

//   .openapi(routes.deleteMenuItemVariant, async (c) => {
//     const { variantId } = c.req.valid('param')
//     const db = await createDb(c.env.DB)

//     try {
//       await deleteMenuItemVariant(db, variantId)
//       return c.body(null, NO_CONTENT)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: 'Failed to delete variant',
//       })
//     }
//   })

//   // ===== ALLERGEN ROUTES =====
//   .openapi(routes.getAllergens, async (c) => {
//     const db = await createDb(c.env.DB)

//     try {
//       const allergens = await getAllergens(db, true)
//       return c.json(allergens, OK)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: getDataFailedDesc(routes.allergenEntity),
//       })
//     }
//   })

//   .openapi(routes.getMenuItemAllergens, async (c) => {
//     const { menuItemId } = c.req.valid('param')
//     const db = await createDb(c.env.DB)

//     try {
//       // Check if menu item exists
//       const existingItem = await getMenuItemById(db, menuItemId)
//       if (!existingItem) {
//         return c.json({ message: notFoundDesc(routes.menuItemEntity) }, NOT_FOUND)
//       }

//       const allergens = await getMenuItemAllergens(db, menuItemId)
//       return c.json(allergens, OK)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: getDataFailedDesc(routes.allergenEntity),
//       })
//     }
//   })

//   .openapi(routes.addMenuItemAllergen, async (c) => {
//     const { menuItemId } = c.req.valid('param')
//     const { allergenId, severity = 'contains' } = c.req.valid('json')
//     const db = await createDb(c.env.DB)

//     try {
//       // Check if menu item exists
//       const existingItem = await getMenuItemById(db, menuItemId)
//       if (!existingItem) {
//         return c.json({ message: notFoundDesc(routes.menuItemEntity) }, NOT_FOUND)
//       }

//       await addMenuItemAllergen(db, menuItemId, allergenId, severity)
//       return c.body(null, CREATED)
//     } catch (error) {
//       // Check if it's a duplicate constraint error
//       if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
//         return c.json({ message: 'Allergen already exists for this menu item' }, CONFLICT)
//       }

//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: 'Failed to add allergen',
//       })
//     }
//   })

//   .openapi(routes.removeMenuItemAllergen, async (c) => {
//     const { menuItemId, allergenId } = c.req.valid('param')
//     const db = await createDb(c.env.DB)

//     try {
//       await removeMenuItemAllergen(db, menuItemId, allergenId)
//       return c.body(null, NO_CONTENT)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: 'Failed to remove allergen',
//       })
//     }
//   })

//   // ===== SPECIAL ROUTES =====
//   .openapi(routes.getFullMenu, async (c) => {
//     const db = await createDb(c.env.DB)

//     try {
//       const menu = await getMenuItemsByCategory(db)
//       return c.json(menu, OK)
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: 'Failed to retrieve full menu',
//       })
//     }
//   })

//   .openapi(routes.checkMenuItemAvailability, async (c) => {
//     const { menuItemId } = c.req.valid('param')
//     const { date } = c.req.valid('query')
//     const db = await createDb(c.env.DB)

//     try {
//       // Check if menu item exists
//       const existingItem = await getMenuItemById(db, menuItemId)
//       if (!existingItem) {
//         return c.json({ message: notFoundDesc(routes.menuItemEntity) }, NOT_FOUND)
//       }

//       const checkDate = date ? new Date(date) : new Date()
//       const available = await isMenuItemAvailable(db, menuItemId, checkDate)

//       return c.json(
//         {
//           available,
//           checkedAt: checkDate.toISOString(),
//           menuItemId,
//         },
//         OK
//       )
//     } catch (error) {
//       throw new HTTPException(INTERNAL_SERVER_ERROR, {
//         message: 'Failed to check availability',
//       })
//     }
//   })

// export default router
