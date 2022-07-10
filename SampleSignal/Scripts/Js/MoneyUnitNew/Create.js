var moneyUnitNewCreation = {
    
    init: function () {
        debugger;
        moneyUnitNewCreation.CreateMoneyUnitNew();
    },
    CreateMoneyUnitNew: function () {
        
        $("#frm-createMoneyUnitNew").submit(function (e) {
            e.preventDefault();
        }).validate({

            rules: {

                Title : { required: true },
                //IsDefault: { required: true },
                //IsBase : { required: true },


            },
            messages: {
                
            },
            submitHandler: function (form) {
                debugger
                if ($(form)[0].checkValidity()) {
                    $.ajax({
                        type: "POST",
                        url: '/MoneyUnitNew/Create',
                        data: $(form).serialize(),
                        success: function (response) {
                            if (response.Status) {
                                AllertSuccess(response.Message, "واحد پولی");


                            }
                            else

                                AllertError(response.Message, "واحد پولی");
                        },
                        error: function () {

                              AllertError("خطا در ثبت", " واحد پولی ");
                        }
                    });
                }


            }
        });
    }
}
moneyUnitNewCreation.init();