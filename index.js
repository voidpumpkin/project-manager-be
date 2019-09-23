require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

//Routes
const routes = require('./routes');
const Project = require('./routes/Project');
const Task = require('./routes/Task');

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || 3000;

app.use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

router
    .use('/', routes)
    .use('/projects', Project)
    .use('/tasks', Task);

const server = app.listen(PORT, () => console.log('Started...'));

module.exports = server;
