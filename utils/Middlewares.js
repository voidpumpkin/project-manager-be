exports.AllowOnlyAuthenticated = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        await next();
    } else {
        ctx.status = 401;
        ctx.body = 'Unauthorized';
    }
};
exports.AllowOnlyWhenIdExistsFnMaker = className => {
    const { getById } = require(`../services/${className}`);
    return async (ctx, next) => {
        const { id } = ctx.params;
        if ((await getById(id)) === null) {
            ctx.body = `${className} with id ${id} does not exist`;
            ctx.status = 422;
        } else {
            await next();
        }
    };
};
