/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/

angular.module('gui.controllers', []).
controller('main', ['$scope','data','$compile',function ($scope, data, $compile) {
	$scope.data = data;
	if (typeof($scope.data.tree.root)=='undefined') {
		$scope.data.fn.tree.reset($scope.data);
	}
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
		$scope.data.menus.main.actions.save.disabled=true;
		s = $scope;
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
		$scope.data.tree.root.id = 'document__' + $scope.data.fn.storage.sanitizeName($scope.data.tree.root.name);
		if(!checkName($scope.data.tree.root.name)){
			$scope.data.fn.storage.storeDocument($scope);
			$('#saveDocumentAsModal').modal('hide');
			$scope.data.menus.main.actions.save.disabled=false;
			$scope.documents = $scope.data.fn.storage.getDocumentNames();
		} else {
			if(confirm($scope.data.lang[$scope.data.lang.act].doYouWantToOverwrite + ' "' + $scope.data.tree.root.name + '"?')){
				$scope.data.fn.storage.storeDocument($scope);
				$('#saveDocumentAsModal').modal('hide');
				$scope.data.menus.main.actions.save.disabled=false;
			}
		}
	};
	$scope.documents.open=function(){
		var docId = $scope.documents.documentToOpen;
		if (docId){
			console.log(docId);
			var documentData = $scope.data.fn.storage.getDocumentObjectById($scope.documents.documentToOpen);

			console.log(documentData.screen);
			console.log($scope.data.screen);

			$scope.data.fn.tree.reset($scope.data);
			$scope.data.flags.storage.canOverwrite = true;

			$scope.data.screen = documentData.screen;
			$scope.data.tree = documentData.tree;
			$scope.data.fn.tree.toggleSelected({
				child:$scope.data.fn.tree.searchElementById('layer_1', $scope.data.tree.root.children),
				data:$scope.data
			});

			console.log($scope);

			$('#openDocumentModal').modal('hide');
			$scope.data.menus.main.actions.save.disabled=false;
			$scope.documents.documentToOpen = null;
		}
	};
	$scope.documents.documentToOpen = null;
}]);
