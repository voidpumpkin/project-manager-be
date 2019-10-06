const projectService = require('../services/Project');
const { get: getUtil } = require('../utils');

const parseProjectResponse = project => {
    const { managerId, taskIds, id, ...attributes } = project;
    const manager = { links: { self: `/users/${managerId}` }, type: 'users', id: managerId };
    // const tasks = taskIds.map(id => {
    //     return { links: { self: `/tasks/${id}` }, type: 'tasks', id };
    // });
    const tasks = { links: { self: `/projects/${id}/relationships/tasks` } };
    const participators = { links: { self: `/projects/${id}/relationships/participators` } };
    const links = { self: `/projects/${id}` };
    const data = { type: 'projects', id, attributes };
    const relationships = { manager, tasks, participators };
    return { links, data, relationships };
};

const get = async ctx => {
    const { id: userId } = ctx.state.user;
    const { id } = ctx.params;
    ctx.body = parseProjectResponse(await projectService.getById(id, userId));
    ctx.status = 200;
};

const post = async ctx => {
    const { id: userId } = ctx.state.user;
    const { title, details } = ctx.request.body.data.attributes;
    const managerId = getUtil(ctx, 'request.body.relationships.manager.id');
    const { id } = await projectService.create({ title, details, managerId }, userId);
    ctx.body = parseProjectResponse(await projectService.getById(id, userId));
    ctx.status = 201;
};

const getParticipators = async ctx => {
    const { id: userId } = ctx.state.user;
    const { id } = ctx.params;
    const participatorIds = await projectService.getParticipatorsIds(id, userId);
    const data = participatorIds.map(id => {
        return { links: { self: `/users/${id}` }, type: 'users', id };
    });
    const links = { self: `/projects/${id}/relationships/participators` };
    ctx.body = { links, data };
    ctx.status = 200;
};

const getTasks = async ctx => {
    const { id: userId } = ctx.state.user;
    const { id } = ctx.params;
    const taskIds = await projectService.getTaskIds(id, userId);
    const data = taskIds.map(id => {
        return { links: { self: `/tasks/${id}` }, type: 'tasks', id };
    });
    const links = { self: `/projects/${id}/relationships/participators` };
    ctx.body = { links, data };
    ctx.status = 200;
};

module.exports = { parseProjectResponse, get, post, getParticipators, getTasks };
