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
    const user = await User.findByPk(id);
    if (!user) {
        throw Error(`User with id ${id} does not exist`);
    }
    return user;
};

exports.create = async user => {
    const { username, password, isSystemAdmin = false } = user;
    if (username && (await User.findOne({ where: { username } }))) {
        throw Error('username already taken');
    }
    const hashedPassword = await hashPassword(password);
    return await User.create({ username, password: hashedPassword, isSystemAdmin });
};

exports.update = async user => {
    const { id, username, password, isSystemAdmin } = user;
    const userInstance = await User.findByPk(id);
    if (!userInstance) {
        throw Error(`User with id ${id} does not exist`);
    }
    if (username && (await User.findOne({ where: { username } }))) {
        throw Error('username already taken');
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    await userInstance.update({ username, password: hashedPassword, isSystemAdmin });
};

exports.destroy = async id => {
    const user = await User.findByPk(id);
    if (!user) {
        throw Error(`User with id ${id} does not exist`);
    }
    await user.destroy();
};
