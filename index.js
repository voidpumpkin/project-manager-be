require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-joi-router');

//Routers
const indexRouter = require('./routes');
const projectRouter = require('./routes/Project');
const taskRouter = require('./routes/Task');

const app = new Koa();
const public = Router();
const PORT = process.env.PORT || 3000;

app.use(indexRouter(public).middleware())
    .use(projectRouter(public).middleware())
    .use(taskRouter(public).middleware());

const server = app.listen(PORT, () => console.log('Started...'));

module.exports = server;
