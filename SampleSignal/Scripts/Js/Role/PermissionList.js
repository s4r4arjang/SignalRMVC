var PermissionId, isCreateNode
Nodes = [];
var PermissionList = {
    init: function () {
        PermissionList.AddListener();

    },
    AddListener: function () {

        //دریافت آی دی درخت 
        $(document).ready(function () {

            //دریافت اطلاعات درخت 
            PermissionList.GetPermissionTree();

            $('#AssignPermissionToRole').on('click',
                function () {
                    PermissionList.AssignPermissionToRole();
                });
        });
    },
    GetPermissionTree: function () {
        debugger;
        function onChangePermissionTree(e) {
            debugger;
            $('.PermissionTreeCreateForm').removeClass('displayShow').addClass('displayNone');
            $('.PermissionTreeEditForm').removeClass('displayShow').addClass('displayNone');

        }


        var rootUrl = "/Role";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/PermissionsList?RoleId=" + $('#RoleId').val(),
                    dataType: "jsonp"
                }
            },
            schema: {
                model: {
                    id: "PermissionId",
                    hasChildren: "HasChild",
                    HasPermission:"HasPermission" 

                }
            },
        });

        $("#PermissionTreeMenu").kendoContextMenu({
            target: "#PermissionTree",
            filter: ".k-in",
            select: function (e) {
                debugger
                var button = $(e.item);
                var node = $(e.target);
                var data = $("#PermissionTree").data("kendoTreeView").dataItem(node);
                $(e.node).find(":checkbox[isselected='true']").prop("checked", true);
                
                PermissionId = data.PermissionId;

                PermissionTitle = data.Title;


                e.preventDefault();
                var checkbox = $(e.node).find(":checkbox");
                var checked = checkbox.prop("checked");
                checkbox.prop("checked", !checked);     
            },

        });

        $("#PermissionTree").kendoTreeView({

            dataSource: data,
            dataTextField: "Title",
            change: onChangePermissionTree,
            checkboxes: {
            
                checkChildren: true,
                checkboxes: true,
         //   template: '<input type="checkbox" #= item.HasPermission? \'checked="checked"\' : "" # class="chkbx" />',   name="checkedFiles[#= item.PermissionId #]"
                template: '<input type="checkbox" #= item.HasPermission? \'value="true" checked="checked" \' : \'value="false"\'  # />',
                name: "checkedItems[]"

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
                debugger
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



    AssignPermissionToRole: function () {
        debugger
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
                url: '/Role/SetPermissionsToRole',
                dataType: 'json',

                data: {
                    'RoleId': document.getElementById('RoleId').value,
                    'Permissions': Nodes,
                    __RequestVerificationToken: token
                },
                success: function (response) {
                    var messageClass = '';
                    if (response.Status == true) {

                        AllertSuccess(response.Message, "دسترسی");
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
PermissionList.init();


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