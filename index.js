require('dotenv').config();
const Koa = require('koa');

const app = new Koa();
const PORT = process.env.PORT || 3000;

// sessions
const session = require('koa-session');
app.keys = ['voidpumpkin-session-secret'];
app.use(session(app));

// authentication
require('./auth');
const passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

// routes
const index = require('./routes');
const auth = require('./routes/auth');
const project = require('./routes/Project');
const task = require('./routes/Task');
app.use(index.middleware())
    .use(auth.middleware())
    .use(project.middleware())
    .use(task.middleware());

const server = app.listen(PORT, () => console.log(`Started on ... http://localhost:${PORT}`));

module.exports = server;
