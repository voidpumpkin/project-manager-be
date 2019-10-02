const Router = require('koa-joi-router');
const { Joi } = Router;
const { getAll, getById, create, update, destroy } = require('../services/Project');
const { AllowOnlyAuthenticated } = require('../utils/Middlewares');
const { logCtxErr } = require('../utils');

const router = Router();

const routes = [
    {
        method: 'get',
        path: '/projects',
        handler: [
            AllowOnlyAuthenticated,
            async ctx => {
                try {
                    throw Error('this route is disabled');
                    ctx.body = await getAll();
                    ctx.status = 200;
                } catch (err) {
                    logCtxErr(err);
                    ctx.body = err.message;
                    ctx.status = 400;
                }
            }
        ]
    },
    {
        method: 'get',
        path: '/projects/:id',
        validate: {
            params: {
                id: Joi.number()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            async ctx => {
                try {
                    const { id: userId } = ctx.state.user;
                    const { id } = ctx.params;
                    ctx.body = await getById(id, userId);
                    ctx.status = 200;
                } catch (err) {
                    logCtxErr(err);
                    ctx.body = err.message;
                    ctx.status = 400;
                }
            }
        ]
    },
    {
        method: 'post',
        path: '/projects',
        validate: {
            type: 'json',
            body: {
                title: Joi.string()
                    .max(255)
                    .required(),
                details: Joi.string()
                    .allow('')
                    .max(255)
                    .required(),
                managerId: Joi.number()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            async ctx => {
                try {
                    const { id: userId } = ctx.state.user;
                    const { title, details, managerId } = ctx.request.body;
                    ctx.body = await create({ title, details, managerId }, userId);
                    ctx.status = 200;
                } catch (err) {
                    logCtxErr(err);
                    ctx.body = err.message;
                    ctx.status = 400;
                }
            }
        ]
    },
    {
        method: 'put',
        path: '/projects/:id',
        validate: {
            type: 'json',
            params: {
                id: Joi.number()
            },
            body: {
                title: Joi.string().max(255),
                details: Joi.string()
                    .allow('')
                    .max(255)
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            async ctx => {
                try {
                    const { id: userId } = ctx.state.user;
                    const { id } = ctx.params;
                    const { title, details } = ctx.request.body;
                    await update({ id, title, details }, userId);
                    ctx.status = 204;
                } catch (err) {
                    logCtxErr(err);
                    ctx.body = err.message;
                    ctx.status = 400;
                }
            }
        ]
    },
    {
        method: 'delete',
        path: '/projects/:id',
        validate: {
            params: {
                id: Joi.number()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            async ctx => {
                try {
                    const { id: userId } = ctx.state.user;
                    const { id } = ctx.params;
                    await destroy(id, userId);
                    ctx.status = 204;
                } catch (err) {
                    logCtxErr(err);
                    ctx.body = err.message;
                    ctx.status = 400;
                }
            }
        ]
    }
];

module.exports = router.route(routes);
