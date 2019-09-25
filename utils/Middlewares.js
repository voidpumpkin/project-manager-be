exports.AllowOnlyAuthenticated = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        await next();
    } else {
        ctx.status = 401;
        ctx.body = 'Unauthorized';
    }
};
