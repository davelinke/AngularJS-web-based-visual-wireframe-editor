/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/

angular.module('gui.controllers', []).
controller('main', ['$scope','$compile',function ($scope, projectData, $compile) {
	$scope.data = $.extend({},config);
	/*
	$scope.data = null;
	projectData.getConfig().success(function (response) {
		$scope.data = response;
	});
	*/
	$scope.fn = {
		toggleSidebar:function () {
			if ($scope.data.config.sidebarClass === '') {
				$scope.data.config.sidebarClass = 'collapsed';
			} else {
				$scope.data.config.sidebarClass = '';
			}
		},
		modal:function(properties){}
	};
	$scope.data.fn.tree.toggleSelected({
		child:$scope.data.fn.tree.searchElementById('layer_1', $scope.data.tree.root.children),
		data:$scope.data
	});
	$scope.modal = {
		showModal: false,
		toggleModal: function(){
			$scope.modal.showModal = !$scope.modal.showModal;
		}
	};
}
]);
