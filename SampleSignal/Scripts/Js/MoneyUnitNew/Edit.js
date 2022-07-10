

$("#frm-editMoneyUnitNew").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
        MoneyUnitId: { required: true },
        Title: { required: true },
    },
    messages: {

    },
    submitHandler: function (form) {

        if ($(form)[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: '/MoneyUnitNew/Edit',
                data: $(form).serialize(),
                success: function (response) {
                    if (response.Status) {
                        AllertSuccess(response.Message, " واحد پولی ");



                    }
                    else

                        AllertError(response.Message, "واحد پولی");
                },
                error: function () {

                    AllertError("خطا در ثبت", " واحد پولی ");
                }
            });
        }


    }
});