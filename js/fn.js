/*
* Web based visual wireframe editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit davelinke.com/editor
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
    }
};
