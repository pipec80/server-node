'use strict';
// set up ======================================================================
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
// tokens ====================================================================
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var passport = require("passport");
var passportJWT = require("passport-jwt");
// models ===============================================================
var User = require('./app/models/userModel');

// configuration ===============================================================
//mongodb.connect(database.localUrl); // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
var port = process.env.PORT || 3000; // set the port
var database = require('./config/database'); // load the database config
mongoose.Promise = global.Promise;
mongoose.connect(database.localUrl);
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
};
app.use(allowCrossDomain);
app.use(express.static('./public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


// routes ======================================================================
var routes = require('./app/routes/apiRoutes.js');
routes(app);
app.use(passport.initialize());
// listen (start app with node server.js) ======================================
app.listen(port);
console.log('todo list RESTful API server started on: ' + port);
console.log('App listening on port ' + port);