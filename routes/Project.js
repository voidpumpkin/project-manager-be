const Router = require('koa-joi-router');
const { Joi } = Router;
const { destroy, removeParticipator } = require('../services/Project');
const { AllowOnlyAuthenticated, OnError } = require('../utils/Middlewares');
const projectController = require('../controllers/Project');

const router = Router();

const routes = [
    {
        method: 'get',
        path: '/projects/:id/relationships/participators',
        validate: {
            params: {
                id: Joi.number()
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, projectController.getParticipators]
    },
    {
        method: 'get',
        path: '/projects/:id/relationships/tasks',
        validate: {
            params: {
                id: Joi.number()
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, projectController.getTasks]
    },
    {
        method: 'get',
        path: '/projects/:id',
        validate: {
            params: {
                id: Joi.number()
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, projectController.get]
    },
    {
        method: 'post',
        path: '/projects/:id/relationships/participators',
        validate: {
            type: 'json',
            params: {
                id: Joi.number()
            },
            body: {
                relationships: {
                    participator: {
                        type: Joi.string()
                            .valid('users')
                            .required(),
                        id: Joi.number().required()
                    }
                }
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, projectController.addParticipator]
    },
    {
        method: 'post',
        path: '/projects',
        validate: {
            type: 'json',
            body: {
                data: {
                    type: Joi.string()
                        .valid('projects')
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
                relationships: Joi.object({
                    manager: {
                        type: Joi.string()
                            .valid('users')
                            .required(),
                        id: Joi.number().required()
                    }
                })
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, projectController.post]
    },
    {
        method: 'patch',
        path: '/projects/:id',
        validate: {
            type: 'json',
            body: {
                data: {
                    type: Joi.string()
                        .valid('projects')
                        .required(),
                    attributes: {
                        title: Joi.string().max(255),
                        details: Joi.string()
                            .allow('')
                            .max(255)
                    }
                },
                relationships: Joi.object({
                    manager: {
                        type: Joi.string()
                            .valid('users')
                            .required(),
                        id: Joi.number().required()
                    }
                })
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, projectController.patch]
    },
    {
        method: 'delete',
        path: '/projects/:id/relationships/participators/:participatorId',
        validate: {
            params: {
                id: Joi.number().required(),
                participatorId: Joi.number().required()
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, projectController.removeParticipator]
    },
    {
        method: 'delete',
        path: '/projects/:id',
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
