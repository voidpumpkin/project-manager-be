const Router = require('koa-joi-router');
const Joi = Router.Joi;
const { AllowOnlyAuthenticated, OnError } = require('../utils/Middlewares');
const taskController = require('../controllers/Task');

const router = Router();

const routes = [
    {
        method: 'get',
        path: '/tasks/:id/relationships/subtasks',
        validate: {
            params: {
                id: Joi.number()
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, taskController.getSubTasks]
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
        method: 'patch',
        path: '/tasks/:id',
        validate: {
            type: 'json',
            params: {
                id: Joi.number()
            },
            body: {
                data: Joi.object({
                    type: Joi.string()
                        .valid('tasks')
                        .required(),
                    attributes: {
                        title: Joi.string().max(255),
                        details: Joi.string()
                            .allow('')
                            .max(255),
                        isDone: Joi.boolean()
                    }
                }),
                relationships: {
                    assignee: Joi.object({
                        type: Joi.string()
                            .valid('users')
                            .required(),
                        id: Joi.number().required()
                    })
                }
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, taskController.patch]
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
        handler: [AllowOnlyAuthenticated, OnError, taskController.destroy]
    }
];

module.exports = router.route(routes);
