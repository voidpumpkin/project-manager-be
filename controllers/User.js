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
    const data = { type: 'users', id, attributes };
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
        type: 'users',
        id,
        attributes: { username }
    };
    ctx.body = { links, data };
    ctx.status = 200;
};

const post = async ctx => {
    const user = ctx.request.body.data.attributes;
    const { id } = await userService.create(user);
    const { links, data } = parseUserResponse(await userService.getById(id));
    ctx.body = { links, data };
    ctx.status = 201;
};

const patchMe = async ctx => {
    const { id } = ctx.state.user;
    const user = ctx.request.body.data.attributes;
    await userService.update({ id, ...user });
    ctx.status = 204;
};

const destoyMe = async ctx => {
    const { id } = ctx.state.user;
    ctx.logout();
    await userService.destroy(id);
    ctx.status = 204;
};

const getMyParticipatedProjects = async ctx => {
    const { id } = ctx.state.user;
    const projects = await userService.getParticipatedProjects(id);
    const data = projects.map(project => {
        const { id, title, details, createdAt, updatedAt, managerId } = project;
        return {
            links: { self: `/projects/${id}` },
            type: 'projects',
            id,
            attributes: { title, details, createdAt, updatedAt, managerId }
        };
    });
    const links = { self: `/users/me/participated-projects` };
    ctx.body = { links, data };
    ctx.status = 200;
};
const getMyManagedProjects = async ctx => {
    const { id } = ctx.state.user;
    const projects = await userService.getManagedProjects(id);
    const data = projects.map(project => {
        const { id, title, details, createdAt, updatedAt, managerId } = project;
        return {
            links: { self: `/projects/${id}` },
            type: 'projects',
            id,
            attributes: { title, details, createdAt, updatedAt, managerId }
        };
    });
    const links = { self: `/users/me/participated-projects` };
    ctx.body = { links, data };
    ctx.status = 200;
};

const getMyTasks = async ctx => {
    const { id } = ctx.state.user;
    const tasks = await userService.getTasks(id);
    const data = tasks.map(project => {
        const {
            id,
            title,
            details,
            isDone,
            createdAt,
            updatedAt,
            projectId,
            taskId,
            assigneeId
        } = project;
        return {
            links: { self: `/tasks/${id}` },
            type: 'tasks',
            id,
            attributes: {
                title,
                details,
                isDone,
                createdAt,
                updatedAt,
                projectId,
                taskId,
                assigneeId
            }
        };
    });
    const links = { self: `/users/me/tasks` };
    ctx.body = { links, data };
    ctx.status = 200;
};

module.exports = {
    parseUserResponse,
    getAll,
    getMe,
    get,
    post,
    patchMe,
    destoyMe,
    getMyParticipatedProjects,
    getMyManagedProjects,
    getMyTasks
};
