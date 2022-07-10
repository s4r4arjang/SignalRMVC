var CreateProcessTreeTitle = {
    init: function () {
        CreateProcessTreeTitle.CreateTreeTitle();
    },
    CreateTreeTitle: function () {

        $("#frm-createProcess").submit(function (e) {
            e.preventDefault();
        }).validate({

            rules: {

                Title: { required: true },

            },
            messages: {

            },
            submitHandler: function (form) {
                debugger
                if ($(form)[0].checkValidity()) {
                    var form = $('#frm-createProcess');
                    var token = $('input[name="__RequestVerificationToken"]', form).val();
                    $.ajax({
                        type: "POST",
                        url: '/ProcessNew/Create',
                        data: $(form).serialize(),
                        success: function (response) {
                            if (response.Status) {
                                AllertSuccess(response.Message, "فرایند/برنامه/مرحله");


                            }
                            else

                                AllertError(response.Message, "فرایند/برنامه/مرحله");
                        },
                        error: function () {

                            AllertError("امکان ثبت وجود ندارد", " فرایند/برنامه/مرحله");
                        }
                    });
                }


            }
        });
    }
}
CreateProcessTreeTitle.init();