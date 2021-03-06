const passport = require('passport'),
    User = require('../app/models/userModel'),
    config = require('./config'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    LocalStrategy = require('passport-local');

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = config.secret;

// Setting username field to email rather than username
const localOptions = {
    usernameField: 'email'
};

// Setting up local login strategy
var localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    console.log('payload received localLogin', localOptions, email, password);
    // usually this would be a database call:
    User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.comparePassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    });
});



// Setting up JWT login strategy
var jwtLogin = new JwtStrategy(jwtOptions, function(jwtPayload, done) {
    console.log('payload received jwtLogin', jwtPayload);
    // usually this would be a database call:
    User.findById(jwtPayload.id, function(err, user) {
        if (err) { return done(err, false); }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);