'use strict'

var notFound = function(req, res, next) {
    res.status(404);
    res.render('not-found');
};

var serverError = function(error, req, res, next) {
    res.status(500);
    res.render('server-error', {error: error});
};

module.exports = {
    notFound: notFound,
    serverError: serverError
};