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
    console.log('payload received', localOptions, email, password);
    // usually this would be a database call:
    User.findById({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }
            return done(null, user);
        });
    });
});

// Setting up JWT login strategy
var jwtLogin = new JwtStrategy(jwtOptions, function(jwtPayload, done) {
    console.log('payload received', jwtPayload);
    // usually this would be a database call:
    User.findById(jwtPayload._id, function(err, user) {
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