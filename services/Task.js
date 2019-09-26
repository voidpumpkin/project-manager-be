const { Task } = require('../models');

exports.getAll = async () => {
    return await Task.findAll();
};

exports.getById = async id => {
    return await Task.findByPk(id);
};

exports.create = async task => {
    return await Task.create(task);
};

exports.update = async task => {
    const { id, title, details, projectId, taskId } = task;
    const taskInstance = await Task.findByPk(id);
    await taskInstance.update({ title, details, projectId, taskId });
};

exports.destroy = async id => {
    const task = await Task.findByPk(id);
    await task.destroy();
};
