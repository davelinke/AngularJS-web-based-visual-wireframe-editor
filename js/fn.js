/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/
$.pxNum = function(x){
	if (x!==0) return parseInt(x.replace(/[^-\d\.]/g, ''));
	return 0;
};
$.calculateOffset = function(s,pl,nl){
	// create an array where you will shove in all the parents to iterate after
	var oa = [];
	var walk = function(o,level){
		for (var i=0;i<o.length;i++){
			var so = o[i];
			if (so===pl) {
				//this is the object, sum the ofset
				oa[level] = so;
				return true;
			}
			if (so.children.length){
				oa[level] = so;
				walk(so.children,level + 1);
			}
		}
		return false;
	};
	walk(s.tree.root.children, 0);
	var ol = 0, ot = 0;
	for (i=0;i<oa.length;i++){
		//ol += $.pxNum(oa[i].style.left) + $.pxNum(oa[i].style['border-width']);
        ol += oa[i].style.lPx + oa[i].style.bwPx;
		//ot += $.pxNum(oa[i].style.top) + $.pxNum(oa[i].style['border-width']);
        ot += oa[i].style.tPx + oa[i].style.bwPx;
	}
	//console.log(oa);
	//var nll = $.pxNum(nl.left);
	//var nlt = $.pxNum(nl.top);
    var
        nll = nl.lPx,
        nlt = nl.tPx,
        lVal = (nll-ol),
        tVal = (nlt-ot)
    ;
	return {
		left: lVal + 'px',
        lPx: lVal,
		top: tVal + 'px',
        tPx: tVal
	};
};
config.fn = {
    fireModal:function(scope,$compile){
        var
            body = $('body'),
            html = '<div class="modal-backdrop" modal>{{data.modal.content}}</div>',
            elem = $compile(html)(scope)
        ;
        body.append(elem);
    },
    killModal:function(){
        angular.element(document.querySelector('.modal-backdrop')).remove();
    },
    setTool:function(scope, t, attrs,$compile){
        t.on('click',function(){
            scope.data.fn.initTool(scope, attrs, $compile);
        });
        if(attrs.isDefault=='true'){
            scope.data.fn.initTool(scope, attrs, $compile);
        }
    },
    initTool:function(scope,attrs,$compile){
        var ts = scope.data.tools;
        ts[scope.data.tool].destroy(scope);
        ts[scope.data.tool].isActive = false;
        $('#canvas').removeClass(scope.data.tool);
        scope.data.tool = attrs.setTool;
        ts[scope.data.tool].init($compile, scope);
        ts[scope.data.tool].isActive = true;
        scope.data.toolActions.actions = ts[scope.data.tool].toolActions;
        $('#canvas').addClass(scope.data.tool);
    },
	tree:{
		/*getJson:function (args) {
			$scope.tree.json = angular.toJson($scope.data.tree.root);
		},*/
		removeSelected:function(obj,data){
			data.fn.tree.remove(data.fn.tree.returnSelected(obj.children), data);
		},
		remove:function (child, data) {
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
			walk(data.tree.root);

			// select something after deleting
			data.fn.tree.toggleSelected({
				child:(data.selection.prev?data.selection.prev:(data.selection.next?data.selection.next:(data.selection.parent?data.selection.parent:null))),
				data:data
			});

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
		addChild:function (child, data) {
			//$scope.tree.unSelect();
			child.children.push({
				id : data.fn.tree.newLayerName({pre:null,data:data}),
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
			data.fn.tree.toggleSelected({child:child.children[child.children.length-1],data:data});
		},
		selectParentLayer:function(where){
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
			return checkSelected(where);
		},
		searchElementById:function(id,where){
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
			return searchTree(where);
		},
		toggleSelected : function (args) {
			var
				child = args.child,
				data = args.data
			;
			if(child){
				data.fn.tree.unSelect(data);
				child.selected = true;
				data.fn.tree.logSelection({child:child, data:data});
			}
		},
		logSelection: function(args){
			var
				child = args.child,
				data = args.data,
				couldBe = null,
				checkSelected = function(so){
					for (var j=0;j<so.length; j++) {
						var io = so[j];
						if (io.type=="layer"){
							couldBe = io;
						}
						if (io.selected===true){
							return {
								active:io,
								next:((j+1)<so.length?so[j+1]:null),
								prev:((j-1)>-1?so[j-1]:null),
								parent:(io.type=="layer"?null:couldBe)
							};
						} else {
							if (io.children.length > 0) {
								var subs = checkSelected(io.children);
								if (subs){
									return subs;
								}
							}
						}
					}
					return false;
				}
			;
			data.selection = checkSelected(data.tree.root.children);
		},
		unSelect:function(data){
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
			walk(data.tree.root);
		},
		toggleMinimized:function (child) {
			child.minimized = !child.minimized;
		},
		newLayerName:function(args){
			var
				data = args.data,
				pre = ((typeof(args.pre)=='undefined'|| !args.pre)?data.lang[data.lang.act].layer:args.pre),
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
			//if (typeof(pre)=='undefined') pre = $scope.data.lang[$scope.data.lang.act].layer;
			while (i) {
				finalname = pre + '_' + i;
				if (!checkLayerName(finalname,data.tree.root.children)) return finalname;
				i++;
			}
		}
	}
};
