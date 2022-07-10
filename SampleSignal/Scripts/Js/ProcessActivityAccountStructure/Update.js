

$("#EditForm").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
        Title: { required: true },
        AccountTreeTitleId: { required: true },
        ActivityAccountStructureId: { required: true },
        ProcessIds: { required: true },


    },
    messages: {
    },
    submitHandler: function (form) {
        var option = {
            "timeOut": "0",
            "closeButton": true,
            "positionClass": "toast-bottom-full-width",
            "timeOut": "4000",
        }
        if ($(form)[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: '/ProcessActivityAccountStructure/Edit',
                data: $(form).serialize(),
                success: function (response) {
                    debugger;
                    if (response.success) {
                        toastr.success(response.message, "فرایند", option);
                    

                    }
                    else

                        toastr.error(response.message, "فرایند", option);
                },
                error: function (errResponse) {

                    toastr.error("خطا در ثبت", "فرایند", option);
                }
            });
        }


    }
});