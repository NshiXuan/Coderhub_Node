const Router = require('koa-router')
const userController = require('../controller/user.controller')

const userRouter = new Router({ prefix: '/users' })
const { verifyUser, handlePassword } = require('../middleware/user.middleware')

userRouter.post('/', verifyUser, handlePassword, userController.create)
userRouter.get('/avatar/:userId', userController.avatarInfo)

module.exports = userRouter