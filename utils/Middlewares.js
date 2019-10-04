const { logCtxErr } = require('../utils');
const { BusinessRuleError } = require('../errors/BusinessRuleError');

const AllowOnlyAuthenticated = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        await next();
    } else {
        const title = 'Unauthorized';
        ctx.status = 401;
        ctx.body = { errors: [{ title }] };
    }
};

const OnError = async (ctx, next) => {
    try {
        //handle joi router errors
        if (ctx.invalid) {
            const { header, query, params, body, type } = ctx.invalid;
            const err = header || query || params || body || type;
            logCtxErr(err);
            const title = err.message;
            ctx.body = { errors: [{ title }] };
            ctx.status = err.status;
            return;
        }
        await next();
    } catch (err) {
        logCtxErr(err);
        const title = err.message;
        ctx.body = { errors: [{ title }] };
        ctx.status = err instanceof BusinessRuleError ? 400 : 500;
    }
};

const RouteDisabled = async () => {
    throw Error('this route is disabled');
};

module.exports = {
    AllowOnlyAuthenticated,
    OnError,
    RouteDisabled
};
