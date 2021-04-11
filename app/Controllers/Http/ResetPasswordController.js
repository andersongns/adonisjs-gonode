'use strict'

const crypto = require('crypto')
const { subDays, isAfter } = require('date-fns')
const UserModel = use('App/Models/User')
const Mail = use('Mail')

class ResetPasswordController {
  async reset ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await UserModel.findByOrFail('email', email)
      const token = crypto.randomBytes(10).toString('hex')
      user.reset_password_token = token
      user.reset_password_created_at = new Date()
      await user.save()
      await Mail.send(
        ['mails.reset-password', 'mails.reset-password-text'],
        {
          email,
          token,
          link: `${request.input('redirect_url')}?token=${token}`
        },
        message => {
          message
            .to(user.email)
            .from('teste@email.com', 'No Reply | GoNode')
            .subject('Recuperação de password')
        }
      )
    } catch (error) {
      return response.status(error.status).send({ error: { message: 'Algo não deu certo, esse e-mail existe?' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()
      const user = await UserModel.findByOrFail('reset_password_token', token)
      const tokenExpires = subDays(new Date(), 2)

      if (isAfter(tokenExpires, user.reset_password_created_at)) {
        return response.status(401).send({ error: { message: 'O token de recuperação está expirado' } })
      }

      user.reset_password_token = null
      user.reset_password_created_at = null
      user.password = password

      await user.save()
    } catch (error) {
      return response.status(error.status).send({ error: { message: 'Algo deu errado ao resetar senha' } })
    }
  }
}

module.exports = ResetPasswordController
