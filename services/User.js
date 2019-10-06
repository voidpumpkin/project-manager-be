const bcrypt = require('bcrypt');
const { User: userModel } = require('../models');
const { BusinessRuleError } = require('../errors/BusinessRuleError');

const hashPassword = async password => {
    const saltRounds = 8;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
};

const getAllIds = async () => {
    const users = await userModel.findAll({
        raw: true
    });
    return users.map(e => e.id);
};

const getById = async id => {
    const userInstance = await userModel.findByPk(id);
    if (!userInstance) {
        throw new BusinessRuleError(`User with id ${id} does not exist`);
    }
    const managedProjectsIds = await userInstance.getManagedProject({ raw: true }).map(e => e.id);
    const participatedProjectsIds = await userInstance.getProject({ raw: true }).map(e => e.id);
    const rawUserInstance = await userModel.findByPk(id, { raw: true });
    return { managedProjectsIds, participatedProjectsIds, ...rawUserInstance };
};

const create = async user => {
    const { username, password } = user;
    if (username && (await userModel.findOne({ where: { username }, raw: true }))) {
        throw new BusinessRuleError('username already taken');
    }
    const hashedPassword = await hashPassword(password);
    return await userModel.create({ username, password: hashedPassword });
};

exports.update = async user => {
    const { id, username, password } = user;
    const userInstance = await userModel.findByPk(id);
    if (!userInstance) {
        throw new BusinessRuleError(`User with id ${id} does not exist`);
    }
    if (username && (await userModel.findOne({ where: { username }, raw: true }))) {
        throw new BusinessRuleError('username already taken');
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    await userInstance.update({ username, password: hashedPassword });
};

exports.destroy = async id => {
    const user = await userModel.findByPk(id);
    if (!user) {
        throw new BusinessRuleError(`User with id ${id} does not exist`);
    }
    await user.destroy();
};

module.exports.getAllIds = getAllIds;
module.exports.getById = getById;
module.exports.create = create;
