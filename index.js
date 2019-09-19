const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

//Routes
const routes = require('./routes');
const Task = require('./routes/Task');
const Tasks = require('./routes/Tasks');

const app = new Koa();
const router = new Router();

app.use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

router.use('/', routes);
router.use('/task', Task);
router.use('/tasks', Tasks);
// router.post('/task', addTask);

app.listen(3000, () => console.log('Started...'));
