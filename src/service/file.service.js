const requestService = require("./request.service")

class FileService {
  async createAvatar(filename, mimetype, size, userId) {
    const statement = `INSERT INTO avatar (filename,mimetype,size,user_id) VALUES (?,?,?,?);`
    return await requestService(statement, [filename, mimetype, size, userId])
  }

  async getAvatarByUserId(userId) {
    const statement = `SELECT * FROM avatar WHERE user_id = ?;`
    return await requestService(statement, [userId])
  }

  async createFile(filename, mimetype, size, userId, momentId) {
    const statement = `INSERT INTO file (filename,mimetype,size,user_id,moment_id) VALUES (?,?,?,?,?);`
    return await requestService(statement, [filename, mimetype, size, userId, momentId])
  }

  async getFileByFilename(filename) {
    const statement = `SELECT * FROM file WHERE filename = ?;`
    return await requestService(statement, [filename])
  }
}

module.exports = new FileService() 