const Router = require('koa-joi-router');
const Joi = Router.Joi;
const { getAll, get, create, update, destroy } = require('../services/Task');
const { get: getProject } = require('../services/Project');
const { AllowOnlyAuthenticated, AllowOnlyWhenIdExistsFnMaker } = require('../utils/Middlewares');

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
                const { id } = ctx.params;
                ctx.body = await get(id);
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
                projectId: Joi.number().required(),
                taskId: Joi.number()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            async ctx => {
                const { title, details, projectId, taskId } = ctx.request.body;
                const project = await getProject(projectId);
                const task = await get(taskId);
                if (project === null) {
                    ctx.body = `parent project with id ${projectId} does not exist`;
                    ctx.status = 400;
                } else if (task === null || projectId != task.projectId) {
                    ctx.body = `parent task with id ${taskId} does not exist`;
                    ctx.status = 400;
                } else {
                    ctx.body = await create({ title, details, projectId, taskId });
                    ctx.status = 200;
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
                    .max(255)
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            AllowOnlyWhenIdExists,
            async ctx => {
                const { id } = ctx.params;
                const { title, details, projectId, taskId } = ctx.request.body;
                await update({ id, title, details, projectId, taskId });
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
