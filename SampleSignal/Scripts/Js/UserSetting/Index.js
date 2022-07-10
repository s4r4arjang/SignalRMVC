$("#frm-UserSetting #FiscalYearId").on("change", function () {
    debugger

    var year = $("#FiscalYearId").val();
    if (year != "") {
        $("#PeriodId1").val(null).trigger('change');
        $.ajax({
            type: 'Get',
            url: '/UserSetting/Period',
            dataType: 'json',
            data: { id: year },
            success: function (response) {
                var period =
                    '<option value >دوره مالی را انتخاب کنید </option>';
                $.each(response, function (index, value) {

                    period += '<option value="' + value.PeriodId + '">' + value.Title + '</option>';

                });

                $("#PeriodId1").html(period);
            }
        })

    }
    else {
        var period =
            '<option value >دوره مالی را انتخاب کنید </option>';
        $("#PeriodId1").html(period);
    }
})






$("#frm-UserSetting").submit(function (e) {
    
    e.preventDefault();
}).validate({
        rules: {

            UserId: { required: true },
         //   BranchId1: { required: true },
            FiscalYearId: { required: true },
           // PeriodId1: { required: true },
        },

        messages: {
        },
        submitHandler: function (form) {
            var UserId = parseInt($('#UserId').val());
            var BranchId = parseInt($('#BranchId1').val());
            var FiscalYearId = parseInt($('#FiscalYearId').val());
            var PeriodId = parseInt($('#PeriodId1').val());


            var Usersetting = {
                'UserId': UserId,
                'BranchId': BranchId,
                'FiscalYearId': FiscalYearId,
                'PeriodId': PeriodId,
            }
            var option = {
                "timeOut": "0",
                "closeButton": true,
                "positionClass": "toast-bottom-full-width",
                "timeOut": "4000",
            }
            var form = $('#frm-UserSetting');
            var token = $('input[name="__RequestVerificationToken"]', form).val();
            $.ajax(
                {
                    type: 'POST',
                    url: '/UserSetting/Index',
                    dataType: 'json',
                    async: false,
                    data: {
                        Usersetting,
                        __RequestVerificationToken : token

                    },
                    success: function (response) {
                    
                        if (response.Status) {

                            toastr.success(response.Message, "  فعال سازی", option);
                            debugger;
                       
                            window.location.href = "Account/LogOff" ;
                        }
                        else {

                            toastr.error(response.Message, "فعال سازی", option);
                        }

                    },
                    error: function (errResponse) {

                        toastr.error("خطا در عملیات", " فعال سازی", option);
                    }
                });
        }
    });