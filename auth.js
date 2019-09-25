const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;

const fetchUser = (id => {
    // FIXME: Connect to db
    const user = { id: 1, username: 'test', password: 'test' };
    return async function() {
        return user;
    };
})();

//save id in cookie TODO: store session in memory
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//get id from cookie
passport.deserializeUser(async (id, done) => {
    try {
        const user = await fetchUser(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(
    new LocalStrategy((username, password, done) => {
        fetchUser()
            .then(user => {
                if (username === user.username && password === user.password) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            })
            .catch(err => done(err));
    })
);
