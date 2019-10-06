const userService = require('../services/User');

const parseUserResponse = user => {
    const { managedProjectsIds, participatedProjectsIds, id, ...attributes } = user;
    const managedProjects = managedProjectsIds.map(id => {
        return { links: { self: `/project/${id}` }, type: 'project', id };
    });
    const participatedProjects = participatedProjectsIds.map(id => {
        return { links: { self: `/project/${id}` }, type: 'project', id };
    });
    const links = { self: `/users/${id}` };
    const data = { type: 'user', id, attributes };
    const relationships = { managedProjects, participatedProjects };
    return { links, data, relationships };
};

const getAll = async ctx => {
    const userIds = await userService.getAllIds();
    const data = userIds.map(id => {
        return { links: { self: `/users/${id}` }, type: 'users', id };
    });
    ctx.body = { links: { self: '/users' }, data };
    ctx.status = 200;
};

const getMe = async ctx => {
    const { id } = ctx.state.user;
    ctx.body = parseUserResponse(await userService.getById(id));
    ctx.status = 200;
};

const get = async ctx => {
    const { id } = ctx.params;
    const { username } = await userService.getById(id);
    const links = { self: `/users/${id}` };
    const data = {
        type: 'user',
        id,
        attributes: { username }
    };
    ctx.body = { links, data };
    ctx.status = 200;
};

const post = async ctx => {
    const { username, password } = ctx.request.body.data.attributes;
    const { id } = await userService.create({ username, password });
    const { links, data } = parseUserResponse(await userService.getById(id));
    ctx.body = { links, data };
    ctx.status = 201;
};
module.exports = { parseUserResponse, getAll, getMe, get, post };
