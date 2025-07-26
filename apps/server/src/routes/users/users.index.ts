import { createDb } from '@mac/db'
import { checkIfEmailExistsForOtherUser, getUserById, updateUser } from '@mac/db/repository'
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from '@mac/resources/http-status-codes'
import {
  EMAIL_ALREADY_EXISTS,
  UPDATE_NO_CHANGES,
  UPDATE_USER_FAILED,
  USER_NOT_FOUND,
} from '@mac/resources/user'
import type { UpdateUser } from '@mac/validators/user'
import { HTTPException } from 'hono/http-exception'

import createRouter from '@/lib/create-router'

import * as routes from './users.routes'

const router = createRouter().openapi(routes.updateUser, async (c) => {
  const { id } = c.req.valid('param')
  const reqData = c.req.valid('json')

  const db = await createDb(c.env.DB)

  // TODO: Check if this is done in middleware
  const existingUserData = await getUserById(db, id)

  if (!existingUserData) {
    return c.json({ message: USER_NOT_FOUND }, NOT_FOUND)
  }

  const dataToUpdate: UpdateUser = {}

  // Only add fields to update if they are provided and different from the current value
  if (reqData.name !== undefined && reqData.name !== existingUserData.name) {
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
  if (reqData.phoneNumber !== undefined && reqData.phoneNumber !== existingUserData.phoneNumber) {
    dataToUpdate.phoneNumber = reqData.phoneNumber
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return c.json({ message: UPDATE_NO_CHANGES }, OK)
  }

  const result = await updateUser(db, id, dataToUpdate)

  if (result.length === 0) {
    throw new HTTPException(INTERNAL_SERVER_ERROR, {
      message: UPDATE_USER_FAILED,
    })
  }

  return c.json(result[0], OK)
})

export default router
