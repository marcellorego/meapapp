'use strict'
var fs = require('fs'),
    path = require("path");

module.exports = Router;

function Router(controllerPath) {
    this.initRouter(controllerPath);
}

Router.prototype.loadRoutes = function(onLoad) {
   
    /*this.routes = {
        '/movie': require('../controllers/MovieController')
    };*/
    
    
   /* var walkSync = function(dir, filelist) {
        var fs = fs || require('fs'),
            files = fs.readdirSync(dir);
        filelist = filelist || [];
        files.forEach(function(file) {
            if (fs.statSync(dir + file).isDirectory()) {
                filelist = walkSync(dir + file + '/', filelist);
            } else {
                filelist.push(file);
            }
        });
        return filelist;
    };
    
    var filelist = [];
    walkSync(this.controllerPath, filelist);
    var routes = {};
    
    
       
    onLoad(routes);*/
    
    var self = this;
    fs.readdir(self.controllerPath, function (err, files) {
        
        if (!err) {
            files.map(function (file) {
                var result = path.join(self.controllerPath, file);
                return result;
            }).filter(function (file) {
                var isFile = fs.statSync(file).isFile();
                return isFile;
            }).forEach(function (file) {
                file = path.resolve(file);
                var extension = path.extname(file);
                var route = path.basename(file, extension);
                self.addController('/' + route, require(file));
            });
        } else {
            throw err;
        }
        
        onLoad(self.routes);
    });
}

Router.prototype.addController = function (routePath, controller) {
    if (!this.routes) this.routes = {};
    this.routes[routePath] = controller;
    console.log("Added contoller %s", routePath);
}

Router.prototype.initRouter = function(controllerPath) {
    this.routes = {};
    this.controllerPath = controllerPath;
}

/*{
	'/movie': require('../controllers/MovieController')	
};*/