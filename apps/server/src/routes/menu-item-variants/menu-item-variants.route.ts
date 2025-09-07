// import { createDb } from '@mac/db'
// import { getMenuItemById } from '@mac/repository/menu-item'
// import {
//   createMenuItemVariant,
//   deleteMenuItemVariant,
//   getMenuItemVariantById,
//   getMenuItemVariants,
//   updateMenuItemVariant,
// } from '@mac/repository/menu-item-variants'
// import { CREATED, NO_CONTENT, OK } from '@mac/resources/http-status-codes'
// import {
//   readMenuItemVariantsValidator,
//   readMenuItemVariantValidator,
// } from '@mac/validators/menu-item-variant'

// import { InternalServerError } from '@/lib/api-errors'
// import createRouter from '@/lib/create-router'
// import { handleApiError } from '@/lib/handle-errors'
// import { notFound } from '@/lib/response-helpers'

// import * as routes from './menu-item-variants.openapi'

// const router = createRouter()
//   .openapi(routes.getMenuItemVariants, async (c) => {
//     const { id } = c.req.valid('param')

//     try {
//       const db = await createDb(c.env.DB)
//       const existingItem = await getMenuItemById(db, id)

//       if (!existingItem) {
//         return c.json(...notFound(routes.entity))
//       }

//       const queryData = await getMenuItemVariants(db, id)

//       const result = await readMenuItemVariantsValidator.safeParseAsync(queryData)

//       if (!result.success) {
//         throw new InternalServerError(routes.entityFailedToGetDesc)
//       }

//       return c.json(result.data, OK)
//     } catch (error) {
//       handleApiError(error, routes.entity)
//       throw new InternalServerError(routes.entityFailedToGetDesc)
//     }
//   })
//   .openapi(routes.createMenuItemVariant, async (c) => {
//     const { id } = c.req.valid('param')
//     const reqData = c.req.valid('json')

//     try {
//       const db = await createDb(c.env.DB)

//       const existingItem = await getMenuItemById(db, id)

//       if (!existingItem) {
//         return c.json(...notFound(routes.entity))
//       }

//       const queryData = await createMenuItemVariant(db, reqData)

//       const result = await readMenuItemVariantValidator.safeParseAsync(queryData)

//       if (!result.success) {
//         throw new InternalServerError(routes.entityCreateFailedDesc)
//       }

//       return c.json(result.data, CREATED)
//     } catch (error) {
//       handleApiError(error, routes.entity)
//       throw new InternalServerError(routes.entityFailedToGetDesc)
//     }
//   })

// export const variantRouter = createRouter()
//   .openapi(routes.updateMenuItemVariant, async (c) => {
//     const { id } = c.req.valid('param')
//     const reqData = c.req.valid('json')

//     try {
//       const db = await createDb(c.env.DB)

//       const existingItem = await getMenuItemVariantById(db, id)

//       if (!existingItem) {
//         return c.json(...notFound(routes.entity))
//       }

//       const result = await updateMenuItemVariant(db, id, reqData)

//       const menuItemVariant = await readMenuItemVariantValidator.safeParseAsync(result)

//       if (!menuItemVariant.success) {
//         throw new InternalServerError(routes.entityUpdateFailedDesc)
//       }

//       return c.json(menuItemVariant.data, OK)
//     } catch (error) {
//       handleApiError(error, routes.entity)
//       throw new InternalServerError(routes.entityUpdateFailedDesc)
//     }
//   })
//   .openapi(routes.deleteMenuItemVariant, async (c) => {
//     const { id } = c.req.valid('param')

//     try {
//       const db = await createDb(c.env.DB)

//       const existingItem = await getMenuItemVariantById(db, id)

//       if (!existingItem) {
//         return c.json(...notFound(routes.entity))
//       }

//       await deleteMenuItemVariant(db, id)

//       return c.body(null, NO_CONTENT)
//     } catch (error) {
//       handleApiError(error, routes.entity)
//       throw new InternalServerError(routes.entityDeleteFailedDesc)
//     }
//   })

// export default router
