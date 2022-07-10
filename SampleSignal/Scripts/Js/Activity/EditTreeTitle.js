var EditActivityTreeTitle = {
    init: function () {
        EditActivityTreeTitle.EditTreeTitleCost();
    },
    EditTreeTitleCost: function () {
        $("#frm-editTreeTitleActivity").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Name: { required: true },
             
            },
            messages: {
            },
            submitHandler: function (form) {
                var Title = $('#Title').val();
                var ActivityTreeTitleId = $('#ActivityTreeTitleId').val();
            
                var model = { 'ActivityTreeTitleId': ActivityTreeTitleId, 'Title': Title };
                var option = {
                    "timeOut": "0",
                    "closeButton": true,
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "4000",
                }
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Activity/EditTreeTitle',
                        dataType: 'json',
                        async: false,
                        data: model,
                        success: function (response) {
                            debugger;
                            if (response.Status) {

                                toastr.success(response.Message, "کدینگ فعالیت", option);


                            }
                            else {

                                toastr.error(response.Message, "کدینگ فعالیت", option);
                            }

                        },
                        error: function (errResponse) {

                            toastr.error("خطا در عملیات", "کدینگ فعالیت", option);
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
EditActivityTreeTitle.init();