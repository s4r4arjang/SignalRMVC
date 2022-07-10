var UserCreation = {
    init: function () {
        UserCreation.CreateUser();
    },
    CreateUser: function () {

        $.validator.addMethod("PasswordCharachters",
            function (value, element, options) {
               // ^ ((?=.*? [A - Z])(?=.*? [a - z])(?=.*? [0 - 9])(?=.* [!@#\$ %\^&\*])| (?=.*? [A - Z])(?=.*? [a - z]) (?=.*? [^ a - zA - Z0 - 9])(?=.* [!@#\$ %\^&\*])| (?=.*? [A - Z])(?=.*? [0 - 9]) (?=.*? [^ a - zA - Z0 - 9])(?=.* [!@#\$ %\^&\*])| (?=.*? [a - z])(?=.*? [0 - 9]) (?=.*? [^ a - zA - Z0 - 9])(?=.* [!@#\$ %\^&\*])).{ 8, }$
                return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(value);

                //if ($('#Title').val() != "") {
                //    if (this.optional(element) || isValid == true) { 
                //        return true;
                //    } else {
                //        return this.optional(element);
                //    }
                //}
            });
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

        $.validator.addMethod("NationalCodeCharachters",
            function (value, element, options) {
                return this.optional(element) || /^[0-9]{10}$/.test(value);

                //if ($('#Title').val() != "") {
                //    if (this.optional(element) || isValid == true) { 
                //        return true;
                //    } else {
                //        return this.optional(element);
                //    }
                //}
            });

        $.validator.addMethod("EmailCharachters",
            function (value, element, options) {
                return this.optional(element) || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);

            });
        $("#frm-addUser").submit(function (e) {
            e.preventDefault();
        }).validate({

            rules: {

                UserName: { required: true, EngCharachters: true },
                FullName: { required: true, PersianCharachters: true },
                Password: { required: true  , PasswordCharachters:true},
                ConfirmPassword: { required: true, equalTo: "#Password" },
                NationalCode: { required: true, NationalCodeCharachters: true },
                Email: { required: true, EmailCharachters: true },



            },
            messages: {
                FullName: "فقط مجاز به ورود کاراکترهای  فارسی میباشید ",
                UserName: "فقط مجاز به ورود کاراکترهای  انگلیسی میباشید ",
                Password: "لطفا  از حروف بزرگ ، کوچک ، اعداد و کاراکترهای خاص استفاده کنید",
                NationalCode: "فقط مجاز به ورود عدد میباشید ",
                Email: "لطفا از فرمت ایمیل استفاده کنید"
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
                        url: '/Users/Create',
                        data: $(form).serialize(),
                        success: function (response) {
                            if (response.Status) {
                                toastr.success(response.Message, " کاربر  ", option);


                            }
                            else

                                toastr.error(response.Message, "کاربر", option);
                        },
                        error: function (errResponse) {

                            toastr.error("خطا در ثبت", " کاربر ", option);
                        }
                    });
                }


            }
        });
    }
}
UserCreation.init();