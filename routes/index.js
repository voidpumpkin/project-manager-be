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

module.exports = router => router.route(routes);
