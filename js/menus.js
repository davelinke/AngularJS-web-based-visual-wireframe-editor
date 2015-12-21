/*
* Pinocchio Editor
* by David Linke Cesami
* licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
* For more information visit pinocchio.us
*/


config.menus={
    main:{
        label:'Main Menu',
        iconClass:'fa fa-bars',
        visible:false,
        actions:{
            'new':{
                label:config.lang[config.lang.act].new,
                disabled:false,
                fn:function(scope){
                    scope.menu.visible=false;
                    if (window.confirm(config.lang[config.lang.act].createNewFileAndLoseChanges)) {
                        $('#newDocumentModal').modal('show');
                    }
                }
            },
            'open':{
                label:config.lang[config.lang.act].open,
                disabled:false,
                fn:function(scope){
                    scope.menu.visible=false;
                    if (window.confirm(config.lang[config.lang.act].openNewFileAndLoseChanges)) {
                        $('#openDocumentModal').modal('show');
                    }
                }
            },
            'save':{
                label:config.lang[config.lang.act].save,
                disabled:true,
                fn:function(scope){
                    scope.menu.visible=false;
                    scope.$parent.data.fn.storage.saveDocument(scope.$parent);
                }
            },
            'saveAs':{
                label:config.lang[config.lang.act].saveAs,
                disabled:false,
                fn:function(scope){
                    scope.menu.visible = false;
                    $('#saveDocumentAsModal').modal('show');
                }
            }
        }
    }
};
