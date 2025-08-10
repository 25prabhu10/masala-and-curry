import { createDb } from '@mac/db'
import { checkIfEmailExistsForOtherUser, getUserById, updateUser } from '@mac/repository/user'
import { CONFLICT, FORBIDDEN, OK } from '@mac/resources/http-status-codes'
import { EMAIL_ALREADY_EXISTS } from '@mac/resources/user'
import { readUserValidator, type UpdateUser, type User } from '@mac/validators/user'

import { InternalServerError } from '@/lib/api-errors'
import { NOT_AUTHORIZED_RES } from '@/lib/constants'
import createRouter from '@/lib/create-router'
import { handleApiError } from '@/lib/handle-errors'
import { notFound } from '@/lib/response-helpers'
import { hasAccess } from '@/lib/utils'

import * as routes from './users.openapi'

const router = createRouter()
  .openapi(routes.getUserById, async (c) => {
    const { id } = c.req.valid('param')

    if (!hasAccess(id, c.var.user)) {
      return c.json(NOT_AUTHORIZED_RES, FORBIDDEN)
    }

    try {
      const db = await createDb(c.env.DB)

      const queryData = await getUserById(db, id)

      if (!queryData) {
        return c.json(...notFound(routes.entity))
      }

      const result = await readUserValidator.safeParseAsync(queryData)

      if (!result.success) {
        throw new InternalServerError(routes.entityFailedToGetDesc)
      }

      return c.json(result.data, OK)
    } catch (error) {
      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityFailedToGetDesc)
    }
  })
  // Update user
  .openapi(routes.updateUser, async (c) => {
    const { id } = c.req.valid('param')
    const reqData = c.req.valid('json')

    if (!hasAccess(id, c.var.user)) {
      return c.json(NOT_AUTHORIZED_RES, FORBIDDEN)
    }

    try {
      const db = await createDb(c.env.DB)

      const existingUserData = await getUserById(db, id)

      if (!existingUserData) {
        return c.json(...notFound(routes.entity))
      }

      const dataToUpdate: UpdateUser = {}

      if (reqData.name !== undefined && reqData.name !== existingUserData.name) {
        // Only add fields to update if they are provided and different from the current value
        dataToUpdate.name = reqData.name
      }
      if (reqData.email !== undefined && reqData.email !== existingUserData.email) {
        const emailExists = await checkIfEmailExistsForOtherUser(db, reqData.email, id)

        if (emailExists) {
          return c.json({ message: EMAIL_ALREADY_EXISTS }, CONFLICT)
        }
        dataToUpdate.email = reqData.email
      }
      if (reqData.image !== undefined && reqData.image !== existingUserData.image) {
        dataToUpdate.image = reqData.image
      }
      if (
        reqData.phoneNumber !== undefined &&
        reqData.phoneNumber !== existingUserData.phoneNumber
      ) {
        dataToUpdate.phoneNumber = reqData.phoneNumber
      }

      let result: User | undefined

      if (Object.keys(dataToUpdate).length === 0) {
        result = existingUserData as User
      } else {
        ;[result] = (await updateUser(db, id, dataToUpdate)) as User[]
      }

      const user = await readUserValidator.safeParseAsync(result)

      if (!user.success) {
        throw new InternalServerError(routes.entityUpdateFailedDesc)
      }
      return c.json(user.data, OK)
    } catch (error) {
      handleApiError(error, routes.entity)
      throw new InternalServerError(routes.entityUpdateFailedDesc)
    }
  })

export default router
