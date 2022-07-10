var ProductId, ProcessId;
var Product = {
    init: function () {
       
        Product.AddListener();

    },
    AddListener: function () {
       
        //دریافت آی دی درخت فعالیت
        $(document).ready(function () {
            ProcessId = $('#ProcessId').val();
            //دریافت اطلاعات درخت فعالیت
            Product.GetProductTree(ProcessId);
            //ویرایش درخت
            Product.EditProduct();
            // ایجاد ریشه
            $('#createNode').on('click',
            
                function () {
                    
                    Product.CreateNode();
                });
        });
    },
    CreateNode: function () {
        
        
        $('.ProductTreeCreateForm').removeClass('displayNone').addClass('displayShow');
        $('.ProductTreeEditForm').removeClass('displayShow').addClass('displayNone');
        isCreateNode = true;
        Product.CreateProduct(isCreateNode);
    },
    GetProductTree: function () {
       
        function onChangeProductTree(e) {
            $('.ProductTreeCreateForm').removeClass('displayShow').addClass('displayNone');
            $('.ProductTreeEditForm').removeClass('displayShow').addClass('displayNone');


            var treeData = $('#ProductTree').data('kendoTreeView'),
                selected = treeData.select(),
                item = treeData.dataItem(selected);
            var productId = item.ProductId;
            var processId = item.ProcessId;
           

            if (item.hasChildren) {
                e.preventDefault();

            } else {

                Product.StepManagement(productId, processId)
            }

        }


        var rootUrl = "/ProductNew";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/GetLevels?ProcessId=" + $('#ProcessId').val(),
                    dataType: "jsonp"
                }
            },
            schema: {
                model: {
                    id: "ProductId",
                    hasChildren: "HasChild",
                }
            },
        });

        $("#ProductTreeMenu").kendoContextMenu({
            target: "#ProductTree",
            filter: ".k-in",
            select: function (e) {
                var button = $(e.item);
                var node = $(e.target);
                var data = $("#ProductTree").data("kendoTreeView").dataItem(node);
                ProductId = data.ProductId;
                ProductTitle = data.ProductTitle;
                parentProductId = data.ParentId;
                ProductCode = data.Code;
                ProductMoneyUnitId=data.MoneyUnitId
                if (button.text() === 'افزودن') {

                    isCreateNode = false;
                    $('.ProductTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                    $('.ProductTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    $('.ListProductStep').removeClass('displayShow').addClass('displayNone');
                    
                   
                    Product.CreateProduct(isCreateNode)

                }
                else if (button.text() === 'ویرایش') {
                    debugger;
                    $('.ProductTreeEditForm').removeClass('displayNone').addClass('displayShow');
                    $('.ProductTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    $('.ListProductStep').removeClass('displayShow').addClass('displayNone');

                    $('#frm-editProduct').find('#Title').val(ProductTitle);
                    $('#frm-editProduct').find('#ID').val(ProductId);
                    $('#frm-editProduct').find('#Code').val(ProductCode);
                    $('#frm-editProduct').find('#MoneyUnitId').val(ProductMoneyUnitId);
                }
                else if (button.text() === 'حذف') {
                    $('.ProductTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    $('.ProductTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    $('.ListProductStep').removeClass('displayShow').addClass('displayNone');

                    var form = $('#__AjaxAntiForgeryForm');
                    var token = $('input[name="__RequestVerificationToken"]', form).val();
                    $.ajax({
                        type: 'POST',
                        url: '/ProductNew/Delete',
                        dataType: 'json',
                        async: false,
                        data: {
                            'Id': ProductId,
                            __RequestVerificationToken: token
                        },
                        success: function (response) {
                            if (response.Status === true) {

                                AllertSuccess(response.Message, "فرایند/برنامه/مرحله");
                                var ProductTree = $("#ProductTree").data("kendoTreeView");
                                ProductTree.dataSource.read();
                            }
                            else {
                                AllertError(response.Message, "فرایند/برنامه/مرحله");
                            }

                            

                        },
                        error: function () {

                            AllertError("امکان حذف وجود ندارد", "فرایند/برنامه/مرحله");
                        }
                    });
                }

            }
        });
        $("#ProductTree").kendoTreeView({

            dataSource: data,
            dataTextField: "ProductTitle",
            change: onChangeProductTree,

        });
    },
    CreateProduct: function (isCreateNode) {
        
        if (isCreateNode === true) {
            ProductId = null;
        }
        $("#frm-createProduct").submit(function (e) {

            e.preventDefault();
        }).validate({
            rules: {
                ProductTitle: { required: true },
                Code: { required: true, number: true },
                

            },
            messages: {
            },
            submitHandler: function (form) {
                var Title = $('#frm-createProduct').find('#Title').val();
                var Code = $('#frm-createProduct').find('#Code').val();
                var MoneyUnitId = $('#frm-createProduct').find('#MoneyUnitId').val();

                var model = {
                    'ProcessId': ProcessId, 'ParentId': ProductId, 'ProductTitle': Title,
                    'Code': Code, 'MoneyUnitId': MoneyUnitId
                    
                }
                var form = $('#frm-createProduct');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/ProductNew/Create',
                        dataType: 'json',

                        data: {
                            model,
                            __RequestVerificationToken: token
                        },
                        success: function (response) {


                         
                            if (response.Status === true) {
                                AllertSuccess(response.Message, "فرایند/برنامه/مرحله");
                                document.getElementById("frm-createProduct").reset();
                                $('.ProductTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                                var ProductTree = $("#ProductTree").data("kendoTreeView");
                                ProductTree.dataSource.read();
                            }
                            else {
                                AllertError(response.Message, "فرایند/برنامه/مرحله");
                            }

                           

                        },
                        error: function () {

                            AllertError("امکان ایجاد وجود ندارد", "فرایند/برنامه/مرحله");

                        },
                    });
            }
        });
    },
    EditProduct: function () {
        
        debugger;
        $("#frm-editProduct").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },
                Code: { required: true, number: true },

            },
            messages: {
            },
            submitHandler: function (form) {
                debugger;

                var ProductId = $('#frm-editProduct').find('#ID').val();
                var Title = $('#frm-editProduct').find('#Title').val();
                var Code = $('#frm-editProduct').find('#Code').val();
                var MoneyUnitId= $('#frm-editProduct').find('#MoneyUnitId').val();
               
                
                var model = {
                    'ProductId': ProductId, 'ProcessId': ProcessId, 'ParentId': parentProductId, 'ProductTitle': Title,
                    'Code': Code, 'MoneyUnitId':MoneyUnitId
                }


                var form = $('#frm-editProduct');
                var token = $('input[name="__RequestVerificationToken"]', form).val();

                $.ajax(
                    {
                        type: 'POST',
                        url: '/ProductNew/Edit',
                        dataType: 'json',

                        data: {
                            model,
                            __RequestVerificationToken : token
                        },
                        success: function (response) {


                            if (response.Status === true) {
                                AllertSuccess(response.Message, "فرایند/برنامه/مرحله");
                                $('.ProductTreeEditForm').removeClass('displayShow').addClass('displayNone');
                                $('.ProductTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                                var ProductTree = $("#ProductTree").data("kendoTreeView");
                                ProductTree.dataSource.read();
                            }
                            else {
                                AllertError(response.Message, "فرایند/برنامه/مرحله");
                            }
                          

                        },
                        error: function () {

                            AllertError("امکان ویرایش وجود ندارد", "فرایند/برنامه/مرحله");
                        },
                    });
            }
        });
    },
    StepManagement: function productStepManagement(productId, processId ) {
        //   e.stopPropagation();
        // e.preventDefault();
        debugger;
        $('.ProductTreeCreateForm').removeClass('displayShow').addClass('displayNone');
        $('.ProductTreeEditForm').removeClass('displayShow').addClass('displayNone');
        $('.ListProductStep').removeClass('displayNone').addClass('displayShow');
        $.ajax(
            {
                type: "GET",
                url: '/ProductStepNew/Index?productId=' + productId,
                dataType: "html",
                success: function (response) {


                    $("#ListProductStep").html(response)
                },
            }
        );

    },



    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
Product.init();

function listProductStep(id) {
    debugger;
    $.ajax(
        {
            type: "GET",
            url: '/ProductStepNew/Index?productId=' + id,
            dataType: "html",
            success: function (response) {


                $("#ListProductStep").html(response)
            },
        }
    );
}
