var secondLevel, thirdLevel, forthLevel, fifthLevel;
var DirectCost = {
    init: function () {
        DirectCost.AddListener();
        //DirectCost.GetListTree();
        DirectCost.GetTreeTitle();
        DirectCost.CreateTree();

    },
    AddListener: function () {
        //انتخاب نود های درخت
        $("#TreeBox").on("select_node.jstree",
            function (evt, data) {
                if (data.node.parent != "#") {
                    //$('.activateTree').removeClass('displayShow').addClass('displayNone');
                    $('.TreeForm').removeClass('displayShow').addClass('displayNone');
                } else {
                    //$('.activateTree').removeClass('displayNone').addClass('displayShow');
                    $('.TreeForm').removeClass('displayShow').addClass('displayNone');
                }
            }
        );
    },
    GetTreeTitle: function () {
        var treeTitleContent = '';
        $.ajax({
            type: 'GET',
            url: '/DirectCost/GetList',
            dataType: 'jsonp',
            cache: false,
            success: function (response) {
                $(document).find('#Tree').html('');
                var ClsIsActive
                if (response.length > 0) {
                    for (i = 0; i < response.length; i++) {
                        if (response[i].IsActive == true) {
                             ClsIsActive = 'ActiveTree';
                        } else {
                            ClsIsActive = 'DeActiveTree';
                        }
                        treeTitleContent += '<li class="treeTitle ' + ClsIsActive+'" id="' +
                            response[i].Id +
                            '">' +
                            response[i].Name +
                            '</li>';
                    }
                }
                $(document).find('#Tree').append(treeTitleContent);
                DirectCost.GetTreeNodes();
            },
            error: function () {
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                DirectCost.Error(errorMessage);
            },
        });
    },
    GetTreeNodes: function () {
        $('.treeTitle').each(function () {
            var treeId = $(this).attr('id');
            var treeTitleElement = $(this);
            var treeTittleCentralContent = '<ul class="nested">';
            $.ajax({
                type: 'GET',
                url: '/DirectCost/GetMaterialList',
                dataType: 'jsonp',
                async: false,
                cache: false,
                data: { id: treeId },
                success: function (response) {
                    if (response.length > 0) {
                        for (i = 0; i < response.length; i++) {
                            if (response[i].id_index_material == null) {
                                treeTittleCentralContent += '<li class="secondLevel" id="' +
                                    response[i].Id +
                                    '">' +
                                    response[i].Name +
                                    '</li>';
                            }
                        }
                        treeTittleCentralContent += '</ul>';
                        treeTitleElement.append(treeTittleCentralContent);
                        //if ($('.treeTitle').find('.secondLevel').length) {
                        for (i = 0; i < response.length; i++) {
                            //if (response[i].id_index_material != null) {
                            $(document).find('#Tree .secondLevel').each(function () {
                                if (response[i].id_index_material == $(this).attr('id')) {
                                    var secondLevelContent = '<ul class="nested">';
                                    secondLevel = $(this);
                                    secondLevelContent += '<li class="thirdLevel" id="' +
                                        response[i].Id +
                                        '">' +
                                        response[i].Name +
                                        '</li>';
                                    secondLevelContent += '</ul>';
                                    $(secondLevel).append(secondLevelContent);
                                    secondLevelContent = '';
                                }
                            });
                            //}
                        }

                        //}
                        //if ($('#Tree').find('.thirdLevel').length) {
                        for (i = 0; i < response.length; i++) {
                            if (response[i].id_index_material != null) {

                                $(document).find('#Tree .thirdLevel').each(function () {
                                    if (response[i].id_index_material == $(this).attr('id')) {
                                        var thirdLevelContent = '<ul class="nested">';
                                        thirdLevel = $(this);
                                        thirdLevelContent += '<li class="forthLevel" id="' +
                                            response[i].Id +
                                            '">' +
                                            response[i].Name +
                                            '</li>';
                                        thirdLevelContent += '</ul>';
                                        $(thirdLevel).append(thirdLevelContent);
                                        thirdLevelContent = '';
                                    }
                                });
                            }
                        }
                        //}
                        //if ($('#Tree').find('.forthLevel').length) {
                        for (i = 0; i < response.length; i++) {
                            if (response[i].id_index_material != null) {

                                $(document).find('#Tree .forthLevel').each(function () {
                                    if (response[i].id_index_material == $(this).attr('id')) {
                                        var forthLevelContent = '<ul class="nested">';
                                        forthLevel = $(this);
                                        forthLevelContent += '<li class="fifthLevel" id="' +
                                            response[i].Id +
                                            '">' +
                                            response[i].Name +
                                            '</li>';
                                        forthLevelContent += '</ul>';
                                        $(forthLevel).append(forthLevelContent);
                                        forthLevelContent = '';
                                    }
                                });
                            }
                        }
                        //}
                        //if ($('#Tree').find('.fifthLevel').length) {
                        for (i = 0; i < response.length; i++) {
                            if (response[i].id_index_material != null) {

                                $(document).find('#Tree .fifthLevel').each(function () {
                                    if (response[i].id_index_material == $(this).attr('id')) {
                                        var fifthLevelContent = '<ul class="nested">';

                                        fifthLevel = $(this);
                                        fifthLevelContent +=
                                            '<li id="' +
                                            response[i].Id + '">' + response[i].Name + '</li>';
                                        fifthLevelContent += '</ul>';
                                        $(fifthLevel).append(fifthLevelContent);
                                        fifthLevelContent = '';
                                    }
                                });
                            }
                        }
                        //}

                    }
                },
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    DirectCost.Error(errorMessage);
                },
            });
        });
        DirectCost.TreeView();
    },
    TreeView: function () {
        $('.TreeLoading').removeClass('displayShow').addClass('displayNone');
        $('#TreeBox').removeClass('displayNone').addClass('displayShow').jstree({
            'core': {

            },
            types: {
                "#": { max_children: 5, max_depth: 5 },
                "folder": { icon: "fa fa-folder" },
                "default": { icon: "far fa-circle", valid_children: ["default", "file", "folder"] },
                "file": { icon: "fa fa-file-text" }
            },
            plugins: ["types","contextmenu"],

            "contextmenu": {
                items:
                    function customMenu(node) {
                        // The default set of all items
                        var items = {
                            "ActivateTree": {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "تعیین ساختار",
                                "icon": "far fa-hand-pointer",
                                "action": function (obj) {
                                    var nodeId = node.id;
                                    $.ajax({
                                        type: 'GET',
                                        url: '/DirectCost/SetAsDefault',
                                        dataType: 'json',
                                        cache: false,
                                        data: { treeTitle: nodeId },
                                        success: function (response) {
                                            if (response == true) {
                                                //$('#message').html(
                                                //    '<div class="alert alert-success alert-dismissible">' +
                                                //    '<a href="#" class= "close" data - dismiss="alert" aria-label="close" >' +
                                                //    '<i class="fas fa-times"></i></a>' +
                                                //    'فعالسازی درخت با موفقیت انجام شد</div>');
                                                window.location.reload();
                                            }
                                            else if (response == false) {
                                                $('#message').html(
                                                    '<div class="alert alert-danger alert-dismissible">' +
                                                    '<a href="#" class= "close" data - dismiss="alert" aria-label="close" >' +
                                                    '<i class="fas fa-times"></i></a>' +
                                                    'بروز خطا در فعال سازی درخت</div>');
                                            }
                                        },
                                        error: function () {
                                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                                            DirectCost.Error(errorMessage);
                                        },
                                    });
                                }
                            },
                                "Create": {
                                    "separator_before": false,
                                    "separator_after": false,
                                    "label": "ایجاد",
                                    "icon": "fas fa-plus",
                                    "action": function(obj) {
                                        var nodeId = node.id;
                                        var parentId = node.parent;
                                        var levelOfTreeTitle = node.parents.length - 1;
                                        var lastParent = node.parents.length - 2;
                                        var root = node.parents[lastParent];
                                        $('#level').val(levelOfTreeTitle);
                                        if (node.parent == "#") {
                                            parentId = nodeId;
                                            root = nodeId;
                                            nodeId = '';
                                            $('#rootId').val(root);
                                            $('#id_index_material').val(nodeId);

                                    }
                                    else{
                                            $('#id_index_material').val(nodeId);
                                            $('#rootId').val(root);

                                        }
                                        $.ajax({
                                            type: 'GET',
                                            url: '/DirectCost/CheckCanAddChild',
                                            dataType: 'json',
                                            cache: false,
                                            data: { rootId: root, level: levelOfTreeTitle },
                                            success: function (response) {
                                                if (response == true) {
                                                    $('#code').attr('disabled', false);
                                                    $('#id_type').attr('disabled', false);
                                                    $('#id_ProcessType').attr('disabled', false);
                                                    $('#description').attr('disabled', false);
                                                    document.getElementById("frmTreeDetail").reset();
                                                    $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                                                }
                                                else if (response == false) {
                                                    var errorMessage = 'شما مجاز به ایجاد بیشتر از ' + (levelOfTreeTitle)+
                                                    ' سطح نمی باشید';
                                                    DirectCost.Error(errorMessage);
                                                }
                                            },
                                            error: function () {
                                                var errorMessage = 'بروز خطا در برقراری ارتباط';
                                                DirectCost.Error(errorMessage);
                                            },
                                        });
                                    }
                                },
                                "Edit": {
                                    "separator_before": false,
                                "separator_after": false,
                                "label": "ویرایش",
                                "icon": "fas fa-edit",
                                    "action": function (obj) {
                                        var nodeId = node.id;
                                        $('#Id').val(nodeId);
                                        $('#code').attr('disabled', true);
                                        $('#id_type').attr('disabled', true);
                                        $('#id_ProcessType').attr('disabled', true);
                                        $('#description').attr('disabled', true);
                                        $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                                        var nodeId = node.id;
                                        $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                                        DirectCost.GetTreeNodeDetails(nodeId);
                                    }
                                },
                                "Remove": {
                                    "separator_before": false,
                                    "separator_after": false,
                                    "label": "حذف",
                                    "icon": "fas fa-trash-alt",
                                    "action": function (obj) {
                                        var nodeId = node.id;
                                        $.ajax({
                                            type: 'GET',
                                            url: '/DirectCost/DeleteMaterial',
                                            dataType: 'json',
                                            cache: false,
                                            data: { id: nodeId },
                                            success: function (response) {
                                                if (response == true) {
                                                //    $('#message').html(
                                                //        '<div class="alert alert-success alert-dismissible">' +
                                                //        '<a href="#" class= "close" data - dismiss="alert" aria-label="close" >' +
                                                //        '<i class="fas fa-times"></i></a>' +
                                                //        'حذف با موفقیت انجام شد</div>');
                                                //$('#TreeBox').html('<ul id="Tree"></ul>');
                                                    //DirectCost.GetTreeTitle();
                                                    window.location.reload();

                                                }
                                                else if (response == false) {
                                                    $('#message').html('<div class="alert alert-danger alert-dismissible">'+
                                                        '<a href="#" class= "close" data - dismiss="alert" aria-label="close" >' +
                                                        '<i class="fas fa-times"></i></a>' +
                                                        'بروز خطا در حذف اطلاعات</div>').delay(5000).fadeOut(800)
                                                }
                                            },
                                            error: function () {
                                                var errorMessage = 'بروز خطا در برقراری ارتباط';
                                                DirectCost.Error(errorMessage);
                                            },
                                        });
                                    }
                                },
                        }

                        if (node.parent == "#") {
                            // Delete the "delete" menu item
                            delete items.Remove;
                            delete items.Edit;
                        }
                        else if (node.parent != "#") {
                                // Delete the "delete" menu item
                            delete items.ActivateTree;
                            }
                        return items;
                    },
            },
            //"items": function ($node) {
                        //    var tree = $("#tree").jstree(true);
                        //    return {
                        //        "Create": {
                        //            "separator_before": false,
                        //            "separator_after": false,
                        //            "label": "ایجاد",
                        //            "action": function (obj) {
                        //                var nodeId = $node.id;
                        //                document.getElementById("frmTreeDetail").reset();
                        //                $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                        //            }
                        //        },
                        //        "Edit": {
                        //            "separator_before": false,
                        //            "separator_after": false,
                        //            "label": "ویرایش",
                        //            "action": function (obj) {
                        //                $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                        //                var nodeId = $node.id;
                        //                $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                        //                DirectCost.GetTreeNodeDetails(nodeId);
                        //            }
                        //        },
                        //        "Remove": {
                        //            "separator_before": false,
                        //            "separator_after": false,
                        //            "label": "حذف",
                        //            "action": function (obj) {
                        //                $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                        //                var nodeId = $node.id;
                        //                alert(nodeId)

                        //            }
                        //        },
                        //    }
                        //},

            //"plugins": [
            //    "checkbox",
            //    "contextmenu",
            //    "dnd",
            //    "massload",
            //    "search",
            //    "sort",
            //    "state",
            //    "types",
            //    "unique",
            //    "wholerow",
            //    "changed",
            //    "conditionalselect"
            //]
        });

    },
    GetTreeNodeDetails: function (nodeId) {
        $.ajax({
            type: 'GET',
            url: '/DirectCost/GetMaterial',
            dataType: 'jsonp',
            cache: false,
            data: { id: nodeId},
            success: function (response) {
                var TreeNodeId = response.Id;
                var TreeNodeName = response.name;
                var TreeNodeCode = response.code;
                var TreeNodeType = response.id_type;
                var TreeNodeProcesstype = response.id_ProcessType;
                var TreeNodeUnit = response.id_unit;
                var TreeNodeDescription = response.Description;
                $('#code').val(TreeNodeCode);
                $('#name').val(TreeNodeName);
                $('#id_type').find('option[value="' + TreeNodeType + '"]').attr('selected', true);
                $('#id_ProcessType').find('option[value="' + TreeNodeProcesstype + '"]').attr('selected', true);
                $('#id_unit').find('option[value="' + TreeNodeUnit + '"]').attr('selected', true);
                if (TreeNodeDescription) { $('#description').val(TreeNodeDescription); }
            },
            error: function () {
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                DirectCost.Error(errorMessage);
            },
        });
    },
    CreateTree: function() {
        $('#frmTreeDetail').on('submit', function(e) {
            e.preventDefault();
        }).validate({
            rules: {
                code: { required: true,number:true },
                name: { required: true, },
                id_type: { required: true,},
                id_ProcessType: { required: true, },
                id_unit: { required: true},
            },
            messages: {
            },
            submitHandler: function (form) {
                form.submit();
            }
        });
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
DirectCost.init();