const Router = require('koa-joi-router');
const { Joi } = Router;
const {
    getAll,
    getById,
    create,
    update,
    destroy,
    addParticipator,
    removeParticipator,
    getParticipatorsIds
} = require('../services/Project');
const { AllowOnlyAuthenticated, OnError } = require('../utils/Middlewares');

const router = Router();

const routes = [
    {
        method: 'get',
        path: '/projects',
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
        path: '/projects/:id/participators',
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
                ctx.body = { ids: await getParticipatorsIds(id, userId) };
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
                    .required(),
                managerId: Joi.number()
            },
            continueOnError: true
        },
        handler: [
            AllowOnlyAuthenticated,
            OnError,
            async ctx => {
                const { id: userId } = ctx.state.user;
                const { title, details, managerId } = ctx.request.body;
                ctx.body = await create({ title, details, managerId }, userId);
                ctx.status = 200;
            }
        ]
    },
    {
        method: 'post',
        path: '/projects/:id/participators',
        validate: {
            type: 'json',
            body: {
                participatorId: Joi.number().required()
            },
            continueOnError: true
        },
        handler: [
            AllowOnlyAuthenticated,
            OnError,
            async ctx => {
                const { id } = ctx.request.params;
                const { participatorId } = ctx.request.body;
                await addParticipator(id, participatorId, ctx.state.user);
                ctx.status = 204;
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
            },
            continueOnError: true
        },
        handler: [
            AllowOnlyAuthenticated,
            OnError,
            async ctx => {
                const { id: userId } = ctx.state.user;
                const { id } = ctx.params;
                const { title, details } = ctx.request.body;
                await update({ id, title, details }, userId);
                ctx.status = 204;
            }
        ]
    },
    {
        method: 'delete',
        path: '/projects/:id/participators/:participatorId',
        validate: {
            params: {
                id: Joi.number().required(),
                participatorId: Joi.number().required()
            },
            continueOnError: true
        },
        handler: [
            AllowOnlyAuthenticated,
            OnError,
            async ctx => {
                const { id, participatorId } = ctx.params;
                await removeParticipator(id, participatorId);
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
