const connection = require('../app/database')
const requestService = require('./request.service')
const { APP_HOST, APP_PORT } = require('../app/config')

class MomentService {
  async create(userId, content) {
    const statement = `INSERT INTO moment (content,user_id) VALUES (?,?);`
    const [result] = await connection.execute(statement, [content, userId])

    return result
  }

  async getMomentById(id) {
    const statement = `
      SELECT 
        m.id id,m.content content,m.createAt createTime,m.updateAt updataTime,
        JSON_OBJECT('id',u.id,'name',u.name,'avatarUrl',u.avatar_url) author,
        IF(COUNT(l.id),	JSON_ARRAYAGG(
          JSON_OBJECT('id',l.id,'name',l.name)
        ),NULL) labels,
        (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
          JSON_OBJECT('id',c.id,'content',c.content,'commentId',c.comment_id,'createTime',c.createAt,
          'user',JSON_OBJECT('id',cu.id,'name',cu.name,'avatarUrl',cu.avatar_url))
        ),NULL) FROM comment c LEFT JOIN users cu ON c.user_id = cu.id WHERE m.id = c.moment_id) comments,
        (SELECT JSON_ARRAYAGG(CONCAT('${APP_HOST}:${APP_PORT}/moment/images/',f.filename)) FROM file f WHERE m.id = f.moment_id) images
      FROM moment m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN moment_label ml ON ml.moment_id = m.id
      LEFT JOIN label l ON l.id = ml.label_id
      WHERE m.id = ?
      GROUP BY m.id;
    `
    const [result] = await connection.execute(statement, [id])

    return result[0]
  }

  async getMomentList(offset, size) {
    const statement = `
      SELECT 
        m.id id,m.content content,m.createAt createTime,m.updateAt updataTime,
        JSON_OBJECT('id',u.id,'name',u.name) author,
        (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
        (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
        (SELECT JSON_ARRAYAGG(CONCAT('${APP_HOST}:${APP_PORT}/moment/images/',f.filename)) FROM file f WHERE m.id = f.moment_id) images
      FROM moment m
      LEFT JOIN users u ON m.user_id=u.id
      LIMIT ?,?;
    `

    return await requestService(statement, [offset, size])
  }

  async update(content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`
    const [result] = await connection.execute(statement, [content, momentId])

    return result
  }

  async delete(momentId) {
    const statement = `DELETE FROM moment WHERE id = ?;`
    const [result] = await connection.execute(statement, [momentId])

    return result
  }

  async hasLabel(momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`
    const result = await requestService(statement, [momentId, labelId])
    return result[0] ? true : false
  }

  async addLabel(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id,label_id) VALUES (?,?);`
    return await requestService(statement, [momentId, labelId])
  }
}

module.exports = new MomentService()