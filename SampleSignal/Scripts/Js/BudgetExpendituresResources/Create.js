$.validator.addMethod("checkAmount", function (value, element) {
    debugger
    var t = $('#TotalAmount').val();
    var l = $('#LastTypesApprovedAmount').val();
    var e = $(element).val();
    return ($('#TotalAmount').val() - $('#LastYearsApprovedAmount').val()) >= $(element).val()
}, "مبلغ باید از تفریق سنوات گذشته از مبلغ کل کمتر باشد ");

$("#CreateForm-ExpendituresResources").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
       
        Title: { required: true },
        Type: { required: true },
        BudgetExpenditureResourceTypeId: {  required: true },
        TotalAmount: { number: true, required: true},
        LastTypesApprovedAmount: { number: true, required: true },
        OfferedAmount: { number: true, required: true, checkAmount: true },
        IntendedAmount: { number: true, checkAmount: true },
        ApprovedAmount: { number: true, checkAmount: true },
   


    },
    messages: {
    },
    submitHandler: function (form) {
        debugger
        if ($(form)[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: '/BudgetExpendituresResources/Create',
                data: $(form).serialize(),
                success: function (response) {
                    if (response.Status) {

                        AllertSuccess(response.Message,"منابع و مصارف")
                     

                    }
                    else
                        AllertError(response.Message, "منابع و مصارف")
                     
                },
                error: function (errResponse) {
                    AllertError("خطا در ثبت", "منابع و مصارف")
                 
                }
            });
        }


    }
});



$("#CreateForm-ExpendituresResources #Type").on("change", function () {
    debugger

    var Type = $("#Type").val();
    if (Type !== "") {
        $("#BudgetExpenditureResourceTypeId").val(null).trigger('change');
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

                $("#BudgetExpenditureResourceTypeId").html(BudgetExpenditureResourceType);
            }
        })

    }
    else {
        var BudgetExpenditureResourceType =
            '<option value="" >لطفا دسته بندی مورد نظر را انتخاب نمائید </option>';
        $("#BudgetExpenditureResourceTypeId").html(BudgetExpenditureResourceType);
    }
})


