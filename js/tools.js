/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/


config.tools={
	addGuide:{
		id:'addGuide',
		isDefault:false,
		isActive:false,
		launcher:'menu_view',
		horizontal:{
			mousedown:function(a){
				a.scope.data.tools.addGuide.isActive = 'horizontal';
				console.log('hor md');
			},
			mouseup:function(a){
				console.log('hor mu');
				var s = a.scope.data;
				s.tools.addGuide.isActive = false;

				var elementToFill = s.tree.getSelectedElement(s.tree.root.children);

			}
		},
		vertical:{
			mousedown:function(a){
				a.scope.data.tools.addGuide.isActive = 'vertical';
				console.log('ver md');
			},
			mouseup:function(a){
				a.scope.data.tools.addGuide.isActive = false;
				console.log('ver mu');
			}
		}
	},
	drawArea:{
		cursor:'crosshair',
		id:'drawArea',
		isDefault:false,
		isActive:false,
		launcher:'toolbar',
		label:'Draw Area',
		iconClass:'ci select',
		isMoving:false,
		optionsTemplate:''+
			'<div id="drawAreaOptions" class="options-panel form-inline">'+
			'<div class="form-group"><label for="drawAreaTop">Top</label>'+
			'<input class="form-control" type="text" aria-describedby="drawAreaTop" ng-model="data.tools.drawArea.config.areaStyle.top" x-key-increment /></div>'+
			'<div class="form-group"><label for="drawAreaHeight">Left</label>'+
			'<input class="form-control" type="text" aria-describedby="drawAreaLeft" ng-model="data.tools.drawArea.config.areaStyle.left" x-key-increment /></div>'+
			'<div class="form-group"><label for="drawAreaWidth">Width</label>'+
			'<input class="form-control" type="text" aria-describedby="drawAreaWidth" ng-model="data.tools.drawArea.config.areaStyle.width" x-key-increment /></div>'+
			'<div class="form-group"><label for="drawAreaHeight">Height</label>'+
			'<input class="form-control" type="text" aria-describedby="drawAreaHeight" ng-model="data.tools.drawArea.config.areaStyle.height" x-key-increment /></div>'+
			'</div>',
		element:null,
		baseConfig:{
			leftPx:0,
			topPx:0,
			areaClass:'draw-area',
			areaStyle:{
				left:'0',
				top:'0',
				width:'0',
				height:'0'
			}
		},
		config:null,
		init:function($compile,scope){
			scope.data.tools.drawArea.config = $.extend({},config.tools.drawArea.baseConfig);
			var
				$screen = $('#canvas'),
				html = '<div id="drawAreaBox" ng-class="data.tools.drawArea.config.areaClass" ng-style="data.tools.drawArea.config.areaStyle"></div>',
				elem = $compile(html)(scope),
				$options = $('#toolOptions'),
				sElem = $compile(scope.data.tools.drawArea.optionsTemplate)(scope)
			;
			$screen.append(elem);
			$options.append(sElem);
			scope.data.tools.drawArea.element = elem;
			scope.data.tools.drawArea.optionsMenu = sElem;
		},
		destroy:function(scope){
			scope.data.tools.drawArea.config = $.extend({},config.tools.drawArea.baseConfig);
			var da = scope.data.tools.drawArea;
			if (da.element){
				da.element.remove();
				da.optionsMenu.remove();
			}

		},
		setUndo:function(args){
			//console.log('setting undo');
		},
		mousedown:function(args){
			args.scope.$apply(function(){
				var s = args.scope.data;
				var dac = s.tools.drawArea.config;
				var e = args.event;
				var canvas = $('#canvas');
				if(e.target==canvas[0]){
					dac.initPos = {
						lPx:e.offsetX,
						tPx:e.offsetY
					};
					dac.areaStyle = {
						left:e.offsetX + 'px',
						lPx:e.offsetX,
						top:e.offsetY + 'px',
						tPx:e.offsetY,
						width: 0,
						wPx:0,
						height: 0,
						hPx:0
					};
				} else if (e.target.id=='workarea') {
					var o = canvas.offset();
					var x = e.pageX - o.left;
					var y = e.pageY - o.top;
					var dw = s.screen.wPx; //$.pxNum(s.screen.width);
					var dh = s.screen.hPx; //$.pxNum(s.screen.height);
					var xVal = (x>0?x:0);
					xVal = Math.floor(xVal>dw?dw:xVal);
					var yVal = y>0?y:0;
					yVal = Math.floor(yVal>dh?dh:yVal);
					dac.initPos = {
						lPx:xVal,
						tPx:yVal
					};
					dac.areaStyle = {
						left:xVal + 'px',
						lPx:xVal,
						top:yVal + 'px',
						tPx:yVal,
						width: 0,
						wPx:0,
						height: 0,
						hPx:0
					};
				} else if (e.target.id=='drawAreaBox') {
					s.tools.drawArea.isMoving = true;
				}
			});
		},
		mouseup:function(args){
			args.scope.data.tools.drawArea.isMoving = false;
			args.scope.data.tools.drawArea.finishSelect(args);
		},
		mouseleave:function(args){
		},
		finishSelect:function(args){
			// this fixes the issue of releasing the button outside the area and entering back without a mouseup event that wasn't tracked
			var e = args.event;
			var s = args.scope.data;
			var d = s.tools.drawArea;
			if (!d.isMoving && e.buttons!=1){
				d.config.leftPx = d.config.areaStyle.lPx; //$.pxNum(d.config.areaStyle.left);
				d.config.topPx = d.config.areaStyle.tPx; //$.pxNum(d.config.areaStyle.top);
			}

		},
		mouseenter:function(args){
			args.scope.data.tools.drawArea.finishSelect(args);
		},
		mousemove:function(e,scope){
			var canvas = $('#canvas');
			if (e.buttons==1){
				scope.$apply(function(){
					var s = scope.data;
					var c = s.tools.drawArea.config;
					console.log(scope.data.tools.drawArea.isMoving);
					if(!scope.data.tools.drawArea.isMoving){
						var
							o = canvas.offset(),
							x = e.pageX - o.left,
							y = e.pageY - o.top,
							dw = s.screen.wPx, //$.pxNum(s.screen.width),
							dh = s.screen.hPx, //$.pxNum(s.screen.height),
							xVal = (x>0?x:0),
							yVal = y>0?y:0
						;
						xVal = Math.floor(xVal>dw?dw:xVal);
						yVal = Math.floor(yVal>dh?dh:yVal);

						var
							leftVal = ((c.areaStyle.lPx < xVal)?c.areaStyle.lPx:xVal),
							topVal = ((c.areaStyle.tPx < yVal)?c.areaStyle.tPx:yVal),
							widthVal = ((c.areaStyle.lPx < xVal)?(xVal-c.areaStyle.lPx):(c.initPos.lPx-xVal)),
							heightVal = ((c.areaStyle.tPx < yVal)?(yVal-c.areaStyle.tPx):(c.initPos.tPx-yVal))
						;

						c.areaStyle = {
							lPx:leftVal,
							left: leftVal + 'px',
							tPx: topVal,
							top: topVal + 'px',
							wPx: widthVal,
							width: widthVal + 'px',
							hPx: heightVal,
							height: heightVal + 'px'
						};
					} else {
						var
							nuX = c.areaStyle.lPx + e.originalEvent.movementX,
							nuY = c.areaStyle.tPx + e.originalEvent.movementY,
							docWidth = s.screen.wPx,
							docHeight = s.screen.hPx
						;
						nuX = nuX>=0 ? nuX: 0; // less than 0 is not possible
						nuY = nuY>=0 ? nuY: 0; // less than 0 is not possible

						nuX = (nuX + c.areaStyle.wPx > docWidth ? c.areaStyle.lPx : nuX);
						nuY = (nuY + c.areaStyle.hPx > docHeight ? c.areaStyle.tPx : nuY);

						c.areaStyle.lPx = nuX;
						c.areaStyle.left = nuX + 'px';
						c.areaStyle.tPx = nuY;
						c.areaStyle.top = nuY + 'px';
					}
				});
			}
		}
	},
	crop:{
		isDefault:false,
		isActive:false,
		id:'crop',
		launcher:'menu_view',
		label:'Crop',
		iconClass:'fa fa-crop',
		init:function(){
			console.log('crop init');
		},
		destroy:function(){
			console.log('crop destroy');
		},
		mousedown:function(e){},
		mouseup:function(e){},
		mousemove:function(e){}
	},
	drawBox:{
		cursor:'crosshair',
		id:'drawBox',
		isDefault:true,
		isActive:false,
		launcher:'toolbar',
		label:'Draw Box',
		iconClass:'fa fa-square-o',
		isMoving:false,
		isDrawing:false,
		optionsTemplate:''+
			'<div id="drawBoxOptions" class="options-panel form-inline">'+
			'<div class="separator-v margin-right"></div>'+
			'<div class="form-group"><label for="canvasOverflow">Canvas overflow</label>'+
			'<input  type="checkbox" class="margin-no" ng-model="data.screen.overflow" /></div>'+
			'</div>',
		element:null,
		config:null,
		resetConfig:function(scope){
			scope.data.tools.drawBox.config = {
				areaClass:'draw-box',
				areaStyle:$.extend({
					left:'-10000px',
					top:'-10000px',
					width:'0',
					height:'0',
					lPx: -10000,
					tPx: -10000,
					wPx: 0,
					hPx: 0
				},scope.data.drawStyle)
			};
		},
		init:function($compile,scope){
			scope.data.tools.drawBox.resetConfig(scope);
			var
				html = '<div id="drawBoxBox" ng-class="data.tools.drawBox.config.areaClass" ng-style="data.tools.drawBox.config.areaStyle"></div>',
				elem = $compile(html)(scope),
				sElem = $compile(scope.data.tools.drawBox.optionsTemplate)(scope)
			;
			$('#canvas').append(elem);
			$('#toolOptions').append(sElem);
			scope.data.tools.drawBox.element = elem;
			scope.data.tools.drawBox.optionsMenu = sElem;
		},
		destroy:function(scope){
			var da = scope.data.tools.drawBox;
			da.resetConfig(scope);
			if (da.element){
				da.element.remove();
				da.optionsMenu.remove();
			}

		},
		setUndo:function(args){
			//console.log('setting undo');
		},
		mousedown:function(args){
			args.scope.data.tools.drawBox.resetConfig(args.scope);
			var
				s = args.scope.data,
				dac = s.tools.drawBox.config,
				e = args.event,
				canvas = $('#canvas')
			;
			args.scope.$apply(function(){
				if(e.target==canvas[0]){
					dac.areaStyle.left = e.offsetX + 'px';
					dac.areaStyle.lPx = e.offsetX;
					dac.areaStyle.top = e.offsetY + 'px';
					dac.areaStyle.tPx = e.offsetY;
					dac.initPos = {
						lPx: e.offsetX,
						tPx: e.offsetY
					};
					dac.areaStyle.width = 0;
					dac.areaStyle.wPx = 0;
					dac.areaStyle.height = 0;
					dac.areaStyle.hPx = 0;
					s.tools.drawBox.isDrawing = true;
				} else if (e.target.id=='workarea') {
					var o = canvas.offset();
					var x = e.pageX - o.left;
					var y = e.pageY - o.top;
					console.log(x);
					var dw = s.screen.wPx;
					var dh = s.screen.hPx;
					var xVal = (s.screen.overflow?x:(x>0?x:0));
					xVal = Math.floor(xVal>dw?dw:xVal);
					var yVal = (s.screen.overflow?y:(y>0?y:0));
					yVal = Math.floor(yVal>dh?dh:yVal);
					dac.areaStyle.left = xVal + 'px';
					dac.areaStyle.lPx = xVal;
					dac.areaStyle.top = yVal + 'px';
					dac.areaStyle.tPx = yVal;
					dac.initPos = {
						lPx: xVal,
						tPx: yVal
					};
					dac.areaStyle.width = 0;
					dac.areaStyle.wPx = 0;
					dac.areaStyle.height = 0;
					dac.areaStyle.hPx = 0;
					s.tools.drawBox.isDrawing = true;
				} else if (e.target.id=='drawBoxBox') {
					s.tools.drawBox.isMoving = true;
				}
			});
		},
		mouseup:function(args){
			args.scope.data.tools.drawBox.isMoving = false;
			args.scope.data.tools.drawBox.finishSelect(args);
		},
		mouseleave:function(args){
		},
		finishSelect:function(args){
			// this fixes the issue of releasing the button outside the area and entering back without a mouseup event that wasn't tracked
			var
				e = args.event,
				s = args.scope.data,
				d = s.tools.drawBox
			;
			if (!d.isMoving && e.buttons!=1){
				//d.config.leftPx = d.config.areaStyle.lPx; //$.pxNum(d.config.areaStyle.left);
				//d.config.topPx = d.config.areaStyle.tPx; //$.pxNum(d.config.areaStyle.top);
				if(d.isDrawing){
					// go draw the box
					if ((d.config.areaStyle.wPx >0)&&(d.config.areaStyle.hPx >0)){
						var selectedLayer = args.scope.data.fn.tree.returnSelected(s.tree.root.children);
						if(!s.config.allowNestedElements){
							selectedLayer = (selectedLayer.type=='layer'?selectedLayer:args.scope.data.fn.tree.selectParentLayer(args.scope.data.tree.root.children));
							args.scope.data.fn.tree.toggleSelected({child:selectedLayer, data:args.scope.data});
						}
						var
							//determine the position relative to the parent
							plTop = selectedLayer.style.tPx; //$.pxNum(selectedLayer.style.top),
							plLeft = selectedLayer.style.lPx; //$.pxNum(selectedLayer.style.left),
							nlTop = d.config.areaStyle.tPx; //$.pxNum(d.config.areaStyle.top),
							nlLeft = d.config.areaStyle.lPx; //$.pxNum(d.config.areaStyle.left),
							nlOffset = $.calculateOffset(s,selectedLayer,d.config.areaStyle)
						;
						selectedLayer.children.push({
							id:s.fn.tree.newLayerName({pre:args.scope.data.lang[args.scope.data.lang.act].element,data:args.scope.data}),
							type:'element',
							children:[],
							style:$.extend({
								position:'absolute',
								left:nlOffset.left,
								lPx:nlOffset.lPx,
								top:nlOffset.top,
								tPx:nlOffset.tPx,
								width: d.config.areaStyle.width,
								wPx:d.config.areaStyle.wPx,
								height: d.config.areaStyle.height,
								hPx:d.config.areaStyle.hPx
							},s.drawStyle)
						});
					}

					d.isDrawing = false;
					d.resetConfig(args.scope);
				}
			}
		},
		mouseenter:function(args){
			args.scope.data.tools.drawBox.finishSelect(args);
		},
		mousemove:function(e,scope){
			if (e.buttons==1){
				var
					canvas = $('#canvas'),
					s = scope.data,
					c = s.tools.drawBox.config,
					o = canvas.offset(),
					x = e.pageX - o.left,
					y = e.pageY - o.top,
					dw = s.screen.wPx,
					dh = s.screen.hPx,
					xVal = (s.screen.overflow?x:(x>0?x:0)),
					yVal = (s.screen.overflow?y:(y>0?y:0))
				;
				xVal = Math.floor(s.screen.overflow?xVal:(xVal>dw?dw:xVal));
				yVal = Math.floor(s.screen.overflow?yVal:(yVal>dh?dh:yVal));
				var
					leftVal = ((c.areaStyle.lPx < xVal)?c.areaStyle.lPx:xVal),
					topVal = ((c.areaStyle.tPx < yVal)?c.areaStyle.tPx:yVal),
					widthVal = Math.floor((c.areaStyle.lPx < xVal)?(xVal-c.areaStyle.lPx):(c.initPos.lPx-xVal)),
					heightVal = Math.floor((c.areaStyle.tPx < yVal)?(yVal-c.areaStyle.tPx):(c.initPos.tPx-yVal))
				;
				scope.$apply(function(){
					c.areaStyle.lPx = leftVal;
					c.areaStyle.left = leftVal + 'px';
					c.areaStyle.tPx = topVal;
					c.areaStyle.top = topVal + 'px';
					c.areaStyle.wPx = widthVal;
					c.areaStyle.width = widthVal + 'px';
					c.areaStyle.hPx = heightVal;
					c.areaStyle.height = heightVal + 'px';
				});
			}
		}
	},
	selection:{
	    cursor:'pointer',
	    id:'selection',
	    isDefault:false,
	    isActive:false,
	    launcher:'toolbar',
	    label:'Select Element',
	    iconClass:'fa fa-mouse-pointer',
		optionsTemplate:''+
		    '<div id="selectionOptions" class="options-panel form-inline">'+
		    '<div class="form-group"><label for="selectionTop">Top</label>'+
		    '<input class="form-control" type="text" id="selectionTop" ng-model="data.tools.selection.element.style.top" x-key-increment /></div>'+
		    '<div class="form-group"><label for="selectionHeight">Left</label>'+
		    '<input class="form-control" type="text" id="selectionLeft" ng-model="data.tools.selection.element.style.left" x-key-increment /></div>'+
		    '<div class="form-group"><label for="selectionWidth">Width</label>'+
		    '<input class="form-control" type="text" id="selectionWidth" ng-model="data.tools.selection.element.style.width" x-key-increment /></div>'+
		    '<div class="form-group"><label for="selectionHeight">Height</label>'+
		    '<input class="form-control" type="text" id="selectionHeight" ng-model="data.tools.selection.element.style.height" x-key-increment /></div>'+
			'<div class="separator-v margin-right"></div>'+
			'<div class="form-group"><label for="canvasOverflow">Canvas overflow</label>'+
			'<input  type="checkbox" class="margin-no" ng-model="data.screen.overflow" /></div>' +
			'</div>',
	    element:null,
	    init:function($compile,scope){
			$('#canvas,#guides').hide();
			var sElem = $compile(scope.data.tools.selection.optionsTemplate)(scope);
			$('#toolOptions').append(sElem);
	    },
	    destroy:function(scope){
			$('#canvas,#guides').show();
			$('#toolOptions').empty();
	    },
	    setUndo:function(args){

	    },
	    mousedown:function(args){
			var
				s = args.scope,
				e = args.event,
				c = args.compile,
				t = s.data.tools.selection
			;
			t.element = s.data.fn.tree.searchElementById($(e.target).attr('ob-id'), s.data.tree.root.children);
			t.initPos = {
				lPx:e.offsetX,
				tPx:e.offsetY
			};
			if (!t.element) {
				var selectedLayer = s.data.fn.tree.selectParentLayer(s.data.tree.root.children);
				s.data.fn.tree.toggleSelected({child:selectedLayer,data:s.data});
			} else {
				s.data.fn.tree.toggleSelected({child:t.element,data:s.data});
			}
	    },
	    mouseup:function(args){

	    },
	    mouseleave:function(args){

	    },
	    finishSelect:function(args){

	    },
	    mouseenter:function(args){

	    },
	    mousemove:function(e,scope){
			var s = scope.data;
			var c = s.tools.selection.element;
			if ((c) && (c.type=="element") && (e.buttons==1)){
				var
					leftPx = c.style.lPx,
					topPx = c.style.tPx,
					nuX = leftPx + e.originalEvent.movementX,
					nuY = topPx + e.originalEvent.movementY,
					docWidth = s.screen.wPx,
					docHeight = s.screen.hPx
				;

				if(!s.screen.overflow){
					nuX = nuX>=0 ? nuX: 0; // less than 0 is not possible
					nuY = nuY>=0 ? nuY: 0; // less than 0 is not possible
					nuX = (nuX + c.style.wPx > docWidth ? leftPx : nuX);
					nuY = (nuY + c.style.hPx > docHeight ? topPx : nuY);
				}

				c.style.left = nuX + 'px';
				c.style.lPx = nuX;
				c.style.top = nuY + 'px';
				c.style.tPx = nuY;
			}
	    }
	}
};
