/*
* Web based visual wireframe editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit davelinke.com/editor
*/

(function () {
   'use strict';
   // this function is strict...
}());

/* Directives */

angular.
module('gui.directives', ['gui.filters']).
directive('keyIncrement', [function () {
			return function (scope, t, attrs) {
				t.on('keydown', function (e) {
					var key = e.keyCode;
					var increment = function (num) {
						var val = t.val();
						var numVal = parseInt(val.replace(/[^-\d\.]/g, ''));
						var nuVal = numVal + num;
						var unit = val.replace(numVal, '');
						t.val(nuVal + (unit===''?'px':unit)).triggerHandler('input');
					};
					if (key == 40) {
						// abajo;
						increment(-1);
					} else if (key == 38) {
						// arriba
						increment(+1);
					}
				});
			};
		}
	]).
directive('toolbox',['$compile','launcherFilter',function($compile,launcher){
	return {
		compile: function (obj, attrs) {
			return function link(s, t, atts) {
				var tools = $compile('<button ng-repeat="(key,value) in data.tools | launcher:\''+atts.toolbox+'\'" type="button" class="btn" ng-class="{active: value.isActive}" set-tool="{{value.id}}" title="{{value.label}}" ng-attr-is-default="{{value.isDefault}}"><span class="{{value.iconClass}}"></span></button>')(s);
				t.append(tools);
			};
		}
	};
}]).
directive('setTool', ['$compile', function ($compile) {
			return {
				link : function (scope, t, attrs) {
					scope.data.fn.setTool(scope, t, attrs, $compile);
				}
			};
		}
	]).
directive('toolActions',['$compile',function($compile){
	return {
		compile: function (obj, attrs) {
			return function link(s, t, atts) {
				//things to watch
				s.$watch('data.toolActions.actions', function (actions) {
					var button = $compile('<button type="button" class="btn btn-sm btn-default" ng-repeat="action in data.toolActions.actions" ng-click="action.fn()" title="{{action.name}}"><span class="{{action.iconClass}}"></span></button>')(s);
					t.empty().append(button);
				},true);
			};
		}
	};
}]).
directive('trackMouseEvents', ['$compile', function ($compile) {
			return function (scope, t, attrs) {
				t.on('mousedown mouseup mouseenter mouseleave', function (e) {
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
				t.on('mousemove', function (e) {
					var so = $('#screen').offset();
					scope.$apply(function () {
						scope.data.mouse.y = e.pageX;
						scope.data.mouse.x = e.pageY;
						scope.data.screen.mouse.x = e.pageX - so.left;
						scope.data.screen.mouse.y = e.pageY - so.top;
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
		}
	]).
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
								transclude(parentScope.$new(), function (clone, childScope) {

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

								});
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
directive('colorPicker',['$compile','$parse',function($compile,$parse){
    return {
		compile: function (obj, attrs) {
			return function link(s, t, atts) {
				var picker = $compile('<div class="tr-sq"><input type="text" class="swatch" style="background-color:'+$parse(atts.model)(s)+'" ng-model="'+atts.model+'" colorpicker="rgba"  colorpicker-position="value" colorpicker-position-value="0,40" colorpicker-parent colorpicker-with-input="true" /></div>')(s);
                t.append(picker);
                s.$watch(atts.model,function(a){
                    picker.children().css('background-color',a);
                    //console.log(s.data.selection.active);
                    if(s.data.selection.active.type=="layer"){
                        s.data.drawStyle[atts.which] = a;
                    } else {
                        console.log(s.data.selection);
                        s.data.selection.active.style[atts.which] = a;
                    }
                });
			};
		}
	};
}]).
directive('listenKeystrokes',['$compile',function($compile){
    return function($scope,t,attrs){
        $(window).on('keydown keyup',function(e){
            console.log(e);
            //e.preventDefault();
            if((typeof($scope.data.keystrokes[e.keyCode])!='undefined')&&(typeof($scope.data.keystrokes[e.keyCode][e.type])!='undefined')) $scope.data.keystrokes[e.keyCode][e.type]({
                e:e,
                s:$scope,
                c:$compile
            });
        });
    };
}]);
