/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/

/* Directives */

angular.
module('gui.directives', ['gui.filters']).
directive('checkbox',[function(){
	return {
		scope:{
			model:'=ngModel',
			label:'@label',
			iconChecked:'@iconChecked',
			iconUnchecked:'@iconUnchecked',
		},
		template:'<span ng-click="model= !model"><i class="custom-checkbox {{{true:iconChecked,false:iconUnchecked}[model]}}"></i><label>{{::label}}</label></span>'
	};
}]).
directive('keyIncrement', [function () {
	return {
		scope:{
			model:'=ngModel',
			unitlessValue:'=unitlessValue',
		},
		link:function(scope,t,attrs){
			t.on('keydown', function (e) {
				//if(!scope.model) scope.model='0px';
					var
						key = e.keyCode
					;
					if(key==40||key==38){
						var
							nuVal,
							findControllerScope = function(s){
								if (s.$parent.$parent===null){
									return s;
								} else {
									 return findControllerScope(s.$parent);
								}
							},
							sc = findControllerScope(scope)
						;
						if (key == 40) { // down;
							nuVal = sc.data.fn.modifiers.cssIncrement(scope.model,-1);
						} else if (key == 38) { // up
							nuVal = sc.data.fn.modifiers.cssIncrement(scope.model,1);
						}
						scope.model = nuVal.val;
						scope.unitlessValue = nuVal.unitLess;
						scope.$apply();
					}

			});
		}
	};
}]).
directive('areaKeyIncrement',[function(){
	return {
		link:function(scope,t,attrs){
			t.on('keydown', function (e) {
					var
						key = e.keyCode,
						nuVal
					;
					console.log(attrs.ngProperty);
					if (key == 40) { // down;
						e.preventDefault();
						nuVal = scope.data.fn.modifiers.modifyElementArea(scope,attrs.ngProperty,-1);
					} else if (key == 38) { // up
						e.preventDefault();
						nuVal = scope.data.fn.modifiers.modifyElementArea(scope,attrs.ngProperty,1);
					}
			});
		}
	};
}]).
directive('toolbox',['launcherFilter',function(launcher){
	return {
		scope:{
			toolbox:'@toolbox',
			data:'=data'
		},
		template:'<button ng-repeat="(key,value) in data.tools | launcher:toolbox" type="button" class="btn" ng-class="{active: value.isActive}" set-tool="{{::value.id}}" title="{{::value.label}}" ng-attr-is-default="{{value.isDefault}}"><span class="{{::value.iconClass}}"></span></button>'
	};
}]).
directive('setTool', ['$compile', function ($compile) {
	return {
		link : function (scope, t, attrs) {
			scope.data.fn.setTool(scope, t, attrs, $compile);
		}
	};
}]).
directive('trackMouseEvents', ['$compile', function ($compile) {
		return function (scope, t, attrs) {
			t.on('mousedown mouseup mouseenter mouseleave touchstart touchend', function (e) {
				e.preventDefault();
				var
					g = e.target,
					tools = scope.data.tools,
					hRuler = $('#horizontalRuler'),
					hrG = $('#rulerHGuide'),
					vRuler = $('#verticalRuler'),
					vrG = $('#rulerVGuide'),
					rulers = $('#rulers'),
					args = {
						event:e,
						scope:scope,
						compile:$compile
					}
				;
				if(e.type=='mousedown'||e.type=='touchstart'){
					$(':focus').blur();
					scope.data.mouse.down.x = e.pageX;
					scope.data.mouse.down.y = e.pageY;
					scope.data.mouse.offset.down.x = e.offsetX;
					scope.data.mouse.offset.down.y = e.offsetY;
				}
				if(e.type=='mouseup'||e.type=='touchend'){
					scope.data.mouse.up.x = e.pageX;
					scope.data.mouse.up.y = e.pageY;
					scope.data.mouse.offset.up.x = e.offsetX;
					scope.data.mouse.offset.up.y = e.offsetY;
				}
				scope.data.flags.mouseEvent = e.type;
				if ((g == hRuler)||(g==hrG)){
					tools.addGuide.horizontal[e.type](args);
				} else if ((g == vRuler)||(g==vrG)) {
					tools.addGuide.vertical[e.type](args);
				} else if(g==rulers){

				} else {
					if (!tools.addGuide.isActive) {
						if (typeof(tools[scope.data.tool].setUndo)=='function') tools[scope.data.tool].setUndo(args);
						if (typeof(tools[scope.data.tool][e.type])=='function') tools[scope.data.tool][e.type](args);
					} else {
						tools.addGuide[tools.addGuide.isActive][e.type](args);
					}
				}
			});
		};
	}
]).
directive('trackMousePosition', [function () {
		return function (scope, t, attrs) {
			t.on('mousemove touchmove', function (e) {
				var so = $('#screen').offset();
				scope.$apply(function () {
					scope.data.mouse.x = e.pageX;
					scope.data.mouse.y = e.pageY;
					scope.data.mouse.offset.x = e.pageX;
					scope.data.mouse.offset.y = e.pageY;
					scope.data.screen.mouse.x = e.pageX - so.left;
					scope.data.screen.mouse.y = e.pageY - so.top;
					if(scope.data.flags.mouseEvent=='mousedown'){
						scope.data.mouse.dragDelta.x = e.pageX - scope.data.mouse.down.x;
						scope.data.mouse.dragDelta.y = e.pageY - scope.data.mouse.down.y;
					}
				});
				scope.data.tools[scope.data.tool].mousemove(e, scope);
			});
		};
	}
]).
directive('modal', [function () {
	return {
		transclude : true,
		templateUrl : 'templates/modal.html',
		scope : {},
		link : function (scope, t, attrs) {
			scope.content = 'Hello modals';
			t.on('click', function (e) {
				if (e.target == t[0]) {
					t.remove();
				}
			});
		}
	};
}]).
directive("showElements", function (RecursionHelper) {
	return {
		scope : {
			family : '='
		},
		templateUrl : 'templates/tree.html',
		compile : function (element, scope) {
			// Use the compile function from the RecursionHelper,
			// And return the linking function(s) which it returns
			return RecursionHelper.compile(element);
		}
	};
}).
directive('tree', function () {

	return {
		restrict : 'A',
		transclude : 'element',
		priority : 1000,
		terminal : true,
		compile : function (tElement, tAttrs, transclude) {

			var
				repeatExpr,
				childExpr,
				rootExpr,
				childrenExpr,
				branchExpr
			;

			repeatExpr = tAttrs.tree.match(/^(.*) in ((?:.*\.)?(.*)) at (.*)$/);  //child in data.tree.root.children at div
			childExpr = repeatExpr[1]; //child
			rootExpr = repeatExpr[2]; //data.tree.root.children
			childrenExpr = repeatExpr[3]; //children
			branchExpr = repeatExpr[4]; //div (the child one)

			return function link(scope, element, attrs) {

				var
				rootElement = element[0].parentNode, // the wrapping element
				cache = [];


				// Reverse lookup object to avoid re-rendering elements
				function lookup(child) {
					var i = cache.length;
					while (i--) {
						if (cache[i].scope[childExpr] === child) {
							return cache.splice(i, 1)[0];
						}
					}
				}

				scope.$watch(rootExpr, function (root) {

					var currentCache = [];

					// Recurse the data structure
					var walk = function(children, parentNode, parentScope, depth) {

						//console.log(children);console.log(parentNode);console.log(parentScope);console.log(depth);

						var
							i = 0,
							n = children.length,
							last = n - 1,
							cursor,
							child,
							cached,
							childScope,
							grandchildren
						;

						// we define this function outside the loop for lint to pass
						var lf = function (clone, childScope) {
							childScope[childExpr] = child;
							cached = {
								scope : childScope,
								parentScope : parentScope,
								element : clone[0],
								branch : branchExpr=='none'?clone[0]:clone.find(branchExpr)[0]
							};
							// This had to happen during transclusion so inherited
							// controllers, among other things, work properly
							parentNode.insertBefore(cached.element, cursor);
						};
						// Iterate the children at the current level
						for (; i < n; ++i) {

							// We will compare the cached element to the element in
							// at the destination index. If it does not match, then
							// the cached element is being moved into this position.
							cursor = parentNode.childNodes[i];

							child = children[i];

							// See if this child has been previously rendered
							// using a reverse lookup by object reference
							cached = lookup(child);

							// If the parentScope no longer matches, we've moved.
							// We'll have to transclude again so that scopes
							// and controllers are properly inherited
							if (cached && cached.parentScope !== parentScope) {
								cache.push(cached);
								cached = null;
							}

							// If it has not, render a new element and prepare its scope
							// We also cache a reference to its branch node which will
							// be used as the parentNode in the next level of recursion
							if (!cached) {
								transclude(parentScope.$new(), lf);
							} else if (cached.element !== cursor) {
								parentNode.insertBefore(cached.element, cursor);
							}

							// Lets's set some scope values
							childScope = cached.scope;

							// Store the current depth on the scope in case you want
							// to use it (for good or evil, no judgment).
							childScope.$depth = depth;

							// Emulate some ng-repeat values
							childScope.$index = i;
							childScope.$first = (i === 0);
							childScope.$last = (i === last);
							childScope.$middle = !(childScope.$first || childScope.$last);

							// Push the object onto the new cache which will replace
							// the old cache at the end of the walk.
							currentCache.push(cached);

							// If the child has children of its own, recurse 'em.
							grandchildren = child[childrenExpr];
							if (grandchildren && grandchildren.length) {
								walk(grandchildren, cached.branch, childScope, depth + 1);
							}
						}
					};

					walk(root, rootElement, scope, 0);

					// Cleanup objects which have been removed.
					// Remove DOM elements and destroy scopes to prevent memory leaks.
					var i = cache.length;
					while (i--) {
						var cached = cache[i];
						if (cached.scope) {
							cached.scope.$destroy();
						}
						if (cached.element) {
							cached.element.parentNode.removeChild(cached.element);
						}
					}

					// Replace previous cache.
					cache = currentCache;

				}, true);
			};
		}
	};
}).
directive('colorPicker',['$compile',function($compile){
	return {
		scope:{
			which:'@which',
		},
		template:
			'<div class="tr-sq" ng-show="$parent.data.selection.active.typeNum==1"><input type="text" class="swatch" style="background-color:{{$parent.data.drawStyle[which]}}" ng-model="$parent.data.drawStyle[which]" colorpicker="rgba"  colorpicker-position="value" colorpicker-position-value="-100,40" colorpicker-parent colorpicker-with-input="true" /></div>' +
			'<div class="tr-sq" ng-show="$parent.data.selection.active.typeNum==2"><input type="text" class="swatch" style="background-color:{{$parent.data.selection.active.styles[$parent.data.flags.screenState][$parent.data.flags.elementState][which]}}" ng-model="$parent.data.selection.active.styles[$parent.data.flags.screenState][$parent.data.flags.elementState][which]" colorpicker="rgba"  colorpicker-position="value" colorpicker-position-value="-100,40" colorpicker-parent colorpicker-with-input="true" /></div>'
	};
}]).
directive('drawstyleSelectionModifier', ['$compile',function ($compile) {
	return {
		scope:{
			inputType : "@inputType",
			inputClass : "@inputClass",
			which: "@which"
		},
		template:
			'<input ng-show="$parent.data.selection.active.typeNum==1" type="{{::inputType}}" class="{{::inputClass}}" which="{{::which}}" ng-model="$parent.data.drawStyle[which]" x-key-increment />' +
			'<input ng-show="$parent.data.selection.active.typeNum==2" type="{{::inputType}}" class="{{::inputClass}}" which="{{::which}}" ng-model="$parent.data.selection.active.styles[$parent.data.flags.screenState][$parent.data.flags.elementState][which]" x-key-increment />'
	};
}]).
directive('listenKeystrokes',['$compile',function($compile){
    return function($scope,t,attrs){
        $(window).on('keydown.listenKeystrokes keyup.listenKeystrokes',function(e){
            //console.log(e);
            if((typeof($scope.data.keystrokes[e.keyCode])!='undefined')&&(typeof($scope.data.keystrokes[e.keyCode][e.type])!='undefined')) $scope.data.keystrokes[e.keyCode][e.type]({
                e:e,
                s:$scope,
                c:$compile
            });
			try{
				//safe apply
				if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();
			} catch(err){}
        });
    };
}]).
directive('flyoutMenu',[function(){
	return {
		restrict:'A',
		scope:{
			menus:'=flyoutMenu',
			menuId:'@id'
		},
		template:
		'<div class="flyoutMenuWrapper" ng-mouseleave="menus.activeMenu=null">'+
		'	<div ng-repeat="(menuName,menu) in menus.menus" id="{{::menuName}}Menu" class="flyout-menu">'+
		'		<button id="{{::menuName}}MenuButton" type="button" ng-class="::menu.iconClass" ng-click="menus.activeMenu = {true:null,false:menuName}[menus.activeMenu==menuName]" ng-mouseover="menus.activeMenu = {true:null,false:menuName}[menus.activeMenu==null]">{{::menu.label}}</button>'+
		'		<div class="flyout" ng-show="(menus.activeMenu==menuName)">'+
		'			<div ng-repeat="action in menu.actions"><button ng-if="!action.separator" ng-click="action.fn($parent);menus.activeMenu=null" ng-disabled="action.disabled">{{::action.label}} <i ng-if="action.hasCheck" class="fa fa-check pull-right"></i></button><hr ng-if="action.separator"/></div>'+
		'		</div>'+
		'	</div>'+
		'</div>'
	};
}]).
directive('inlineStyles', [function () {
	return {
		scope:{
			element:'=ngModel',
			preview:'@preview'
		},
		template:'{{styleString}}',
		link:function(scope,t,attrs){
			var createStyles = function(){
				scope.styleString="";
				var writeStyles = function(element){
					if (typeof(element.styles)!='undefined'){
						var styles = element.styles;
						var id = '#screen_'+element.id;
						for (var ss in styles){
							for (var state in styles[ss]){
								if (state!='normal'){
									var pre = (ss=='base'?'':'.'+ss+' ');
									//scope.styleString += id+(state=='normal'?'':(typeof(scope.preview)!='undefined'?state:state.replace(':','.colon__')))+'{';
									scope.styleString += pre+id+(typeof(scope.preview)!='undefined'?state:state.replace(':','.colon__'))+'{';
									for (var property in styles[ss][state]){
										scope.styleString += property +':'+styles[ss][state][property]+' !important;';
									}
									scope.styleString += '}';
								}
							}
						}
					}
					if (element.children.length>0) {
						for (var i=0;i<element.children.length;i++){
							writeStyles(element.children[i]);
						}
					}
				};
				writeStyles(scope.element);
			};
			scope.$watch('element',function(newValue){
				createStyles();
			},true);
		}
	};
}]).
directive('uploadToModel', [function () {
	return {
		scope:{
			model:'=ngModel',
			uploadWrapper:"@uploadWrapper",
		},link:function(scope,t,attrs){
			//image upload routine
			var fileInput = t[0];
			fileInput.addEventListener('change', function(e) {
				var file = fileInput.files[0];
				var imageType = /image.*/;
				if (file.type.match(imageType)) {
					var reader = new FileReader();
					reader.onload = function(e) {
						console.log(scope.uploadWrapper);
						scope.model = scope.uploadWrapper.replace('file-data',reader.result);
						//safe apply
						if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') scope.$apply();
					};
					reader.readAsDataURL(file);
				} else {
					alert("File not supported!");
				}
			});
		}
	};
}]).
directive('cursorClass',function(){
	return {
		scope:{
			model:'=ngModel'
		},
		template:'div.element{cursor:{{model}} !important;}'
	};
}).
directive('ngDragstart',function(){
	return{
		scope:{
			dragStart:'=ngDragstart',
			dataElement:'=ngModel'
		},
		link:function(scope,t,attrs){
			t.on('dragstart',function(e){
				scope.dragStart(e,scope,t,attrs);
			});
		}
	};
}).
directive('ngDrop',function(){
	return {
		scope:{
			dropFunc:'=ngDrop',
			dragOverFunc:'=ngDragover',
			dragLeaveFunc:'=ngDragleave',
			parentElement:'=ngParentElement',
			child:'=ngChildElement'
		},
		link:function(scope,t,attrs){
			t.on('drop',function(e){
				scope.dropFunc(e,scope,t,attrs);
			}).on('dragover',function(e){
				scope.dragOverFunc(e,scope,t,attrs);
			}).on('dragleave',function(e){
				scope.dragLeaveFunc(e,scope,t,attrs);
			});
		}
	};
});
