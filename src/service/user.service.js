const connection = require('../app/database')
const requestService = require('./request.service')

class UserService {
  async create(user) {
    const { name, password } = user
    const statement = `INSERT INTO users (name,password) VALUES (?,?);`
    const result = await connection.execute(statement, [name, password])

    // 将user存储到数据库中
    return result
  }

  async getUserByName(name) {
    const statement = `SELECT * FROM users WHERE name = ?;`
    const result = await connection.execute(statement, [name])

    return result[0]
  }

  async updateAvatarUrlById(avatarUrl, userId) {
    const statement = `UPDATE users SET avatar_url = ? WHERE id = ?;`
    return await requestService(statement, [avatarUrl, userId])
  }
}

module.exports = new UserService()