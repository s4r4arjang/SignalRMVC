////$.validator.addMethod("EngCharachters",
////    function (value, element, options) {
////        return this.optional(element) || /^[A-Za-z][A-Za-z0-9]*$/.test(value);

////        //if ($('#Title').val() != "") {
////        //    if (this.optional(element) || isValid == true) { 
////        //        return true;
////        //    } else {
////        //        return this.optional(element);
////        //    }
////        //}
////    });
////$.validator.addMethod("PersianCharachters",
////    function (value, element, options) {
////        return this.optional(element) || /^[\u0600-\u06FF\s]+$/.test(value);

////        //if ($('#Title').val() != "") {
////        //    if (this.optional(element) || isValid == true) { 
////        //        return true;
////        //    } else {
////        //        return this.optional(element);
////        //    }
////        //}
////    });

$("#frm-editPermission").submit(function (e) {
    debugger;
    e.preventDefault();
}).validate({
    rules: {
        PermissionId: { required: true },
        Title: { required: true},
        Code: { required: true},




    },
    messages: {
       // PersianTitle: "فقط مجاز به ورود کاراکترهای  فارسی میباشید "
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
                url: '/Permission/Edit',
                data: $(form).serialize(),
                success: function (response) {
                    if (response.Status) {
                        toastr.success(response.Message, " دسترسی  ", option);


                    }
                    else

                        toastr.error(response.Message, "دسترسی", option);
                },
                error: function (errResponse) {

                    toastr.error("خطا در ثبت", " دسترسی ", option);
                }
            });
        }


    }
});