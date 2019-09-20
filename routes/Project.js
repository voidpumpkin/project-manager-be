const Router = require('koa-router');
const { Project } = require('../models');

const router = new Router();

router
    .get('/', async ctx => {
        ctx.body = await Project.findAll();
        ctx.status = 200;
    })
    .get('/:id', async ctx => {
        const { id } = ctx.params;
        ctx.body = await Project.findByPk(id);
        ctx.status = 200;
    })
    .post('/', async ctx => {
        const { title, details } = ctx.request.body;
        ctx.body = await Project.create({ title, details });
        ctx.status = 200;
    })
    .put('/:id', async ctx => {
        const { id } = ctx.params;
        const { title, details } = ctx.request.body;
        const project = await Project.findByPk(id);
        await project.update({ title, details });
        ctx.status = 204;
    })
    .delete('/:id', async ctx => {
        const { id } = ctx.params;
        const project = await Project.findByPk(id);
        await project.destroy();
        ctx.status = 204;
    });

module.exports = router.routes();
