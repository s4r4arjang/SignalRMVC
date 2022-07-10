﻿

$("#frm-editBranchParameterType").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
        ParameterTypeId: { required: true },
        Title: { required: true },
    },
    messages: {

    },
    submitHandler: function (form) {

        if ($(form)[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: '/BranchParameterType/Edit',
                data: $(form).serialize(),
                success: function (response) {
                    if (response.Status) {
                        AllertSuccess(response.Message, " انواع پارامتر");



                    }
                    else

                        AllertError(response.Message, "انواع پارامتر");
                },
                error: function () {

                    AllertError("خطا در ثبت", " انواع پارامتر ");
                }
            });
        }


    }
});