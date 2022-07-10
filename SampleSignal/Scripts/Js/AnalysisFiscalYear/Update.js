

var AnalysisFiscalYearUpdate = {
    init: function () {
      //  AnalysisFiscalYearUpdate.CheckActivityCostChange();
       // AnalysisFiscalYearUpdate.Addlistener();
        AnalysisFiscalYearUpdate.UpdateFiscalYear();
      //  AnalysisFiscalYearUpdate.SetComboData();
    },
    
    UpdateFiscalYear: function () {
   
      
        $("#frm-EditAnalysisFiscalYear").submit(function (e) {
        
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

                var YearId = $("#frm-EditAnalysisFiscalYear").find('#YearId').val();
                var Title = $("#frm-EditAnalysisFiscalYear").find('#Title').val();
                var Year = parseInt($("#frm-EditAnalysisFiscalYear").find('#Year1').val());
                var StartDatePersian = $('#StartDatePersian').val();
              //  var EndDatePersian = $('#EndDatePersian').val();
                var Budgetyear = $("#frm-EditAnalysisFiscalYear").find('#Budgetyear').val();
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
                $.ajax(
                    {
                        type: 'POST',
                        url: '/AnalysisFiscalYear/Update',
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
    //    //        AnalysisFiscalYearUpdate.Error(errorMessage);
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
    //                AnalysisFiscalYearUpdate.Error(errorMessage);
    //                $("#CostTreeFiscalYear").attr("disabled", true);


    //            }
    //        },
    //        error: function () {
    //            var errorMessage = 'بروز خطا در برقراری ارتباط';
    //            AnalysisFiscalYearUpdate.Error(errorMessage);
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
    //                AnalysisFiscalYearUpdate.Error(errorMessage);
    //                $("#ActivityTreeFiscalYear").attr("disabled", true);
    //                $("#CostTreeFiscalYear").attr("disabled", true);
    //            }

    //        },
    //        error: function () {
    //            var errorMessage = 'بروز خطا در برقراری ارتباط';
    //            AnalysisFiscalYearUpdate.Error(errorMessage);
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
//            AnalysisFiscalYearUpdate.Error(errorMessage);
//        },
//    });

//}


AnalysisFiscalYearUpdate.init();