var CreateActivityTreeTitle = {
    init: function () {
        CreateActivityTreeTitle.CreateTreeTitle();
    },
    CreateTreeTitle: function () {

        $("#frm-createTreeTitleActivity").submit(function (e) {
            e.preventDefault();
        }).validate({

            rules: {

                Title: { required: true },

            },
            messages: {

            },
            submitHandler: function (form) {
                if ($(form)[0].checkValidity()) {
                    var form = $('#frm-createTreeTitleActivity');
                    var token = $('input[name="__RequestVerificationToken"]', form).val();
                    $.ajax({
                        type: "POST",
                        url: '/ActivityNew/CreateTreeTitle',
                        data: $(form).serialize(),
                        success: function (response) {
                            if (response.Status) {
                                AllertSuccess(response.Message, "کدینگ فعالیت");


                            }
                            else

                                AllertError(response.Message, "کدینگ فعالیت");
                        },
                        error: function () {

                            AllertError("امکان ثبت وجود ندارد", " کدینگ فعالیت ");
                        }
                    });
                }


            }
        });
    }
}
CreateActivityTreeTitle.init();