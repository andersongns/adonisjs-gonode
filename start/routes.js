'use strict'

const Route = use('Route')

Route.post('/users', 'UserController.create')
Route.post('/auth', 'AuthenticationController.auth')
Route.post('/reset-password', 'ResetPasswordController.reset')
Route.put('/reset-password', 'ResetPasswordController.update')

Route.get('/files/:id', 'FileController.show')
Route.post('/files', 'FileController.create')
