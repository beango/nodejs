"use strict";

var util = require('util');
var config = require('../config');
var userDao = require('../dao/userDao');

exports.index = function (req, res, next) {
    userDao.allUsers(function (err, todos) {
        if (err) {
            return next(err);
        }
        res.render('index', {todos: todos});
    });
};
