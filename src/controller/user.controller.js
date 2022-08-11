const fs = require('fs')

const fileService = require('../service/file.service')
const userService = require('../service/user.service')
const { AVATAR_PATH } = require('../constants/file-path')

class UserController {
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body

    // 查询数据
    const result = await userService.create(user)

    // 返回数据
    ctx.body = result
  }

  async avatarInfo(ctx, next) {
    // 1.获取用户头像信息
    const { userId } = ctx.params
    const result = await fileService.getAvatarByUserId(userId)
    const avatarInfo = result[0]

    // 2.提供头像信息
    ctx.response.set('content-type', avatarInfo.mimetype)
    // 注释上面的set代码，网页访问这个接口后会直接下载图片，因为浏览器不知道我们这个图片的类型，有上面的set访问会直接展示图片
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`)
  }
}

module.exports = new UserController()