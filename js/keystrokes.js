/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/

config.keystrokes = {
    '65':{
        'keydown':function(a){
            a.s.data.fn.initTool(a.s, {setTool:'selection'}, a.c);
        },
        'keyup':function(a){
        }
    },
    '77':{
        'keydown':function(a){
            a.s.data.fn.initTool(a.s, {setTool:'drawBox'}, a.c);
        },
        'keyup':function(a){
        }
    },
    '17':{
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
    }
};
