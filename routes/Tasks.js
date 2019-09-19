const Router = require('koa-router');
const { task } = require('../models');

const tasksRouter = new Router();

tasksRouter.get('/', async ctx => {
    const tasks = await task.findAll();
    ctx.status = 200;
    ctx.body = JSON.stringify(tasks, null, 4);
});

module.exports = tasksRouter.routes();
