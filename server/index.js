'use strict'

var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    path = require("path"),
    //_ = require('lodash'),
    //restful = require('node-restful'),
    morgan = require('morgan')   
    ;

console.log(__dirname);

//Load package.json
var pjson = require(path.join(__dirname, '/package.json'));

// Properties for the application
var database = pjson.database;
var version = pjson.version;

// Create the application
var app = express();

app.locals.version = version;

app.locals.paths = {
    public :        path.join(__dirname, '/public'),
    api :           path.join(__dirname, '/api'),
    views :         [
        path.join(__dirname, '/views')
    ]
};

app.locals.requires = {
    dbConfig :      path.join(__dirname, '/dbConfig/index'),
    error :         path.join(__dirname, '/error/index'),
    route :         path.join(__dirname, '/routes/index'),
    watch :         path.join(__dirname, '/watch/index'),
    resolver :      path.join(__dirname, '/resolver/index'),
    model :         path.join(__dirname, '/models/index')
};

// API config
app.locals.apiConfig = {};

// DB Connection
var connectDB = require(app.locals.requires.dbConfig);

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

// Connects to the database
var db = connectDB(database, onDatabaseOpened, onDatabaseError);
app.locals.db = db;

function onDatabaseOpened() {
    
    //Create main model
    createModel();

    //Watch Hot Dploy Mean Api
    var watchHDMA = require(app.locals.requires.watch);
    watchHDMA(app.locals.paths.api, app.locals.apiConfig);

    // Register api resolver
    var resolverHDMA = require(app.locals.requires.resolver);
    resolverHDMA(app);
    
    var port = process.env.NODEPORT || 3000;
	console.log('Listening on port ' + port);
	app.listen(port);
};

function onDatabaseError() {
    console.error.bind(console, 'connection error:')
};

function createModel() {
    var Model = require(app.locals.requires.model);
    var model = new Model();
    app.locals.model = model;
};

function loadErrorPages() {
    // Error pages support
    var error = require(app.locals.require.error);
    app.use(error.notFound);
    app.use(error.serverError);
}

function viewsRendererResolver() {

    // Sets app views engine
    app.set('views', app.locals.path.views);
    app.set('view engine', 'ejs');
    app.use(express.static(app.locals.path.public));
}

module.exports = app;