    'use strict';
    var express = require('express');
    var passport = require('passport');
    var ROLE_MEMBER = require('../../config/constants').ROLE_MEMBER;
    var ROLE_CLIENT = require('../../config/constants').ROLE_CLIENT;
    var ROLE_OWNER = require('../../config/constants').ROLE_OWNER;
    var ROLE_ADMIN = require('../../config/constants').ROLE_ADMIN;

    var userHandlers = require('../controllers/userController.js');
    var passportService = require('../../config/passport');
    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        userRoutes = express.Router();
    // Middleware to require login/auth
    var requireAuth = passport.authenticate('jwt', { session: false });
    var requireLogin = passport.authenticate('local', { session: false });

    module.exports = function(app) {
        // api ---------------------------------------------------------------------
        app.use(passport.initialize());
        // Set auth routes as subgroup/middleware to apiRoutes
        apiRoutes.use('/auth', authRoutes);
        // Registration route
        authRoutes.post('/register', userHandlers.register);
        // Login route
        authRoutes.post('/login', requireLogin, userHandlers.login);
        // Password reset request route (generate/send token)
        // authRoutes.post('/forgot-password', userHandlers.forgotPassword);
        // Password reset route (change password using token)
        //authRoutes.post('/reset-password/:token', userHandlers.verifyToken);
        //= ========================
        // User Routes
        //= ========================
        apiRoutes.post('/user', userRoutes);
        // Test protected route
        apiRoutes.post('/protected', requireAuth, (req, res) => {
            res.send({ content: 'The protected test route is functional!' });
        });
        // Set url for API group routes
        app.use('/api', apiRoutes);
    };