'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainNavCtrl
 * @description
 * # MainNavCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainNavCtrl', function ($scope, $location) {
    $scope.isActive = function(route) {
    	var localRoute = $location.path().substring(1);
    	var routePath = route.substring(1);
    	var active = false;
    	if (localRoute.length > 0 && routePath.length > 0)
    	   	active = localRoute.indexOf(routePath) >= 0;
    	else
    		active = (localRoute == routePath);
        return active;
    };
  });
