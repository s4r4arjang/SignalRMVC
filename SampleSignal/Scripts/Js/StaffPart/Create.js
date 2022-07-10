var StaffPartCreation = {
    init: function () {
        StaffPartCreation.CreateStaffPart();
    },
    CreateStaffPart: function () {
        
        $("#frm-addStaffPart").submit(function (e) {
            e.preventDefault();
        }).validate({

            rules: {

                Title: { required: true },
                




            },
            messages: {
                
            },
            submitHandler: function (form) {
                if ($(form)[0].checkValidity()) {
                    $.ajax({
                        type: "POST",
                        url: '/StaffPart/Create',
                        data: $(form).serialize(),
                        success: function (response) {
                            if (response.Status) {
                                AllertSuccess(response.Message, "دوایر");


                            }
                            else

                                AllertError(response.Message, "دوایر");
                        },
                        error: function () {

                            AllertError("خطا در ثبت", " دوایر");
                        }
                    });
                }


            }
        });
    }
}
StaffPartCreation.init();