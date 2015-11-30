/*
* Web based visual wireframe editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit davelinke.com/editor
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
			otherwise({
				redirectTo : '/main'
			});
		}
	]);
