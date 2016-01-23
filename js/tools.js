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
		optionsTemplate:'',
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
			var
				d = scope.data,
				db = d.tools.drawBox
			;
			db.resetConfig(scope);
			var
				html = '<div id="drawBoxBox" ng-class="data.tools.drawBox.config.areaClass" ng-style="data.tools.drawBox.config.areaStyle"></div>',
				elem = $compile(html)(scope),
				sElem = $compile(db.optionsTemplate)(scope)
			;
			$('#canvas').append(elem);
			db.element = elem;
			db.optionsMenu = sElem;
			d.flags.elementState = 'normal';
			d.flags.screenState = 'base';
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
			args.scope.data.tools.drawBox.clickTouch(args);
		},
		touchstart:function(args){
			args.scope.data.tools.drawBox.clickTouch(args);
		},
		clickTouch:function(args){
			args.scope.data.tools.drawBox.resetConfig(args.scope);
			var
				s = args.scope.data,
				dac = s.tools.drawBox.config,
				e = args.event,
				canvas = $('#canvas'),
				lockedLayer = (s.selection.active.typeNum==2?s.fn.tree.selectParentLayer(s.tree.root.children):s.selection.active).locked
			;
			if(lockedLayer===false){
				args.scope.$apply(function(){
					if(e.target==canvas[0]){

						dac.areaStyle.left = s.mouse.offset.down.x + 'px';
						dac.areaStyle.lPx = s.mouse.offset.down.x;
						dac.areaStyle.top = s.mouse.offset.down.y + 'px';
						dac.areaStyle.tPx = s.mouse.offset.down.y;
						dac.initPos = {
							lPx: s.mouse.offset.down.x,
							tPx: s.mouse.offset.down.y
						};
						dac.areaStyle.width = 0;
						dac.areaStyle.wPx = 0;
						dac.areaStyle.height = 0;
						dac.areaStyle.hPx = 0;

						s.tools.drawBox.isDrawing = true;
					} else if (e.target.id=='workarea') {
						var
							o = canvas.offset(),
							x = s.mouse.down.x - o.left,
							y = s.mouse.down.y - o.top,
							dw = s.screen.wPx,
							dh = s.screen.hPx,
							xVal = (s.screen.overflow?x:(x>0?x:0)),
							yVal = (s.screen.overflow?y:(y>0?y:0))
						;
						if (!s.screen.overflow){
							xVal = Math.floor(xVal>dw?dw:xVal);
							yVal = Math.floor(yVal>dh?dh:yVal);
						}


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
			}
		},
		mouseup:function(args){
			args.scope.data.tools.drawBox.isMoving = false;
			args.scope.data.tools.drawBox.finishSelect(args);
		},
		touchend:function(args){
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
				d = s.tools.drawBox,
				downFlag = (s.flags.mouseEvent =='mousedown' || s.flags.mouseEvent=='touchstart')?true:false,
				lockedLayer = (s.selection.active.typeNum==2?s.fn.tree.selectParentLayer(s.tree.root.children):s.selection.active).locked
			;
			if (!d.isMoving && !downFlag && lockedLayer===false){
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
							//plTop = selectedLayer.styles.base.normal.tPx,
							//plLeft = selectedLayer.styles.base.normal.lPx,
							//nlTop = d.config.areaStyle.tPx,
							//nlLeft = d.config.areaStyle.lPx,
							nlOffset = s.fn.calculateOffset(s,selectedLayer,d.config.areaStyle)
						;
						selectedLayer.children.push({
							id:s.fn.tree.newLayerName({pre:args.scope.data.lang[args.scope.data.lang.act].element,data:args.scope.data}),
							type:'element',
							cursorClass:'',
							locked:false,
							visible:true,
							typeNum:2,
							children:[],
							styles:{
								base:{
									'normal':$.extend({
										position:'absolute',
										left:nlOffset.left,
										lPx:nlOffset.lPx,
										top:nlOffset.top,
										tPx:nlOffset.tPx,
										width: d.config.areaStyle.width,
										wPx:d.config.areaStyle.wPx,
										height: d.config.areaStyle.height,
										hPx:d.config.areaStyle.hPx,
										overflow:'hidden',
										'white-space':'pre-wrap',
										opacity:1,
										'mix-blend-mode':'normal'
									},s.drawStyle)
								}
							}
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
			scope.data.tools.drawBox.move(e,scope);
		},
		touchmove:function(e,scope){
			scope.data.tools.drawBox.move(e,scope);
		},
		move:function(e,scope){
			var
				downFlag = (scope.data.flags.mouseEvent =='mousedown' || scope.data.flags.mouseEvent=='touchstart')?true:false,
				lockedLayer = (scope.data.selection.active.typeNum==2?scope.data.fn.tree.selectParentLayer(scope.data.tree.root.children):scope.data.selection.active).locked
			;
			if (downFlag && lockedLayer===false){

				var
					canvas = $('#canvas'),
					s = scope.data,
					c = s.tools.drawBox.config,
					o = canvas.offset(),
					x = s.mouse.x - o.left,
					y = s.mouse.y - o.top,
					dw = s.screen.wPx,
					dh = s.screen.hPx,
					xVal = (s.screen.overflow?x:(x>0?x:0)),
					yVal = (s.screen.overflow?y:(y>0?y:0)),
					xDownPoint,
					yDownPont
				;

				xVal = Math.floor(s.screen.overflow?xVal:(xVal>dw?dw:xVal)); // if no screen overflow and with bigger than screen, then screen height
				yVal = Math.floor(s.screen.overflow?yVal:(yVal>dh?dh:yVal)); // if no screen overflow and height bigger than screen, then screen height
				var
					leftVal = ((c.initPos.lPx < xVal)?c.initPos.lPx:xVal),
					topVal = ((c.initPos.tPx < yVal)?c.initPos.tPx:yVal),
					widthVal = Math.floor((c.initPos.lPx < xVal)?(xVal-c.initPos.lPx):(c.initPos.lPx-xVal)),
					heightVal = Math.floor((c.initPos.tPx < yVal)?(yVal-c.initPos.tPx):(c.initPos.tPx-yVal))
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
	    cursor:'',
	    id:'selection',
	    isDefault:false,
	    isActive:false,
	    launcher:'toolbar',
	    label:'Select Element',
	    iconClass:'fa fa-mouse-pointer',
		optionsTemplate:'',
	    element:null,
	    init:function($compile,scope){
			$('#canvas,#guides').hide();
	    },
	    destroy:function(scope){
			$('#canvas,#guides').show();
	    },
	    setUndo:function(args){},
		down:function(args){
			var
				s = args.scope,
				e = args.event,
				c = args.compile,
				t = s.data.tools.selection,
				es = s.data.flags.elementState,
				ss = s.data.flags.screenState,
				gs = s.data.fn.modifiers.getStyle
			;
			t.element = s.data.fn.tree.searchElementById($(e.target).attr('ob-id'), s.data.tree.root.children);
			if (!t.element) {
				var selectedLayer = s.data.fn.tree.selectParentLayer(s.data.tree.root.children);
				s.data.fn.tree.toggleSelected({child:selectedLayer,data:s.data});
			} else {
				t.eInitPos = {
					lPx:gs(t.element,ss,es,'lPx',true),
					tPx:gs(t.element,ss,es,'tPx',true),
					wPx:gs(t.element,ss,es,'wPx',true),
					hPx:gs(t.element,ss,es,'hPx',true)
				};
				var lockedLayer = ((t.element.typeNum==2)&&(s.data.fn.tree.selectParentLayer(s.data.tree.root.children).locked)?true:false);
				if ((t.element.locked === false)&&(lockedLayer===false)){
					s.data.fn.tree.toggleSelected({child:t.element,data:s.data});
					s.data.flags.resizeLeft = (e.offsetX<5)?true:false;
					s.data.flags.resizeTop = (e.offsetY<5)?true:false;
					s.data.flags.resizeRight = (e.offsetX>(t.element.styles[ss][es].wPx - 5))?true:false;
					s.data.flags.resizeBottom = (e.offsetY>(t.element.styles[ss][es].hPx - 5))?true:false;
				}
			}
			s.$apply();
		},
	    mousedown:function(args){
			args.scope.data.tools.selection.down(args);
	    },
		touchstart:function(args){
			args.scope.data.tools.selection.down(args);
		},
	    mouseup:function(args){
			//safe apply
			if (args.scope.$root.$$phase != '$apply' && args.scope.$root.$$phase != '$digest') args.scope.$apply();
	    },
		touchend:function(){},
	    mouseleave:function(args){
			if(args.scope.data.tools.selection.element) args.scope.data.tools.selection.element.cursorClass = '';
	    },
	    finishSelect:function(args){},
	    mouseenter:function(args){},
		move:function(e,scope){
			var
				s = scope.data,
				f = s.flags,
				c = s.tools.selection.element,
				cursorClass = '',
				h={},
				downFlag = (s.flags.mouseEvent=='mousedown'||s.flags.mouseEvent=='touchstart')?true:false,
				t = s.tools.selection,
				state = s.flags.elementState,
				ss = s.flags.screenState,
				gs = s.fn.modifiers.getStyle,
				lockedLayer = (c?((c.typeNum==2)&&(s.fn.tree.selectParentLayer(s.tree.root.children).locked)?true:false):null)
			;
			// set adequate cursor
			if (c && c.typeNum==2 && !downFlag){
				if (e.offsetY<5) cursorClass +='n';
				if (e.offsetY>(gs(c,ss,state,'hPx',true) - 5)) cursorClass +='s';
				if (e.offsetX<5) cursorClass +='w';
				if (e.offsetX>(gs(c,ss,state,'wPx',true) - 5)) cursorClass +='e';
				c.cursorClass = cursorClass;
			}
			if (c && c.locked===false && lockedLayer===false){
				//resize or move
				if ((c.typeNum==2) && downFlag){
					var
						leftPx = gs(c,ss,state,'lPx',true),
						topPx = gs(c,ss,state,'tPx',true)
					;
					if(f.resizeLeft||f.resizeTop||f.resizeRight||f.resizeBottom){
						if (f.resizeLeft){
							s.fn.modifiers.setElementArea(scope,'left');
							s.fn.modifiers.setElementArea(scope,'width',true);
						}
						if (f.resizeTop){
							s.fn.modifiers.setElementArea(scope,'top');
							s.fn.modifiers.setElementArea(scope,'height',true);
						}
						if (f.resizeRight){
							s.fn.modifiers.setElementArea(scope,'width');
						}
						if (f.resizeBottom){
							s.fn.modifiers.setElementArea(scope,'height');
						}
					} else {
						s.fn.modifiers.setElementArea(scope,'left');
						s.fn.modifiers.setElementArea(scope,'top');
					}
				}
			}
		},
	    mousemove:function(e,scope){
			scope.data.tools.selection.move(e,scope);
	    },
	    touchmove:function(e,scope){
			scope.data.tools.selection.move(e,scope);
	    }
	},
	eyedropper:{
		cursor:'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmlld0JveD0iMCAwIDE2IDE2IgogICBoZWlnaHQ9IjE2IgogICB3aWR0aD0iMTYiCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgIGlkPSJzdmcyIgogICB2ZXJzaW9uPSIxLjEiPjxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTgiPjxyZGY6UkRGPjxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj48ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD48ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+PC9jYzpXb3JrPjwvcmRmOlJERj48L21ldGFkYXRhPjxkZWZzCiAgICAgaWQ9ImRlZnM2Ij48Y2xpcFBhdGgKICAgICAgIGlkPSJjbGlwUGF0aDE4IgogICAgICAgY2xpcFBhdGhVbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoCiAgICAgICAgIGlkPSJwYXRoMTYiCiAgICAgICAgIGQ9Ik0gMCwxMiBIIDEyIFYgMCBIIDAgWiIgLz48L2NsaXBQYXRoPjwvZGVmcz48ZwogICAgIHRyYW5zZm9ybT0ibWF0cml4KDEuMzMzMzMzMywwLDAsLTEuMzMzMzMzMywwLDE2KSIKICAgICBpZD0iZzEwIj48ZwogICAgICAgaWQ9ImcxMiI+PGcKICAgICAgICAgY2xpcC1wYXRoPSJ1cmwoI2NsaXBQYXRoMTgpIgogICAgICAgICBpZD0iZzE0Ij48ZwogICAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkuODUzNSwxMikiCiAgICAgICAgICAgaWQ9ImcyMCI+PHBhdGgKICAgICAgICAgICAgIGlkPSJwYXRoMjIiCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojMzczNTM1O2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lIgogICAgICAgICAgICAgZD0ibSAwLDAgYyAwLjU5MiwwIDEuMDk4LC0wLjIxIDEuNTE3LC0wLjYyOSAwLjQyLC0wLjQyIDAuNjI5LC0wLjkyNiAwLjYyOSwtMS41MTcgMCwtMC41OTIgLTAuMjA5LC0xLjA5NSAtMC42MjksLTEuNTEgTCAwLjAxMSwtNS4xNDkgMC43MDcsLTUuODQ2IEMgMC43NTIsLTUuODkxIDAuNzczLC01Ljk0MiAwLjc3MywtNiBjIDAsLTAuMDU4IC0wLjAyMSwtMC4xMDkgLTAuMDY2LC0wLjE1NCBsIC0xLjQwNiwtMS40MDcgYyAtMC4wNDUsLTAuMDQ0IC0wLjA5NiwtMC4wNjYgLTAuMTU1LC0wLjA2NiAtMC4wNTgsMCAtMC4xMDksMC4wMjIgLTAuMTU0LDAuMDY2IGwgLTAuNzAzLDAuNzA0IC00LjAzOCwtNC4wMzkgYyAtMC4xNjUsLTAuMTY0IC0wLjM2NiwtMC4yNDcgLTAuNjAzLC0wLjI0NyBIIC03LjcxMSBMIC05LjQyNSwtMTIgbCAtMC40MjksMC40MjkgMC44NTgsMS43MTQgdiAxLjM1OSBjIDAsMC4yMzYgMC4wODIsMC40MzggMC4yNDcsMC42MDIgbCA0LjAzOCw0LjAzOSAtMC43MDMsMC43MDMgQyAtNS40NTgsLTMuMTA5IC01LjQ4LC0zLjA1OSAtNS40OCwtMyBjIDAsMC4wNTkgMC4wMjIsMC4xMDkgMC4wNjYsMC4xNTQgbCAxLjQwNiwxLjQwNyBjIDAuMDQ1LDAuMDQ0IDAuMDk2LDAuMDY2IDAuMTU0LDAuMDY2IDAuMDU5LDAgMC4xMSwtMC4wMjIgMC4xNTUsLTAuMDY2IGwgMC42OTYsLTAuNjk4IDEuNDkzLDEuNTA4IEMgLTEuMDk1LC0wLjIxIC0wLjU5MiwwIDAsMCIgLz48L2c+PGcKICAgICAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzLjQyODcsMi4xNDI2KSIKICAgICAgICAgICBpZD0iZzI0Ij48cGF0aAogICAgICAgICAgICAgaWQ9InBhdGgyNiIKICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUiCiAgICAgICAgICAgICBkPSJNIDAsMCAzLjg1NywzLjg1NyAyLjU3MSw1LjE0MyAtMS4yODYsMS4yODYgViAwIFoiIC8+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==) 0 12, auto',
	    id:'eyedropper',
	    isDefault:false,
	    isActive:false,
	    launcher:'toolbar',
	    label:'Eyedropper',
	    iconClass:'fa fa-eyedropper',
		optionsTemplate:'',
	    element:null,
	    init:function($compile,scope){
			$('#canvas,#guides').hide();
	    },
	    destroy:function(scope){
			$('#canvas,#guides').show();
	    },
	    setUndo:function(args){

	    },
		down:function(args){
			var
				s = args.scope,
				e = args.event,
				c = args.compile,
				t = s.data.tools.eyedropper,
				es = s.data.flags.elementState,
				ss = s.data.flags.screenState
			;
			t.element = s.data.fn.tree.searchElementById($(e.target).attr('ob-id'), s.data.tree.root.children);

			if (t.element.typeNum==2) {
				var style = angular.extend({}, t.element.styles[ss][es]);
				delete style.hPx;
				delete style.height;
				delete style.lPx;
				delete style.left;
				delete style.position;
				delete style.tPx;
				delete style.top;
				delete style.wPx;
				delete style.width;
				console.log(style);
				if(s.data.selection.active.typeNum==2){
					s.data.selection.active.styles[ss][es] = angular.extend({},s.data.selection.active.styles[ss][es],style);
				} else {
					s.data.drawStyle['background-color'] = style['background-color'];
					s.data.drawStyle['border-color'] = style['border-color'];
					s.data.drawStyle['border-style'] = style['border-style'];
					s.data.drawStyle['border-width'] = style['border-width'];
				}
			}
		},
	    mousedown:function(args){
			args.scope.data.tools.eyedropper.down(args);
	    },
		touchstart:function(args){
			args.scope.data.tools.eyedropper.down(args);
		},
	    mouseup:function(args){},
		touchend:function(){},
	    mouseleave:function(args){},
	    finishSelect:function(args){},
	    mouseenter:function(args){},
	    mousemove:function(e,scope){},
	    touchmove:function(e,scope){}
	}
};
