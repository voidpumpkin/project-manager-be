const { getById: getProjectById } = require('./Project');
const { getById: getUserById } = require('./User');

exports.addParticipatorToProject = async (projectId, participatorId, userId) => {
    const project = await getProjectById(projectId);
    if (project.managerId !== userId) {
        throw Error('Participators can be added only when you are the Project manager');
    }
    const user = await getUserById(participatorId);
    const addedObject = await project.addUser(user);
    if (!addedObject) {
        throw Error('Wrong params or already exists');
    }
    return addedObject;
};

exports.removeParticipatorFromProject = async (projectId, participatorId) => {
    const project = await getProjectById(projectId);
    const user = await getUserById(participatorId);
    return await project.removeUser(user);
};
