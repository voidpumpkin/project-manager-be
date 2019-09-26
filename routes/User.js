const Router = require('koa-joi-router');
const { Joi } = Router;
const { getAll, getById, getByAtr, create, update, destroy } = require('../services/User');
const { AllowOnlyAuthenticated, AllowOnlyWhenIdExistsFnMaker } = require('../utils/Middlewares');

const router = Router();
const AllowOnlyWhenIdExists = AllowOnlyWhenIdExistsFnMaker('User');

const routes = [
    {
        method: 'get',
        path: '/users',
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
        path: '/users/:id',
        validate: {
            params: {
                id: Joi.number()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            AllowOnlyWhenIdExists,
            async ctx => {
                const { id } = ctx.params;
                ctx.body = await getById(id);
                ctx.status = 200;
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
            AllowOnlyAuthenticated,
            async ctx => {
                const { username, password, isSystemAdmin } = ctx.request.body;
                if (await getByAtr('username', username)) {
                    ctx.status = 409;
                    ctx.body = 'username already taken';
                } else {
                    ctx.body = await create({ username, password, isSystemAdmin });
                    ctx.status = 200;
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
            AllowOnlyWhenIdExists,
            async ctx => {
                const { id } = ctx.params;
                //FIXME: Password more authentication
                const { username, password, isSystemAdmin } = ctx.request.body;
                const existingUser = await getByAtr('username', username);
                if (existingUser) {
                    ctx.status = 409;
                    ctx.body = 'username already taken';
                } else {
                    await update({ id, username, password, isSystemAdmin });
                    ctx.status = 204;
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
            AllowOnlyWhenIdExists,
            async ctx => {
                //FIXME: Should only allow if is Manager of no projects
                const { id } = ctx.params;
                await destroy(id);
                ctx.status = 204;
            }
        ]
    }
];

module.exports = router.route(routes);
