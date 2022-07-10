var secondLevel, thirdLevel, forthLevel, fifthLevel;
var InDirectCost = {
    init: function () {
        InDirectCost.AddListener();
        InDirectCost.GetTreeTitle();
        InDirectCost.CreateTree();

    },
    AddListener: function () {
        //انتخاب نود های درخت
        $("#TreeBox").on("select_node.jstree",
            function (evt, data) {
                if (data.node.parent != "#") {
                    $('.TreeForm').removeClass('displayShow').addClass('displayNone');
                } else {
                    $('.TreeForm').removeClass('displayShow').addClass('displayNone');
                }
            }
        );
    },
    GetTreeTitle: function () {
        var treeTitleContent = '';
        $.ajax({
            type: 'GET',
            url: '/IndirectCost/GetList',
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
                        treeTitleContent += '<li class="treeTitle ' + ClsIsActive + '" id="' +
                            response[i].Id +
                            '">' +
                            response[i].Name +
                            '</li>';
                    }
                }
                $(document).find('#Tree').append(treeTitleContent);
                InDirectCost.GetTreeNodes();
            },
            error: function () {
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                InDirectCost.Error(errorMessage);
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
                url: '/IndirectCost/GetCentralList',
                dataType: 'json',
                async: false,
                cache: false,
                data: { id: treeId },
                success: function (response) {
                    if (response.length > 0) {

                        for (i = 0; i < response.length; i++) {
                            if (response[i].id_index_central == null) {
                                treeTittleCentralContent += '<li class="secondLevel" id="' +
                                    response[i].id +
                                    '">' +
                                    response[i].name +
                                    '</li>';
                            }
                        }
                        treeTittleCentralContent += '</ul>';
                        treeTitleElement.append(treeTittleCentralContent);
                        for (i = 0; i < response.length; i++) {
                            $(document).find('#Tree .secondLevel').each(function () {
                                if (response[i].id_index_central == $(this).attr('id')) {
                                    var secondLevelContent = '<ul class="nested">';
                                    secondLevel = $(this);
                                    secondLevelContent += '<li class="thirdLevel" id="' +
                                        response[i].id +
                                        '">' +
                                        response[i].name +
                                        '</li>';
                                    secondLevelContent += '</ul>';
                                    $(secondLevel).append(secondLevelContent);
                                    secondLevelContent = '';
                                }
                            });
                        }
                        for (i = 0; i < response.length; i++) {
                            if (response[i].id_index_central != null) {

                                $(document).find('#Tree .thirdLevel').each(function () {
                                    if (response[i].id_index_central == $(this).attr('id')) {
                                        var thirdLevelContent = '<ul class="nested">';
                                        thirdLevel = $(this);
                                        thirdLevelContent += '<li class="forthLevel" id="' +
                                            response[i].id +
                                            '">' +
                                            response[i].name +
                                            '</li>';
                                        thirdLevelContent += '</ul>';
                                        $(thirdLevel).append(thirdLevelContent);
                                        thirdLevelContent = '';
                                    }
                                });
                            }
                        }
                        for (i = 0; i < response.length; i++) {
                            if (response[i].id_index_central != null) {

                                $(document).find('#Tree .forthLevel').each(function () {
                                    if (response[i].id_index_central == $(this).attr('id')) {
                                        var forthLevelContent = '<ul class="nested">';
                                        forthLevel = $(this);
                                        forthLevelContent += '<li class="fifthLevel" id="' +
                                            response[i].id +
                                            '">' +
                                            response[i].name +
                                            '</li>';
                                        forthLevelContent += '</ul>';
                                        $(forthLevel).append(forthLevelContent);
                                        forthLevelContent = '';
                                    }
                                });
                            }
                        }
                        for (i = 0; i < response.length; i++) {
                            if (response[i].id_index_central != null) {

                                $(document).find('#Tree .fifthLevel').each(function () {
                                    if (response[i].id_index_central == $(this).attr('id')) {
                                        var fifthLevelContent = '<ul class="nested">';

                                        fifthLevel = $(this);
                                        fifthLevelContent +=
                                            '<li id="' +
                                            response[i].id + '">' + response[i].name + '</li>';
                                        fifthLevelContent += '</ul>';
                                        $(fifthLevel).append(fifthLevelContent);
                                        fifthLevelContent = '';
                                    }
                                });
                            }
                        }
                    }
                },
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    InDirectCost.Error(errorMessage);
                },
            });
        });
        InDirectCost.TreeView();
    },
    TreeView: function () {
        $('.TreeLoading').removeClass('displayShow').addClass('displayNone');
        $('#TreeBox').removeClass('displayNone').addClass('displayShow').jstree({
            types: {
                "#": { max_children: 5, max_depth: 5 },
                "folder": { icon: "fa fa-folder" },
                "default": { icon: "far fa-circle", valid_children: ["default", "file", "folder"] },
                "file": { icon: "fa fa-file-text" }
            },
            plugins: ["types", "contextmenu"],

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
                                        url: '/IndirectCost/SetAsDefault',
                                        dataType: 'json',
                                        cache: false,
                                        data: { treeTitle: nodeId },
                                        success: function (response) {
                                            if (response == true) {
                                                window.location.reload();
                                            }
                                            else if (response == false) {
                                                $('#message').html(
                                                    '<div class="alert alert-danger alert-dismissible">' +
                                                    '<a href="#" class= "close" data - dismiss="alert" aria-label="close" >' +
                                                    '<i class="fas fa-times"></i></a>' +
                                                    'بروز خطا در فعال سازی درخت</div>').delay(5000).fadeOut(800);
                                            }
                                        },
                                        error: function () {
                                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                                            InDirectCost.Error(errorMessage);
                                        },
                                    });
                                }
                            },
                            "CreateCentral": {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "ایجاد مرکز",
                                "icon": "fas fa-plus",
                                "action": function (obj) {
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
                                    else {
                                        $('#id_index_material').val(nodeId);
                                        $('#rootId').val(root);

                                    }
                                    $.ajax({
                                        type: 'GET',
                                        url: '/IndirectCost/CheckCanAddChild',
                                        dataType: 'json',
                                        cache: false,
                                        data: { rootId: root, level: levelOfTreeTitle },
                                        success: function (response) {
                                            if (response == true) {
                                                $('#code').attr('disabled', false);
                                                $('#id_type').attr('disabled', false);
                                                $('#description').attr('disabled', false);
                                                document.getElementById("frmTreeDetail").reset();
                                                $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                                            }
                                            else if (response == false) {
                                                var errorMessage = 'شما مجاز به ایجاد بیشتر از ' + (levelOfTreeTitle) +
                                                    ' سطح نمی باشید';
                                                InDirectCost.Error(errorMessage);
                                            }
                                        },
                                        error: function () {
                                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                                            InDirectCost.Error(errorMessage);
                                        },
                                    });
                                }
                            },
                            "CreateCost": {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "ایجاد هزینه",
                                "icon": "fas fa-plus",
                                //"action": function (obj) {
                                //    var nodeId = node.id;
                                //    var parentId = node.parent;
                                //    var levelOfTreeTitle = node.parents.length - 1;
                                //    var lastParent = node.parents.length - 2;
                                //    var root = node.parents[lastParent];
                                //    $('#level').val(levelOfTreeTitle);
                                //    if (node.parent == "#") {
                                //        parentId = nodeId;
                                //        root = nodeId;
                                //        nodeId = '';
                                //        $('#rootId').val(root);
                                //        $('#id_index_material').val(nodeId);

                                //    }
                                //    else {
                                //        $('#id_index_material').val(nodeId);
                                //        $('#rootId').val(root);

                                //    }
                                //    $.ajax({
                                //        type: 'GET',
                                //        url: '/IndirectCost/CheckCanAddChild',
                                //        dataType: 'json',
                                //        cache: false,
                                //        data: { rootId: root, level: levelOfTreeTitle },
                                //        success: function (response) {
                                //            if (response == true) {
                                //                $('#code').attr('disabled', false);
                                //                $('#id_type').attr('disabled', false);
                                //                $('#id_ProcessType').attr('disabled', false);
                                //                $('#description').attr('disabled', false);
                                //                document.getElementById("frmTreeDetail").reset();
                                //                $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                                //            }
                                //            else if (response == false) {
                                //                var errorMessage = 'شما مجاز به ایجاد بیشتر از ' + (levelOfTreeTitle) +
                                //                    ' سطح نمی باشید';
                                //                Script.Error(errorMessage);
                                //            }
                                //        },
                                //        error: function () {
                                //            var errorMessage = 'بروز خطا در برقراری ارتباط';
                                //            Script.Error(errorMessage);
                                //        },
                                //    });
                                //}
                            },
                            "EditCost": {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "ویرایش هزینه",
                                "icon": "fas fa-edit",
                                //"action": function (obj) {
                                //    var nodeId = node.id;
                                //    $('#Id').val(nodeId);
                                //    $('#code').attr('disabled', true);
                                //    $('#id_type').attr('disabled', true);
                                //    $('#description').attr('disabled', true);
                                //    $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                                //    $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                                //    Script.GetTreeNodeDetails(nodeId);
                                //}
                            },
                            "RemoveCost": {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "حذف هزینه",
                                "icon": "fas fa-trash-alt",
                                //"action": function (obj) {
                                //    var nodeId = node.id;
                                //    $.ajax({
                                //        type: 'GET',
                                //        url: '/IndirectCost/DeleteCentral',
                                //        dataType: 'json',
                                //        cache: false,
                                //        data: { id: nodeId },
                                //        success: function (response) {
                                //            if (response == true) {
                                //                window.location.reload();

                                //            }
                                //            else if (response == false) {
                                //                $('#message').html('<div class="alert alert-danger alert-dismissible">' +
                                //                    '<a href="#" class= "close" data - dismiss="alert" aria-label="close" >' +
                                //                    '<i class="fas fa-times"></i></a>' +
                                //                    'بروز خطا در حذف اطلاعات</div>')
                                //            }
                                //        },
                                //        error: function () {
                                //            var errorMessage = 'بروز خطا در برقراری ارتباط';
                                //            Script.Error(errorMessage);
                                //        },
                                //    });
                                //}
                            },
                            "EditCentral": {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "ویرایش مرکز",
                                "icon": "fas fa-edit",
                                "action": function (obj) {
                                    var nodeId = node.id;
                                    $('#Id').val(nodeId);
                                    $('#code').attr('disabled', true);
                                    $('#id_type').attr('disabled', true);
                                    $('#description').attr('disabled', true);
                                    $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                                    $('.TreeForm').removeClass('displayNone').addClass('displayShow');
                                    Script.GetTreeNodeDetails(nodeId);
                                }
                            },
                            "RemoveCentral": {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "حذف مرکز",
                                "icon": "fas fa-trash-alt",
                                "action": function (obj) {
                                    var nodeId = node.id;
                                    $.ajax({
                                        type: 'GET',
                                        url: '/IndirectCost/DeleteCentral',
                                        dataType: 'json',
                                        cache: false,
                                        data: { id: nodeId },
                                        success: function (response) {
                                            if (response == true) {
                                                window.location.reload();

                                            }
                                            else if (response == false) {
                                                $('#message').html(
                                                    '<div class="alert alert-danger alert-dismissible">' +
                                                    '<a href="#" class= "close" data - dismiss="alert" aria-label="close" >' +
                                                    '<i class="fas fa-times"></i></a>' +
                                                    'بروز خطا در حذف اطلاعات</div>').delay(5000).fadeOut(800);
                                            }
                                        },
                                        error: function () {
                                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                                            Script.Error(errorMessage);
                                        },
                                    });
                                }
                            },
                        }
                        if (node.parent == "#") {
                            // Delete the "delete" menu item
                            delete items.RemoveCentral;
                            delete items.EditCentral;
                            delete items.CreateCost;
                            delete items.EditCost;
                            delete items.RemoveCost;
                        }
                        if (node.parent != "#") {
                            // Delete the "delete" menu item
                            delete items.ActivateTree;
                        }
                         if (node.parents.length == 2) {
                            delete items.CreateCentral;
                             delete items.EditCost;
                             delete items.RemoveCost;
                        }
                         if (node.parents.length > 2) {
                             delete items.CreateCentral;
                             delete items.EditCentral;
                             delete items.RemoveCentral;
                         }
                        return items;
                    },
            },
        });

    },
    GetTreeNodeDetails: function (nodeId) {
        $.ajax({
            type: 'GET',
            url: '/IndirectCost/GetCentral',
            dataType: 'json',
            cache: false,
            data: { id: nodeId },
            success: function (response) {
                var TreeNodeId = response.id;
                var TreeNodeName = response.name;
                var TreeNodeCode = response.code;
                var TreeNodeType = response.id_type;
                var TreeNodeDescription = response.description;
                $('#code').val(TreeNodeCode);
                $('#name').val(TreeNodeName);
                $('#id_type').find('option[value="' + TreeNodeType + '"]').attr('selected', true);
                if (TreeNodeDescription) { $('#description').val(TreeNodeDescription); }
            },
            error: function () {
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                InDirectCost.Error(errorMessage);
            },
        });
    },
    CreateTree: function () {
        $('#frmTreeDetail').on('submit', function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                code: { required: true, number: true },
                name: { required: true, },
                id_type: { required: true, },
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
InDirectCost.init();