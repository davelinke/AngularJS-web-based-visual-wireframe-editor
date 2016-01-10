/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/

angular.module('gui.controllers', []).
controller('main', ['$scope','data','$compile',function ($scope, data, $compile) {
	s=$scope;
	$scope.data = data;
	if (typeof($scope.data.tree.root)=='undefined') {
		$scope.data.fn.tree.reset($scope.data);
	}
	$scope.fn = {
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
	// create new document
	$scope.createNew = function(){
		$scope.data.fn.tree.reset($scope.data);
		$scope.data.flags.storage.canOverwrite = false;
		$scope.data.tree.root.name = $scope.createNew.newName;
		$scope.data.tree.root.id = 'document__' + $scope.data.fn.storage.sanitizeName($scope.createNew.newName);
		$scope.data.screen.width = $scope.createNew.width;
		$scope.data.screen.height = $scope.createNew.height;
		$scope.data.screen.wPx = $scope.data.fn.pxNum($scope.createNew.width);
		$scope.data.screen.hPx = $scope.data.fn.pxNum($scope.createNew.height);
		$('#newDocumentModal').modal('hide');
		$scope.data.fn.tree.toggleSelected({
			child:$scope.data.fn.tree.searchElementById('layer_1', $scope.data.tree.root.children),
			data:$scope.data
		});
		$scope.createNew.newName = $scope.data.lang[$scope.data.lang.act].createNewDocument;
		$scope.data.menus.menus.file.actions.save.disabled=true;

		$scope.newDocumentForm.$setPristine();
		$scope.newDocumentForm.$setUntouched();
	};
	$scope.createNew.newName = $scope.data.lang[$scope.data.lang.act].createNewDocument;
	$scope.createNew.width="270px";
	$scope.createNew.height="440px";

	//available documents
	$scope.documents = $scope.data.fn.storage.getDocumentNames();
	$scope.documents.setDocumentName = function(name){
		$scope.data.tree.root.name = name;
	};
	$scope.documents.saveAs = function(){
		var checkName = function(name){
			for (var i=0;i<$scope.documents.length;i++){
				if (name==$scope.documents[i].name) return true;
			}
			return false;
		};
		var newName = $('#saveAsName').val();
		$scope.data.tree.root.name = newName;
		$scope.data.tree.root.id = 'document__' + $scope.data.fn.storage.sanitizeName(newName);
		if(!checkName(newName)){
			$scope.data.fn.storage.storeDocument($scope);
			$scope.data.menus.menus.file.actions.save.disabled=false;
			$scope.documents = $scope.data.fn.storage.getDocumentNames();
		} else {
			if(confirm($scope.data.lang[$scope.data.lang.act].doYouWantToOverwrite + ' "' + newName + '"?')){
				$scope.data.fn.storage.storeDocument($scope);
				$scope.data.menus.menus.file.actions.save.disabled=false;
			}
		}
		$scope.saveDocumentAsForm.$setPristine();
		$scope.saveDocumentAsForm.$setUntouched();
		$('#saveDocumentAsModal').modal('hide');
	};
	$scope.documents.open=function(){
		var docId = $scope.documents.documentToOpen;
		if (docId){
			$scope.data.fn.documents.open($scope,docId,function(){
				$scope.openDocumentForm.$setPristine();
				$scope.openDocumentForm.$setUntouched();
				$('#openDocumentModal').modal('hide');
				$scope.data.menus.menus.file.actions.save.disabled=false;
				$scope.documents.documentToOpen = null;
			});
		}
	};
	$scope.documents.documentToOpen = null;
}]).
controller('preview',['$scope','$routeParams','data',function ($scope, $routeParams, data) {
	$scope.data = data;
	$scope.goEdit = function(){
		window.location.hash = '/main/'
	};
}]);
