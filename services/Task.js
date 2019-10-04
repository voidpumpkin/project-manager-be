const { Task, Project } = require('../models');
const { get } = require('../utils');
const { isParticipator } = require('./Project');

exports.getAll = async () => {
    return await Task.findAll({ raw: true });
};

exports.getById = async (id, userId) => {
    const task = await Task.findByPk(id, { raw: true });
    if (!task) {
        throw Error(`Task with id ${id} does not exist`);
    }
    const project = await Project.findByPk(task.projectId, { raw: true });
    if (!(await isParticipator(project, userId))) {
        throw Error('You are not part of that project!');
    }
    return task;
};

exports.create = async (task, userId) => {
    const { title, details, isDone = false, projectId, taskId: parentTaskId, assigneeId } = task;
    const project = await Project.findByPk(projectId, { raw: true });
    const parentTask = await Task.findByPk(parentTaskId, { raw: true });
    if (project === null) {
        throw Error(`parent project with id ${projectId} does not exist`);
    }
    if (!(await isParticipator(project, userId))) {
        throw Error('You are not part of that project!');
    }
    if (parentTaskId && (parentTask === null || projectId !== get(parentTask, 'projectId'))) {
        throw Error(`parent task with id ${parentTaskId} does not exist`);
    }
    if (assigneeId && !(await isParticipator(project, assigneeId))) {
        throw Error('Asignee must be a project participator');
    }
    return await Task.create({
        title,
        details,
        isDone,
        projectId,
        taskId: parentTaskId,
        assigneeId
    });
};

exports.update = async (task, userId) => {
    const { id, title, details, isDone, assigneeId } = task;
    const taskInstance = await Task.findByPk(id);
    if (!taskInstance) {
        throw Error(`Task with id ${id} does not exist`);
    }
    const project = await Project.findByPk(taskInstance.projectId, { raw: true });
    if (!(await isParticipator(project, userId))) {
        throw Error('You are not part of that project!');
    }
    if (assigneeId && !(await isParticipator(project, assigneeId))) {
        throw Error('Asignee must be a project participator');
    }
    await taskInstance.update({ title, details, isDone, assigneeId });
};

exports.destroy = async (id, userId) => {
    const task = await Task.findByPk(id);
    if (!task) {
        throw Error(`Task with id ${id} does not exist`);
    }
    const project = await Project.findByPk(task.projectId, { raw: true });
    if (!(await isParticipator(project, userId))) {
        throw Error('You are not part of that project!');
    }
    await task.destroy();
};
