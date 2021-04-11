'use strict'

class AuthenticationController {
  async auth ({ request, auth }) {
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    return token
  }
}

module.exports = AuthenticationController
