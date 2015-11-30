/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
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
/*
.factory('ergastAPIservice', function ($http) {

	var ergastAPI = {

	};

	ergastAPI.getDrivers = function () {
		return $http({
			method : 'JSONP',
			url : 'http://ergast.com/api/f1/2013/driverStandings.json?callback=JSON_CALLBACK'
		});
	}

	ergastAPI.getDriverDetails = function (id) {
		return $http({
			method : 'JSONP',
			url : 'http://ergast.com/api/f1/2013/drivers/' + id + '/driverStandings.json?callback=JSON_CALLBACK'
		});
	}

	ergastAPI.getDriverRaces = function (id) {
		return $http({
			method : 'JSONP',
			url : 'http://ergast.com/api/f1/2013/drivers/' + id + '/results.json?callback=JSON_CALLBACK'
		});
	}

	return ergastAPI;
})
*/
;
