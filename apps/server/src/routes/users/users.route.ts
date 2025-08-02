import { createDb } from '@mac/db'
import { checkIfEmailExistsForOtherUser, getUserById, updateUser } from '@mac/repository/user'
import {
  CONFLICT,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from '@mac/resources/http-status-codes'
import { EMAIL_ALREADY_EXISTS } from '@mac/resources/user'
import { readUserValidator, type UpdateUser } from '@mac/validators/user'
import { HTTPException } from 'hono/http-exception'

import { NOT_AUTHORIZED_RES, UPDATE_NO_CHANGES_RES } from '@/lib/constants'
import createRouter from '@/lib/create-router'
import { hasAccess } from '@/lib/utils'

import * as routes from './users.openapi'

const router = createRouter()
  // Get user by ID
  .openapi(routes.getUserById, async (c) => {
    const { id } = c.req.valid('param')

    // Check if the user is trying to access their own data or if they are an admin
    if (hasAccess(id, c.var.user)) {
      return c.json(NOT_AUTHORIZED_RES, FORBIDDEN)
    }

    try {
      const db = await createDb(c.env.DB)

      const queryData = await getUserById(db, id)

      if (!queryData) {
        return c.json({ message: routes.entityNotFoundDesc }, NOT_FOUND)
      }

      const result = await readUserValidator.safeParseAsync(queryData)

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
  // Update user
  .openapi(routes.updateUser, async (c) => {
    const { id } = c.req.valid('param')
    const reqData = c.req.valid('json')

    // Check if the user is trying to access their own data or if they are an admin
    if (hasAccess(id, c.var.user)) {
      return c.json(NOT_AUTHORIZED_RES, FORBIDDEN)
    }

    try {
      const db = await createDb(c.env.DB)

      // TODO: Check if this is done in middleware
      const existingUserData = await getUserById(db, id)

      if (!existingUserData) {
        return c.json({ message: routes.entityNotFoundDesc }, NOT_FOUND)
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

      if (Object.keys(dataToUpdate).length === 0) {
        return c.json(UPDATE_NO_CHANGES_RES, OK)
      }

      const result = await updateUser(db, id, dataToUpdate)

      if (result.length === 0) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: routes.entityUpdateFailedDesc,
        })
      }

      const user = await readUserValidator.safeParseAsync(result[0])

      if (!user.success) {
        throw new HTTPException(INTERNAL_SERVER_ERROR, {
          message: routes.entityFailedToGetDesc,
        })
      }
      return c.json(user.data, OK)
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error
      }
      throw new HTTPException(INTERNAL_SERVER_ERROR, {
        message: routes.entityFailedToGetDesc,
      })
    }
  })

export default router
