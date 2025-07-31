// import { createRoute, z } from '@hono/zod-openapi'
// import {
//   getDataFailedDesc,
//   getDataSuccessDesc,
//   NOT_AUTHENTICATED,
//   NOT_AUTHORIZED,
//   notFoundDesc,
//   updateDataDesc,
//   updateFailedDesc,
//   updateSuccessDesc,
//   VALIDATION_ERROR_DESC,
// } from '@mac/resources/general'
// import {
//   BAD_REQUEST,
//   CONFLICT,
//   CREATED,
//   FORBIDDEN,
//   INTERNAL_SERVER_ERROR,
//   NO_CONTENT,
//   NOT_FOUND,
//   OK,
//   UNAUTHORIZED,
//   UNPROCESSABLE_ENTITY,
// } from '@mac/resources/http-status-codes'

// import { jsonContent, jsonContentRequired } from '@/lib/openapi/helpers'
// import {
//   createErrorSchema,
//   createIdParamsOpenapiSchema,
//   createMessageObjectSchema,
// } from '@/lib/openapi/schemas'
// import { protect } from '@/middlewares'

// const tags = ['Menu']

// const menuItemEntity = 'Menu Item' as const
// const variantEntity = 'Menu Item Variant' as const
// const allergenEntity = 'Allergen' as const

// const menuItemIdParamsSchema = createIdParamsOpenapiSchema(menuItemEntity)
// const variantIdParamsSchema = createIdParamsOpenapiSchema(variantEntity)

// // ===== MENU ITEM ROUTES =====

// export const getMenuItems = createRoute({
//   description: 'Get menu items with filtering, search, and pagination.',
//   method: 'get',
//   path: '/items',
//   request: {
//     query: menuFiltersSchema,
//   },
//   responses: {
//     [OK]: jsonContent(
//       z.array(
//         z.object({
//           category: z
//             .object({
//               displayOrder: z.number(),
//               id: z.string(),
//               name: z.string(),
//             })
//             .nullable(),
//           menuItem: SelectMenuItemSchema,
//         })
//       ),
//       getDataSuccessDesc(menuItemEntity)
//     ),
//     [BAD_REQUEST]: jsonContent(createErrorSchema(menuFiltersSchema), VALIDATION_ERROR_DESC),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema(getDataFailedDesc(menuItemEntity)),
//       getDataFailedDesc(menuItemEntity)
//     ),
//   },
//   summary: 'Get Menu Items',
//   tags,
// })

// export const getMenuItemById = createRoute({
//   description: 'Get a menu item by ID with optional variants and allergens.',
//   method: 'get',
//   path: '/items/:menuItemId',
//   request: {
//     params: menuItemIdParamsSchema,
//     query: z.object({
//       includeAllergens: z.boolean().optional().default(false),
//       includeVariants: z.boolean().optional().default(false),
//     }),
//   },
//   responses: {
//     [OK]: jsonContent(
//       z.object({
//         allergens: z
//           .array(
//             z.object({
//               allergen: SelectAllergenSchema,
//               severity: z.string(),
//             })
//           )
//           .optional(),
//         category: z
//           .object({
//             id: z.string(),
//             name: z.string(),
//           })
//           .nullable(),
//         menuItem: SelectMenuItemSchema,
//         variants: z.array(SelectMenuItemVariantSchema).optional(),
//       }),
//       getDataSuccessDesc(menuItemEntity)
//     ),
//     [NOT_FOUND]: jsonContent(
//       createMessageObjectSchema(notFoundDesc(menuItemEntity)),
//       notFoundDesc(menuItemEntity)
//     ),
//     [UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(menuItemIdParamsSchema),
//       VALIDATION_ERROR_DESC
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema(getDataFailedDesc(menuItemEntity)),
//       getDataFailedDesc(menuItemEntity)
//     ),
//   },
//   summary: 'Get Menu Item by ID',
//   tags,
// })

// export const createMenuItem = createRoute({
//   description: 'Create a new menu item.',
//   method: 'post',
//   middleware: protect,
//   path: '/items',
//   request: {
//     body: jsonContentRequired(InsertMenuItemSchema, createDataDesc(menuItemEntity)),
//   },
//   responses: {
//     [CREATED]: jsonContent(z.array(SelectMenuItemSchema), createDataSuccessDesc(menuItemEntity)),
//     [UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(InsertMenuItemSchema),
//       VALIDATION_ERROR_DESC
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema(createFailedDesc(menuItemEntity)),
//       createFailedDesc(menuItemEntity)
//     ),
//     [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
//     [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
//   },
//   summary: 'Create Menu Item',
//   tags,
// })

// export const updateMenuItem = createRoute({
//   description: 'Update a menu item by ID.',
//   method: 'put',
//   middleware: protect,
//   path: '/items/:menuItemId',
//   request: {
//     body: jsonContentRequired(UpdateMenuItemSchema, updateDataDesc(menuItemEntity)),
//     params: menuItemIdParamsSchema,
//   },
//   responses: {
//     [OK]: jsonContent(z.array(SelectMenuItemSchema), updateSuccessDesc(menuItemEntity)),
//     [NOT_FOUND]: jsonContent(
//       createMessageObjectSchema(notFoundDesc(menuItemEntity)),
//       notFoundDesc(menuItemEntity)
//     ),
//     [UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(UpdateMenuItemSchema),
//       VALIDATION_ERROR_DESC
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema(updateFailedDesc(menuItemEntity)),
//       updateFailedDesc(menuItemEntity)
//     ),
//     [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
//     [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
//   },
//   summary: 'Update Menu Item',
//   tags,
// })

// export const deleteMenuItem = createRoute({
//   description: 'Delete a menu item by ID.',
//   method: 'delete',
//   middleware: protect,
//   path: '/items/:menuItemId',
//   request: {
//     params: menuItemIdParamsSchema,
//   },
//   responses: {
//     [NO_CONTENT]: {
//       description: deleteSuccessDesc(menuItemEntity),
//     },
//     [NOT_FOUND]: jsonContent(
//       createMessageObjectSchema(notFoundDesc(menuItemEntity)),
//       notFoundDesc(menuItemEntity)
//     ),
//     [UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(menuItemIdParamsSchema),
//       VALIDATION_ERROR_DESC
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema(deleteFailedDesc(menuItemEntity)),
//       deleteFailedDesc(menuItemEntity)
//     ),
//     [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
//     [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
//   },
//   summary: 'Delete Menu Item',
//   tags,
// })

// // ===== MENU ITEM VARIANT ROUTES =====

// export const getMenuItemVariants = createRoute({
//   description: 'Get all variants for a menu item.',
//   method: 'get',
//   path: '/items/:menuItemId/variants',
//   request: {
//     params: menuItemIdParamsSchema,
//   },
//   responses: {
//     [OK]: jsonContent(z.array(SelectMenuItemVariantSchema), getDataSuccessDesc(variantEntity)),
//     [NOT_FOUND]: jsonContent(
//       createMessageObjectSchema(notFoundDesc(menuItemEntity)),
//       notFoundDesc(menuItemEntity)
//     ),
//     [UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(menuItemIdParamsSchema),
//       VALIDATION_ERROR_DESC
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema(getDataFailedDesc(variantEntity)),
//       getDataFailedDesc(variantEntity)
//     ),
//   },
//   summary: 'Get Menu Item Variants',
//   tags,
// })

// export const createMenuItemVariant = createRoute({
//   description: 'Create a new variant for a menu item.',
//   method: 'post',
//   middleware: protect,
//   path: '/items/:menuItemId/variants',
//   request: {
//     body: jsonContentRequired(InsertMenuItemVariantSchema, createDataDesc(variantEntity)),
//     params: menuItemIdParamsSchema,
//   },
//   responses: {
//     [CREATED]: jsonContent(
//       z.array(SelectMenuItemVariantSchema),
//       createDataSuccessDesc(variantEntity)
//     ),
//     [NOT_FOUND]: jsonContent(
//       createMessageObjectSchema(notFoundDesc(menuItemEntity)),
//       notFoundDesc(menuItemEntity)
//     ),
//     [UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(InsertMenuItemVariantSchema),
//       VALIDATION_ERROR_DESC
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema(createFailedDesc(variantEntity)),
//       createFailedDesc(variantEntity)
//     ),
//     [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
//     [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
//   },
//   summary: 'Create Menu Item Variant',
//   tags,
// })

// export const updateMenuItemVariant = createRoute({
//   description: 'Update a menu item variant by ID.',
//   method: 'put',
//   middleware: protect,
//   path: '/variants/:variantId',
//   request: {
//     body: jsonContentRequired(UpdateMenuItemVariantSchema, updateDataDesc(variantEntity)),
//     params: variantIdParamsSchema,
//   },
//   responses: {
//     [OK]: jsonContent(z.array(SelectMenuItemVariantSchema), updateSuccessDesc(variantEntity)),
//     [NOT_FOUND]: jsonContent(
//       createMessageObjectSchema(notFoundDesc(variantEntity)),
//       notFoundDesc(variantEntity)
//     ),
//     [UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(UpdateMenuItemVariantSchema),
//       VALIDATION_ERROR_DESC
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema(updateFailedDesc(variantEntity)),
//       updateFailedDesc(variantEntity)
//     ),
//     [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
//     [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
//   },
//   summary: 'Update Menu Item Variant',
//   tags,
// })

// export const deleteMenuItemVariant = createRoute({
//   description: 'Delete a menu item variant by ID.',
//   method: 'delete',
//   middleware: protect,
//   path: '/variants/:variantId',
//   request: {
//     params: variantIdParamsSchema,
//   },
//   responses: {
//     [NO_CONTENT]: {
//       description: deleteSuccessDesc(variantEntity),
//     },
//     [NOT_FOUND]: jsonContent(
//       createMessageObjectSchema(notFoundDesc(variantEntity)),
//       notFoundDesc(variantEntity)
//     ),
//     [UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(variantIdParamsSchema),
//       VALIDATION_ERROR_DESC
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema(deleteFailedDesc(variantEntity)),
//       deleteFailedDesc(variantEntity)
//     ),
//     [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
//     [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
//   },
//   summary: 'Delete Menu Item Variant',
//   tags,
// })

// // ===== ALLERGEN ROUTES =====

// export const getAllergens = createRoute({
//   description: 'Get all allergens.',
//   method: 'get',
//   path: '/allergens',
//   responses: {
//     [OK]: jsonContent(z.array(SelectAllergenSchema), getDataSuccessDesc(allergenEntity)),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema(getDataFailedDesc(allergenEntity)),
//       getDataFailedDesc(allergenEntity)
//     ),
//   },
//   summary: 'Get Allergens',
//   tags,
// })

// export const getMenuItemAllergens = createRoute({
//   description: 'Get allergens for a specific menu item.',
//   method: 'get',
//   path: '/items/:menuItemId/allergens',
//   request: {
//     params: menuItemIdParamsSchema,
//   },
//   responses: {
//     [OK]: jsonContent(
//       z.array(
//         z.object({
//           allergen: SelectAllergenSchema,
//           severity: z.string(),
//         })
//       ),
//       getDataSuccessDesc(allergenEntity)
//     ),
//     [NOT_FOUND]: jsonContent(
//       createMessageObjectSchema(notFoundDesc(menuItemEntity)),
//       notFoundDesc(menuItemEntity)
//     ),
//     [UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(menuItemIdParamsSchema),
//       VALIDATION_ERROR_DESC
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema(getDataFailedDesc(allergenEntity)),
//       getDataFailedDesc(allergenEntity)
//     ),
//   },
//   summary: 'Get Menu Item Allergens',
//   tags,
// })

// export const addMenuItemAllergen = createRoute({
//   description: 'Add an allergen to a menu item.',
//   method: 'post',
//   middleware: protect,
//   path: '/items/:menuItemId/allergens',
//   request: {
//     body: jsonContentRequired(InsertMenuItemAllergenSchema, 'Add allergen to menu item'),
//     params: menuItemIdParamsSchema,
//   },
//   responses: {
//     [CREATED]: {
//       description: 'Allergen added successfully',
//     },
//     [NOT_FOUND]: jsonContent(
//       createMessageObjectSchema(notFoundDesc(menuItemEntity)),
//       notFoundDesc(menuItemEntity)
//     ),
//     [CONFLICT]: jsonContent(
//       createMessageObjectSchema('Allergen already exists for this menu item'),
//       'Allergen already exists for this menu item'
//     ),
//     [UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(InsertMenuItemAllergenSchema),
//       VALIDATION_ERROR_DESC
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema('Failed to add allergen'),
//       'Failed to add allergen'
//     ),
//     [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
//     [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
//   },
//   summary: 'Add Menu Item Allergen',
//   tags,
// })

// export const removeMenuItemAllergen = createRoute({
//   description: 'Remove an allergen from a menu item.',
//   method: 'delete',
//   middleware: protect,
//   path: '/items/:menuItemId/allergens/:allergenId',
//   request: {
//     params: z.object({
//       allergenId: z.string(),
//       menuItemId: z.string(),
//     }),
//   },
//   responses: {
//     [NO_CONTENT]: {
//       description: 'Allergen removed successfully',
//     },
//     [NOT_FOUND]: jsonContent(
//       createMessageObjectSchema('Allergen association not found'),
//       'Allergen association not found'
//     ),
//     [UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(
//         z.object({
//           allergenId: z.string(),
//           menuItemId: z.string(),
//         })
//       ),
//       VALIDATION_ERROR_DESC
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema('Failed to remove allergen'),
//       'Failed to remove allergen'
//     ),
//     [UNAUTHORIZED]: jsonContent(createMessageObjectSchema(NOT_AUTHENTICATED), NOT_AUTHENTICATED),
//     [FORBIDDEN]: jsonContent(createMessageObjectSchema(NOT_AUTHORIZED), NOT_AUTHORIZED),
//   },
//   summary: 'Remove Menu Item Allergen',
//   tags,
// })

// // ===== SPECIAL ROUTES =====

// export const getFullMenu = createRoute({
//   description: 'Get the complete menu organized by categories.',
//   method: 'get',
//   path: '/full-menu',
//   responses: {
//     [OK]: jsonContent(
//       z.array(
//         z.object({
//           category: z.object({
//             displayOrder: z.number(),
//             id: z.string(),
//             name: z.string(),
//           }),
//           menuItems: z.array(
//             z.object({
//               basePrice: z.number(),
//               description: z.string().nullable(),
//               id: z.string(),
//               image: z.string().nullable(),
//               isAvailable: z.boolean(),
//               isGlutenFree: z.boolean(),
//               isPopular: z.boolean(),
//               isSpicy: z.boolean(),
//               isVegan: z.boolean(),
//               isVegetarian: z.boolean(),
//               name: z.string(),
//             })
//           ),
//         })
//       ),
//       'Full menu retrieved successfully'
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema('Failed to retrieve full menu'),
//       'Failed to retrieve full menu'
//     ),
//   },
//   summary: 'Get Full Menu',
//   tags,
// })

// export const checkMenuItemAvailability = createRoute({
//   description: 'Check if a menu item is available at a specific time.',
//   method: 'get',
//   path: '/items/:menuItemId/availability',
//   request: {
//     params: menuItemIdParamsSchema,
//     query: z.object({
//       date: z.string().datetime().optional().openapi({
//         description: 'ISO datetime string (defaults to current time)',
//       }),
//     }),
//   },
//   responses: {
//     [OK]: jsonContent(
//       z.object({
//         available: z.boolean(),
//         checkedAt: z.string().datetime(),
//         menuItemId: z.string(),
//       }),
//       'Availability check completed'
//     ),
//     [NOT_FOUND]: jsonContent(
//       createMessageObjectSchema(notFoundDesc(menuItemEntity)),
//       notFoundDesc(menuItemEntity)
//     ),
//     [UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(menuItemIdParamsSchema),
//       VALIDATION_ERROR_DESC
//     ),
//     [INTERNAL_SERVER_ERROR]: jsonContent(
//       createMessageObjectSchema('Failed to check availability'),
//       'Failed to check availability'
//     ),
//   },
//   summary: 'Check Menu Item Availability',
//   tags,
// })
