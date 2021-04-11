'use strict'

const UserModel = use('App/Models/User')

class UserController {
  async create ({ request }) {
    const data = request.only([
      'username',
      'email',
      'password'
    ])

    const user = await UserModel.create(data)
    return user
  }
}

module.exports = UserController
