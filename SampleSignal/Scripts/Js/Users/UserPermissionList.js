var PermissionId, isCreateNode
Nodes = [];
var UserPermissionList = {
    init: function () {
        UserPermissionList.AddListener();

    },
    AddListener: function () {

        //دریافت آی دی درخت 
        $(document).ready(function () {

            //دریافت اطلاعات درخت 
            UserPermissionList.GetPermissionTree();

            $('#AssignPermissionToUser').on('click',
                function () {
                    UserPermissionList.AssignPermissionToUser();
                });
        });
    },
    GetPermissionTree: function () {
        debugger;
        function onChangePermissionTree(e) {
            $('.PermissionTreeCreateForm').removeClass('displayShow').addClass('displayNone');
            $('.PermissionTreeEditForm').removeClass('displayShow').addClass('displayNone');

        }


        var rootUrl = "/Users";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/PermissionsList?UserId=" + $('#UserId').val(),
                    dataType: "jsonp"
                }
            },
            schema: {
                model: {
                    id: "PermissionId",
                    hasChildren: "HasChild",
                    HasPermission: "HasPermission"
                }
            },
        });

        $("#PermissionTreeMenu").kendoContextMenu({
            target: "#PermissionTree",
            filter: ".k-in",
            select: function (e) {
                var button = $(e.item);
                var node = $(e.target);
                var data = $("#PermissionTree").data("kendoTreeView").dataItem(node);
                $(e.node).find(":checkbox[isselected='true']").prop("checked", true);
                PermissionId = data.PermissionId;

                PermissionTitle = data.Title;
            },

           
        });
        $("#PermissionTree").kendoTreeView({

            dataSource: data,
            dataTextField: "Title",
            change: onChangePermissionTree,
            checkboxes: {
                checkChildren: true,
                template: '<input type="checkbox" #= item.HasPermission? \'checked="checked"\' : "" # class="chkbx" />'
            },
            check: function (e) {

                e.preventDefault();
                var checkbox = $(e.node).find(":checkbox");
                var checked = checkbox.prop("checked");
                var data = this.dataItem(e.node)
                checkChild(e.node, checked);
                data.HasPermission = checked;
            },
            //check: onCheck,
            dataBound: function (e) {
                var treeView = $("#PermissionTree").data("kendoTreeView");
                treeView.expand(".k-item");
            }

        });

        function checkChild(nodes, checked) {
            // var childs = nodes.children;
            var childs = $(".k-item", nodes);
            debugger;
            for (var i = 0; i < childs.length; i++) {

                $("#PermissionTree").data("kendoTreeView").dataItem(childs[i]).HasPermission = checked;


                if (childs[i].hasChildren) {
                    checkChild(childs[i], checked);
                }
            }
        }
    },

    AssignPermissionToUser: function () {

        var treeView = $("#PermissionTree").data("kendoTreeView").dataSource.view();

        Nodes = [];
        treeView = $("#PermissionTree").data("kendoTreeView"),

            checkedNodeIds(treeView.dataSource.view(), Nodes);
        debugger;

        var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        $.ajax(
            {
                type: 'Post',
                url: '/Users/SetPermissionsToUser',
                dataType: 'json',

                data: {
                    'UserId': document.getElementById('UserId').value,
                    'Permissions': Nodes,
                    __RequestVerificationToken: token
                },
                success: function (response) {
                    var messageClass = '';
                    if (response.Status == true) {

                        AllertSuccess(response.Message, "دسترسی");

                        var PermissionTree = $("#PermissionTree").data("kendoTreeView");
                        PermissionTree.clearSelection();
                        PermissionTree.dataSource.read();
                        PermissionTree.refresh();



                    }
                    else {
                        AllertError(response.Message, "دسترسی");
                    }

                },
                error: function () {

                    AllertError("بروز خطا در برقراری ارتباط", "دسترسی");
                },
            });
    },

    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
UserPermissionList.init();
function checkedNodeIds(nodes, Nodes) {
    debugger;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].HasPermission) {
            Nodes.push(nodes[i].id);

        }

        if (nodes[i].hasChildren) {
            checkedNodeIds(nodes[i].children.view(), Nodes);
        }
    }
}


