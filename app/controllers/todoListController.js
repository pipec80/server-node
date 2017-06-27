'use strict';
const todoList = require('../models/todoListModel');
var mongoose = require('mongoose'),
    Task = mongoose.model('Tasks');



exports.lists = function(req, res) {
    console.log('lists', req.body);
    Task.find({}, function(err, task) {
        if (err) {
            res.send(err);
        }
        res.status(201).json(task);
    });
};

exports.createTask = function(req, res) {
    console.log('createTask', req.body);
    var ntask = new Task(req.body);
    ntask.save(function(err, task) {
        if (err) {
            res.send(err);
        }
        res.status(201).json(task);
    });
};

exports.readTask = function(req, res) {
    Task.findById(req.params.taskId, function(err, task) {
        if (err) { res.send(err); }
        res.status(201).json(task);
    });
};

exports.updateTask = function(req, res) {
    Task.findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true }, function(err, task) {
        if (err) { res.send(err); }
        res.status(201).json(task);
    });
};

exports.deleteTask = function(req, res) {
    Task.remove({
        _id: req.params.taskId
    }, function(err) {
        if (err) { res.send(err); }
        res.status(201).json({ message: 'Task successfully deleted' });
    });
};