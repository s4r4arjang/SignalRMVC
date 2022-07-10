var PermissionId, isCreateNode;
var Permission = {
    init: function () {
        Permission.AddListener();

    },
    AddListener: function () {
        
        //دریافت آی دی درخت 
        $(document).ready(function () {

            //دریافت اطلاعات درخت 
            Permission.GetPermissionTree();
            //ایجاد درخت
            Permission.CreatePermission(isCreateNode);
            //ویرایش درخت
            Permission.EditPermission();
            // ایجاد ریشه
            $('#createNode').on('click',
                function () {
                    Permission.CreateNode();
                });
        });
    },
    CreateNode: function () {
        $('.PermissionTreeCreateForm').removeClass('displayNone').addClass('displayShow');
        $('.PermissionTreeEditForm').removeClass('displayShow').addClass('displayNone');
        isCreateNode = true;
        Permission.CreatePermission(isCreateNode);
    },
    GetPermissionTree: function () {
        debugger;
        function onChangePermissionTree(e) {
            $('.PermissionTreeCreateForm').removeClass('displayShow').addClass('displayNone');
            $('.PermissionTreeEditForm').removeClass('displayShow').addClass('displayNone');
            
        }


        var rootUrl = "/Permission";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/GetLevelStructure",
                    dataType: "jsonp"
                }
            },
            schema: {
                model: {
                    id: "PermissionId",
                    hasChildren: "HasChild",
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
                
                PermissionId = data.PermissionId;

                PermissionTitle = data.Title;
                PermissionCode = data.Code;
                PermissionValue = data.Value;

                if (button.text() === 'افزودن') {

                    isCreateNode = false;
                    $('.PermissionTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                    $('.PermissionTreeEditForm').removeClass('displayShow').addClass('displayNone');
                 
                    Permission.CreatePermission(isCreateNode)

                }
                else if (button.text() === 'ویرایش') {
                    debugger
                    $('.PermissionTreeEditForm').removeClass('displayNone').addClass('displayShow');
                    $('.PermissionTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    
                    $('#frm-editPermission').find('#Title').val(PermissionTitle);
                    $('#frm-editPermission').find('#Code').val(PermissionCode);
                    $('#frm-editPermission').find('#Value').val(PermissionValue);


                }
                else if (button.text() === 'حذف') {
                    $('.PermissionTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    $('.PermissionTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    
                    var form = $('#__AjaxAntiForgeryForm');
                    var token = $('input[name="__RequestVerificationToken"]', form).val();
                    $.ajax({
                        type: 'POST',
                        url: '/Permission/Delete',
                        dataType: 'json',
                        async: false,
                        data: {
                            'id': PermissionId,
                            __RequestVerificationToken: token,
                        },
                        success: function (response) {
                            if (response.Status === true) {
                                AllertSuccess(response.Message, "دسترسی");
                            }
                            else {
                                AllertError(response.Message, "دسترسی");
                            }

                            var PermissionTree = $("#PermissionTree").data("kendoTreeView");
                            PermissionTree.dataSource.read();

                        },
                        error: function () {
                            AllertError("امکان حذف وجود ندارد", "دسترسی");

                        }
                    });
                }

            }
        });
        $("#PermissionTree").kendoTreeView({
            
            dataSource: data,
            dataTextField: "Title",
            change: onChangePermissionTree
        });
    },
    CreatePermission: function (isCreateNode) {

        if (isCreateNode === true) {
            PermissionId = null;
        }
        $("#frm-createPermission").submit(function (e) {

            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },
                Code: { required: true },

            },
            messages: {
            },
            submitHandler: function (form) {

                var Title = $('#frm-createPermission').find('#Title').val();
                var Code = $('#frm-createPermission').find('#Code').val();
                var Value = $('#frm-createPermission').find('#Value').val();
                debugger;
                var model = {

                    'Title': Title,
                    'ParentId': PermissionId,
                    'Code': Code,
                    'Value': Value

                }

                var form = $('#__AjaxAntiForgeryForm');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Permission/Create',
                        dataType: 'json',

                        data: {
                            model,
                            __RequestVerificationToken: token,
                        },
                        success: function (response) {


                            document.getElementById("frm-createPermission").reset();
                            $('.PermissionTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                            if (response.Status === true) {
                                AllertSuccess(response.Message, "دسترسی");
                            }
                            else {
                                AllertError(response.Message, "دسترسی");
                            }

                            var PermissionTree = $("#PermissionTree").data("kendoTreeView");
                            PermissionTree.dataSource.read();

                        },
                        error: function () {
                            AllertError("بروز خطا در برقراری ارتباط", "دسترسی");

                        },
                    });
            }
        });
    },
    EditPermission: function () {
        debugger;
        $("#frm-editPermission").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },
                Code: { required: true },

            },
            messages: {
            },
            submitHandler: function (form) {

                var Title = $('#frm-editPermission').find('#Title').val();
                var Code = $('#frm-editPermission').find('#Code').val();
                var Value = $('#frm-editPermission').find('#Value').val();
                var model = {

                    'Title': Title,
                    'PermissionId': PermissionId,
                    'Code': Code,
                    'Value': Value


                }

                var form = $('#__AjaxAntiForgeryForm');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Permission/Edit',
                        dataType: 'json',

                        data: {
                            model,
                            __RequestVerificationToken: token,
                        },
                        success: function (response) {


                            if (response.Status === true) {
                                AllertSuccess(response.Message, "دسترسی");
                            }
                            else {
                                AllertError(response.Message, "دسترسی");
                            }
                            $('.PermissionTreeEditForm').removeClass('displayShow').addClass('displayNone');
                            $('.PermissionTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                            var PermissionTree = $("#PermissionTree").data("kendoTreeView");
                            PermissionTree.dataSource.read();

                        },
                        error: function () {
                            AllertError("بروز خطا در برقراری ارتباط", "دسترسی");
                        },
                    });
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
Permission.init();


