const path = require('path');
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

///sequelize stuff
const Sequelize = require('sequelize');

const sequelize = new Sequelize('sqlite:./project_manager_db.db');

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Task = sequelize.import(path.resolve('./models/Task.js'));
sequelize.sync();

Task.create({ name: 'Add name' }).then(task => {
    console.log('task id:', task.id);
});
