const taskService = require('../services/task');
const { get: getUtil } = require('../utils');

const parseTaskResponse = task => {
    const { projectId, assigneeId, taskId, id, ...attributes } = task;
    const project = { links: { self: `/projects/${projectId}` }, type: 'projects', id: projectId };
    const asignee = !assigneeId
        ? null
        : { links: { self: `/users/${assigneeId}` }, type: 'users', id: assigneeId };
    const parentTask = !taskId
        ? null
        : {
              links: { self: `/tasks/${taskId}` },
              type: 'tasks',
              id: taskId
          };
    const subTasks = { links: { self: `/tasks/${id}/relationships/subtasks` } };
    const links = { self: `/tasks/${id}` };
    const data = { type: 'tasks', id, attributes };
    const relationships = { asignee, project, task: parentTask, subTasks };
    return { links, data, relationships };
};

const get = async ctx => {
    const { id: userId } = ctx.state.user;
    const { id } = ctx.params;
    ctx.body = parseTaskResponse(await taskService.getById(id, userId));
    ctx.status = 200;
};

const post = async ctx => {
    const { id: userId } = ctx.state.user;
    const { title, details } = ctx.request.body.data.attributes;
    const projectId = getUtil(ctx, 'request.body.relationships.project.id');
    const taskId = getUtil(ctx, 'request.body.relationships.task.id');
    const assigneeId = getUtil(ctx, 'request.body.relationships.assignee.id');
    const { id } = await taskService.create(
        { title, details, projectId, taskId, assigneeId },
        userId
    );
    ctx.body = parseTaskResponse(await taskService.getById(id, userId));
    ctx.status = 201;
};
module.exports = { get, post };
