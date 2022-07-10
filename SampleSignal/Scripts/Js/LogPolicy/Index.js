
$("#frm-LogPolicy").submit(function (e) {
    
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
                    url: '/LogPolicy/Index',
                    dataType: 'json',
                    async: false,
                    data: $(form).serialize(),
                    success: function (response) {
                    
                        if (response.Status) {

                            AllertSuccess(response.Message, "سیاست های لاگ");
                        }
                        else {

                            AllertSuccess(response.Message, "سیاست های لاگ");
                        }

                    },
                    error: function (errResponse) {

                        AllertError("امکان ثبت وجود ندارد", "سیاست های لاگ");
                    }
                });
        }
    });