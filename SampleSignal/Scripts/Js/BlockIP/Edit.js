

$("#frm-editDriver").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
        DriverId: { required: true },
        Title: { required: true},
        UnitType : { required: true},
    },
    messages: {
       
    },
    submitHandler: function (form) {
       
        if ($(form)[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: '/Driver/Edit',
                data: $(form).serialize(),
                success: function (response) {
                    if (response.Status) {
                        AllertSuccess(response.Message, " محرک ");
                       


                    }
                    else

                        AllertError(response.Message, "محرک");
                },
                error: function () {

                        AllertError("خطا در ثبت", " محرک ");
                }
            });
        }


    }
});