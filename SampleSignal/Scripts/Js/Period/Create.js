var source = document.getElementById("PeridTemplate").innerHTML;

var template = Handlebars.compile(source);
Handlebars.registerHelper('index-print', function (index) {
    return index+1
});
Handlebars.registerHelper('Status', function () {

    if (this.Id == $('#activeperiodId').val()) {
     
        return "fa-check";
    }
    else {
        return "";
    }
});

     
var PeriodCreate = {

    init: function () {
        PeriodCreate.Addlistener();
        PeriodCreate.GetAllCreatedPeriods();
        PeriodCreate.SetPeriodCount();
        PeriodCreate.ConfirmPeriods();
    },
    Addlistener: function () {
      
    },
    //ایجاد تعداد دوره ها
    SetPeriodCount: function () {
        $("#frm-setPeriodCount").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                periodCount: { required: true,min:1,max:12,number:true },
            },
            messages: {
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") == "periodCount") {
                    error.appendTo("#periodCountError");
                }
                else {
                    error.insertAfter(element);
                }
            },
            submitHandler: function (form) {
              
                var periodsContent = '';
                var periodCount = $('#periodCount').val();
                var fiscalYearId = $('#fiscalyearId').val();

                var form = $('#frm-setPeriodCount');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Period/PeriodCreator',
                        dataType: 'json',
                        async: false,
                        data: {
                            'fiscalYearId': fiscalYearId, 'periodCount': periodCount,
                            __RequestVerificationToken : token
                        },
                        success: function (response) {
                            document.getElementById("frm-setPeriodCount").reset();
                            if (response.length > 0) {
                               var FiscalYear=response;
                              context={FiscalYear};
                           periodsHtml=template(context)
                           $('#tbl-periods').find('tbody').html(periodsHtml);
                               
                            } else {
                                periodsContent = '<td class="center" colspan="6">هیچ موردی یافت نشد!</td>';
                                $('#tbl-periods').find('tbody').html(periodsContent);
                            }
                        },
                        error: function () {
                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                            PeriodCreate.Error(errorMessage);
                        },
                    });
            }
        });
    },
    GetAllCreatedPeriods: function () {
        var fiscalYearId = $('#fiscalyearId').val();
    
        var periodsContent = '';
        $.ajax(
            {
                type: 'GET',
                url: '/Period/GetAllByFiscalYear',
                dataType: 'jsonp',
                async: false,
                data: {
                    'fiscalYearId': fiscalYearId,
                },
                success: function (response) {
                    if (response.length > 0) {
                       var FiscalYear=response;
                        context={FiscalYear};
                        periodsHtml=template(context)
                        $('#tbl-periods').find('tbody').html(periodsHtml);

                    } else {
                        periodsContent = '<td class="center" colspan="6">هیچ موردی یافت نشد!</td>';
                        $('#tbl-periods').find('tbody').html(periodsContent);
                    }
                },
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    PeriodCreate.Error(errorMessage);
                },
            });
    },
    //ثبت نهایی دوره ها
    ConfirmPeriods: function () {
        $.validator.addClassRules("periodTitle", {
            required: true,
        });

        $('#frm-confirmPeriod').on('submit',function(e) {
                e.preventDefault();
            }).validate({
                rules: {

                },
                messages: {
                },
                submitHandler: function(form) {
                    var fiscalYearId = $('#fiscalyearId').val();
                    var periodTitle = '';
                    var startDatePer = '';
                    var endDatePer = '';
                    var startDate = '';
                    var endDate = '';
                    var periods = [];
                    $(".periodRows").each(function() {
                        periodTitle = $(this).find('.periodTitle').val();
                        startDatePer = $(this).find('.startDatePer').text();
                        endDatePer = $(this).find('.endDatePer').text();
                        startDate = $(this).find('.startDate').val();
                        endDate = $(this).find('.endDate').val();
                        Id=$(this).find("[name='Id']").val()
                        if (Id > 0) {
                        bootbox.alert({
                            message: "درصورت حذف دوره اطلاعات تخصیص یافته پاک میشوددر صورت اطمینان از دکمه ایجاد استفاده نمایید.!",
                       locale: "fa"
                       });
                         form.preventDefault();
                        return false;
                        }

                        periods.push({
                               "Id":0,
                            "Title": periodTitle,
                            "StartDateStr": startDate,
                            "EndDateStr": endDate,
                            "FiscalYearId": fiscalYearId,
                            "FiscalYear": null,
                            "StartDatePer": startDatePer,
                            "EndDatePer": endDatePer
                        });
                    });
                    var form = $('#frm-confirmPeriod');
                    var token = $('input[name="__RequestVerificationToken"]', form).val();
                    $.ajax({
                        type: 'POST',
                        url: '/Period/Create',
                        dataType: 'json',
                        async: false,
                        data: {
                            'periods': periods, 'fiscalYearId': fiscalYearId,
                            __RequestVerificationToken : token
                        },
                        success: function(response) {
                            if (response.Status === true)
                            {

                       
                          
                                AllertSuccess(response.Message, "دوره");

                            }
                            else {
                                AllertError(response.Message, "دوره");
                            }
                               
                       
                        },
                        error: function() {
                     
                            AllertError('بروز خطا در برقراری ارتباط', "دوره");
                        },
                    });
                }
        });
    },
 
    //دریافت سشن ها بصورت پارشیال
    LoadAllSessions: function () {
        $.ajax({
            type: "GET",
            url: "/Home/SessionPartial",
            contentType: "application/json; charset=utf-8",
            dataType: "html",
            async: false,
            success: function (response) {
                $('#allSessions').html(response);
            },
            error: function () {
                $('#allSessions').html('<h6 class="errorPart">بروز خطا در بارگذاری</h4>');
            },
        });
    },
    //دریافت عناوین فعال آیتم های فعال(دوره)
    GetActiveItemsForCreatePeriod: function () {
        //دریافت دوره فعال هر کاربر
        $.ajax({
            type: 'GET',
            url: '/Period/GetActivePeriodTitle',
            dataType: 'json',
            cache: false,
            success: function (response) {
                if (response != '') {
                    $('.ActivFiscalYearPeriod').find('.text').html(response);
                } else {
                    $('.ActivFiscalYearPeriod').find('.text').html('__');
                }
            },
            error: function () {
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                PeriodCreate.Error(errorMessage);
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
PeriodCreate.init();
function SetDefaultPeriod(id) {

    var rowId = id;
    $.ajax(
        {
            type: 'POST',
            url: '/Period/SetActivePeriod',
            dataType: 'json',
            async: true,
            data: { periodId: rowId },
            success: function (response) {
                var messageClass = '';
                if (response.Status == true) {
                 
                    messageClass = 'success';
                    PeriodCreate.GetAllCreatedPeriods();
                    //var idrow = "#" + rowId
                    //alert("row")
                    //alert(rowId)
                    //alert("act")
                    //$('#activeperiodId').val(rowId)
                    //alert($('#activeperiodId').val())
                    //$('.checktik').html('');
                    //$(idrow).html('<i class="fas fa-check"></i>')
                    location.reload();
                } else {
                    messageClass = 'danger';
                }
                $('#messageFiscalYearPeriods').fadeIn().html('<div class= "alert alert-' +
                    messageClass +
                    ' alert-dismissible">' +
                    '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                    '<strong>' +
                    response.Message +
                    '</strong>' +
                    '</div>').delay(5000).fadeOut(800);

            }
        });
}