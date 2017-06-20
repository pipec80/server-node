'use strict';
var jwt = require('jsonwebtoken'),
    config = require('../../config/config');
const User = require('../models/userModel');

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

        user.save(function(err, user) {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                var payload = { email: user.email, id: user._id };
                var token = jwt.sign(payload, config.secret, {
                    expiresIn: 10080 // in seconds
                }); //'JWT ' + token
                res.status(200).json({ token: token, user: user });
            }
        });
    });
};

exports.login = function(req, res) {
    var payload = { email: req.user.email, id: req.user._id };
    var token = jwt.sign(payload, config.secret, {
        expiresIn: 10080 // in seconds
    }); //'JWT ' + token
    res.status(200).json({ token: token, user: req.user });
};