'use strict';
var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = mongoose.model('User'),
    config = require('../../config/config');

// Generate JWT
// TO-DO Add issuer and audience


exports.register = function(req, res, next) {
    // Check for registration errors
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;

    // Return error if no email provided
    if (!email) {
        return res.status(422).send({
            error: 'You must enter an email address.'
        });
    }

    // Return error if full name not provided
    if (!firstName || !lastName) {
        return res.status(422).send({
            error: 'You must enter your full name.'
        });
    }

    // Return error if no password provided
    if (!password) {
        return res.status(422).send({
            error: 'You must enter a password.'
        });
    }

    User.findOne({
        email: email
    }, function(err, existingUser) {
        if (err) {
            return next(err);
        }

        // If user is not unique, return error
        if (existingUser) {
            return res.status(422).send({
                error: 'That email address is already in use.'
            });
        }

        // If email is unique and password was provided, create account
        const user = new User({
            email,
            password,
            profile: {
                firstName,
                lastName
            }
        });

        var newUser = new User(user);
        newUser.password = bcrypt.hashSync(req.body.password, 10);
        newUser.save(function(err, user) {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                user.password = undefined;
                return res.json(user);
            }
        });
    });
};

exports.login = function(req, res) {
    console.log("login", req);
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;
        if (!user || !user.comparePassword(req.body.password)) {
            return res.status(401).json({
                message: 'Authentication failed. Invalid user or password.'
            });
        }
        var payload = { email: user.email, _id: req._id };
        var token = jwt.sign(payload, config.secret, {
            expiresIn: 10080 // in seconds
        });
        res.status(200).json({ token: 'JWT ' + token, user: user });
    });
};

exports.loginRequired = function(req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({
            message: 'Unauthorized user!'
        });
    }
};