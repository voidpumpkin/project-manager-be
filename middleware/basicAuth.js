const { FgCyan } = require('../utils/ConsoleColors');
const { Basic } = require('permit');
const permit = new Basic();
const users = [{ username: 'bob', password: 'bob' }];

module.exports = async (ctx, next) => {
    const { req, res } = ctx;
    const [username, password] = permit.check(req);
    try {
        if (!username || !password) {
            permit.fail(res);
            throw new Error('Authentication required');
        }
        const user = users.find(e => e.username === username && e.password === password);
        if (!user) {
            permit.fail(res);
            throw new Error(`Authentication invalid for "${username}"`);
        } else {
            ctx.user = user;
        }
        await next();
    } catch (err) {
        console.warn(FgCyan, err.message);
    }
};
