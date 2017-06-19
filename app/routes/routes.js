'use strict';

module.exports = function(app) {

    // api ---------------------------------------------------------------------


    // application web ---------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};