const { Project, User, ProjectParticipator } = require('../models');

exports.addParticipatorToProject = async (projectId, participatorId, userId) => {
    const project = await Project.findByPk(projectId);
    if (project.managerId !== userId) {
        throw Error('Participators can be added only when you are the Project manager');
    }
    const user = await User.findByPk(participatorId);
    const addedObject = await project.addUser(user);
    if (!addedObject) {
        throw Error('Wrong params or already exists');
    }
    return addedObject;
};

exports.removeParticipatorFromProject = async (projectId, participatorId) => {
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
