const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

//Routes
const routes = require('./routes');
const Project = require('./routes/Project');
const Task = require('./routes/Task');

const app = new Koa();
const router = new Router();

app.use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

router.use('/', routes);
router.use('/projects', Project);
router.use('/tasks', Task);

app.listen(3000, () => console.log('Started...'));
