'use strict'

var fs = require('fs'),
    path = require("path");

module.exports = Router;

function Router(controllerPath) {
    this.routes = {};
    this.controllerPath = controllerPath;
}

Router.prototype.loadRoutes = function(onLoad) {
   
    var self = this;
    /*self.routes = {
        '/movie': require('../controllers/MovieController')
    };*/
    
    readControllerPath(this.controllerPath, function(mapRoutes) {
        
        for (var route in mapRoutes) {
            var file = mapRoutes[route];
            self.addController('/' + route, file);
        };
        
        onLoad(self.routes);        
    });
}

Router.prototype.addController = function (routePath, controller) {
    if (!this.routes) this.routes = {};
    this.routes[routePath] = require(controller);
    console.log("Added contoller %s", routePath);
}

var fileControllerRouteResolver = function(file) {
    file = path.resolve(file);
    var extension = path.extname(file);
    var route = path.basename(file, extension);
    return route;
}

var readControllerPath = function(controllerPath, onReadDone) {
    
    var mapRoutes = {};
    
    fs.readdir(controllerPath, function (err, files) {
        
        if (!err) {
            
            var fileNames = files.map(function (file) {
                var result = path.join(controllerPath, file);
                return result;
            });
            
            var controllers = fileNames.filter(function (file) {
                var isFile = fs.statSync(file).isFile();
                return isFile;
            });
            
            controllers.forEach(function (file) {
                var route = fileControllerRouteResolver(file);
                mapRoutes[route] = file;
            });
            
            var controllersFolders = fileNames.filter(function (file) {
                var isFolder = fs.statSync(file).isDirectory();
                return isFolder;
            }); 
            
            controllersFolders.forEach(function (folder) {
                readControllerPath(folder, onReadDone);
            });
            
        } else {
            throw err;
        }
        
        onReadDone(mapRoutes);
    });
}