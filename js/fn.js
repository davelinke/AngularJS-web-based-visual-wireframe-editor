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
	        ol += oa[i].styles[s.flags.screenState][s.flags.elementState].lPx + oa[i].styles[s.flags.screenState][s.flags.elementState].bwPx;
	        ot += oa[i].styles[s.flags.screenState][s.flags.elementState].tPx + oa[i].styles[s.flags.screenState][s.flags.elementState].bwPx;
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
			 return config.fn.findControllerScope(s.$parent);
		}
	},
	modifiers:{
		modifyElementAreaWithKeystroke:function(scope,attribute,value){
			if ((scope.data.selection.active.typeNum==2)&&($("[area-key-increment]:focus,[x-key-increment]:focus").length===0)){
				scope.data.fn.modifiers.modifyElementArea(scope,attribute,value);
			}
		},
		setElementArea:function(scope,attribute,abs){
			if (typeof(abs)=='undefined') abs = false;
			var
				canvasOverflow = scope.data.screen.overflow,
				es = scope.data.flags.elementState,
				ss = scope.data.flags.screenState,
				sel = scope.data.tools.selection,
				element = sel.element,
				eInitPos = sel.eInitPos,
				nuVal,
				pxAttr,
				delta,
				maxDelta
			;


			switch (attribute) {
				case 'top':
					delta = (abs===true?scope.data.mouse.dragDelta.y*-1:scope.data.mouse.dragDelta.y);
					nuVal = (eInitPos.tPx + delta);
					pxAttr = 'tPx';
					if(!canvasOverflow){
						var maxTop = scope.data.screen.hPx-element.styles[ss][es].hPx;
						if(nuVal < 0) nuVal = 0;
						if(nuVal > maxTop) nuVal = maxTop;
					}
					break;
				case 'left':
					delta = (abs===true?scope.data.mouse.dragDelta.x*-1:scope.data.mouse.dragDelta.x);
					nuVal = (eInitPos.lPx + delta);
					pxAttr = 'lPx';
					if(!canvasOverflow){
						var maxLeft = scope.data.screen.wPx - element.styles[ss][es].wPx;
						if(nuVal < 0)  nuVal = 0;
						if(nuVal > maxLeft) nuVal = maxLeft;
					}
					break;
				case 'height':
					delta = scope.data.mouse.dragDelta.y;
					if (abs) {
						minDelta = eInitPos.tPx;
						delta = delta*-1;
					}
					pxAttr = 'hPx';
					nuVal = (eInitPos.hPx + delta);
					if(!canvasOverflow){
						var tVal = element.styles[ss][es].tPx;
						if (abs===true && delta>minDelta) {
							nuVal = element.styles[ss][es].hPx;
						} else {
							var maxheight = scope.data.screen.hPx - tVal;
							if(nuVal > maxheight) nuVal = maxheight;
						}
					}
					break;
				case 'width':
					delta = scope.data.mouse.dragDelta.x;
					if (abs) {
						minDelta = eInitPos.lPx;
						delta = delta*-1;
					}
					pxAttr = 'wPx';
					nuVal = (eInitPos.wPx + delta);
					if(!canvasOverflow){
						var lVal = element.styles[ss][es].lPx;
						if (abs===true && delta>minDelta){
							nuVal = element.styles[ss][es].wPx;
						} else {
							var maxwidth = scope.data.screen.wPx-lVal;
							if(nuVal > maxwidth) nuVal = maxwidth;
						}
					}
					break;
				default:
			}
			element.styles[ss][es][pxAttr] = nuVal;
			element.styles[ss][es][attribute] = nuVal + 'px';

			if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') scope.$apply();
		},
		modifyElementArea:function(scope,attribute,value,element){
			//console.log(scope,attribute,value);
			if (typeof(element)=='undefined') element = scope.data.selection.active;
			var
				canvasOverflow = scope.data.screen.overflow,
				es = scope.data.flags.elementState,
				ss = scope.data.flags.screenState,
				nuVal = scope.data.fn.modifiers.cssIncrement(element.styles[ss][es][attribute],value)
			;
			if(!canvasOverflow){
				switch (attribute) {
					case 'top':
						var maxTop = scope.data.screen.hPx-element.styles[ss][es].hPx;
						if(nuVal.unitLess < 0) nuVal = {val:'0px',unitLess:0};
						if(nuVal.unitLess > maxTop) nuVal = {val:maxTop+'px',unitLess:maxTop};
						break;
					case 'left':
						var maxLeft = scope.data.screen.wPx-element.styles[ss][es].wPx;
						if(nuVal.unitLess < 0)  nuVal = {val:'0px',unitLess:0};
						if(nuVal.unitLess > maxLeft) nuVal = {val:maxLeft+'px',unitLess:maxLeft};
						break;
					case 'height':
						var maxheight = scope.data.screen.hPx-element.styles[ss][es].tPx;
						if(nuVal.unitLess > maxheight) nuVal = {val:maxheight+'px',unitLess:maxheight};
						break;
					case 'width':
						var maxwidth = scope.data.screen.wPx-element.styles[ss][es].lPx;
						if(nuVal.unitLess > maxwidth) nuVal = {val:maxwidth+'px',unitLess:maxwidth};
						break;
					default:
						//nazzin
				}
			}
			element.styles[ss][es][attribute] = nuVal.val;
			if (typeof(element.styles[ss][es][attribute.substr(0,1)+'Px'])!='undefined') element.styles[ss][es][attribute.substr(0,1)+'Px'] = nuVal.unitLess;
			if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') scope.$apply();
		},
		movementDelta:function(initVal,currentVal){
			return {
				xPx: (initVal.lPx - currentVal.lPx),
				yPx: (initVal.tPx -currentVal.tPx)
			};
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
		setStyle:function(element,ss,state,style,value){
			if (typeof(element[ss][state])=='undefined'){
				element.styles[ss][state]={};
			}
			element.styles[ss][state][style] = value;
		},
		getStyle:function(element,ss,state,style,cloneNormal){
			if (typeof(cloneNormal)=='undefined') cloneNormal = false;
			if (typeof(element.styles[ss][state])=='undefined'){
				element.styles[ss][state]={};
			}
			if (typeof(element.styles[ss][state][style])=='undefined'){
				element.styles[ss][state][style]=(cloneNormal?element.styles.base.normal[style]:'');
			}
			return element.styles[ss][state][style];
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
		try{
			//safe apply
			if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') scope.$apply();
		} catch(err){}
    },
	varHider:function(value){
		console.log(value);
		value = false;
	},
	tree:{
		dragLeave:function(e,scope,t,attrs){
			e.preventDefault();
			t.removeClass('drag-over');
		},
		dragOver:function(e,scope,t,attrs){
			e.preventDefault();
			t.addClass('drag-over');
		},
		dropLayer:function(e,scope,t,attrs){
			var cs = config.fn.findControllerScope(scope);
			var pa = cs.data.tree.root;
			var lPos =  pa.children.indexOf(scope.child);
			var insertion = $.extend(true,{},cs.data.uhaul);
			pa.children.splice(pa.children.indexOf(cs.data.uhaul),1);
			pa.children.splice(lPos, 0, insertion);

			cs.data.flags.dragType = null;
			//safe apply
			if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') scope.$apply();
		},
		drop:function(e,scope,t,attrs){
			var cs = config.fn.findControllerScope(scope);
			var pa = cs.data.fn.tree.selectParentLayer(cs.data.tree.root.children, scope.child);
			var paPos = pa.children.indexOf(scope.child);
			var insertion = $.extend(true,{},cs.data.uhaul);
			var spa = cs.data.fn.tree.selectParentLayer(cs.data.tree.root.children, cs.data.uhaul);
			spa.children.splice(spa.children.indexOf(cs.data.uhaul),1);
			pa.children.splice(paPos, 0, insertion);
			cs.data.flags.dragType = null;
			//safe apply
			if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') scope.$apply();
		},
		startDrag:function(e,scope,t,attrs){
			var cs = config.fn.findControllerScope(scope);
			cs.data.flags.dragType = scope.dataElement.typeNum;
			cs.data.uhaul = scope.dataElement;
			cs.data.fn.tree.toggleSelected({
				child:scope.dataElement,
				data:cs.data
			});
			//safe apply
			if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') scope.$apply();
		},
		duplicateActive: function(data){
			var
				child = data.selection.active,
				pastingLayer = ((child.typeNum==2)?data.fn.tree.selectParentLayer(data.tree.root.children):data.tree.root)
			;
			if (child){
				childCopy = $.extend(true,{},child);
				var fixCopy = function(zeCopy){
					var copyName = function(id){
						var copyArr = id.split('_copy_');
						copyNumber = parseInt(copyArr[copyArr.length-1]);
						copyNumber = (isNaN(copyNumber)?1:copyNumber+1);
						return copyArr[0] + '_copy_' + copyNumber;
					};
					zeCopy.id = copyName(zeCopy.id);
					zeCopy.selected = false;
					if(zeCopy.children.length > 0){
						for (var i=0;i<zeCopy.children.length;i++){
							fixCopy(zeCopy.children[i]);
						}
					}
				};
				fixCopy(childCopy);

				pastingLayer.children.push(childCopy);
				config.fn.tree.toggleSelected({
					child:pastingLayer.children[pastingLayer.children.length-1],
					data:data
				});
			}
		},
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
				locked:false,
				visible:true,
				styles:{
					base:{
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
							bwPx:0,
							opacity:1,
							'mix-blend-mode':'normal'
						}
					}
				},
				type:(child.type=='root'?'layer':'element'),
				typeNum:(child.typeNum===0?1:2)
			});
			data.fn.tree.toggleSelected({child:child.children[child.children.length-1],data:data});
		},
		selectParentLayer:function(where, element){
			var
				couldBe = null,
				checkSelected = function(so){
					for (var j=0;j<so.length; j++) {
						var io = so[j];
						if (io.type=="layer"){
							//console.log(io);
							couldBe = io;
						}
						if (typeof(element)=='undefined'){
							if (io.selected===true) return couldBe;
						} else {
							if (io===element) return couldBe;
						}
						if (io.children.length > 0) {
							if (checkSelected(io.children))  return couldBe;
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
			return localStorage[id];
		},
		getDocumentObjectById:function(id){
			return angular.fromJson(config.fn.storage.retrieveDocument('pinocchio_'+id));
		},
		store:function(type,data,name){
			localStorage.setItem('pinocchio_'+type+'__'+name, data);
		}
	},
	documents:{
		open:function($scope,docId,callback){
			if (docId){
				var documentData = $scope.data.fn.storage.getDocumentObjectById(docId);
				$scope.data.fn.tree.reset($scope.data);
				$scope.data.flags.storage.canOverwrite = true;

				$scope.data.screen = documentData.screen;
				$scope.data.tree = documentData.tree;
				$scope.data.fn.tree.toggleSelected({
					child:$scope.data.fn.tree.searchElementById('layer_1', $scope.data.tree.root.children),
					data:$scope.data
				});
				callback();
			}
		}
	}
};
