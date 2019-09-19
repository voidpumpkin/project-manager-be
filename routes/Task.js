const Router = require('koa-router');
const { task } = require('../models');

const taskRouter = new Router();

taskRouter
    .get('/', ctx => {
        ctx.body = 'Well getTasks was called';
    })
    .post('/', async ctx => {
        const { title, details } = ctx.request.body;
        await task.create({ title, details });
        ctx.status = 200;
    });

module.exports = taskRouter.routes();
