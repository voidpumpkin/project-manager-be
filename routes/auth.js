const passport = require('koa-passport');
const Router = require('koa-joi-router');
const { Joi } = Router;

const router = Router();

const routes = [
    {
        method: 'post',
        path: '/login',
        validate: {
            type: 'json',
            body: {
                username: Joi.string()
                    .max(255)
                    .required(),
                password: Joi.string()
                    .max(255)
                    .required()
            }
        },
        handler: [
            passport.authenticate('local'),
            async ctx => {
                ctx.status = 204;
            }
        ]
    },
    {
        method: 'post',
        path: '/logout',
        handler: [
            async ctx => {
                ctx.logout();
                ctx.status = 204;
            }
        ]
    }
];

module.exports = router.route(routes);
