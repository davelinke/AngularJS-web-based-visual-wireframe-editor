/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/

(function () {
   'use strict';
   // this function is strict...
}());

/* Filters */

angular.module('gui.filters', []).
filter('launcher', function () {
	return function (items, field) {
		var filtered = [];
		angular.forEach(items, function (item) {
			if (item.launcher==field) filtered.push(item);
		});
		return filtered;
	};
}).
filter('nicename', function () {
	return function (item) {
		return item.replace(/_/g, ' ');
	};
});
