$.validator.addMethod("EngCharachters",
    function (value, element, options) {
        return this.optional(element) || /^[A-Za-z][A-Za-z0-9]*$/.test(value);

    });
$.validator.addMethod("PersianCharachters",
    function (value, element, options) {
        return this.optional(element) || /^[\u0600-\u06FF\s]+$/.test(value);

    
    });

$.validator.addMethod("NationalCodeCharachters",
    function (value, element, options) {
        return this.optional(element) || /^[0-9]{10}$/.test(value);


    });

$.validator.addMethod("EmailCharachters",
    function (value, element, options) {
        return this.optional(element) || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);

    });

$("#frm-editUser").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
        UserId: { required: true },

        UserName: { required: true, EngCharachters: true },
        FullName: { required: true, PersianCharachters: true },
        NationalCode: { required: true, NationalCodeCharachters: true },
        Email: { required: true, EmailCharachters: true },
    },
    messages: {
        FullName: "فقط مجاز به ورود کاراکترهای  فارسی میباشید ",
        UserName: "فقط مجاز به ورود کاراکترهای  انگلیسی میباشید ",
        Email: "لطفا فرمت ایمیل را وارد نمایید"
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
                url: '/Users/Edit',
                data: $(form).serialize(),
                success: function (response) {
                    if (response.Status) {
                        toastr.success(response.Message, " نقش  ", option);


                    }
                    else

                        toastr.error(response.Message, "نقش", option);
                },
                error: function (errResponse) {

                    toastr.error("خطا در ثبت", " نقش ", option);
                }
            });
        }


    }
});