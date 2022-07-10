var BranchTypeCreation = {
    
    init: function () {
        debugger;
        BranchTypeCreation.CreateBranchType();
    },
    CreateBranchType: function () {
        
        $("#frm-createBranchType").submit(function (e) {
            e.preventDefault();
        }).validate({

            rules: {

                Title: { required: true },
                Code: { required: true },
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
                        url: '/BranchType/Create',
                        data: $(form).serialize(),
                        success: function (response) {
                            if (response.Status) {
                                AllertSuccess(response.Message, "انواع شعبه");


                            }
                            else

                                AllertError(response.Message, "انواع شعبه");
                        },
                        error: function () {

                            AllertError("خطا در ثبت", " انواع شعبه ");
                        }
                    });
                }


            }
        });
    }
}
BranchTypeCreation.init();