const Router = require('koa-router');
const { getAll, get, create, update, destroy } = require('../services/Project');

const router = new Router();

router
    .get('/', async ctx => {
        ctx.body = await getAll();
        ctx.status = 200;
    })
    .get('/:id', async ctx => {
        const { id } = ctx.params;
        ctx.body = await get(id);
        ctx.status = 200;
    })
    .post('/', async ctx => {
        const { title, details } = ctx.request.body;
        ctx.body = await create({ title, details });
        ctx.status = 200;
    })
    .put('/:id', async ctx => {
        const { id } = ctx.params;
        const { title, details } = ctx.request.body;
        await update({ id, title, details });
        ctx.status = 204;
    })
    .delete('/:id', async ctx => {
        const { id } = ctx.params;
        await destroy(id);
        ctx.status = 204;
    });

module.exports = router.routes();
