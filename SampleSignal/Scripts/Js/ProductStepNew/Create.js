$("#frm-createProductStep").submit(function (e) {
    debugger;
    e.preventDefault();
  
}).validate({
    rules: {
        Title: { required: true },
        ProductId : { required: true },
      
    },
    messages: {
    },
    submitHandler: function (form) {
        debugger;
      

        if ($(form)[0].checkValidity()) {   
            $.ajax({
                type: "POST",
                url: '/ProductStepNew/Create',
                data:  $(form).serialize(),
                    
                success: function (response) {
                  
                    if (response.Status) {

                        AllertSuccess(response.Message,"مرحله")


                    }
                    else {

                        AllertError(response.Message, "مرحله")
                    }
                       
                },
                error: function (errResponse) {
                
                    AllertError("امکان ثبت وجود ندارد", "مرحله")
                }
            });
        }


    }
});