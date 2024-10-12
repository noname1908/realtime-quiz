import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import UserService from 'App/Services/UserService'
import StoreUserValidator from 'App/Validators/StoreUserValidator'

@inject()
export default class UsersController {
  constructor(private userService: UserService) {}

  /**
   * @store
   * @operationId storeUser
   * @requestBody <User>.only(name)
   * @responseBody 200 - <User>
   * @responseBody 422 - Invalid data
   */
  public async store({ request }: HttpContextContract): Promise<User> {
    const payload = await request.validate(StoreUserValidator)

    const user = await this.userService.addUser(payload)

    return user
  }
}
