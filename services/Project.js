const { Project, ProjectParticipator, User } = require('../models');

const isParticipator = async (projectInstance, userId) => {
    const projectParticipator = await ProjectParticipator.findOne({
        where: { participatorId: userId, projectId: projectInstance.id }
    });
    return !!projectParticipator;
};

const getAll = async () => {
    return await Project.findAll({ raw: true });
};

const getParticipators = async (id, userId) => {
    const project = await Project.findByPk(id);
    if (!project) {
        throw Error(`Project with id ${id} does not exist`);
    }
    if (!(await isParticipator(project, userId))) {
        throw Error('You are not participating in this project');
    }
    return await project.getParticipator({ raw: true });
};

const getParticipatorsIds = async (id, userId) => {
    const participators = await getParticipators(id, userId);
    return participators.map(e => e.id);
};

const getById = async (id, userId) => {
    const project = await Project.findByPk(id, { raw: true });
    if (!project) {
        throw Error(`Project with id ${id} does not exist`);
    }
    if (!(await isParticipator(project, userId))) {
        throw Error('You are not participating in this project');
    }
    return await Project.findByPk(id, { raw: true });
};

const addParticipator = async (projectId, participatorId, userId) => {
    const project = await Project.findByPk(projectId);
    if (!project) {
        throw Error(`Project with id ${id} does not exist`);
    }
    if (project.managerId !== userId) {
        throw Error('Participators can be added only when you are the Project manager');
    }
    const user = await User.findByPk(participatorId);
    if (!project) {
        throw Error(`User with id ${id} does not exist`);
    }
    const addedObject = await project.addParticipator(user);
    if (!addedObject) {
        throw Error('Wrong params or already exists');
    }
    return addedObject;
};

const create = async (project, userId) => {
    const { title, details, managerId = userId } = project;
    if (managerId != userId) {
        throw Error('Manager can only be set as yourself');
    }
    const projectInstance = await Project.create({ title, details, managerId });
    await addParticipator(projectInstance.id, userId, userId);
    return projectInstance;
};

const update = async (project, userId) => {
    const { id, title, details } = project;
    const projectInstance = await Project.findByPk(id);
    if (!projectInstance) {
        throw Error(`Project with id ${id} does not exist`);
    }
    if (!(await isParticipator(projectInstance, userId))) {
        throw Error('You are not participating in this project');
    }
    if (projectInstance.managerId !== userId) {
        throw Error('Projects can be edited only by project managers');
    }
    await projectInstance.update({ title, details });
};

const removeParticipator = async (projectId, participatorId) => {
    const projectInstance = await Project.findByPk(id);
    if (!projectInstance) {
        throw Error(`Project with id ${id} does not exist`);
    }
    if (!(await isParticipator(projectInstance, participatorId))) {
        throw Error('You are not participating in this project');
    }
    if (projectInstance.managerId !== participatorId) {
        throw Error('Projects can be edited only by project managers');
    }
    const projectParticipator = ProjectParticipator.findOne({
        where: { projectId, participatorId },
        raw: true
    });
    if (!projectParticipator) {
        throw Error('Participation does not exist');
    }
    const user = await User.findByPk(participatorId);
    return await projectInstance.removeParticipator(user);
};

const destroy = async (id, userId) => {
    const project = await Project.findByPk(id);
    if (!project) {
        throw Error(`Project with id ${id} does not exist`);
    }
    if (!(await isParticipator(project, userId))) {
        throw Error('You are not participating in this project');
    }
    if (project.managerId !== userId) {
        throw Error('Projects can be deleted only by project managers');
    }
    await project.destroy();
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    destroy,
    getParticipators,
    addParticipator,
    removeParticipator,
    isParticipator,
    getParticipatorsIds
};
