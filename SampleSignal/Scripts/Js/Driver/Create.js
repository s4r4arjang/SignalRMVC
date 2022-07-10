var DriverCreation = {
    init: function () {
        DriverCreation.CreateDriver();
    },
    CreateDriver: function () {
        
        $("#frm-addDriver").submit(function (e) {
            e.preventDefault();
        }).validate({

            rules: {

                title: { required: true },
                UnitType: { required: true },




            },
            messages: {
                
            },
            submitHandler: function (form) {
                if ($(form)[0].checkValidity()) {
                    $.ajax({
                        type: "POST",
                        url: '/Driver/Create',
                        data: $(form).serialize(),
                        success: function (response) {
                            if (response.Status) {
                                AllertSuccess(response.Message, "محرک");


                            }
                            else

                                AllertError(response.Message, "محرک");
                        },
                        error: function () {

                              AllertError("خطا در ثبت", " محرک ");
                        }
                    });
                }


            }
        });
    }
}
DriverCreation.init();