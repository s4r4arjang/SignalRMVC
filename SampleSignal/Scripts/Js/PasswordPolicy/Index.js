
$("#frm-PasswordPolicy").submit(function (e) {
    
    e.preventDefault();
}).validate({
        rules: {

            Length: { required: true },
        },

        messages: {
        },
    submitHandler: function (form) {
        //var UpperCase = $('#frm-PasswordPolicy').find('#UpperCase').is(":checked");
        //var LowerCase = $('#frm-PasswordPolicy').find('#LowerCase').is(":checked");
        //var NumberUsage = $('#frm-PasswordPolicy').find('#NumberUsage').is(":checked");
        //var SpecialCharacters = $('#frm-PasswordPolicy').find('#SpecialCharacters').is(":checked");
        //var Length = parseInt($('#Length').val());
           
        //    var model = {
        //        'UpperCase': UpperCase,
        //        'LowerCase': LowerCase,
        //        'NumberUsage': NumberUsage,
        //        'SpecialCharacters': SpecialCharacters,
        //        'Length': Length,
        //    }
           
            $.ajax(
                {
                    type: 'POST',
                    url: '/PasswordPolicy/Index',
                    dataType: 'json',
                    async: false,
                    data: $(form).serialize(),
                    success: function (response) {
                    
                        if (response.Status) {

                            AllertSuccess(response.Message, "سیاست رمز عبور");
                        }
                        else {

                            AllertSuccess(response.Message, "سیاست رمز عبور");
                        }

                    },
                    error: function (errResponse) {

                        AllertError("امکان ثبت وجود ندارد", "سیاست رمز عبور");
                    }
                });
        }
    });