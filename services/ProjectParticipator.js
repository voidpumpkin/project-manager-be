const { Project, User, ProjectParticipator } = require('../models');

exports.addParticipatorToProject = async (projectId, participatorId, userId) => {
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

exports.removeParticipatorFromProject = async (projectId, participatorId) => {
    const projectParticipator = ProjectParticipator.findOne({
        where: { projectId, participatorId }
    });
    if (!projectParticipator) {
        throw Error('Participation does not exist');
    }
    const project = await Project.findByPk(projectId);
    const user = await User.findByPk(participatorId);
    return await project.removeUser(user);
};

exports.isProjectParticipator = async (projectInstance, userId) => {
    const projectParticipator = await ProjectParticipator.findOne({
        where: { participatorId: userId, projectId: projectInstance.id }
    });
    return !!projectParticipator;
};
