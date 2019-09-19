const Koa = require('koa');
const KoaRouter = require('koa-router');

const app = new Koa();

//simple middleware
// app.use(async ctx => (ctx.body = { msg: 'Hello world' }));

//router stuff middleware
const router = new KoaRouter();
app.use(router.routes()).use(router.allowedMethods());
router.get('/eh', ctx => (ctx.body = { msg: 'Hello world' }));

app.listen(3000, () => console.log('Started...'));
