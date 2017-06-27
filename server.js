'use strict';
// set up ======================================================================
var express = require('express');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
const path = require('path');
var helmet = require('helmet');
// configuration ===============================================================
const db = require('./config/database');
const config = require('./config/config');
const app = express(); // create our app w/ express

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
};
app.use(helmet()); //
app.use(allowCrossDomain);
app.use(morgan('combined')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(express.static('./public')); // set the static files location /public/img will be /img for users
// webapp ======================================================================
/*app.get('*', function(req, res) {
    res.sendFile(path.resolve('public/index.html')); // load the single view file (angular will handle the page changes on the front-end)
});*/
// routes ======================================================================
var routes = require('./app/routes/apiRoutes.js');
routes(app);
// listen (start app with node server.js) ======================================
var port = config.port;
app.listen(process.env.PORT || port);
console.log('todo list RESTful API server started on: ' + port);
console.log('App listening on port ' + port);