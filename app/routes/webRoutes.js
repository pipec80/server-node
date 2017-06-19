module.exports = (function() {
    'use strict';
    var webRouter = require('express').Router();

    // application web ---------------------------------------------------------
    webRouter.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    return webRouter;
})();