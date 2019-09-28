const { Project } = require('../models');
const { isProjectParticipator } = require('./ProjectParticipator');

exports.getAll = async () => {
    return await Project.findAll();
};

exports.getById = async (id, userId) => {
    const project = await Project.findByPk(id);
    if (!project) {
        throw Error(`Project with id ${id} does not exist`);
    }
    if (!(await isProjectParticipator(project, userId))) {
        throw Error('You are not participating in this project');
    }
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

exports.update = async (project, userId) => {
    const { id, title, details } = project;
    const projectInstance = await Project.findByPk(id);
    if (!projectInstance) {
        throw Error(`Project with id ${id} does not exist`);
    }
    if (!(await isProjectParticipator(projectInstance, userId))) {
        throw Error('You are not participating in this project');
    }
    if (projectInstance.managerId !== userId) {
        throw Error('Projects can be edited only by project managers');
    }
    await projectInstance.update({ title, details });
};

exports.destroy = async (id, userId) => {
    const project = await Project.findByPk(id);
    if (!project) {
        throw Error(`Project with id ${id} does not exist`);
    }
    if (!(await isProjectParticipator(project, userId))) {
        throw Error('You are not participating in this project');
    }
    if (project.managerId !== userId) {
        throw Error('Projects can be deleted only by project managers');
    }
    await project.destroy();
};
