const jwt = require('jsonwebtoken')

const errorTypes = require('../constants/error-types')
const userService = require('../service/user.service')
const authService = require('../service/auth.service')
const md5password = require('../utils/password-handle')
const { PUBLIC_KEY } = require('../app/config')

const verifyUser = async (ctx, next) => {
  // 1.获取用户名与密码
  const { name, password } = ctx.request.body

  // 2.判断用户名或者密码是否为空
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }

  // 3.判断用户是否存在
  const result = await userService.getUserByName(name)
  const user = result[0]
  if (!user) {
    return ctx.app.emit('error', new Error(errorTypes.USER_IS_NOT_EXISTS), ctx)
  }

  // 4.判断密码是否与数据库中的密码是否一致（加密）
  if (md5password(password) !== user.password) {
    return ctx.app.emit('error', new Error(errorTypes.PASSWORD_IS_INCORRECT), ctx)
  }

  ctx.user = user
  await next()
}

const verifyAuth = async (ctx, next) => {
  // 1.获取token
  const authorization = ctx.headers.authorization
  if (!authorization) {
    return ctx.app.emit('error', new Error(errorTypes.UNAUTHORIZATION), ctx)
  }
  const token = authorization.replace('Bearer ', '')

  // 2.验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    ctx.user = result
    await next()
  } catch (error) {
    ctx.app.emit('error', new Error(errorTypes.UNAUTHORIZATION), ctx)
  }
}

/**
 * 1.很多的内容都需要验证权限：修改/删除/评论
 * 2.接口：业务接口系统/后台管理系统  这里为业务接口系统
 * 一对一：user -> role
 * 多对多：role -> menu(删除动态/修改动态)
 */
const verifyPermission = async (ctx, next) => {
  // 1.获取参数
  const [resourceKey] = Object.keys(ctx.params)
  const tableName = resourceKey.replace('Id', '')
  const resourceId = ctx.params[resourceKey]
  const { id } = ctx.user

  // 2.查询是否具备权限
  try {
    const isPermission = await authService.checkResource(tableName, resourceId, id)
    if (!isPermission) throw new Error()
    await next()
  } catch (error) {
    return ctx.app.emit('error', new Error(errorTypes.UNPERMISSION), ctx)
  }
}

module.exports = {
  verifyUser,
  verifyAuth,
  verifyPermission
};
