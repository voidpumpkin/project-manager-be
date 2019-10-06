const Router = require('koa-joi-router');
const Joi = Router.Joi;
const { update, destroy } = require('../services/Task');
const { AllowOnlyAuthenticated, OnError } = require('../utils/Middlewares');
const taskController = require('../controllers/Task');

const router = Router();

const routes = [
    {
        method: 'get',
        path: '/tasks/:id',
        validate: {
            params: {
                id: Joi.number()
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, taskController.get]
    },
    {
        method: 'post',
        path: '/tasks',
        validate: {
            type: 'json',
            body: {
                data: {
                    type: Joi.string()
                        .valid('tasks')
                        .required(),
                    attributes: {
                        title: Joi.string()
                            .max(255)
                            .required(),
                        details: Joi.string()
                            .allow('')
                            .max(255)
                            .required()
                    }
                },
                relationships: {
                    project: Joi.object({
                        type: Joi.string()
                            .valid('projects')
                            .required(),
                        id: Joi.number().required()
                    }).required(),
                    assignee: Joi.object({
                        type: Joi.string()
                            .valid('users')
                            .required(),
                        id: Joi.number().required()
                    }),
                    task: Joi.object({
                        type: Joi.string()
                            .valid('tasks')
                            .required(),
                        id: Joi.number().required()
                    })
                }
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, taskController.post]
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
