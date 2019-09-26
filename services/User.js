const bcrypt = require('bcrypt');
const { User } = require('../models');

const hashPassword = async password => {
    const saltRounds = 8;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
};

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
    const hashedPassword = await hashPassword(password);
    return await User.create({ username, password: hashedPassword, isSystemAdmin });
};

exports.update = async user => {
    const { id, username, password, isSystemAdmin } = user;
    const projectInstance = await User.findByPk(id);
    const hashedPassword = password ? await hashPassword(password) : undefined;
    await projectInstance.update({ username, password: hashedPassword, isSystemAdmin });
};

exports.destroy = async id => {
    const project = await User.findByPk(id);
    await project.destroy();
};
