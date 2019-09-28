const Router = require('koa-joi-router');
const Joi = Router.Joi;
const { getAll, getById, create, update, destroy } = require('../services/Task');
const { AllowOnlyAuthenticated, AllowOnlyWhenIdExistsFnMaker } = require('../utils/Middlewares');
const { logCtxErr } = require('../utils');

const router = Router();
const AllowOnlyWhenIdExists = AllowOnlyWhenIdExistsFnMaker('Task');

const routes = [
    {
        method: 'get',
        path: '/tasks',
        handler: [
            AllowOnlyAuthenticated,
            async ctx => {
                ctx.body = await getAll();
                ctx.status = 200;
            }
        ]
    },
    {
        method: 'get',
        path: '/tasks/:id',
        validate: {
            params: {
                id: Joi.number()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            AllowOnlyWhenIdExists,
            async ctx => {
                try {
                    const { id: userId } = ctx.state.user;
                    const { id } = ctx.params;
                    ctx.body = await getById(id, userId);
                    ctx.status = 200;
                } catch (err) {
                    logCtxErr();
                    ctx.body = err.message;
                    ctx.status = 400;
                }
            }
        ]
    },
    {
        method: 'post',
        path: '/tasks',
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
                isDone: Joi.boolean(),
                projectId: Joi.number().required(),
                taskId: Joi.number()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            async ctx => {
                try {
                    const { id: userId } = ctx.state.user;
                    const { title, details, isDone, projectId, taskId } = ctx.request.body;
                    ctx.body = await create({ title, details, isDone, projectId, taskId }, userId);
                    ctx.status = 200;
                } catch (err) {
                    logCtxErr();
                    ctx.body = err.message;
                    ctx.status = 400;
                }
            }
        ]
    },
    {
        method: 'put',
        path: '/tasks/:id',
        validate: {
            type: 'json',
            params: {
                id: Joi.number()
            },
            body: {
                title: Joi.string().max(255),
                details: Joi.string()
                    .allow('')
                    .max(255),
                isDone: Joi.boolean()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            AllowOnlyWhenIdExists,
            async ctx => {
                try {
                    const { id: userId } = ctx.state.user;
                    const { id } = ctx.params;
                    const { title, details, isDone } = ctx.request.body;
                    await update({ id, title, details, isDone }, userId);
                    ctx.status = 204;
                } catch (err) {
                    logCtxErr();
                    ctx.body = err.message;
                    ctx.status = 400;
                }
            }
        ]
    },
    {
        method: 'delete',
        path: '/tasks/:id',
        validate: {
            params: {
                id: Joi.number()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            AllowOnlyWhenIdExists,
            async ctx => {
                try {
                    const { id: userId } = ctx.state.user;
                    const { id } = ctx.params;
                    await destroy(id, userId);
                    ctx.status = 204;
                } catch (err) {
                    logCtxErr();
                    ctx.body = err.message;
                    ctx.status = 400;
                }
            }
        ]
    }
];

module.exports = router.route(routes);
