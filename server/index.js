var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');
//var morgan = require('morgan');
var Router = require('./routes/index');

//Load package.json
var pjson = require('./package.json');

// Create the application
var app = express();

// Properties for the application
app.locals.database = pjson.database;
app.locals.version = pjson.version;
app.locals.controllers = pjson.controllers;

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

//app.use(morgan('combined'));

var connectDB = require('./config/dbconfig');
var db = connectDB(app.locals.database, onDatabaseOpened, onDatabaseError);

function onDatabaseOpened() {
    
    loadModels();

   //Load the routes
   loadRoutes(app.locals.controllers);

	console.log('Listening on port 3000');
	app.listen(3000);
};

function onDatabaseError() {
    console.error.bind(console, 'connection error:')
};

function onRoutesLoaded(routes) {
    _.each(routes, function(controller, route) {
		app.use(route, controller(app, route));
	});
};

function loadModels() {
    app.models = require('./models/index');
};

function loadRoutes(controllerPath) {
	var router = new Router(controllerPath);
    router.loadRoutes(onRoutesLoaded);
};

module.exports = db;
