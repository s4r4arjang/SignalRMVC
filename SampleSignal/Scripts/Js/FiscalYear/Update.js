

var FiscalYearUpdate = {
    init: function () {
      //  FiscalYearUpdate.CheckActivityCostChange();
       // FiscalYearUpdate.Addlistener();
        FiscalYearUpdate.UpdateFiscalYear();
      //  FiscalYearUpdate.SetComboData();
    },
    //Addlistener: function () {
    //    var roleId = $('#RoleId').val();
    //    if (roleId === "Administrator") {
    //        FiscalYearUpdate.GetAllBranch();
    //    }
    //    $(document).ready(function () {

    //        //ایجاد combo سال مالی
    //        var contentFiscalYear = '<option disabled>سال مالی را انتخاب نمائید</option>';
    //        //$.ajax({
    //        //    type: 'GET',
    //        //    url: '/FiscalYear/ListYearDropDown',
    //        //    dataType: 'json',
    //        //    async: false,
    //        //    success: function (response) {

    //        //        $.each(response, function (idx, item) {

    //        //            context = { Value: item.Value, Title: item.Text };
    //        //            contentFiscalYear = contentFiscalYear + template(context);
    //        //        });
    //        //        $("#Year").html(contentFiscalYear);
    //        //    },
    //        //    error: function () {
    //        //        var errorMessage = 'بروز خطا در برقراری ارتباط';
    //        //        FiscalYearUpdate.Error(errorMessage);
    //        //    },
    //        //});
    //    });
    //    //دریافت لیست ساختار هزینه با انتخاب شعبه
    //    if ($("#BranchId").length) {
    //        $('#BranchId').on('change',
    //            function () {
    //                var branchIdFiscalYear = parseInt($(this).val());
    //                //ایجاد combo ساختار هزینه
    //                var contentCostTreeFiscalYear =
    //                    '<option selected disabled>ساختار هزینه مورد نظر را انتخاب نمائید</option>';
    //                $.ajax({
    //                    type: 'GET',
    //                    url: '/Cost/GetCostTreeTitle',
    //                    dataType: 'json',
    //                    data: { 'branchId': branchIdFiscalYear },
    //                    async: false,
    //                    success: function (response) {

    //                        $.each(response, function (idx, item) {

    //                            context = { Value: item.Id, Title: item.Name };
    //                            contentCostTreeFiscalYear = contentCostTreeFiscalYear + template(context);
    //                        });
    //                        $("#CostTreeFiscalYear").html(contentCostTreeFiscalYear);
    //                    },
    //                    error: function () {
    //                        var errorMessage = 'بروز خطا در برقراری ارتباط';
    //                        FiscalYearUpdate.Error(errorMessage);
    //                    },
    //                });
    //            });
    //    } else {
    //        //ایجاد combo ساختار هزینه
    //        var contentCostTreeFiscalYear =
    //            '<option selected disabled>ساختار هزینه مورد نظر را انتخاب نمائید</option>';
    //        $.ajax({
    //            type: 'GET',
    //            url: '/Cost/GetCostTreeTitle',
    //            dataType: 'json',
    //            data: { 'branchId': null },
    //            async: false,
    //            success: function (response) {

    //                $.each(response, function (idx, item) {

    //                    context = { Value: item.Id, Title: item.Name };
    //                    contentCostTreeFiscalYear = contentCostTreeFiscalYear + template(context);
    //                });
    //                $("#CostTreeFiscalYear").html(contentCostTreeFiscalYear);
    //            },
    //            error: function () {
    //                var errorMessage = 'بروز خطا در برقراری ارتباط';
    //                FiscalYearCreate.Error(errorMessage);
    //            },
    //        });
    //    }
    //    //دریافت لیست ساختار فعالیت با انتخاب ساختار هزینه

    //    $('#CostTreeFiscalYear').on('change', function () {
    //        costTreeTitleId = parseInt($(this).val());
    //        GetActivity(costTreeTitleId);
    //    });

    //    //با تغییر شعبه بر کمبو آی دی شعبه برای بررسی تکراری نبودن تغییر می کند
    //    $('#BranchId').on('change',
    //        function () {
    //            $('#branchIdCreateFiscalYear').val($(this).val());
    //        });
    //},
    UpdateFiscalYear: function () {
   
      
   
        //$.validator.addMethod("UniqFiscalYearTitle",
        //    function (value, element, options) {
        //        var BranchIdForCheck = parseInt($('#branchIdCreateFiscalYear').val());
        //        if ($("#frm-createFiscalYear").find('#Title').val() != "") {
        //            $.ajax({
        //                type: 'GET',
        //                url: '/FiscalYear/CheckTitleExist',
        //                dataType: 'json',
        //                async: false,
        //                data: { 'title': value, 'branchId': BranchIdForCheck },
        //                success: function (response) {
        //                    if (response.Status == false) {
        //                        isValid = true;
        //                    } else {
        //                        isValid = false;
        //                    }
        //                },
        //                error: function () {
        //                    var errorMessage = 'بروز خطا در برقراری ارتباط';
        //                    FiscalYearUpdate.Error(errorMessage);
        //                },
        //            });
        //            if (this.optional(element) || isValid == true) {
        //                return true;
        //            } else {
        //                return this.optional(element);
        //            }
        //        }
        //    });
        $("#frm-EditFiscalYear").submit(function (e) {
        
            e.preventDefault();
        }).validate({
            rules: {
              
                Title: {required: true  },
                Year: {required: true },
                StartDatePersian: { required: true },
                Budgetyear: { required: true },
            //    EndDatePersian: { required: true },
            },
            messages: {
            },
            submitHandler: function (form) {

                var YearId = $("#frm-EditFiscalYear").find('#YearId').val();
                var Title = $("#frm-EditFiscalYear").find('#Title').val();
                var Year = parseInt($("#frm-EditFiscalYear").find('#Year1').val());
                var StartDatePersian = $('#StartDatePersian').val();
              //  var EndDatePersian = $('#EndDatePersian').val();
                var Budgetyear = $("#frm-EditFiscalYear").find('#Budgetyear').val();
                var BeforeYearId = parseInt($('#BeforeYearId').val());
                if (isNaN(BeforeYearId))
                    BeforeYearId = null;
                var fiscalYear = {
                    'YearId': YearId, 'Title': Title, 'Year': Year, 'StartDatePersian': StartDatePersian
                    //, 'EndDatePersian': EndDatePersian
                    , 'Budgetyear': Budgetyear
                    , 'BeforeYearId': BeforeYearId
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
                        url: '/FiscalYear/Update',
                        dataType: 'json',
                        async: false,
                        data: {
                            fiscalYear
                        },
                        success: function (response) {
                            debugger;
                            if (response.Status) {

                                toastr.success(response.Message, " سال مالی", option);


                            }
                            else {

                                toastr.error(response.Message, " سال مالی", option);
                            }

                        },
                        error: function (errResponse) {

                            toastr.error("خطا در عملیات", " سال مالی", option);
                        }
                    });
            }
        });
    },
    //SetComboData: function () {
    //    GetActivity($('#CostTreeFiscalYear').attr("data-Value"));
    //    //$.each($('select'), function (idx, item) {
    //    //    $(item).val($(item).attr("data-value"));
    //    //});
    //},
    //GetAllBranch: function () {
    //    //$.ajax({
    //    //    type: 'GET',
    //    //    url: '/Branch/GetAllBranch',
    //    //    dataType: 'json',
    //    //    async: false,
    //    //    success: function (response) {
    //    //        var BranchListContent = '<option selected disabled>لطفا شعبه مورد نظر را انتخاب نمائید</option>';
    //    //        $.each(response, function (idx, item) {
    //    //            context = { Value: item.Id, Title: item.Name };
    //    //            BranchListContent = BranchListContent + template(context);
    //    //        });

    //    //        $('#BranchId').html(BranchListContent);
    //    //    },
    //    //    error: function () {
    //    //        var errorMessage = 'بروز خطا در برقراری ارتباط';
    //    //        FiscalYearUpdate.Error(errorMessage);
    //    //    },
    //    //});
    //},
    //CheckActivityCostChange: function () {
    //    var fiscalYearId = $("#Id").val();
    //    $.ajax({
    //        type: 'GET',
    //        url: '/ProductStep/CheckFicialYearCostChange',
    //        dataType: 'json',
    //        async: false,
    //        data: { 'fiscalYearId': fiscalYearId },
    //        success: function (response) {
    //            if (response.Status == false) {
    //                var errorMessage = 'درخت هزینه به مرحله متصل شده است لطفا ابتدا ارتباط را حذف کنید.';
    //                FiscalYearUpdate.Error(errorMessage);
    //                $("#CostTreeFiscalYear").attr("disabled", true);


    //            }
    //        },
    //        error: function () {
    //            var errorMessage = 'بروز خطا در برقراری ارتباط';
    //            FiscalYearUpdate.Error(errorMessage);
    //        },
    //    });
    //    $.ajax({
    //        type: 'GET',
    //        url: '/ProductStep/CheckFicialYearActivityChange',
    //        dataType: 'json',
    //        async: false,
    //        data: { 'fiscalYearId': fiscalYearId, },
    //        success: function (response) {
    //            if (response.Status == false) {
    //                var errorMessage = 'درخت فعالیت به مرحله متصل شده است لطفا ابتدا ارتباط را حذف کنید.';
    //                FiscalYearUpdate.Error(errorMessage);
    //                $("#ActivityTreeFiscalYear").attr("disabled", true);
    //                $("#CostTreeFiscalYear").attr("disabled", true);
    //            }

    //        },
    //        error: function () {
    //            var errorMessage = 'بروز خطا در برقراری ارتباط';
    //            FiscalYearUpdate.Error(errorMessage);
    //        },
    //    });

    //},
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
//function GetActivity(costTreeTitleId) {
//    //ایجاد combo ساختار فعالیت
//    var contentActivityTreeFiscalYear = '<option selected disabled>ساختار فعالیت مورد نظر را انتخاب نمائید</option>';
//    $.ajax({
//        type: 'GET',
//        url: '/Activity/GetAllActivityTreeTitleHasRelationWithCostTree',
//        dataType: 'json',
//        data: { 'costTreeTitleId': costTreeTitleId },
//        async: false,
//        success: function (response) {
//            if (response.length > 0) {
//                $.each(response, function (idx, item) {
//                    context = { Value: item.Id, Title: item.Name };
//                    contentActivityTreeFiscalYear = contentActivityTreeFiscalYear + template(context);
//                });

//            }
//            $("#ActivityTreeFiscalYear").html(contentActivityTreeFiscalYear);
//        },
//        error: function () {
//            var errorMessage = 'بروز خطا در برقراری ارتباط';
//            FiscalYearUpdate.Error(errorMessage);
//        },
//    });

//}


FiscalYearUpdate.init();