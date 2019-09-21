const { Project } = require('../models');

exports.getAll = async () => {
    return await Project.findAll();
};

exports.get = async id => {
    return await Project.findByPk(id);
};

exports.create = async project => {
    return await Project.create(project);
};

exports.update = async project => {
    const { id, title, details } = project;
    const projectInstance = await Project.findByPk(id);
    await projectInstance.update({ title, details });
};

exports.destroy = async id => {
    const project = await Project.findByPk(id);
    await project.destroy();
};
