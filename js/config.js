/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/
var config = {
	baseObject:{
		id:'document__new_document',
		name: 'New Document',
		children : [{
			id : 'layer_1',
			type: 'layer',
			typeNum:1, // 0 for the root level, 1 for layers and 2 for elments;
			selected:false,
			styles:{
				'normal':{top:'0',
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
			children : []
		}],
		type:'root',
		typeNum:0,
		styles:{
			normal:{}
		}
	},
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
	tree:{},
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
	config:{
		sidebarClass:'',
		allowNestedElements:false
	},
	lang:{
		act:'en',
		en:{
			layer:'layer',
			element:'element',
			welcome:'Welcome',
			createNewDocument:'New Document',
			name:'Name',
			width:'Width',
			height:'Height',
			create:'Create',
			layers:'Layers',
			setFillColor:'Set Fill Color',
			setBorderColor:'Set Border Color',
			setBorderWidth:'Set Border Width',
			new:'New',
			save:'Save',
			createNewFileAndLoseChanges:'Create new file and loose changes?',
			openNewFileAndLoseChanges:'Open new file and loose changes?',
			saveAs:'Save As...',
			saveDocumentAs:'Save Document As',
			doYouWantToOverwrite:'Do you want to overwrite',
			cancel:'Cancel',
			openDocument:'Open Document',
			open:'Open',
			copy:'Copy',
			properties:'Properties',
			top:'top',
			left:'left',
			text:'text',
			textAlign:'text align',
			fontSize:'font size',
			fontColor:'font color',
			fontFamily:'font family',
			fontWeight:'font weight',
			layout:'layout',
			padding:'padding',
			margin:'margin',
			overflow:'overflow'
		}
	},
	drawStyle : {
		'background-color':'#fff',
		'border-color':'#000',
		'border-style':'solid',
		'border-width':'1px',
		bwPx:0
	},
	stylePickers:{
		'background-color':'',
		'border-color':'',
		'border-width':'',
		'border-style':''
	},
	snap:{
		canvas:true,
		element:true
	},
	flags:{
		storage:{
			canSave:false
		}
	}
};
