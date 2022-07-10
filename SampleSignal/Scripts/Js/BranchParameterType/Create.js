var BranchParameterTypeCreation = {
    
    init: function () {
        debugger;
        BranchParameterTypeCreation.CreateBranchParameterType();
    },
    CreateBranchParameterType: function () {
        
        $("#frm-createBranchParameterType").submit(function (e) {
            e.preventDefault();
        }).validate({

            rules: {

                Title : { required: true },
               
            },
            messages: {
                
            },
            submitHandler: function (form) {
                debugger
                if ($(form)[0].checkValidity()) {
                    $.ajax({
                        type: "POST",
                        url: '/BranchParameterType/Create',
                        data: $(form).serialize(),
                        success: function (response) {
                            if (response.Status) {
                                AllertSuccess(response.Message, "انواع پارامتر");


                            }
                            else

                                AllertError(response.Message, "انواع پارامتر");
                        },
                        error: function () {

                            AllertError("خطا در ثبت", " انواع پارامتر");
                        }
                    });
                }


            }
        });
    }
}
BranchParameterTypeCreation.init();