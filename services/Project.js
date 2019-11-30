const { Project, ProjectParticipator, User } = require('../models');
const { BusinessRuleError } = require('../utils/BusinessRuleError');

const isParticipator = async (projectInstance, userId) => {
    const projectParticipator = await ProjectParticipator.findOne({
        where: { participatorId: userId, projectId: projectInstance.id }
    });
    return !!projectParticipator;
};

const getParticipators = async (id, userId) => {
    const projectInstance = await Project.findByPk(id);
    if (!projectInstance) {
        throw new BusinessRuleError(`Project with id ${id} does not exist`);
    }
    if (!(await isParticipator(projectInstance, userId))) {
        throw new BusinessRuleError('You are not participating in this project');
    }
    return await projectInstance.getParticipator({ raw: true });
};

const getParticipatorsIds = async (id, userId) => {
    const participators = await getParticipators(id, userId);
    return participators.map(e => e.id);
};

const getTasks = async id => {
    const projectInstance = await Project.findByPk(id);
    return await projectInstance.getTask({ raw: true });
};

const getTaskIds = async id => {
    const tasks = await getTasks(id);
    return tasks.map(e => e.id);
};

const getSubTasks = (taskId, tasks) => {
    const subTasks = tasks.filter(e => e.taskId === taskId);
    const leftTasks = tasks.filter(e => e.taskId !== taskId);
    subTasks.forEach(task => {
        task.subTasks = getSubTasks(task.id, leftTasks);
    });
    return subTasks;
};

const getById = async (id, userId) => {
    const rawProjectInstance = await Project.findByPk(id, { raw: true });
    if (!rawProjectInstance) {
        throw new BusinessRuleError(`Project with id ${id} does not exist`);
    }
    if (!(await isParticipator(rawProjectInstance, userId))) {
        throw new BusinessRuleError('You are not participating in this project');
    }
    const participators = (await getParticipators(id, userId)).map(e => ({
        id: e.id,
        username: e.username
    }));
    const tasks = await getTasks(id);
    const topTasks = tasks.filter(e => e.taskId === null);
    const allSubTasks = tasks.filter(e => e.taskId !== null);
    topTasks.forEach(task => {
        task.subTasks = getSubTasks(task.id, allSubTasks);
    });
    return { tasks: topTasks, ...rawProjectInstance, participators };
};

const addParticipator = async (projectId, participatorId, userId) => {
    const project = await Project.findByPk(projectId);
    if (!project) {
        throw new BusinessRuleError(`Project with id ${projectId} does not exist`);
    }
    if (project.managerId !== userId) {
        throw new BusinessRuleError(
            'Participators can be added only when you are the Project manager'
        );
    }
    const user = await User.findByPk(participatorId);
    if (!project) {
        throw new BusinessRuleError(`User with id ${projectId} does not exist`);
    }
    const addedObject = await project.addParticipator(user);
    if (!addedObject) {
        throw new BusinessRuleError('Wrong params or already exists');
    }
    return addedObject;
};

const create = async (project, userId) => {
    const { title, details, managerId = userId } = project;
    if (managerId != userId) {
        throw new BusinessRuleError('Manager can only be set as yourself');
    }
    const projectInstance = await Project.create({ title, details, managerId });
    await addParticipator(projectInstance.id, userId, userId);
    return projectInstance;
};

const update = async (project, userId) => {
    const { id, title, details, managerId } = project;
    const projectInstance = await Project.findByPk(id);
    if (!projectInstance) {
        throw new BusinessRuleError(`Project with id ${id} does not exist`);
    }
    if (!(await isParticipator(projectInstance, userId))) {
        throw new BusinessRuleError('You are not participating in this project');
    }
    if (projectInstance.managerId !== userId) {
        throw new BusinessRuleError('Projects can be edited only by project managers');
    }
    if (managerId && !(await isParticipator(projectInstance, managerId))) {
        throw new BusinessRuleError('Only participating users can become managers');
    }
    await projectInstance.update({ title, details, managerId });
};

const removeParticipator = async (projectId, participatorId) => {
    const projectInstance = await Project.findByPk(projectId);
    if (!projectInstance) {
        throw new BusinessRuleError(`Project with id ${projectId} does not exist`);
    }
    if (!(await isParticipator(projectInstance, participatorId))) {
        throw new BusinessRuleError('You are not participating in this project');
    }
    if (projectInstance.managerId !== participatorId) {
        throw new BusinessRuleError('Projects can be edited only by project managers');
    }
    const projectParticipator = ProjectParticipator.findOne({
        where: { projectId, participatorId },
        raw: true
    });
    if (!projectParticipator) {
        throw new BusinessRuleError('Participation does not exist');
    }
    const user = await User.findByPk(participatorId);
    return await projectInstance.removeParticipator(user);
};

const destroy = async (id, userId) => {
    const project = await Project.findByPk(id);
    if (!project) {
        throw new BusinessRuleError(`Project with id ${id} does not exist`);
    }
    if (!(await isParticipator(project, userId))) {
        throw new BusinessRuleError('You are not participating in this project');
    }
    if (project.managerId !== userId) {
        throw new BusinessRuleError('Projects can be deleted only by project managers');
    }
    await project.destroy();
};

module.exports = {
    isParticipator,
    getParticipators,
    getParticipatorsIds,
    getTasks,
    getTaskIds,
    getById,
    addParticipator,
    create,
    update,
    removeParticipator,
    destroy
};
