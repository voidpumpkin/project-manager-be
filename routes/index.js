const Router = require('koa-router');

const indexRouter = new Router();

indexRouter.get('/', ctx => {
    ctx.status = 200;
    ctx.body = 'You are using the Project Manager Back-end!';
});

module.exports = indexRouter.routes();
