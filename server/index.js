var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    path = require("path"),
    //_ = require('lodash')
    morgan = require('morgan')
    ;
console.log(__dirname);

//Load package.json
var pjson = require(path.join(__dirname, '/package.json'));

// Create the application
var app = express();

// Properties for the application
app.locals.database = pjson.database;
app.locals.version = pjson.version;

app.locals.path = {
    public : path.join(__dirname, '/public'),
    controller : path.join(__dirname, '/controllers'),
    view : path.join(__dirname, '/views')
};

app.locals.require = {
    dbconfig : path.join(__dirname, '/config/dbconfig'),
    model : path.join(__dirname, '/models/index'),
    error : path.join(__dirname, '/error/index'),
    route : path.join(__dirname, '/routes/index')
};

// API config
app.locals.apiConfig = {};

// Sets app views engine
app.set('views', app.locals.path.view);
app.set('view engine', 'ejs');
app.use(express.static(app.locals.path.public));

// Add middleware necessary for REST API's
app
.use(bodyParser.urlencoded({
	extended: true	
}))
.use(bodyParser.json())
.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app
.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use(morgan('combined'));

/*.use(function(req, res, next) {
    // do logging
    console.log(req);
    next(); // make sure we go to the next routes and don't stop here
});*/

var connectDB = require(app.locals.require.dbconfig);
var db = connectDB(app.locals.database, onDatabaseOpened, onDatabaseError);

function onDatabaseOpened() {
    
    //Load models
    //loadModels();

    //Load routes
    //loadRoutes();

    //loadErrorPages();

    //Watch new routes
    watchApi(app.locals.path.controller, app.locals.apiConfig);

    // Register api resolver
    apiResolver(app.locals.apiConfig);
    
	console.log('Listening on port 3000');
	app.listen(3000);
};

function onDatabaseError() {
    console.error.bind(console, 'connection error:')
};

function loadModels() {
    var Model = require(app.locals.require.model);
    var models = new Model();
    app.models = models;
};

function loadRoutes() {
    var Route = require(app.locals.require.route);
	var router = new Route(app.locals.path.controller);
    router.loadRoutes(onRoutesLoaded);
};

function onRoutesLoaded(routes) {
    for (var route in routes) {
        var controller = routes[route];
        app.use(route, controller(app, route));
    }
};

function loadErrorPages() {
    // Error pages support
    var error = require(app.locals.require.error);
    app.use(error.notFound);
    app.use(error.serverError);
}

function watchApi(apiPath, apiConfig) {
    
    var chokidar = require('chokidar');
    
    var watcher = chokidar
    .watch(apiPath, {
        ignored: /^\./, 
        persistent: true
    });

    watcher
    .on('addDir', function(dir) {
        var key = path.basename(dir);
        apiConfig[key] = dir;
    })
    .on('unlinkDir', function(dir) {
        var key = path.basename(dir);
        delete apiConfig[key];
    })
    .on('error', function(error) {
        console.error('Error happened', error);
    });
}

function apiResolver(apiConfig) {
    
    var watchConfig = require('observed');
    
    Object.observe(apiConfig, function (changes) {
        var change = null;
        for (var index in changes) {
            change = changes[index];
            if (change.type === 'add') {
                console.log(change.type, change.name);            
            } else {
                console.log(change.type, change.name);
            }            
        }
    });
}

module.exports = app;