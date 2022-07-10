

$("#EditForm").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
        Title: { required: true },
        AccountTreeTitleId: { required: true },
        ActivityTreeTitleId: { required: true },


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
                url: '/ActivityAccountStructure/Edit',
                data: $(form).serialize(),
                success: function (response) {
                    if (response.success) {
                        toastr.success(response.message, "فعالیت - هزینه", option);
                        $('#exampleModal').modal('toggle');

                    }
                    else

                        toastr.error(response.message, "فعالیت - هزینه", option);
                },
                error: function (errResponse) {

                    toastr.error("خطا در ثبت", "فعالیت - هزینه", option);
                }
            });
        }


    }
});