
var BudgetExpenditureResourceType = {
    init: function () {
        BudgetExpenditureResourceType.AddListener();

    },
    AddListener: function () {
        debugger;
        //دریافت آی دی درخت فعالیت
        $(document).ready(function () {
            
            //دریافت اطلاعات درخت فعالیت
            BudgetExpenditureResourceType.GetBudgetExpenditureResourceTypeTree();
            ////ایجاد درخت
            //  BudgetExpenditureResourceType.CreateBudgetExpenditureResourceType( isCreateNode);
            ////ویرایش درخت
            BudgetExpenditureResourceType.EditBudgetExpenditureResourceType();
            // ایجاد ریشه
            $('#createNode').on('click',
                function () {
                    BudgetExpenditureResourceType.CreateNode();
                });
        });
    },
    CreateNode: function () {
        $('.BudgetExpenditureResourceTypeTreeCreateForm').removeClass('displayNone').addClass('displayShow');
        $('.BudgetExpenditureResourceTypeTreeEditForm').removeClass('displayShow').addClass('displayNone');
        isCreateNode = true;
        BudgetExpenditureResourceType.CreateBudgetExpenditureResourceType(isCreateNode);
    },
    GetBudgetExpenditureResourceTypeTree: function () {
        debugger;
        function onChangeBudgetExpenditureResourceTypeTree(e) {
            $('.BudgetExpenditureResourceTypeTreeCreateForm').removeClass('displayShow').addClass('displayNone');
            $('.BudgetExpenditureResourceTypeTreeEditForm').removeClass('displayShow').addClass('displayNone');
            $('#ListIndicator').removeClass('displayShow').addClass('displayNone');
        }


        var rootUrl = "/BudgetExpenditureResourceType";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/GetLevelStructure?Type=" + $('#Type').val(),
                    dataType: "jsonp"
                }
            },
            schema: {
                model: {
                    id: "BudgetExpenditureResourceTypeId",
                    hasChildren: "HasChild",
                }
            },
        });

        $("#BudgetExpenditureResourceTypeTreeMenu").kendoContextMenu({
            target: "#BudgetExpenditureResourceTypeTree",
            filter: ".k-in",
            select: function (e) {
                var button = $(e.item);
                var node = $(e.target);
                var data = $("#BudgetExpenditureResourceTypeTree").data("kendoTreeView").dataItem(node);
                BudgetExpenditureResourceTypeId = data.BudgetExpenditureResourceTypeId;

                BudgetExpenditureResourceTypeTitle = data.Title;


                if (button.text() === 'افزودن') {

                    isCreateNode = false;
                    $('.BudgetExpenditureResourceTypeTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                    $('.BudgetExpenditureResourceTypeTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    $('#ListIndicator').removeClass('displayShow').addClass('displayNone');
                    BudgetExpenditureResourceType.CreateBudgetExpenditureResourceType(isCreateNode)

                }
                else if (button.text() === 'ویرایش') {
                    $('.BudgetExpenditureResourceTypeTreeEditForm').removeClass('displayNone').addClass('displayShow');
                    $('.BudgetExpenditureResourceTypeTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    $('#ListIndicator').removeClass('displayShow').addClass('displayNone');

                    $('#frm-editBudgetExpenditureResourceType').find('#Title').val(BudgetExpenditureResourceTypeTitle);


                }
                else if (button.text() === 'حذف') {
                    $('.BudgetExpenditureResourceTypeTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    $('.BudgetExpenditureResourceTypeTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    $('#ListIndicator').removeClass('displayShow').addClass('displayNone');

                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                    $.ajax({
                        type: 'POST',
                        url: '/BudgetExpenditureResourceType/Delete',
                        dataType: 'json',
                        async: false,
                        data: {
                            'id': BudgetExpenditureResourceTypeId,
                             __RequestVerificationToken: token,
                        },
                        success: function (response) {
                            if (response.Status === true) {
                                AllertSuccess(response.Message, "دسته بندی منابع و مصارف");
                                
                            }
                            else {
                                AllertError(response.Message, "دسته بندی منابع و مصارف");
                            }

                            var BudgetExpenditureResourceTypeTree = $("#BudgetExpenditureResourceTypeTree").data("kendoTreeView");
                            BudgetExpenditureResourceTypeTree.dataSource.read();

                        },
                        error: function () {
                            AllertError('امکان حذف وجود ندارد', "دسته بندی منابع و مصارف");

                        }
                    });
                }
               
            }
        });
        $("#BudgetExpenditureResourceTypeTree").kendoTreeView({

            dataSource: data,
            dataTextField: "Title",
            change: onChangeBudgetExpenditureResourceTypeTree,

        });
    },
    CreateBudgetExpenditureResourceType: function (isCreateNode) {

        if (isCreateNode === true) {
            BudgetExpenditureResourceTypeId = null;
        }
        $("#frm-createBudgetExpenditureResourceType").submit(function (e) {

            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },

            },
            messages: {
            },
            submitHandler: function (form) {

                var Title = $('#frm-createBudgetExpenditureResourceType').find('#Title').val();
                var Type = $("#Type").val();
                debugger;
                var model = {

                    'Title': Title,
                    'ParentId': BudgetExpenditureResourceTypeId,
                    'Type': Type
                }
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();

                $.ajax(
                    {
                        type: 'POST',
                        url: '/BudgetExpenditureResourceType/Create',
                        dataType: 'json',

                        data: {
                            model,
                           __RequestVerificationToken: token,
                        },
                        success: function (response) {


                            document.getElementById("frm-createBudgetExpenditureResourceType").reset();
                            $('.BudgetExpenditureResourceTypeTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                            if (response.Status === true) {
                                AllertSuccess(response.Message, "دسته بندی منابع و مصارف");
                            }
                            else {
                                AllertError(response.Message, "دسته بندی منابع و مصارف");
                            }

                            var BudgetExpenditureResourceTypeTree = $("#BudgetExpenditureResourceTypeTree").data("kendoTreeView");
                            BudgetExpenditureResourceTypeTree.dataSource.read();

                        },
                        error: function () {
                            AllertError("بروز خطا در برقراری ارتباط","دسته بندی منابع و مصارف" );

                        },
                    });
            }
        });
    },
    EditBudgetExpenditureResourceType: function () {
        debugger;
        $("#frm-editBudgetExpenditureResourceType").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },

            },
            messages: {
            },
            submitHandler: function (form) {

                var Title = $('#frm-editBudgetExpenditureResourceType').find('#Title').val();

                var model = {

                    'Title': Title,
                    'BudgetExpenditureResourceTypeId': BudgetExpenditureResourceTypeId,

                }
                var form = $('#__AjaxAntiForgeryForm');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/BudgetExpenditureResourceType/Edit',
                        dataType: 'json',

                        data: {
                            model,
                            __RequestVerificationToken: token,
                        },
                        success: function (response) {


                            if (response.Status === true) {
                                AllertSuccess(response.Message, "دسته بندی منابع و مصارف");
                            }
                            else {
                                AllertError(response.Message, "دسته بندی منابع و مصارف");
                            }
                            $('.BudgetExpenditureResourceTypeTreeEditForm').removeClass('displayShow').addClass('displayNone');
                            $('.BudgetExpenditureResourceTypeTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                            var BudgetExpenditureResourceTypeTree = $("#BudgetExpenditureResourceTypeTree").data("kendoTreeView");
                            BudgetExpenditureResourceTypeTree.dataSource.read();

                        },
                        error: function () {
                            AllertError("بروز خطا در برقراری ارتباط", "دسته بندی منابع و مصارف");
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
BudgetExpenditureResourceType.init();


