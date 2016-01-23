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
	$scope.documents = {
		names: $scope.data.fn.storage.getDocumentNames(),
		saveAsName:'New Document',
		openName:null,
		fn:{
			setDocumentName:function(name){
				$scope.data.tree.root.name = name;
			},
			saveAs:function(){
				var
					s = $scope,
					d = s.data,
					docs = s.documents.names
				;
				var checkName = function(name){
					for (var i=0;i<docs.length;i++){
						if (name==docs[i].name) return true;
					}
					return false;
				};
				var newName = s.documents.saveAsName;
				d.tree.root.name = newName;
				d.tree.root.id = 'document__' + d.fn.storage.sanitizeName(newName);
				if(!checkName(newName)){
					d.fn.storage.storeDocument($scope);
					d.menus.menus.file.actions.save.disabled=false;
					docs = d.fn.storage.getDocumentNames();
				} else {
					if(confirm(d.lang[d.lang.act].doYouWantToOverwrite + ' "' + newName + '"?')){
						d.fn.storage.storeDocument($scope);
						d.menus.menus.file.actions.save.disabled=false;
					}
				}
				$('#saveDocumentAsModal').modal('hide');
				s.documents.saveAsName = 'New Document';
				s.documents.names = $scope.data.fn.storage.getDocumentNames();
			},
			open:function(){
				var docId = $scope.documents.openName;
				if (docId){
					$scope.data.fn.documents.open($scope,docId,function(){
						$('#openDocumentModal').modal('hide');
						$scope.data.menus.menus.file.actions.save.disabled=false;
						$scope.documents.openName = null;
					});
				}
			}
		}
	};
	$scope.documents.openName = null;
}]).
controller('preview',['$scope','$routeParams','data',function ($scope, $routeParams, data) {
	$scope.data = data;
	$scope.goEdit = function(){
		window.location.hash = '/main/';
	};
}]);
