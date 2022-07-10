var costId, parentCostId, costTitle, costCode, costParentCode, costType, costDriverId, costGroupId, description = '', isCreateNode = false,
     CostTypeID;
var CostStructure = {
    init: function () {
        debugger;
        CostStructure.AddListener();
       


    },
    AddListener: function () {
        $(document).find('.CostType').on('change', function () {
            debugger;
            CostTypeID = $(this).val();

            costcategoryType = 1;
            if (CostTypeID === "6")
                costcategoryType = 2;
            //دریافت لست دسته بندی هزینه ها
            $.ajax({
                type: 'GET',
                url: '/CostNew/GetCostGroup?Type=' + costcategoryType,
                dataType: 'json',
                async: false,
                success: function (response) {
                    var CostGroupContent = '<option selected disabled>لطفا دسته بندی هزینه را انتخاب نمائید</option>';
                    for (i = 0; i < response.length; i++) {
                        CostGroupContent += '<option value="' + response[i].CostCategoryId + '">' + response[i].Title + '</option>';
                    }
                    $('.CostGroupId').html(CostGroupContent);
                },
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    CostStructure.Error(errorMessage);
                }
            });


            CostStructure.ChangeCostType();
           
        });
        //iCheck for checkbox and radio inputs
        $('input[type="radio"].minimal').iCheck({
            checkboxClass: 'icheckbox_minimal-blue',
            radioClass: 'iradio_minimal-blue'
        });
        //دریافت آی دی درخت هزینه
        $(document).ready(function () {
            var treeTitleCostId = $('#treeTitleCostId').val();
            //دریافت اطلاعات درخت هزینه
            CostStructure.GetCostTree(treeTitleCostId);
            //ویرایش هزینه
            CostStructure.EditCost(treeTitleCostId);
            //ایجاد نود
            $('#createCostNode').on('click',
                function () {
                    
                    $('#frm-createCost').find('#CostDriverId').attr('disabled', true);
                    $('#frm-createCost').find("#StaffPartId").attr('disabled', true);
                    $('#frm-createCost').find("#dynamicType").attr('disabled', true);
                    $('#frm-createCost').find("#MoneyUnitId").attr('disabled', false);
                    $('#frm-createCost').find("#CostGroupId").attr('disabled', false);
                    $('#frm-createCost').find(".CostType").attr('disabled', false);
                    document.getElementById("frm-createCost").reset();
                   
                    CostStructure.CreateNode(treeTitleCostId);
                });
        });
    },
    ChangeCostType: function () {
        debugger;
        
         if (CostTypeID == 3 || CostTypeID ==4) {
            debugger;
            

             $('#frm-createCost').find('#dynamicType').attr('disabled', false);
             $('#frm-editCost').find('#dynamicType').attr('disabled', false);
             if (CostTypeID != 4) {
                 $('#frm-createCost').find('#StaffPartId').attr('disabled', true);
                 $('#frm-editCost').find('#StaffPartId').attr('disabled', true);
                 
             } else {
                 $('#frm-createCost').find('#StaffPartId').attr('disabled', false);
                 $('#frm-editCost').find('#StaffPartId').attr('disabled', false);
             }

             if (CostTypeID != 3) {
                 $('#frm-createCost').find('#CostDriverId').attr('disabled', true);
                 $('#frm-editCost').find('#CostDriverId').attr('disabled', true);
             } else {
                 $('#frm-createCost').find('#CostDriverId').attr('disabled', false);
                 $('#frm-editCost').find('#CostDriverId').attr('disabled', false);
             }
             
        }
         else
         {


             if (CostTypeID != 3) {
                 $('#frm-createCost').find('#CostDriverId').attr('disabled', true);
                 $('#frm-editCost').find('#CostDriverId').attr('disabled', true);
             } else {
                 $('#frm-createCost').find('#CostDriverId').attr('disabled', false);
                 $('#frm-editCost').find('#CostDriverId').attr('disabled', false);
             }
             if (CostTypeID != 4) {
                 $('#frm-createCost').find('#StaffPartId').attr('disabled', true);
                 $('#frm-editCost').find('#StaffPartId').attr('disabled', true);
             } else {
                 $('#frm-createCost').find('#StaffPartId').attr('disabled', false);
                 $('#frm-editCost').find('#StaffPartId').attr('disabled', false);
                 
             }


            $('#frm-createCost').find('#dynamicType').val("2");
             $('#frm-editCost').find('#dynamicType').val("2");

             $('#frm-createCost').find('#dynamicType').attr('disabled', true);
             $('#frm-editCost').find('#dynamicType').attr('disabled', true);



        }
 
    },
    
    CreateNode: function (treeTitleCostId) {
        $('.costTreeCreateForm').removeClass('displayNone').addClass('displayShow');
        $('.costTreeEditForm').removeClass('displayShow').addClass('displayNone');
        isCreateNode = true;
        CostStructure.CreateCost(treeTitleCostId, isCreateNode);
    },
    GetCostTree: function (treeTitleCostId) {
        //var costIdOnExpand;

        function onChangeCostTree(e) {
            $('.costTreeCreateForm').removeClass('displayShow').addClass('displayNone');
            $('.costTreeEditForm').removeClass('displayShow').addClass('displayNone');
        }

       

        var rootUrl = "/CostNew";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/GetLevelCosts?treeTitleId=" + treeTitleCostId,
                    dataType: "jsonp"
                }
            },
            schema: {
                model: {
                    id: "CostId",
                    hasChildren: "HasChild",
                }
            },
        });
        $("#costTreeMenu").kendoContextMenu({
            target: "#costTree",
            filter: ".k-in",
            select: function (e) {
                debugger;
                var button = $(e.item);
                var node = $(e.target);
                var data = $("#costTree").data("kendoTreeView").dataItem(node);
                costId = data.CostId;
                parentCostId = data.ParentId;
                costTitle = data.CostTitle;
                costCode = data.Code;
                costParentCode = data.ParentCode;
                costType = data.CostType;
                costDriverId = data.CostDriverId;
                costGroupId = data.CostGroupId;
                staffPartId = data.StaffPartId;
                DynamicType = data.DynamicType;
                MoneyUnitId = data.MoneyUnitId;
                //IsProductive = data.IsProductive;
                description = data.Description;
                if (button.text() === 'افزودن') {
                    debugger;

                    costcategoryType = 1;
                    if (costType ==="6")
                        costcategoryType = 2;
                    //دریافت لست دسته بندی هزینه ها
                    $.ajax({
                        type: 'GET',
                        url: '/CostNew/GetCostGroup?Type=' + costcategoryType,
                        dataType: 'json',
                        async: false,
                        success: function (response) {
                            debugger;
                            var CostGroupContent = '<option value >لطفا دسته بندی هزینه را انتخاب نمائید</option>';
                            for (i = 0; i < response.length; i++) {
                                CostGroupContent += '<option value="' + response[i].CostCategoryId + '">' + response[i].Title + '</option>';

                            }
                            $('#frm-createCost .CostGroupId').html(CostGroupContent);
                        },
                        error: function () {
                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                            CostStructure.Error(errorMessage);
                        }
                    });

                                         
                    // $('#frm-createCost').find('#CostDriverId').val("3").trigger("change");
                                           

                    $('#frm-createCost').find(".CostType").attr('disabled', true);
                    $('#frm-createCost').find('#CostDriverId').attr('disabled', true);
                    $('#frm-createCost').find("#StaffPartId").attr('disabled', true);
                    $('#frm-createCost').find("#dynamicType").attr('disabled', true);
                    $('#frm-createCost').find("#MoneyUnitId").attr('disabled', false);
                    $('#frm-createCost').find("#CostGroupId").attr('disabled', false);

                   
                    isCreateNode = false;
                    $('.costTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                    $('.costTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    var preCode = '';
                    if (costParentCode !== null) {
                        preCode = costParentCode + costCode;
                    } else {
                        preCode = costCode;
                    }
                    $('#frm-createCost').find('#preCode').val(preCode);
                    debugger;
                    $('#frm-createCost').find('#StaffPartId').val(staffPartId);
                    $('#frm-createCost #CostGroupId').val(costGroupId);
                    $('#frm-createCost').find('#dynamicType').val(DynamicType);
                    $('#frm-createCost').find('#MoneyUnitId').val(MoneyUnitId);
                    $('#frm-createCost').find('#CostDriverId').val(costDriverId);
                    $('#frm-createCost').find('#CostType').val(costType);
                    CostTypeID = costType;
                    CostStructure.ChangeCostType();
                    treeTitleCostId = $('#treeTitleCostId').val();
                    CostStructure.CreateCost(treeTitleCostId, isCreateNode);
                    
                }
                else if (button.text() === 'ویرایش') {
                   
                                
                    
                                    debugger;
                                    costcategoryType = 1;
                                    if (costType === 6)
                                        costcategoryType = 2;
                                    //دریافت لست دسته بندی هزینه ها
                                    $.ajax({
                                        type: 'GET',
                                        url: '/CostNew/GetCostGroup?Type=' + costcategoryType,
                                        dataType: 'json',
                                        async: false,
                                        success: function (response) {
                                            debugger;
                                            var CostGroupContent = '<option selected disabled>لطفا دسته بندی هزینه را انتخاب نمائید</option>';
                                            for (i = 0; i < response.length; i++) {
                                                CostGroupContent += '<option value="' + response[i].CostCategoryId + '">' + response[i].Title + '</option>';

                                            }
                                            $('#frm-editCost .CostGroupId').html(CostGroupContent);
                                        },
                                        error: function () {
                                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                                            CostStructure.Error(errorMessage);
                                        }
                                    });
                                    
                    $('#frm-editCost').find(".CostType").attr('disabled', true);
                    $('#frm-editCost').find('#CostDriverId').attr('disabled', true);
                    $('#frm-editCost').find("#StaffPartId").attr('disabled', true);
                    $('#frm-editCost').find("#dynamicType").attr('disabled', true);
                    $('#frm-editCost').find("#MoneyUnitId").attr('disabled', false);
                    $('#frm-editCost').find("#CostGroupId").attr('disabled', false);
                        
                    $('.costTreeEditForm').removeClass('displayNone').addClass('displayShow');
                    $('.costTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    $('#frm-editCost').find("#MoneyUnitId").val(MoneyUnitId);
                    $('#frm-editCost').find('#ID').val(costId);
                    $('#frm-editCost').find('#Title').val(costTitle);
                    $('#frm-editCost').find('#Code').val(costCode);
                    $('#frm-editCost').find('#StaffPartId').val(staffPartId);
                    $('#frm-editCost').find("#CostType").val(costType);
                    $('#frm-editCost').find("#CostDriverId").val(costDriverId);
                    $('#frm-editCost').find("#CostGroupId").val(costGroupId);
                    $("#frm-editCost .CostGroupId").val(costGroupId);
                    $('#frm-editCost').find('#Description').val(description);
                    $('#frm-editCost').find('#dynamicType').val(DynamicType);

                    CostTypeID = $('#frm-editCost').find('#CostType').val();
                    var preCode = '';
                    if (costParentCode !== null) {
                        preCode = costParentCode + costCode;
                    } else {
                        preCode = costCode;
                    }
                    $('#frm-editCost').find('#preCode').val(preCode);
                    CostStructure.ChangeCostType();
                }
                else if (button.text() === 'حذف') {
                    $('.costTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    $('.costTreeCreateForm').removeClass('displayShow').addClass('displayNone');

                    var form = $('#__AjaxAntiForgeryForm');
                    var token = $('input[name="__RequestVerificationToken"]', form).val();
                    $.ajax({
                        type: 'POST',
                        url: '/CostNew/DeleteCost',
                        dataType: 'json',
                        async: false,
                        data: {
                            'Id': costId,
                            __RequestVerificationToken: token,
                        },
                        success: function (response) {
                            if (response.Status === true) {

                                AllertSuccess(response.Message, "کدینگ حساب");
                                var costTree = $("#costTree").data("kendoTreeView");
                                costTree.dataSource.read();
                            }
                            else {
                                AllertError(response.Message, "کدینگ حساب");
                            }



                        },
                        error: function () {

                            AllertError("امکان حذف وجود ندارد", "کدینگ حساب");
                        }
                    });
                }
                
            }
        });
        $("#costTree").kendoTreeView({
            // appends a new node to the root level
            dataSource: data,
            dataTextField: "CostTitle",
            change: onChangeCostTree,
           
            
        });
    },
    
    CreateCost: function (treeTitleCostId, isCreateNode) {
        debugger
        if (isCreateNode === true) {
            costId = null;
        }
        $("#frm-createCost").submit(function (e) {
            
            debugger
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },
                Code: { required: true, number: true },
                CostType: { required: true },
                //CostDriverId: { required: true },
                //StaffPartId: { required: true },
                CostGroupId: { required: true },
                MoneyUnitId: { required: true },
                StaffPartId: {
                    required: {
                        depends: function (elem) {
                            return $("#CostType").val() === "4";
                        }
                    },
                },
                CostDriverId: {
                    required: {
                        depends: function (elem) {
                            return $("#CostType").val() === "3";
                        }
                    },
                }
            },
            messages: {
            },
            submitHandler: function (form) {
                debugger;
                var Title = $('#frm-createCost').find('#Title').val();
                var Code = $('#frm-createCost').find('#Code').val();
                var ParentCode = $('#frm-createCost').find('#preCode').val();
                var CostType = $('#frm-createCost').find('#CostType').val();
                var CostDriverId = CostType === "3" ? $('#frm-createCost').find('#CostDriverId').val() : null;
                
                var CostGroupId = $('#frm-createCost').find('#CostGroupId').val();
                var StaffPartId = CostType === "4" ? $('#frm-createCost').find('#StaffPartId').val() : null;
              
                var Description = $('#frm-createCost').find('#Description').val();
                var DynamicType = $('#frm-createCost').find('#dynamicType').val();
                var MoneyUnitId = $('#frm-createCost').find('#MoneyUnitId').val();
                var model = {
                    'TreeTitleId': treeTitleCostId, 'ParentId': costId, 'CostTitle': Title,
                    'Code': Code, 'ParentCode': ParentCode, 'CostType': CostType,
                    'CostDriverId': CostDriverId, 'CostGroupId': CostGroupId, 'Description': Description
                    , 'StaffPartId': StaffPartId, 'DynamicType': DynamicType, 'MoneyUnitId': MoneyUnitId
                   
                }
                debugger

                var form = $('#frm-createCost');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/CostNew/CreateCost',
                        dataType: 'json',
                        async: false,
                        data: {
                            model,
                            __RequestVerificationToken: token
                        },
                        success: function (response) {
                            
                            if (response.Status === true)
                            {
                                AllertSuccess(response.Message, "کدینگ حساب");
                                $('#CostDriverId').attr('disabled', false);
                                document.getElementById("frm-createCost").reset();
                                $('.costTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                                var costTree = $("#costTree").data("kendoTreeView");
                                costTree.dataSource.read();
                            }
                            else {
                                AllertError(response.Message, "کدینگ حساب");
                            }
                           
                        },
                        error: function () {
                            
                            AllertError("امکان ثبت وجود ندارد", "کدینگ حساب");
                        },
                    });
            }
        });
    },
    EditCost: function (treeTitleCostId) {
        debugger;
        $("#frm-editCost").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                CostTitle: { required: true },
                //    Code: { required: true, number: true },
                //   CostType: { required: true },
                //    CostDriverId: { required: true },
                //     CostGroupId: { required: true 
                CostGroupId: { required: true },
                DynamicType: { required: true },
            },
            messages: {
            },
            submitHandler: function (form) {
                debugger;
                var CostId = $('#frm-editCost').find('#ID').val();
                var Title = $('#frm-editCost').find('#Title').val();
                var Code = $('#frm-editCost').find('#Code').val();
                var CostType = $('#frm-editCost').find('#CostType').val();
                var CostGroupId = $('#frm-editCost').find('#CostGroupId').val();
                var Description = $('#frm-editCost').find('#Description').val();
                var CostDriverId = CostType === "3" ? $('#frm-editCost').find('#CostDriverId').val() : null;
                var StaffPartId = CostType === "4" ? $('#frm-editCost').find('#StaffPartId').val() : null;
                var DynamicType = $('#frm-editCost').find('#dynamicType').val();
                var MoneyUnitId = $('#frm-editCost').find('#MoneyUnitId').val();

                var model = {
                    'CostId': CostId, 'TreeTitleId': treeTitleCostId, 'ParentId': parentCostId, 'CostTitle': Title, 'Code': Code, 'CostType': CostType,
                    'CostDriverId': CostDriverId, 'CostGroupId': CostGroupId, 'Description': Description, StaffPartId: StaffPartId, 'DynamicType': DynamicType
                    , 'MoneyUnitId': MoneyUnitId
                }

                var form = $('#frm-editCost');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/CostNew/EditCost',
                        dataType: 'json',
                        async: false,
                        data: {
                            model,
                            __RequestVerificationToken: token,
                        },
                        success: function (response) {

                            if (response.Status === true) {
                                AllertSuccess(response.Message, "کدینگ حساب");
                                document.getElementById("frm-editCost").reset();
                                $('.costTreeEditForm').removeClass('displayShow').addClass('displayNone');
                                var costTree = $("#costTree").data("kendoTreeView");
                                costTree.dataSource.read();
                            }

                            else {
                                AllertError(response.Message, "کدینگ حساب");
                            }

                        },
                        error: function () {

                            AllertError("امکان ویرایش وجود ندارد", "کدینگ حساب");
                        },
                    });
            }
        });
    },
   
   
}
CostStructure.init();