$("#frm-editProductStep").submit(function (e) {
    debugger;
    e.preventDefault();
}).validate({
    rules: {
        Title: { required: true },
        BeforeStepId: { required: true },
        NextStepId: { required: true },
        ProductStepId: { required: true },


    },
    messages: {
    },
    submitHandler: function (form) {
        var model = {
            Title: $("#frm-editProductStep #Title").val(),
            
            BeforeStepId: $("#frm-editProductStep #BeforeStepId1").val(),
            NextStepId: $("#frm-editProductStep #NextStepId1").val(),
            ProductStepId: $("#frm-editProductStep #ProductStepId").val()
        };
        debugger
        if ($(form)[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: '/ProductStepNew/Edit',
                data: model,
                    
                success: function (response) {
                    debugger;
                    if (response.Status) {
                      
                        AllertSuccess(response.Message, "مرحله")


                    }
                    else {
                    
                        AllertError(response.Message, "مرحله")
                    }
                       
                },
                error: function (errResponse) {
                
                    AllertError("امکان ویرایش وجود ندارد", "مرحله")
                }
            });
        }


    }
});