const Router = require('koa-joi-router');
const { Joi } = Router;
const { create, update, destroy } = require('../services/User');
const { AllowOnlyAuthenticated, OnError } = require('../utils/Middlewares');
const userController = require('../controllers/user');

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
                username: Joi.string()
                    .max(255)
                    .required(),
                password: Joi.string()
                    .max(255)
                    .required()
            },
            continueOnError: true
        },
        handler: [
            OnError,
            async ctx => {
                const { username, password } = ctx.request.body;
                ctx.body = await create({ username, password });
                ctx.status = 200;
            }
        ]
    },
    {
        method: 'put',
        path: '/users/me',
        validate: {
            type: 'json',
            params: {
                id: Joi.number()
            },
            body: {
                username: Joi.string().max(255),
                password: Joi.string().max(255)
            },
            continueOnError: true
        },
        handler: [
            AllowOnlyAuthenticated,
            OnError,
            async ctx => {
                const { id } = ctx.state.user;
                const { username, password } = ctx.request.body;
                await update({ id, username, password });
                ctx.status = 204;
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
                password: Joi.string().max(255)
            },
            continueOnError: true
        },
        handler: [
            AllowOnlyAuthenticated,
            OnError,
            async ctx => {
                throw Error('this route is disabled');
                const { id } = ctx.params;
                const { username, password } = ctx.request.body;
                await update({ id, username, password });
                ctx.status = 204;
            }
        ]
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
