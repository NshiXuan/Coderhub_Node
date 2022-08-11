const Router = require('koa-router')

const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware')
const commentController = require('../controller/comment.controller')

const commentRouter = new Router({ prefix: '/comment' })

// 发表评论
commentRouter.post('/', verifyAuth, commentController.create)
commentRouter.post('/reply/:commentId', verifyAuth, commentController.reply)

// 修改评论
commentRouter.patch('/:commentId', verifyAuth, verifyPermission, commentController.update)

// 删除评论
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, commentController.delete)

// 获取评论列表
commentRouter.get('/', commentController.list)

module.exports = commentRouter
