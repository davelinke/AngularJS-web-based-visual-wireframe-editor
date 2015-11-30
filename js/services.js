/*
* Web based visual wireframe editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit davelinke.com/editor
*/
angular.module('gui.services', [])
.factory('projectData', function ($http) {
	return {
		getConfig:function () {
			return $http({
				method : 'JSONP',
				url : 'js/config.json?callback=JSON_CALLBACK'
			});
		}
	};
})
;
