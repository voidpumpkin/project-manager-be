const userService = require('../services/User');

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
    const {
        managedProjectsIds,
        participatedProjectsIds,
        id: undefined,
        ...user
    } = await userService.getById(id);
    const links = { self: `/users/${id}` };
    const data = {
        type: 'user',
        id,
        attributes: { ...user }
    };
    const managedProjects = managedProjectsIds.map(id => {
        return { links: { self: `/project/${id}` }, type: 'project', id };
    });
    const participatedProjects = participatedProjectsIds.map(id => {
        return { links: { self: `/project/${id}` }, type: 'project', id };
    });
    const relationships = { managedProjects, participatedProjects };
    ctx.body = { links, data, relationships };
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
module.exports = { getAll, getMe, get };
