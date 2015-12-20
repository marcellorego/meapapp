var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');
var morgan = require('morgan');

// Create the application
var app = express();

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

var connectDB = require('./config/dbconfig');
var db = connectDB(function() {
    
    app.models = require('./models/index');

	//Load the routes
	var routes = require('./routes');
	_.each(routes, function(controller, route) {
		app.use(route, controller(app, route));
	});

	console.log('Listening on port 3000');
	app.listen(3000);
    
}, function() {
    console.error.bind(console, 'connection error:')
});

module.exports = db;
