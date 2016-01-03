'use strict'

var fs = require('fs'),
    path = require("path"),
    observed = require('observed');

module.exports = resolverHDMA;

function resolverHDMA(express) {
    
    var listener = observed(express.locals.apiConfig);
    
    listener
    .on('add', function (change) {
        
        var dir = change.value;
        //Load package.json
        var pjson = require(path.join(dir, '/package.json'));
        //Load main require
        var index = require(path.join(dir, pjson.main));        
        
        var resource = setup(express, index);
        
        express.locals.model.addModel(resource);
        
        console.log(change.type, index.route);
    })            
    .on("delete", function(change) {
        console.log(change.type, change.path);
    });
}

function setup(express, index) {
    var rest = index.controller(index.model);
    rest.register(express, index.route);
    return rest;
};