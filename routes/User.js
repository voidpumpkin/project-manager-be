const Router = require('koa-joi-router');
const { Joi } = Router;
const { update, destroy } = require('../services/User');
const { AllowOnlyAuthenticated, OnError } = require('../utils/Middlewares');
const userController = require('../controllers/User');

const router = Router();

const routes = [
    {
        method: 'get',
        path: '/users',
        handler: [AllowOnlyAuthenticated, OnError, userController.getAll]
    },
    {
        method: 'get',
        path: '/users/me',
        handler: [AllowOnlyAuthenticated, OnError, userController.getMe]
    },
    {
        method: 'get',
        path: '/users/:id',
        validate: {
            params: {
                id: Joi.number()
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, userController.get]
    },
    {
        method: 'post',
        path: '/users',
        validate: {
            type: 'json',
            body: {
                data: {
                    type: Joi.string()
                        .valid('users')
                        .required(),
                    attributes: {
                        username: Joi.string()
                            .max(255)
                            .required(),
                        password: Joi.string()
                            .max(255)
                            .required()
                    }
                }
            },
            continueOnError: true
        },
        handler: [OnError, userController.post]
    },
    {
        method: 'patch',
        path: '/users/me',
        validate: {
            type: 'json',
            body: {
                data: {
                    type: Joi.string()
                        .valid('users')
                        .required(),
                    attributes: {
                        username: Joi.string().max(255),
                        password: Joi.string().max(255)
                    }
                }
            },
            continueOnError: true
        },
        handler: [AllowOnlyAuthenticated, OnError, userController.patchMe]
    },
    {
        method: 'delete',
        path: '/users/:id',
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
                throw Error('this route is disabled');
                const { id } = ctx.params;
                await destroy(id);
                ctx.status = 204;
            }
        ]
    }
];

module.exports = router.route(routes);
