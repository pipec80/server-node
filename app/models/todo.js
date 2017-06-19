'use strict';
var mongoose = require('mongodb');

module.exports = mongoose.model('Todo', {
    text: {
        type: String,
        default: ''
    }
});