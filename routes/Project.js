const Router = require('koa-joi-router');
const { Joi } = Router;
const { getAll, get, create, update, destroy } = require('../services/Project');
const { AllowOnlyAuthenticated, AllowOnlyWhenIdExistsFnMaker } = require('../utils/Middlewares');

const router = Router();
const AllowOnlyWhenIdExists = AllowOnlyWhenIdExistsFnMaker('Project');

const routes = [
    {
        method: 'get',
        path: '/projects',
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
        path: '/projects/:id',
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
                ctx.body = await get(id);
                ctx.status = 200;
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
                    .required()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            async ctx => {
                const { title, details } = ctx.request.body;
                ctx.body = await create({ title, details });
                ctx.status = 200;
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
            AllowOnlyWhenIdExists,
            async ctx => {
                const { id } = ctx.params;
                const { title, details } = ctx.request.body;
                await update({ id, title, details });
                ctx.status = 204;
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
            AllowOnlyWhenIdExists,
            async ctx => {
                const { id } = ctx.params;
                await destroy(id);
                ctx.status = 204;
            }
        ]
    }
];

module.exports = router.route(routes);
