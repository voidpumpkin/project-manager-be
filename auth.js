const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { getById } = require('./services/User');
const { User } = require('./models');

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
            const user = await User.findOne({ where: { username } });
            if (user) {
                const isPasswordMatching = await bcrypt.compare(password, user.password);
                if (isPasswordMatching) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } else {
                done(null, false);
            }
        } catch (err) {
            done(err);
        }
    })
);
