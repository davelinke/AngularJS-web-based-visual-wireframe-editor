/*
* Web based visual wireframe editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit davelinke.com/editor
*/

var config = {
	templates:{
		properties:'<strong>properties</strong>'
	},
	modal:{
		content:'default modal content'
	},
	mouse:{
		left:0,
		top:0
	},
	tree:{
		json:'',
		getSelectedElement:function(to){
			var selected = null;
			var traverse = function(o){
				for (var i = 0; i<o.length; i++){
					if (o[i].selected) {
						selected = o;
						break;
					} else {
						if (o[i].children.length > 0){
							traverse(o[i]);
						}
					}
				}
				return selected;
			};
			return traverse(to);
		}
	},
	selection:{
		active:null,
		previous:null,
		next:null,
		parent:null
	},
	screen : {
		id:'screen',
		element:document.getElementById('screen'),
		width : '270px',
		height : '440px',
		wPx:270,
		hPx:440,
		mouse:{
			x:null,
			y:null
		},
		overflow:false
	},
	tool:'drawBox',
	toolPrev:null,
	toolActions:{
		output:'hola ke ase',
		actions:[
			{
				name:'hello',
				iconClass:'fa fa-hand-spock-o',
				fn:function(){console.log('hello');}
			},
			{
				name:'goodbye',
				iconClass:'fa fa-hand-peace-o',
				fn:function(){console.log('goodbye');}
			}
		]
	},
	config:{
		sidebarClass:'',
		allowNestedElements:false
	},
	lang:{
		act:'en',
		en:{
			layer:'layer',
			element:'element'
		}
	},
	drawStyle : {
		'background-color':'#fff',
		'border-color':'#000',
		'border-style':'solid',
		'border-width':'0',
		bwPx:0
	},
	snap:{
		canvas:true,
		element:true
	},
	colorPickers:{
		background:'#fff',
		border:'#000'
	}
};
