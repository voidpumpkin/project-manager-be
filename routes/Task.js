const Router = require('koa-router');
const { Task } = require('../models');

const router = new Router();

router
    .get('/', async ctx => {
        ctx.body = await Task.findAll();
        ctx.status = 200;
    })
    .get('/:id', async ctx => {
        const { id } = ctx.params;
        ctx.body = await Task.findByPk(id);
        ctx.status = 200;
    })
    .post('/', async ctx => {
        const { title, details, projectId, taskId } = ctx.request.body;
        ctx.body = await Task.create({ title, details, projectId, taskId });
        ctx.status = 200;
    })
    .put('/:id', async ctx => {
        const { id } = ctx.params;
        const { title, details, projectId, taskId } = ctx.request.body;
        const task = await Task.findByPk(id);
        await task.update({ title, details, projectId, taskId });
        ctx.status = 204;
    })
    .delete('/:id', async ctx => {
        const { id } = ctx.params;
        const task = await Task.findByPk(id);
        await task.destroy();
        ctx.status = 204;
    });

module.exports = router.routes();
