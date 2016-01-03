'use strict'

var config = {
    "route" : "/movies",
    "view" : "./views",
    "model" : require('./model/Movies.js'),
    "controller" : require('./controller/MovieController.js')   
};

module.exports = config;