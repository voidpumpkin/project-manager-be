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
                console.log('\x1b[33m%s\x1b[0m', 'it reached');

                ctx.status = 204;
                // ctx.body = 'You are using the Project Manager Back-end!';
            }
        ]
    },
    {
        method: 'post',
        path: '/logout',
        handler: [
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/fail'
            }),
            async ctx => {
                ctx.logout();
                ctx.redirect('/fail');
            }
        ]
    }
];

module.exports = router.route(routes);
