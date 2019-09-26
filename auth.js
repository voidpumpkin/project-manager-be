const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const { getById, getByAtr } = require('./services/User');

//save id in cookie TODO: store session in memory
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//get id from cookie
passport.deserializeUser(async (id, done) => {
    try {
        const user = await getById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await getByAtr('username', username);
            if (username === user.username && password === user.password) {
                done(null, user);
            } else {
                done(null, false);
            }
        } catch (err) {
            done(err);
        }
    })
);
