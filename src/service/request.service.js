const connection = require('../app/database')

const requestService = async (statement, ...args) => {
  try {
    const [result] = await connection.execute(statement, ...args)
    return result
  } catch (error) {
    console.log(error);
  }
}

module.exports = requestService
