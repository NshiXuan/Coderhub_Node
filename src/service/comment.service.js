const requestService = require('./request.service')

class CommentService {
  async create(momentId, content, userId) {
    const statement = `INSERT INTO comment (content,moment_id,user_id) VALUES (?,?,?);`
    return await requestService(statement, [content, momentId, userId])
  }

  async reply(momentId, content, userId, commentId) {
    const statement = `INSERT INTO comment (content,moment_id,user_id,comment_id) VALUES (?,?,?,?);`
    return await requestService(statement, [content, momentId, userId, commentId])
  }

  async update(commentId, content) {
    const statement = `UPDATE comment SET content = ? WHERE id = ?;`
    return await requestService(statement, [content, commentId])
  }

  async delete(commentId) {
    const statement = `DELETE FROM comment WHERE id = ?`
    return await requestService(statement, [commentId])
  }
}

module.exports = new CommentService()
