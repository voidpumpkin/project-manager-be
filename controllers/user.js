const { getUsersIds } = require('../services/User');
const getAll = async ctx => {
    const userIds = await getUsersIds();
    const data = userIds.map(id => {
        return { type: 'users', id };
    });
    ctx.body = { links: { self: '/users' }, data };
    ctx.status = 200;
};

module.exports = { getAll };
