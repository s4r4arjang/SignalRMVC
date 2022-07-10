$.validator.addMethod("checkAmount", function (value, element) {

    return ($('#TotalAmount').val() - $('#LastYearsApprovedAmount').val()) >= $(element).val()
}, "مبلغ باید از تفریق سنوات گذشته از مبلغ کل کمتر باشد ");

$("#EditForm-ExpendituresResources").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
        Title: { required: true },
        Type: { required: true },
     //   BudgetExpenditureResourceTypeId: { required: true },
        TotalAmount: { number: true, required: true },
        LastYearsApprovedAmount: { number: true, required: true },
        OfferedAmount: { number: true, required: true, checkAmount: true },
        IntendedAmount: { number: true, checkAmount: true },
        ApprovedAmount: { number: true, checkAmount: true },


    },
    messages: {
    },
    submitHandler: function (form) {
        debugger
        if ($(form)[0].checkValidity()) {
            var Title = $('.form-horizontal').find('#Title').val();
            var TypeId = $('.form-horizontal').find('#Type1').val();
            var BudgetExpenditureResourceTypeId = $('.form-horizontal').find('#BudgetExpenditureResourceTypeId1').val();
            var TotalAmount = $('.form-horizontal').find('#TotalAmount').val();
            var LastYearsApprovedAmount = $('.form-horizontal').find('#LastYearsApprovedAmount').val();
            var OfferedAmount = $('.form-horizontal').find('#OfferedAmount').val();
            var ApprovedAmount = $('.form-horizontal').find('#ApprovedAmount').val();
            var IntendedAmount = $('.form-horizontal').find('#IntendedAmount').val();
            var Description = $('.form-horizontal').find('#Description').val();
            var BudgetExpendituresResourcesId = $('.form-horizontal').find('#BudgetExpendituresResourcesId').val();

            var form = $('#EditForm-ExpendituresResources');
            var token = $('input[name="__RequestVerificationToken"]', form).val();

            debugger
            var model = {
                'Title': Title, 'TypeId': TypeId, 'BudgetExpenditureResourceTypeId': BudgetExpenditureResourceTypeId,
                'TotalAmount': TotalAmount, 'LastYearsApprovedAmount': LastYearsApprovedAmount,
                'OfferedAmount': OfferedAmount, 'ApprovedAmount': ApprovedAmount, "IntendedAmount": IntendedAmount,
                'Description': Description, 'BudgetExpendituresResourcesId': BudgetExpendituresResourcesId,
            }
            $.ajax({
                type: "POST",
                url: '/BudgetExpendituresResources/Edit',
                data: {
                    model,
                    __RequestVerificationToken: token
                },
                /*$(form).serialize()*/
                success: function (response) {
                    if (response.success) {
                        AllertSuccess(response.message, "منابع و مصارف");
                     

                    }
                    else

                        AllertError(response.message, "منابع و مصارف");
                },
                error: function (errResponse) {

                    AllertError("خطا در ثبت", "منابع و مصارف");
                }
            });
        }

    }
});



$("#EditForm-ExpendituresResources #Type1").on("change", function () {

    var Type = $("#Type1").val();
    if (Type !== "") {
        $("#BudgetExpenditureResourceTypeId1").val(null).trigger('change');
        $.ajax({
            type: 'Get',
            url: '/BudgetExpendituresResources/GetCategory',
            dataType: 'json',
            data: { Id: Type },
            success: function (response) {
                var BudgetExpenditureResourceType =
                    '<option value >لطفا دسته بندی مورد نظر را انتخاب نمائید </option>';
                $.each(response, function (index, value) {

                    BudgetExpenditureResourceType += '<option value="' + value.BudgetExpenditureResourceTypeId + '">' + value.Title + '</option>';

                });

                $("#BudgetExpenditureResourceTypeId1").html(BudgetExpenditureResourceType);
            }
        })

    }
    else {
        var BudgetExpenditureResourceType =
            '<option value="" >لطفا دسته بندی مورد نظر را انتخاب نمائید </option>';
        $("#BudgetExpenditureResourceTypeId1").html(BudgetExpenditureResourceType);
    }
})