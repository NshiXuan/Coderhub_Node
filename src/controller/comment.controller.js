const commentService = require('../service/comment.service')
const requestService = require('../service/request.service')

class CommentController {
  async create(ctx, next) {
    const { momentId, content } = ctx.request.body
    const { id } = ctx.user

    const result = await commentService.create(momentId, content, id)

    ctx.body = result
  }

  async reply(ctx, next) {
    const { content, momentId } = ctx.request.body
    const { commentId } = ctx.params
    const { id } = ctx.user

    const result = await commentService.reply(momentId, content, id, commentId)

    ctx.body = result
  }

  async update(ctx, next) {
    const { commentId } = ctx.params
    const { content } = ctx.request.body
    const result = await commentService.update(commentId, content)

    ctx.body = result
  }

  async delete(ctx, next) {
    const { commentId } = ctx.params
    const result = await commentService.delete(commentId)

    ctx.body = result
  }

  async list(ctx, next) {
    const { momentId } = ctx.query
    const statement = `
      SELECT 
        c.id,c.content,c.comment_id commentId,c.createAt createTime,
        JSON_OBJECT('id',u.id,'name',u.name) author
      FROM comment c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE moment_id = ?;
    `
    const result = await requestService(statement, [momentId])

    ctx.body = result
  }
}

module.exports = new CommentController()
