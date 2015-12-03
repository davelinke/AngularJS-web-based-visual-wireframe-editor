/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/

angular.module('gui.controllers', []).
controller('main', ['$scope','$compile',function ($scope, projectData, $compile) {
	$scope.data = $.extend({},config);
	//config = null;
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
	$scope.tree = {
		json:'',
		newLayerName:function(pre){
			var
				i = 1,
				finalname,
				checkLayerName = function(name,so){
					for (var j=0;j<so.length; j++) {
						var io = so[j];
						if (io.id==name){
							return true;
						} else {
							if ((io.children.length > 0) && (checkLayerName(name,io.children))) return true;
						}
					}
					return false;
				}
			;
			if (typeof(pre)=='undefined') pre = $scope.data.lang[$scope.data.lang.act].layer;
			while (i) {
				finalname = pre + '_' + i;
				if (!checkLayerName(finalname,$scope.data.tree.root.children)) return finalname;
				i++;
			}
		},
		getJson:function () {
			$scope.tree.json = angular.toJson($scope.data.tree.root);
		},
		toggleMinimized:function (child) {
			child.minimized = !child.minimized;
		},
		unSelect:function(){
			function walk(target) {
				var
					children = target.children,
					i
				;
				if (children) {
					i = children.length;
					while (i--) {
						if (children[i].selected){
							/*$scope.$apply(function () {
								children[i].selected = false;
							});*/
							children[i].selected = false;
							break;
						}
						walk(children[i]);
					}
				}
			}
			walk($scope.data.tree.root);
		},
		logSelection: function(child){
			var
				couldBe = null,
				checkSelected = function(so){
					for (var j=0;j<so.length; j++) {
						var io = so[j];
						if (io.type=="layer"){
							//console.log(io);
							couldBe = io;
						}
						if (io.selected===true){
							return {
								active:child,
								next:((j+1)<so.length?so[j+1]:null),
								prev:((j-1)>-1?so[j-1]:null),
								parent:null
							};
						} else {
							if (io.children.length > 0) {
								var subs = checkSelected(io.children);
								if (subs){
									subs.parent = couldBe;
								}
								return subs;
							}
						}
					}
					return false;
				}
			;
			$scope.data.selection = checkSelected($scope.data.tree.root.children);
			console.log($scope.data.selection);
		},
		toggleSelected : function (child) {
			if(child){
				$scope.tree.unSelect();
				child.selected = true;
				$scope.tree.logSelection(child);
				// change swatches
				var obtochange = (child.type=="layer"?$scope.data.drawStyle:child.style);
				for (var key in $scope.data.stylePickers) {
					$scope.data.stylePickers[key] = obtochange[key];
				}
			}
		},
		searchElementById:function(id){
			var
				searchTree = function(so){
					for (var j=0;j<so.length; j++) {
						var io = so[j];
						if (io.id===id){
							return io;
						} else {
							var c = searchTree(io.children);
							if ((io.children.length > 0) && (c)) return c;
						}
					}
					return false;
				}
			;
			return searchTree($scope.data.tree.root.children);
		},
		selectParentLayer:function(){
			var
				couldBe = null,
				checkSelected = function(so){
					for (var j=0;j<so.length; j++) {
						var io = so[j];
						if (io.type=="layer"){
							//console.log(io);
							couldBe = io;
						}
						if (io.selected===true){
							return couldBe;
						} else {
							if (io.children.length > 0) {
								if (checkSelected(io.children))  return couldBe;
							}
						}
					}
					return false;
				}
			;
			return checkSelected($scope.data.tree.root.children);
		},
		addChild:function (child) {
			//$scope.tree.unSelect();
			child.children.push({
				id : $scope.tree.newLayerName(),
				children : [],
				selected:false,
				style:{
					top:'0',
					tPx:0,
					left:'0',
					lPx:0,
					width:'0',
					wPx:0,
					height:'0',
					hPx:0,
					overflow:'visible',
					'border-width':'0px',
					bwPx:0
				},
				type:(child.type=='root'?'layer':'element')
			});
			$scope.tree.toggleSelected(child.children[child.children.length-1]);
		},
		returnSelected:function(target){
			var
				checkSelected = function(so){
					for (var j=0;j<so.length; j++) {
						var io = so[j];
						if (io.selected===true){
							return io;
						} else {
							var c = checkSelected(io.children);
							if ((io.children.length > 0) && (c)) return c;
						}
					}
					return false;
				}
			;
			return checkSelected(target);
		},
		remove:function (child) {
			function walk(target) {
				var
					children = target.children,
					i
				;
				if (children) {
					i = children.length;
					while (i--) {
						if (children[i] === child) {
							return children.splice(i, 1);
						} else {
							walk(children[i]);
						}
					}
				}
			}
			walk($scope.data.tree.root);

			// select something after deleting
			$scope.tree.toggleSelected(($scope.data.selection.prev?$scope.data.selection.prev:($scope.data.selection.next?$scope.data.selection.next:($scope.data.selection.parent?$scope.data.selection.parent:null))));

		},
		removeSelected:function(obj){
			$scope.tree.remove($scope.tree.returnSelected(obj.children));
		},
		properties:function(){
			$scope.modal.content = 'hi';
			$scope.modal.showModal = true;
		}
	};
	$scope.tree.toggleSelected($scope.tree.searchElementById('layer_1'));
	$scope.modal = {
		showModal: false,
		toggleModal: function(){
			$scope.modal.showModal = !$scope.modal.showModal;
		}
	};
}
]);
