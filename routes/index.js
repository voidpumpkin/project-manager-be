const Router = require('koa-joi-router');
const router = Router();
const routes = [
    {
        method: 'get',
        path: '/',
        handler: async ctx => {
            ctx.status = 200;
            ctx.body = 'You are using the Project Manager Back-end!';
        }
    }
];

module.exports = router.route(routes);
