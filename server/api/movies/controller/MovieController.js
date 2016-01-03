'use strict'

var restful = require('node-restful');

module.exports = function(model) {

	//Setup the controller for REST
	var rest = restful.model(
		 model.collection,
		 model.schema
	).methods(['get', 'put', 'post', 'delete']);

	return rest;
};