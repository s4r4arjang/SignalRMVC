var BlockIPCreation = {
    init: function () {
        BlockIPCreation.CreateBlockIP();
        $('#BlockIPItem').on('change', function () {
            var s = $('#BlockIPItem').val();
            if (s == "1") {
                $('#IPEnd').removeClass("displayShow").addClass('displayNone');
            }

            else
            {
 
                $('#IPEnd').removeClass("displayNone").addClass('displayShow');
            }
        });
    },
    CreateBlockIP: function () {
        
        $("#frm-addBlockIP").submit(function (e) {
            e.preventDefault();
        }).validate({

            rules: {

                IPStart: { required: true }
            },
            messages: {
                
            },
            submitHandler: function (form) {
                if ($(form)[0].checkValidity()) {
                    $.ajax({
                        type: "POST",
                        url: '/BlockIP/Create',
                        data: $(form).serialize(),
                        success: function (response) {
                            if (response.Status) {
                                AllertSuccess(response.Message, "IP");


                            }
                            else

                                AllertError(response.Message, "IP");
                        },
                        error: function () {

                              AllertError("خطا در ثبت", " IP ");
                        }
                    });
                }


            }
        });
    }
}
BlockIPCreation.init();