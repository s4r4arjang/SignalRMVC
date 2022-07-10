
$("#frm-UserPolicy").submit(function (e) {
    
    e.preventDefault();
}).validate({
        rules: {

            Length: { required: true },
        },

        messages: {
        },
    submitHandler: function (form) {
       
            $.ajax(
                {
                    type: 'POST',
                    url: '/UserPolicy/Index',
                    dataType: 'json',
                    async: false,
                    data: $(form).serialize(),
                    success: function (response) {
                    
                        if (response.Status) {

                            AllertSuccess(response.Message, "سیاست های کاربر");
                        }
                        else {

                            AllertSuccess(response.Message, "سیاست های کاربر");
                        }

                    },
                    error: function (errResponse) {

                        AllertError("امکان ثبت وجود ندارد", "سیاست های کاربر");
                    }
                });
        }
    });