const bcrypt = require('bcrypt');
const { User } = require('../models');
const { BusinessRuleError } = require('../errors/BusinessRuleError');

const hashPassword = async password => {
    const saltRounds = 8;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
};

const getUsersIds = async () => {
    const users = await User.findAll({
        raw: true
    });
    return users.map(e => e.id);
};

exports.getById = async id => {
    const userInstance = await User.findByPk(id);
    const user = await User.findByPk(id, {
        raw: true
    });
    if (!user) {
        throw new BusinessRuleError(`User with id ${id} does not exist`);
    }
    const managedProjects = await userInstance.getManagedProject({ raw: true }).map(e => e.id);
    const participatedProjects = await userInstance.getProject({ raw: true }).map(e => e.id);
    return { ...user, participatedProjects, managedProjects };
};

exports.create = async user => {
    const { username, password } = user;
    if (username && (await User.findOne({ where: { username }, raw: true }))) {
        throw new BusinessRuleError('username already taken');
    }
    const hashedPassword = await hashPassword(password);
    return await User.create({ username, password: hashedPassword });
};

exports.update = async user => {
    const { id, username, password } = user;
    const userInstance = await User.findByPk(id);
    if (!userInstance) {
        throw new BusinessRuleError(`User with id ${id} does not exist`);
    }
    if (username && (await User.findOne({ where: { username }, raw: true }))) {
        throw new BusinessRuleError('username already taken');
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    await userInstance.update({ username, password: hashedPassword });
};

exports.destroy = async id => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new BusinessRuleError(`User with id ${id} does not exist`);
    }
    await user.destroy();
};

module.exports.getUsersIds = getUsersIds;
