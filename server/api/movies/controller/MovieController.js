var restful = require('node-restful');

module.exports = function(app, route) {

	//Setup the controller for REST
	var rest = restful.model(
		'movie',
		app.models.getModel('movie')
	).methods(['get', 'put', 'post', 'delete']);

	rest.register(app, route);
	
	var result = function(req, res, next) {
		console.log(req.url);
		next();
	};
	
	return result;
};