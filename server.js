require('dotenv').config();
const Koa = require('koa');

const app = new Koa();
const PORT = process.env.PORT || 3000;

// logger
const logger = require('koa-logger');
const transporter = process.env.LOG_REQ === 'true' ? str => console.log(str) : () => {};
app.use(logger(transporter));

// sessions
const session = require('koa-session');
app.keys = ['voidpumpkin-session-secret'];
app.use(session(app));

// authentication
require('./utils/Authentication');
const passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

// routes
const index = require('./routes');
const auth = require('./routes/auth');
const user = require('./routes/User');
const project = require('./routes/Project');
const task = require('./routes/Task');
app.use(index.middleware())
    .use(auth.middleware())
    .use(user.middleware())
    .use(project.middleware())
    .use(task.middleware());

const server = app.listen(PORT, () => console.log(`Started on ... http://localhost:${PORT}`));

module.exports = server;
