var EditTreeCostTitle = {
    init: function () {
        EditTreeCostTitle.EditTreeTitleCost();
    },
    EditTreeTitleCost: function () {
        $("#frm-editTreeTitleCost").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },
           
            },
            messages: {
            },
            submitHandler: function (form) {
                var Title = $('#Title').val();
                var AccountTreeTitleId = $('#AccountTreeTitleId').val();
            
                var model = { 'AccountTreeTitleId': AccountTreeTitleId, 'Title': Title };
                var option = {
                    "timeOut": "0",
                    "closeButton": true,
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "4000",
                }
                var form = $('#frm-editTreeTitleCost');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Cost/EditTreeTitle',
                        dataType: 'json',
                        async: false,
                        data: {
                            model,
                            __RequestVerificationToken: token
                        },
                        success: function (response) {
                            debugger;
                            if (response.Status) {

                                toastr.success(response.Message, "کدینگ حساب", option);


                            }
                            else {

                                toastr.error(response.Message, "کدینگ حساب", option);
                            }

                        },
                        error: function (errResponse) {

                            toastr.error("خطا در ثبت", "کدینگ حساب", option);
                        }
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
EditTreeCostTitle.init();