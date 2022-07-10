

var AllocationCreation = {
    init: function () {
        AllocationCreation.CreateAllocation();
    },
    CreateAllocation: function () {

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

        $("#frm-addAllocation").submit(function (e) {
            e.preventDefault();
        }).validate({

            rules: {

                Title: { required: true, PersianCharachters: true},




            },
            messages: {
                Title:"فقط مجاز به ورود کاراکترهای  فارسی میباشید  "
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
                        url: '/AllocationBase/Create',
                        data: $(form).serialize(),
                        success: function (response) {
                            if (response.Status) {
                                toastr.success(response.Message, " تخصیص  ", option);


                            }
                            else

                                toastr.error(response.Message, "تخصیص", option);
                        },
                        error: function (errResponse) {

                            toastr.error("خطا در ثبت", " تخصیص ", option);
                        }
                    });
                }


            }
        });
    }
}
AllocationCreation.init();