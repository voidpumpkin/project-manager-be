const { Task, Project } = require('../models');
const { get } = require('../utils');
const { isParticipator } = require('./Project');
const { BusinessRuleError } = require('../utils/BusinessRuleError');

const getSubTasks2 = async taskId => {
    const taskInstance = await Task.findByPk(taskId);
    const subTasks = (await taskInstance.getSubtask({ raw: true })) || [];
    for (const subTask of subTasks) {
        subTask.subTasks = await getSubTasks2(subTask.id);
    }
    return subTasks;
};

const countSubTasks = task => {
    const { subTasks } = task;
    if (subTasks.length) {
        return subTasks.reduce((prev, curr) => {
            return prev + 1 + countSubTasks(curr);
        }, 0);
    } else {
        return 0;
    }
};

const getById = async (id, userId) => {
    const task = await Task.findByPk(id, { raw: true });
    if (!task) {
        throw new BusinessRuleError(`Task with id ${id} does not exist`);
    }
    const project = await Project.findByPk(task.projectId, { raw: true });
    if (!(await isParticipator(project, userId))) {
        throw new BusinessRuleError('You are not part of that project!');
    }
    const subTasks = await getSubTasks2(task.id);
    const subTaskCount = subTasks.reduce((prev, curr) => {
        return prev + 1 + countSubTasks(curr);
    }, 0);
    return { ...task, subTasks, subTaskCount };
};

const create = async (task, userId) => {
    const { title, details, isDone = false, projectId, taskId: parentTaskId, assigneeId } = task;
    const project = await Project.findByPk(projectId, { raw: true });
    const parentTask = await Task.findByPk(parentTaskId, { raw: true });
    if (project === null) {
        throw new BusinessRuleError(`parent project with id ${projectId} does not exist`);
    }
    if (!(await isParticipator(project, userId))) {
        throw new BusinessRuleError('You are not part of that project!');
    }
    if (parentTaskId && (parentTask === null || projectId !== get(parentTask, 'projectId'))) {
        throw new BusinessRuleError(`parent task with id ${parentTaskId} does not exist`);
    }
    if (assigneeId && !(await isParticipator(project, assigneeId))) {
        throw new BusinessRuleError('Asignee must be a project participator');
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

const update = async (task, userId) => {
    const { id, title, details, isDone, assigneeId } = task;
    const taskInstance = await Task.findByPk(id);
    if (!taskInstance) {
        throw new BusinessRuleError(`Task with id ${id} does not exist`);
    }
    const project = await Project.findByPk(taskInstance.projectId, { raw: true });
    if (!(await isParticipator(project, userId))) {
        throw new BusinessRuleError('You are not part of that project!');
    }
    if (assigneeId && !(await isParticipator(project, assigneeId))) {
        throw new BusinessRuleError('Asignee must be a project participator');
    }
    await taskInstance.update({ title, details, isDone, assigneeId });
};

const destroy = async (id, userId) => {
    const task = await Task.findByPk(id);
    if (!task) {
        throw new BusinessRuleError(`Task with id ${id} does not exist`);
    }
    const project = await Project.findByPk(task.projectId, { raw: true });
    if (!(await isParticipator(project, userId))) {
        throw new BusinessRuleError('You are not part of that project!');
    }
    await task.destroy();
};

const getSubTasks = async (id, userId) => {
    const taskInstance = await Task.findByPk(id);
    if (!taskInstance) {
        throw new BusinessRuleError(`Task with id ${id} does not exist`);
    }
    const projectRawInstance = await Project.findByPk(taskInstance.projectId, { raw: true });
    if (!(await isParticipator(projectRawInstance, userId))) {
        throw new BusinessRuleError('You are not part of that project!');
    }
    return await taskInstance.getSubtask();
};

const getSubTaskIds = async (id, userId) => {
    const subTasks = await getSubTasks(id, userId);
    return subTasks.map(e => e.id);
};

module.exports = { getById, create, update, destroy, getSubTasks, getSubTaskIds };
