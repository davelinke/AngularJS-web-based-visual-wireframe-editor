/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/
config.fn = {
	calculateOffset:function(s,pl,nl){
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
	        ol += oa[i].styles.normal.lPx + oa[i].styles.normal.bwPx;
	        ot += oa[i].styles.normal.tPx + oa[i].styles.normal.bwPx;
		}
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
	},
	pxNum : function(x){
		if (x!==0) return parseInt(x.replace(/[^-\d\.]/g, ''));
		return 0;
	},
	findControllerScope:function(s){
		if (s.$parent.$parent===null){
			return s;
		} else {
			 return findControllerScope(s.$parent);
		}
	},
	modifiers:{
		modifyElementAreaWithKeystroke:function(scope,attribute,value){
			if ((scope.data.selection.active.typeNum==2)&&($("[area-key-increment]:focus,[x-key-increment]:focus").length===0)){
				scope.data.fn.modifiers.modifyElementArea(scope,attribute,value);
			}
		},
		modifyElementArea:function(scope,attribute,value){
			//console.log(scope,attribute,value);
			var
				canvasOverflow = scope.data.screen.overflow,
				nuVal = scope.data.fn.modifiers.cssIncrement(scope.data.selection.active.styles.normal[attribute],value)
			;
			if(!canvasOverflow){
				switch (attribute) {
					case 'top':
						var maxTop = scope.data.screen.hPx-scope.data.selection.active.styles.normal.hPx;
						if(nuVal.unitLess < 0) nuVal = {val:'0px',unitLess:0};
						if(nuVal.unitLess > maxTop) nuVal = {val:maxTop+'px',unitLess:maxTop};
						break;
					case 'left':
						var maxLeft = scope.data.screen.wPx-scope.data.selection.active.styles.normal.wPx;
						if(nuVal.unitLess < 0)  nuVal = {val:'0px',unitLess:0};
						if(nuVal.unitLess > maxLeft) nuVal = {val:maxLeft+'px',unitLess:maxLeft};
						break;
					case 'height':
						var maxheight = scope.data.screen.hPx-scope.data.selection.active.styles.normal.tPx;
						if(nuVal.unitLess > maxheight) nuVal = {val:maxheight+'px',unitLess:maxheight};
						break;
					case 'width':
						var maxwidth = scope.data.screen.wPx-scope.data.selection.active.styles.normal.lPx;
						if(nuVal.unitLess > maxwidth) nuVal = {val:maxwidth+'px',unitLess:maxwidth};
						break;
					default:
						//nazzin
				}
			}
			scope.data.selection.active.styles.normal[attribute] = nuVal.val;
			if (typeof(scope.data.selection.active.styles.normal[attribute.substr(0,1)+'Px'])!='undefined') scope.data.selection.active.styles.normal[attribute.substr(0,1)+'Px'] = nuVal.unitLess;
			scope.$apply();
		},
		cssIncrement:function(val,add){
			if (!val) val='0px';
			var numVal = parseInt(val.replace(/[^-\d\.]/g, ''));
			var nuVal = numVal + add;
			var unit = val.replace(numVal, '');
			return {
				val:nuVal + (unit===''?'px':unit),
				unitLess:nuVal
			};
		},
		setStyle:function(element,state,style,value){
			if (typeof(element[state])=='undefined'){
				element.styles[state]={};
			}
			element.styles[state][style] = value;
		},
		getStyle:function(element,state,style,value){
			if (typeof(element.styles[state])=='undefined'){
				element.styles[state]={};
			}
			if (typeof(element.styles[state][style])=='undefined'){
				element.styles[state][style]='';
			}
			return element.styles[state][style];
		}
	},
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
        //$('#canvas').removeClass(scope.data.tool);
        scope.data.tool = attrs.setTool;
        ts[scope.data.tool].init($compile, scope);
        ts[scope.data.tool].isActive = true;
        //$('#canvas').addClass(scope.data.tool);
		//safe apply
		if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') scope.$apply();
    },
	varHider:function(value){
		console.log(value);
		value = false;
	},
	tree:{
		reset : function(data){
			data.tree.root = angular.merge({},data.baseObject);
		},
		set:function(data,value){
			data = angular.merge({},value);
		},
		removeSelected:function(obj,data){
			data.fn.tree.remove(data.fn.tree.returnSelected(obj.children), data);
		},
		remove:function (child, data) {
			// set the undo here
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
			// set an undo here
			child.children.push({
				id : data.fn.tree.newLayerName({pre:null,data:data}),
				children : [],
				selected:false,
				styles:{
					normal:{
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
					}
				},
				type:(child.type=='root'?'layer':'element'),
				typeNum:(child.typeNum===0?1:2)
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
	},
	storage:{
		getEverything:function(){
			return window.localStorage;
		},
		filterData:function(data,type){
			var returnArray = [];
			for (var key in data){
				if (key.indexOf('pinocchio_'+type+'__')===0){
					returnArray.push(angular.fromJson(data[key]));
				}
			}
			return returnArray;
		},
		getDocuments:function(){
			return config.fn.storage.filterData(config.fn.storage.getEverything(),'document');
		},
		getDocumentNames:function(){
			var documents = config.fn.storage.getDocuments();
			var returnArray = [];
			for (var i = 0; i< documents.length;i++){
				returnArray.push({
					id:documents[i].tree.root.id,
					name:documents[i].tree.root.name
				});
			}
			return returnArray;
		},
		checkName:function(name){
			var documents = config.fn.storage.getDocuments();
			console.log(documents);
			for (var i = 0; i< documents.length;i++){
				if(documents[i].tree.root.name==name) return true;
			}
			return false;
		},
		sanitizeName:function(string){
			return string.toLowerCase().replace(/\s/g, "_");
		},
		saveDocument:function(scope){
			config.fn.storage.storeDocument(scope);
		},
		storeDocument:function(scope){
			var docName = scope.data.tree.root.name;
			var storeObject = {
				screen:angular.merge({},scope.data.screen),
				tree:angular.merge({},scope.data.tree)
			};
			var obJson = angular.toJson(storeObject);
			config.fn.storage.store('document',obJson, config.fn.storage.sanitizeName(docName));
		},
		retrieveDocument:function(id){
			console.log(id);
			return localStorage[id];
		},
		getDocumentObjectById:function(id){
			console.log(id);
			return angular.fromJson(config.fn.storage.retrieveDocument('pinocchio_'+id));
		},
		store:function(type,data,name){
			localStorage.setItem('pinocchio_'+type+'__'+name, data);
		}
	}
};
