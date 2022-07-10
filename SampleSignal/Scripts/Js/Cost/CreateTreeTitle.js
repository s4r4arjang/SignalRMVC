var CreateCostTreeTitle = {
    init: function () {
        CreateCostTreeTitle.CreateTreeTitleCost();
    },
    CreateTreeTitleCost: function () {
        $("#frm-createTreeTitleCost").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true},
         
            },
            messages: {
            },
            submitHandler: function (form) {
                var Title = $('#Title').val();
         
                var model = { 'Title': Title };
                var option = {
                    "timeOut": "0",
                    "closeButton": true,
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "4000",
                }
                var form = $('#frm-createTreeTitleCost');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Cost/CreateTreeTitle',
                        dataType: 'json',
                        async: false,
                        data:
                        {
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

                            toastr.error("خطا در عملیات", "کدینگ حساب", option);
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
CreateCostTreeTitle.init();