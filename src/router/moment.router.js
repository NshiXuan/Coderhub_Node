const Router = require('koa-router')

const momentController = require('../controller/moment.controller')
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const { verifyLabelExists } = require('../middleware/label.middleware')

const momentRouter = new Router({ prefix: '/moment' })

momentRouter.post('/', verifyAuth, momentController.create)
momentRouter.get('/', momentController.list)
momentRouter.get('/:momentId', momentController.detail)

// 1.用户必须登录 2.用户具备权限
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, momentController.update)
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, momentController.delete)

// 给动态添加标签
momentRouter.post('/labels/:momentId', verifyAuth, verifyPermission, verifyLabelExists, momentController.addLabels)

// 动态配图服务
momentRouter.get('/images/:filename', momentController.fileInfo)

module.exports = momentRouter
