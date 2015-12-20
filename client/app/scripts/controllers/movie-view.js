'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieViewCtrl
 * @description
 * # MovieViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MovieViewCtrl', function ($scope, Movie, $routeParams) {
    $scope.viewMovie = true;
    $scope.movie = Movie.one($routeParams.id).get().$object;
  });
