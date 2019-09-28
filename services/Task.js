const { Task } = require('../models');
const { get } = require('../utils');
const { getById: getProjectById } = require('../services/Project');
const { isProjectParticipator } = require('./ProjectParticipator');

exports.getAll = async () => {
    return await Task.findAll();
};

exports.getById = async (id, userId) => {
    const task = await Task.findByPk(id);
    if (!task) {
        throw Error(`Task with id ${id} does not exist`);
    }
    const project = await getProjectById(task.projectId);
    if (!(await isProjectParticipator(project, userId))) {
        throw Error('You are not part of that project!');
    }
    return task;
};

exports.create = async (task, userId) => {
    const { title, details, isDone = false, projectId, taskId: parentTaskId } = task;
    const project = await getProjectById(projectId);
    const parentTask = await Task.findByPk(parentTaskId);
    if (project === null) {
        throw Error(`parent project with id ${projectId} does not exist`);
    } else {
        if (!(await isProjectParticipator(project, userId))) {
            throw Error('You are not part of that project!');
        } else if (
            parentTaskId &&
            (parentTask === null || projectId !== get(parentTask, 'projectId'))
        ) {
            throw Error(`parent task with id ${parentTaskId} does not exist`);
        }
    }
    return await Task.create({ title, details, isDone, projectId, taskId: parentTaskId });
};

exports.update = async (task, userId) => {
    const { id, title, details, isDone } = task;
    const taskInstance = await Task.findByPk(id);
    if (!taskInstance) {
        throw Error(`Task with id ${id} does not exist`);
    }
    const project = await getProjectById(taskInstance.projectId);
    if (!(await isProjectParticipator(project, userId))) {
        throw Error('You are not part of that project!');
    }
    await taskInstance.update({ title, details, isDone });
};

exports.destroy = async (id, userId) => {
    const task = await Task.findByPk(id);
    if (!task) {
        throw Error(`Task with id ${id} does not exist`);
    }
    const project = await getProjectById(task.projectId);
    if (!(await isProjectParticipator(project, userId))) {
        throw Error('You are not part of that project!');
    }
    await task.destroy();
};
