//$("#frm-UserSetting #FiscalYearId").on("change", function () {
//    debugger

//    var year = $("#FiscalYearId").val();
//    if (year != "") {
//        $.ajax({
//            type: 'Get',
//            url: '/UserSetting/Period',
//            dataType: 'json',
//            data: { id: year },
//            success: function (response) {
//                var period =
//                    '<option value >دوره مالی را انتخاب کنید </option>';
//                $.each(response, function (index, value) {

//                    period += '<option value="' + value.PeriodId + '">' + value.Title + '</option>';

//                });

//                $("#PeriodId1").html(period);
//            }
//        })

//    }
//    else {
//        var period =
//            '<option value >دوره مالی را انتخاب کنید </option>';
//        $("#PeriodId1").html(period);
//    }
//})






$("#frm-TotalCapacity").submit(function (e) {
    debugger;
    e.preventDefault();
}).validate
    ({
        rules: {

            BranchId : { required: true },
            PeriodId: { required: true },
            Capacity: { required: true },
        },

        messages: {
        },
        submitHandler: function (form) {
            //var BranchId = parseInt($('#BranchId').val());
            //var PeriodId = parseInt($('#PeriodId').val());
            var Capacity = parseInt($('#Capacity').val());
            
            //var TotalCapacity = {
            //    'Capacity': Capacity,
            //}
            $.ajax(
                {
                    type: 'POST',
                    url: '/TDABCTotalCapacity/Index',
                    dataType: 'json',
                    data: $(form).serialize(),
                    //async: false,
                    //data: {
                    //    TotalCapacity: TotalCapacity

                    //},
                    success: function (response) {

                        if (response.Status) {

                            AllertSuccess(response.Message, "ظرفیت کل");
                            debugger;

                           // window.location.href = "Account/LogOff";
                        }
                        else {

                            AllertError(response.Message, "ظرفیت کل");
                        }

                    },
                    error: function (errResponse) {

                        AllertError("خطا در عملیات", " ظرفیت کل");
                        
                    }
                });
        }
    });