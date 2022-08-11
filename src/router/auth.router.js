const Router = require('koa-router')

const authController = require('../controller/auth.controller')
const { verifyUser, verifyAuth } = require('../middleware/auth.middleware')

const autoRouter = new Router()

autoRouter.post('/login', verifyUser, authController.login)
autoRouter.get('/test', verifyAuth, authController.success)

module.exports = autoRouter
