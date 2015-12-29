var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    _ = require('lodash')
    //,morgan = require('morgan');
    ;
console.log(__dirname);

//Load package.json
var pjson = require(__dirname + '/package.json');

// Create the application
var app = express();

// Properties for the application
app.locals.database = pjson.database;
app.locals.version = pjson.version;

app.locals.path = {
    public : __dirname + '/public',
    controller : __dirname + '/controllers',
    view : __dirname + '/views'
};

app.locals.require = {
    dbconfig : __dirname + '/config/dbconfig',
    model : __dirname + '/models/index',
    error : __dirname + '/error/index',
    route : __dirname + '/routes/index'
};

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

// Error pages support
var error = require(app.locals.require.error);
app
.use(error.notFound);
app
.use(error.serverError);

//app.use(morgan('combined'));

var connectDB = require(app.locals.require.dbconfig);
var db = connectDB(app.locals.database, onDatabaseOpened, onDatabaseError);

function onDatabaseOpened() {
    
    //Load models
    loadModels();

    //Load routes
    loadRoutes();

	console.log('Listening on port 3000');
	app.listen(3000);
};

function onDatabaseError() {
    console.error.bind(console, 'connection error:')
};

function loadModels() {
    app.models = require(app.locals.require.model);
};

function loadRoutes() {
    var Route = require(app.locals.require.route);
	var router = new Route(app.locals.path.controller);
    router.loadRoutes(onRoutesLoaded);
};

function onRoutesLoaded(routes) {
    _.each(routes, function(controller, route) {
		app.use(route, controller(app, route));
	});
};

module.exports = db;