/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/


config.menus={
    active:false,
    menus:{
        file:{
            label:'File',
            iconClass:'btn menu-item',
            active:false,
            actions:{
                'new':{
                    label:config.lang[config.lang.act].new,
                    disabled:false,
                    fn:function(scope){
                        if (window.confirm(config.lang[config.lang.act].createNewFileAndLoseChanges)) {
                            $('#newDocumentModal').modal('show');
                        }
                    }
                },
                'open':{
                    label:config.lang[config.lang.act].open,
                    disabled:false,
                    fn:function(scope){
                        if (window.confirm(config.lang[config.lang.act].openNewFileAndLoseChanges)) {
                            $('#openDocumentModal').modal('show');
                        }
                    }
                },
                'save':{
                    label:config.lang[config.lang.act].save,
                    disabled:true,
                    fn:function(scope){
                        console.log(scope);
                        scope.$parent.$parent.data.fn.storage.saveDocument(scope.$parent.$parent);
                    }
                },
                'saveAs':{
                    label:config.lang[config.lang.act].saveAs,
                    disabled:false,
                    fn:function(scope){
                        $('#saveDocumentAsModal').modal('show');
                    }
                }
            }
        },
        edit:{
            label:'Edit',
            iconClass:'btn menu-item',
            active:false,
            actions:{
                'copy':{
                    label:config.lang[config.lang.act].copy,
                    disabled:false,
                    fn:function(scope){
                        console.log('copying');
                    }
                }
            }
        }
    },
};
