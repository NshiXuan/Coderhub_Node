const Router = require('koa-router')

const labelController = require('../controller/label.controller')
const { verifyAuth } = require('../middleware/auth.middleware')

const labelRouter = new Router({ prefix: '/label' })

labelRouter.post('/', verifyAuth, labelController.create)

// 获取标签接口
labelRouter.get('/', labelController.list)

module.exports = labelRouter
