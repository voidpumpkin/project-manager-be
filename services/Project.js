const { Project } = require('../models');

exports.getAll = async () => {
    return await Project.findAll();
};

exports.getById = async id => {
    return await Project.findByPk(id);
};

exports.create = async (project, userId) => {
    const { addParticipatorToProject } = require('./ProjectParticipator');
    const { title, details, managerId = userId } = project;
    if (managerId != userId) {
        throw Error('Manager can only be set as yourself');
    }
    const projectInstance = await Project.create({ title, details, managerId });
    await addParticipatorToProject(projectInstance.id, userId, userId);
    return projectInstance;
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
