$.validator.addMethod("EngCharachters",
    function (value, element, options) {
        return this.optional(element) || /^[A-Za-z][A-Za-z0-9]*$/.test(value);

        //if ($('#Title').val() != "") {
        //    if (this.optional(element) || isValid == true) { 
        //        return true;
        //    } else {
        //        return this.optional(element);
        //    }
        //}
    });
$.validator.addMethod("PersianCharachters",
    function (value, element, options) {
        return this.optional(element) || /^[\u0600-\u06FF\s]+$/.test(value);

        //if ($('#Title').val() != "") {
        //    if (this.optional(element) || isValid == true) { 
        //        return true;
        //    } else {
        //        return this.optional(element);
        //    }
        //}
    });

$("#frm-editRole").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
        RoleId: { required: true },
        Title: { required: true, EngCharachters : true},
        PersianTitle: { required: true, PersianCharachters : true},




    },
    messages: {
        PersianTitle: "فقط مجاز به ورود کاراکترهای  فارسی میباشید "
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
                url: '/Role/Edit',
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