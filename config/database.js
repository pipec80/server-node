'use strict';
const Mongoose = require('mongoose');
const config = require('./config');

Mongoose.connect(config.dblocalUrl);

const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log("Connection with database succeeded.");
});

exports.db = db;