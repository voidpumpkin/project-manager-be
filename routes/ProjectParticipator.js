const Router = require('koa-joi-router');
const { Joi } = Router;
const {
    addParticipatorToProject,
    removeParticipatorFromProject
} = require('../services/ProjectParticipator');
const { AllowOnlyAuthenticated, AllowOnlyWhenIdExistsFnMaker } = require('../utils/Middlewares');
const { logCtxErr } = require('../utils');

const router = Router();
const AllowOnlyWhenIdExists = AllowOnlyWhenIdExistsFnMaker('Project');

const routes = [
    {
        method: 'post',
        path: '/projects/:id/participators',
        validate: {
            type: 'json',
            body: {
                participatorId: Joi.number().required()
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            AllowOnlyWhenIdExists,
            async ctx => {
                try {
                    const { id } = ctx.request.params;
                    const { participatorId } = ctx.request.body;
                    await addParticipatorToProject(id, participatorId, ctx.state.user);
                    ctx.status = 204;
                } catch (err) {
                    logCtxErr();
                    ctx.status = 400;
                    ctx.body = err.message;
                }
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
            }
        },
        handler: [
            AllowOnlyAuthenticated,
            AllowOnlyWhenIdExists,
            async ctx => {
                const { id, participatorId } = ctx.params;
                await removeParticipatorFromProject(id, participatorId);
                ctx.status = 204;
            }
        ]
    }
];

module.exports = router.route(routes);
