const fs = require('fs')

const fileService = require('../service/file.service')
const momentService = require('../service/moment_service')
const { PICTURE_PATH } = require('../constants/file-path')

class MomentController {
  async create(ctx, next) {
    // 1.获取数据 user_id , content
    const userId = ctx.user.id
    const content = ctx.request.body.content

    // 2.将数据插入数据库
    const result = await momentService.create(userId, content)

    ctx.body = result
  }

  async detail(ctx, next) {
    // 1.获取数据momentId 因为路由为 /:momentId
    const momentId = ctx.params.momentId

    // 2.更加id查询这条数据
    const result = await momentService.getMomentById(momentId)

    ctx.body = result
  }

  async list(ctx, next) {
    // 1.获取数据offset size
    const { offset, size } = ctx.query

    // 2.查询列表
    const result = await momentService.getMomentList(offset, size)

    ctx.body = result
  }

  async update(ctx, next) {
    // 获取要修改的动态id、修改的内容、用户的id
    const { momentId } = ctx.params
    const { content } = ctx.request.body

    const result = await momentService.update(content, momentId)

    ctx.body = result
  }

  async delete(ctx, next) {
    // 1.获取momentId
    const { momentId } = ctx.params

    // 2.删除内容
    const result = await momentService.delete(momentId)

    ctx.body = result
  }

  async addLabels(ctx, next) {
    // 1.获取标签和动态id
    const { labels } = ctx
    const { momentId } = ctx.params

    // 2.添加所有的标签
    for (const label of labels) {
      const isExist = await momentService.hasLabel(momentId, label.id)
      if (!isExist) {
        await momentService.addLabel(momentId, label.id)
      }
    }

    ctx.body = {
      statusCode: 200,
      message: '给动态添加标签成功~'
    }
  }

  async fileInfo(ctx, next) {
    // 1.获取图像信息
    let { filename } = ctx.params
    console.log(filename);
    const fileInfo = await fileService.getFileByFilename(filename)
    const { type } = ctx.query
    const types = ['small', 'middle', 'large']
    if (types.some(item => item === type)) {
      filename = filename + '-' + type
    }

    // 2.提供图片信息
    ctx.response.set('content-type', fileInfo[0].mimetype)
    // 注释上面的set代码，网页访问这个接口后会直接下载图片，因为浏览器不知道我们这个图片的类型，有上面的set访问会直接展示图片
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`)
  }
}

module.exports = new MomentController()
