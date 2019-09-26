const { User } = require('../models');

exports.getAll = async () => {
    return await User.findAll();
};

exports.getById = async id => {
    return await User.findByPk(id);
};

exports.getByAtr = async (atr, value) => {
    if (!value) {
        return null;
    }
    return await User.findOne({ where: { [atr]: value } });
};

exports.create = async user => {
    const { username, password, isSystemAdmin = false } = user;
    return await User.create({ username, password, isSystemAdmin });
};

exports.update = async user => {
    const { id, username, password, isSystemAdmin } = user;
    const projectInstance = await User.findByPk(id);
    await projectInstance.update({ username, password, isSystemAdmin });
};

exports.destroy = async id => {
    const project = await User.findByPk(id);
    await project.destroy();
};
