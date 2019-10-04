const Router = require('koa-joi-router');
const Joi = Router.Joi;
const { getAll, getById, create, update, destroy } = require('../services/Task');
const { AllowOnlyAuthenticated, OnError } = require('../utils/Middlewares');

const router = Router();

const routes = [
    {
        method: 'get',
        path: '/tasks',
        handler: [
            AllowOnlyAuthenticated,
            OnError,
            async ctx => {
                throw Error('this route is disabled');
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
            },
            continueOnError: true
        },
        handler: [
            AllowOnlyAuthenticated,
            OnError,
            async ctx => {
                const { id: userId } = ctx.state.user;
                const { id } = ctx.params;
                ctx.body = await getById(id, userId);
                ctx.status = 200;
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
                taskId: Joi.number(),
                assigneeId: Joi.number()
            },
            continueOnError: true
        },
        handler: [
            AllowOnlyAuthenticated,
            OnError,
            async ctx => {
                const { id: userId } = ctx.state.user;
                const { title, details, isDone, projectId, taskId, assigneeId } = ctx.request.body;
                ctx.body = await create(
                    { title, details, isDone, projectId, taskId, assigneeId },
                    userId
                );
                ctx.status = 200;
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
                isDone: Joi.boolean(),
                assigneeId: Joi.number()
            },
            continueOnError: true
        },
        handler: [
            AllowOnlyAuthenticated,
            OnError,
            async ctx => {
                const { id: userId } = ctx.state.user;
                const { id } = ctx.params;
                const { title, details, isDone, assigneeId } = ctx.request.body;
                await update({ id, title, details, isDone, assigneeId }, userId);
                ctx.status = 204;
            }
        ]
    },
    {
        method: 'delete',
        path: '/tasks/:id',
        validate: {
            params: {
                id: Joi.number()
            },
            continueOnError: true
        },
        handler: [
            AllowOnlyAuthenticated,
            OnError,
            async ctx => {
                const { id: userId } = ctx.state.user;
                const { id } = ctx.params;
                await destroy(id, userId);
                ctx.status = 204;
            }
        ]
    }
];

module.exports = router.route(routes);
