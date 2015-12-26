/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/

config.keystrokes = {
    '65':{ //a letter
        'keydown':function(a){
            a.s.data.fn.initTool(a.s, {setTool:'selection'}, a.c);
        },
        'keyup':function(a){
        }
    },
    '77':{ //m letter
        'keydown':function(a){
            a.s.data.fn.initTool(a.s, {setTool:'drawBox'}, a.c);
        },
        'keyup':function(a){
        }
    },
    '17':{ //ctrl key
        'keydown':function(a){
            if(a.s.data.tool!=='selection'){
                a.s.data.toolPrev = a.s.data.tool;
                a.s.data.fn.initTool(a.s, {setTool:'selection'}, a.c);
            }
        },
        'keyup':function(a){
            var backto = a.s.data.toolPrev;
            a.s.data.toolPrev = null;
            a.s.data.fn.initTool(a.s, {setTool:backto}, a.c);
        }
    },
    '46':{ //delete key
        'keydown':function(a){
            a.e.preventDefault();
            if (a.s.data.selection.active.typeNum==2){
                a.s.data.fn.tree.remove(a.s.data.selection.active,a.s.data);
                a.s.$digest();
            }
        },
        'keyup':function(a){
            a.e.preventDefault();
        }
    },
    '38':{ // up arrow
    		'keydown':function(a){
                if (a.s.data.selection.active.typeNum==2){
                    var nuTop = a.s.data.fn.cssIncrement(a.s.data.selection.active.style.top,-1);
                    a.s.data.selection.active.style.top = nuTop.val;
                    a.s.data.selection.active.style.tPx = nuTop.unitLess;
                    a.s.$apply();
                }
            },
    		'keyup':function(a){}
    },
    '40':{ // down arrow
    		'keydown':function(a){
                if (a.s.data.selection.active.typeNum==2){
                    var nuTop = a.s.data.fn.cssIncrement(a.s.data.selection.active.style.top,1);
                    a.s.data.selection.active.style.top = nuTop.val;
                    a.s.data.selection.active.style.tPx = nuTop.unitLess;
                    a.s.$apply();
                }
            },
    		'keyup':function(a){}
    },
    '37':{ // left arrow
    		'keydown':function(a){
                if (a.s.data.selection.active.typeNum==2){
                    var nuTop = a.s.data.fn.cssIncrement(a.s.data.selection.active.style.left,-1);
                    a.s.data.selection.active.style.left = nuTop.val;
                    a.s.data.selection.active.style.lPx = nuTop.unitLess;
                    a.s.$apply();
                }
            },
    		'keyup':function(a){}
    },
    '39':{ // right arrow
    		'keydown':function(a){
                if (a.s.data.selection.active.typeNum==2){
                    var nuTop = a.s.data.fn.cssIncrement(a.s.data.selection.active.style.left,1);
                    a.s.data.selection.active.style.left = nuTop.val;
                    a.s.data.selection.active.style.lPx = nuTop.unitLess;
                    a.s.$apply();
                }
            },
    		'keyup':function(a){}
    }
};
config.keystrokes['91'] = config.keystrokes['17']; // to equalize mac ctrl key to win ctrl key
config.keystrokes['8'] = config.keystrokes['46']; // backspace key deletes element same as delete key
