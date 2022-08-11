const requestService = require("./request.service")

class LabelService {
  async create(name) {
    const statement = `INSERT INTO label (name) VALUES (?);`
    return await requestService(statement, [name])
  }

  async getLabelByName(name) {
    const statement = `SELECT * FROM label WHERE name = ?;`
    const result = await requestService(statement, [name])
    return result[0]
  }

  async getLabels(limit, offset) {
    const statement = `SELECT * FROM label LIMIT ?,?;`
    const result = await requestService(statement, [offset, limit])
    return result
  }
}

module.exports = new LabelService()
