require('dotenv').config();
const Koa = require('koa');

//Routers
const index = require('./routes');
const project = require('./routes/Project');
const task = require('./routes/Task');

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(index.middleware())
    .use(project.middleware())
    .use(task.middleware());

const server = app.listen(PORT, () => console.log(`Started on ... http://localhost:${PORT}`));

module.exports = server;
