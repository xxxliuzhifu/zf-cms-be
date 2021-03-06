const Visitor = require('../models/visitor')

class VisitorCtl {
  async find(ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    const q = new RegExp(ctx.query.q)
    try {
      const data = await Visitor.find({
        $or: [{ guestName: q }, { siteName: q }]
      })
        .limit(perPage)
        .skip(page * perPage)
      ctx.body = {
        code: 200,
        message: '成功',
        data: data
      }
    } catch (error) {
      console.log('error', error)
      ctx.body = {
        code: 500,
        message: '服务错误'
      }
    }
  }
  async create(ctx) {
    ctx.verifyParams({
      guestName: { type: 'string', required: true },
      mobileNumber: { type: 'string', required: true },
      personNum: { type: 'string', required: true },
      visitTime: { type: 'string', required: true },
      siteName: { type: 'string', required: true }
    })
    const body = ctx.request.body
    body.visitTime = +body.visitTime
    const visitor = await new Visitor(body).save()
    ctx.body = visitor
  }
  async del(ctx) {
    try {
      const data = await Visitor.findByIdAndRemove(ctx.params.id)
      if (data) {
        ctx.body = {
          code: 200,
          message: '成功',
          data: data
        }
      } else {
        ctx.body = {
          code: 404,
          message: '访客不存在'
        }
      }
    } catch (error) {
      console.log('error', error)
      ctx.body = {
        code: 500,
        message: '服务错误'
      }
    }
  }
  async update(ctx) {
    ctx.verifyParams({
      guestName: { type: 'string', required: false },
      mobileNumber: { type: 'string', required: false },
      personNum: { type: 'string', required: false },
      visitTime: { type: 'string', required: false },
      siteName: { type: 'string', required: false }
    })
    const body = ctx.request.body
    body.visitTime = body.visitTime ? +body.visitTime : body.visitTime
    try {
      const visitor = await Visitor.findByIdAndUpdate(ctx.params.id, body)
      ctx.body = visitor
    } catch (error) {
      console.log('error', error)
      ctx.body = {
        code: 500,
        message: '服务错误'
      }
    }
  }
}

module.exports = new VisitorCtl()
