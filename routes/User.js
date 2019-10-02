const Router = require('koa-joi-router');
const { Joi } = Router;
const { getAll, getById, create, update, destroy } = require('../services/User');
const { AllowOnlyAuthenticated } = require('../utils/Middlewares');
const { logCtxErr } = require('../utils');

const router = Router();

const routes = [
    {
        method: 'get',
        path: '/users',
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
        path: '/users/:id',
        validate: {
            params: {
                id: Joi.number()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            async ctx => {
                try {
                    throw Error('this route is disabled');
                    const { id } = ctx.params;
                    ctx.body = await getById(id);
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
        path: '/users',
        validate: {
            type: 'json',
            body: {
                username: Joi.string()
                    .max(255)
                    .required(),
                password: Joi.string()
                    .max(255)
                    .required(),
                isSystemAdmin: Joi.boolean()
            }
        },
        handler: [
            async ctx => {
                try {
                    const { username, password, isSystemAdmin } = ctx.request.body;
                    ctx.body = await create({ username, password, isSystemAdmin });
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
        path: '/users/:id',
        validate: {
            type: 'json',
            params: {
                id: Joi.number()
            },
            body: {
                username: Joi.string().max(255),
                password: Joi.string().max(255),
                isSystemAdmin: Joi.boolean()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            async ctx => {
                try {
                    const { id } = ctx.params;
                    const { username, password, isSystemAdmin } = ctx.request.body;
                    await update({ id, username, password, isSystemAdmin });
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
        path: '/users/:id',
        validate: {
            params: {
                id: Joi.number()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            async ctx => {
                try {
                    throw Error('this route is disabled');
                    const { id } = ctx.params;
                    await destroy(id);
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
