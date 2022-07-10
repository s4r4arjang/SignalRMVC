var CostCategoryId, ProjectId;
var CostCategory = {
    init: function () {
        CostCategory.AddListener();

    },
    AddListener: function () {
        debugger;
        //دریافت آی دی درخت فعالیت
        $(document).ready(function () {
            ProjectId = $('#ProjectId.CostCategory').val();
            //دریافت اطلاعات درخت فعالیت
            CostCategory.GetCostCategoryTree();
            ////ایجاد درخت
            //  CostCategory.CreateCostCategory( isCreateNode);
            ////ویرایش درخت
            CostCategory.EditCostCategory();
            // ایجاد ریشه
            $('#createNode').on('click',
                function () {
                    CostCategory.CreateNode();
                });
        });
    },
    CreateNode: function () {
        $('.CostCategoryTreeCreateForm').removeClass('displayNone').addClass('displayShow');
        $('.CostCategoryTreeEditForm').removeClass('displayShow').addClass('displayNone');
        isCreateNode = true;
        CostCategory.CreateCostCategory(isCreateNode);
    },
    GetCostCategoryTree: function () {
        debugger;
        function onChangeCostCategoryTree(e) {
            $('.CostCategoryTreeCreateForm').removeClass('displayShow').addClass('displayNone');
            $('.CostCategoryTreeEditForm').removeClass('displayShow').addClass('displayNone');
            $('#ListIndicator').removeClass('displayShow').addClass('displayNone');
        }


        var rootUrl = "/CostCategory";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/GetLevelStructure?Type=" + $('#Type').val(),
                    dataType: "jsonp"
                }
            },
            schema: {
                model: {
                    id: "CostCategoryId",
                    hasChildren: "HasChild",
                }
            },
        });
  
        $("#CostCategoryTreeMenu").kendoContextMenu({
            target: "#CostCategoryTree",
            filter: ".k-in",
            select: function (e) {
                var button = $(e.item);
                var node = $(e.target);
                var data = $("#CostCategoryTree").data("kendoTreeView").dataItem(node);
                CostCategoryId = data.CostCategoryId;

                CostCategoryTitle = data.Title;


                if (button.text() === 'افزودن') {

                    isCreateNode = false;
                    $('.CostCategoryTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                    $('.CostCategoryTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    $('#ListIndicator').removeClass('displayShow').addClass('displayNone');
                    CostCategory.CreateCostCategory(isCreateNode)

                }
                else if (button.text() === 'ویرایش') {
                    $('.CostCategoryTreeEditForm').removeClass('displayNone').addClass('displayShow');
                    $('.CostCategoryTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    $('#ListIndicator').removeClass('displayShow').addClass('displayNone');
                  
                    $('#frm-editCostCategory').find('#Title').val(CostCategoryTitle);


                }
                else if (button.text() === 'حذف') {
                    $('.CostCategoryTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    $('.CostCategoryTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    $('#ListIndicator').removeClass('displayShow').addClass('displayNone');
                    var option = {
                        "timeOut": "0",
                        "closeButton": true,
                        "positionClass": "toast-bottom-full-width",
                        "timeOut": "4000",
                    }

                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                    $.ajax({
                        type: 'POST',
                        url: '/CostCategory/Delete',
                        dataType: 'json',
                        async: false,
                        data: {
                            'id': CostCategoryId,
                            __RequestVerificationToken: token,
                        },
                        success: function (response) {
                            if (response.Status === true) {
                                toastr.success(response.Message, "ساختار", option);
                            }
                            else {
                                toastr.error(response.Message, "ساختار", option);
                            }

                            var CostCategoryTree = $("#CostCategoryTree").data("kendoTreeView");
                            CostCategoryTree.dataSource.read();

                        },
                        error: function () {
                            toastr.error('بروز خطا در برقراری ارتباط', "ساختار", option);

                        }
                    });
                }
                else if (button.text() === "شاخص") {

                    $('.CostCategoryTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    $('.CostCategoryTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    $('#ListIndicator').removeClass('displayNone').addClass('displayShow');
                    CostCategory.IndicatorManage();


                }
            }
        });
        $("#CostCategoryTree").kendoTreeView({

            dataSource: data,
            dataTextField: "Title",
            change: onChangeCostCategoryTree,

        });
    },
    CreateCostCategory: function (isCreateNode) {

        if (isCreateNode === true) {
            CostCategoryId = null;
        }
        $("#frm-createCostCategory").submit(function (e) {

            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },

            },
            messages: {
            },
            submitHandler: function (form) {

                var Title = $('#frm-createCostCategory').find('#Title').val();
                var Type = $("#Type").val();
                debugger;
                var model = {

                    'Title': Title,
                    'ParentId': CostCategoryId,
                    'Type': Type
                }
                var option = {
                    "timeOut": "0",
                    "closeButton": true,
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "4000",
                }
                       var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/CostCategory/Create',
                        dataType: 'json',

                        data: {
                            model,
                           __RequestVerificationToken: token,
                        },
                        success: function (response) {


                            document.getElementById("frm-createCostCategory").reset();
                            $('.CostCategoryTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                            if (response.Status === true) {
                                toastr.success(response.Message, "دسته بندی هزینه", option);
                            }
                            else {
                                toastr.error(response.Message, "دسته بندی هزینه", option);
                            }

                            var CostCategoryTree = $("#CostCategoryTree").data("kendoTreeView");
                            CostCategoryTree.dataSource.read();

                        },
                        error: function () {
                            toastr.error(response.Message, "امکان حذف وجود ندارد", option);

                        },
                    });
            }
        });
    },
    EditCostCategory: function () {
        debugger;
        $("#frm-editCostCategory").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },

            },
            messages: {
            },
            submitHandler: function (form) {

                var Title = $('#frm-editCostCategory').find('#Title').val();

                var model = {

                    'Title': Title,
                    'CostCategoryId': CostCategoryId,

                }
                var option = {
                    "timeOut": "0",
                    "closeButton": true,
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "4000",
                }
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/CostCategory/Edit',
                        dataType: 'json',

                        data: {
                            model,
                           __RequestVerificationToken: token,
                        },
                        success: function (response) {


                            if (response.Status === true) {
                                toastr.success(response.Message, "دسته بندی هزینه", option);
                            }
                            else {
                                toastr.error(response.Message, "دسته بندی هزینه", option);
                            }
                            $('.CostCategoryTreeEditForm').removeClass('displayShow').addClass('displayNone');
                            $('.CostCategoryTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                            var CostCategoryTree = $("#CostCategoryTree").data("kendoTreeView");
                            CostCategoryTree.dataSource.read();

                        },
                        error: function () {
                            toastr.error(response.Message, "بروز خطا در برقراری ارتباط", option);
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
CostCategory.init();


