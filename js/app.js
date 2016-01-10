/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/

angular.module('gui', [
	'gui.services',
	'gui.controllers',
	'gui.directives',
	'gui.filters',
	'ngRoute',
	'colorpicker.module'
]).
config(['$routeProvider', function ($routeProvider) {
	$routeProvider.
		when("/main", {
			templateUrl : "partials/main.html",
			controller : "main"
		}).
		when("/preview-screen/:id",{
			templateUrl : "partials/preview-screen.html",
			controller : "preview"
		}).
		otherwise({
			redirectTo : '/main'
		})
	;
}]);
