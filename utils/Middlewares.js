const { logCtxErr } = require('../utils');
const { BusinessRuleError } = require('../errors/BusinessRuleError');

const AllowOnlyAuthenticated = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        await next();
    } else {
        ctx.status = 401;
        ctx.body = 'Unauthorized';
    }
};

const OnError = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        logCtxErr(err);
        ctx.body = err.message;
        ctx.status = err instanceof BusinessRuleError ? 400 : 500;
    }
};

module.exports = {
    AllowOnlyAuthenticated,
    OnError
};
