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
                    label:config.lang[config.lang.act].save+config.lang[config.lang.act].locally,
                    disabled:true,
                    fn:function(scope){
                        var
                            cScope = config.fn.findControllerScope(scope);
                        cScope.data.fn.storage.saveDocument(cScope);
                    }
                },
                'saveAs':{
                    label:config.lang[config.lang.act].saveAs+config.lang[config.lang.act].locally,
                    disabled:false,
                    fn:function(scope){
                        $('#saveDocumentAsModal').modal('show');
                    }
                },
                'separator-1':{
                    separator:true
                },
                'preview':{
                    label:config.lang[config.lang.act].preview,
                    disabled:false,
                    fn:function(scope){
                        window.location.hash = '/preview-screen/self';
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
                        var
                            cScope = config.fn.findControllerScope(scope),
                            copy = $.extend(true,{},cScope.data.selection.active)
                        ;
                        if (copy.typeNum==2) cScope.clipboard = copy;
                    }
                },
                'paste':{
                    label:config.lang[config.lang.act].paste,
                    disabled:false,
                    fn:function(scope){
                        var
                            cScope = config.fn.findControllerScope(scope),
                            clipboard = cScope.clipboard,
                            pastingLayer = config.fn.tree.selectParentLayer(cScope.data.tree.root.children)
                        ;
                        if (clipboard){
                            var id = clipboard.id;
                            var copyArr = id.split('_copy_');
                            console.log(parseInt(copyArr[copyArr.length-1]));
                            copyNumber = parseInt(copyArr[copyArr.length-1]);
                            copyNumber = (isNaN(copyNumber)?1:copyNumber+1);

                            clipboard.id = copyArr[0] + '_copy_' + copyNumber;
                            config.fn.modifiers.modifyElementArea(cScope,'top',10,clipboard);
                            config.fn.modifiers.modifyElementArea(cScope,'left',10,clipboard);
                            clipboard.selected = false;
                            var paste = $.extend(true,{},clipboard);
                            pastingLayer.children.push(paste);
                            config.fn.tree.toggleSelected({
                        		child:pastingLayer.children[pastingLayer.children.length-1],
                        		data:cScope.data
                        	});
                        }
                    }
                },
                'pasteInPlace':{
                    label:config.lang[config.lang.act].pasteInPlace,
                    disabled:false,
                    fn:function(scope){
                        var
                            cScope = config.fn.findControllerScope(scope),
                            clipboard = cScope.clipboard,
                            pastingLayer = config.fn.tree.selectParentLayer(cScope.data.tree.root.children)
                        ;
                        if (clipboard){
                            var id = clipboard.id;
                            var copyArr = id.split('_copy_');
                            copyNumber = parseInt(copyArr[copyArr.length-1]);
                            copyNumber = (isNaN(copyNumber)?1:copyNumber+1);

                            clipboard.id = copyArr[0] + '_copy_' + copyNumber;
                            clipboard.selected = false;
                            var paste = $.extend(true,{},clipboard);
                            pastingLayer.children.push(paste);
                            config.fn.tree.toggleSelected({
                        		child:pastingLayer.children[pastingLayer.children.length-1],
                        		data:cScope.data
                        	});
                        }
                    }
                }
            }
        },
        view:{
            label:'View',
            iconClass:'btn menu-item',
            active:false,
            actions:{
                canvasOverflow:{
                    label:config.lang[config.lang.act].canvasOverflow,
                    disabled:false,
                    hasCheck:false,
                    fn:function(scope){
                        var cScope = config.fn.findControllerScope(scope);
                        cScope.data.screen.overflow = !cScope.data.screen.overflow;
                        cScope.data.menus.menus.view.actions.canvasOverflow.hasCheck = !cScope.data.menus.menus.view.actions.canvasOverflow.hasCheck;
                    }
                }
            }
        },
        window:{
            label:'Window',
            iconClass:'btn menu-item',
            active:false,
            actions:{
                toolbar:{
                    label:config.lang[config.lang.act].toolbar,
                    disabled:false,
                    hasCheck:true,
                    fn:function(scope){
                        var cScope = config.fn.findControllerScope(scope);
                        cScope.data.menus.menus.window.actions.toolbar.hasCheck = !cScope.data.menus.menus.window.actions.toolbar.hasCheck;
                    }
                },
                'separator-2':{
                    separator:true
                },
                properties:{
                    label:config.lang[config.lang.act].properties,
                    disabled:false,
                    hasCheck:true,
                    fn:function(scope){
                        var cScope = config.fn.findControllerScope(scope);
                        cScope.data.menus.menus.window.actions.properties.hasCheck = !cScope.data.menus.menus.window.actions.properties.hasCheck;
                    }
                },
                layers:{
                    label:config.lang[config.lang.act].layers,
                    disabled:false,
                    hasCheck:true,
                    fn:function(scope){
                        var cScope = config.fn.findControllerScope(scope);
                        cScope.data.menus.menus.window.actions.layers.hasCheck = !cScope.data.menus.menus.window.actions.layers.hasCheck;
                    }
                }
            }
        }
    },
};
