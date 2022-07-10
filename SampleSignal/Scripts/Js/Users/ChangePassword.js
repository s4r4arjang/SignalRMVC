

$.validator.addMethod("PasswordCharachters",
    function (value, element, options) {
        //^ ((?=.*? [A - Z])(?=.*? [a - z])(?=.*? [0 - 9])(?=.* [!@#\$ %\^&\*]) | (?=.*? [A - Z])(?=.*? [a - z])(?=.*? [^ a - zA - Z0 - 9])(?=.* [!@#\$ %\^&\*])| (?=.*? [A - Z])(?=.*? [0 - 9])(?=.*? [^ a - zA - Z0 - 9])(?=.* [!@#\$ %\^&\*])| (?=.*? [a - z])(?=.*? [0 - 9])(?=.*? [^ a - zA - Z0 - 9])(?=.* [!@#\$ %\^&\*])).{ 8,} $ /.test(value);
        return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(value);

      
    });

$("#frm-changePassword").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
        UseId: { required: true },

        Password: { required: true, PasswordCharachters: true },
        ConfirmPassword: { required: true , equalTo: "#Password"  },





    },
    messages: {
        Password: "لطفا  از حروف بزرگ ، کوچک ، اعداد و کاراکترهای خاص استفاده کنید",
        ConfirmPassword: "تکرار رمز عبور باید با رمز عبور یکسان باشد "
    },
    submitHandler: function (form) {
        debugger
        var option = {
            "timeOut": "0",
            "closeButton": true,
            "positionClass": "toast-bottom-full-width",
            "timeOut": "4000",
        }
        if ($(form)[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: '/Users/ChangePassword',
                data: $(form).serialize(),
                success: function (response) {
                    if (response.Status) {
                        toastr.success(response.Message, " رمز عبور  ", option);


                    }
                    else

                        toastr.error(response.Message, "رمز عبور", option);
                },
                error: function (errResponse) {

                    toastr.error("خطا در ثبت", " رمز عبور ", option);
                }
            });
        }


    }
});