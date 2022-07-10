

$("#frm-editBranchType").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
        BranchTypeId: { required: true },
        Title: { required: true },
        Code: { required: true },

    },
    messages: {

    },
    submitHandler: function (form) {

        if ($(form)[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: '/BranchType/Edit',
                data: $(form).serialize(),
                success: function (response) {
                    if (response.Status) {
                        AllertSuccess(response.Message, " انواع شعبه ");



                    }
                    else

                        AllertError(response.Message, "انواع شعبه");
                },
                error: function () {

                    AllertError("خطا در ثبت", "انواع شعبه ");
                }
            });
        }


    }
});