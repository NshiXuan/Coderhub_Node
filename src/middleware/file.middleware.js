const path = require('path')
const multer = require('koa-multer')
const Jimp = require('jimp')

const { AVATAR_PATH, PICTURE_PATH } = require('../constants/file-path')

const initStorage = (storageFilePath) => {
  return multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, storageFilePath)
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
}

const avatarStorage = initStorage(AVATAR_PATH)
const avatarUpload = multer({ storage: avatarStorage })
const avatarHandler = avatarUpload.single('avatar')

const pictureStorage = initStorage(PICTURE_PATH)
const pictureUpload = multer({ storage: pictureStorage })
const pictureHandler = pictureUpload.array('picture', 9)

const pictureResize = async (ctx, next) => {
  // 1.获取所有图片信息
  const files = ctx.req.files

  // 2.对图像进行处理 sharp/jimp
  for (const file of files) {
    const destPath = path.join(file.destination, file.filename)
    Jimp.read(file.path).then(image => {
      image.resize(1280, Jimp.AUTO).write(`${destPath}-large`)
      image.resize(640, Jimp.AUTO).write(`${destPath}-middle`)
      image.resize(320, Jimp.AUTO).write(`${destPath}-small`)
    })
  }

  await next()
}

module.exports = {
  avatarHandler,
  pictureHandler,
  pictureResize
}