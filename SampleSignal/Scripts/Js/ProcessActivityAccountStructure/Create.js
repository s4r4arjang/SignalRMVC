

$("#ProcessActivityAccountStructureCreate").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
       
        Title: { required: true },
        AccountTreeTitleId: { required: true },
        ActivityAccountStructureId: { required: true },
        ProcessIds: { required: true },


    },
    messages: {
    },
    submitHandler: function (form) {
       
        
        if ($(form)[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: '/ProcessActivityAccountStructure/Create',
                data: $(form).serialize(),
                success: function (response) {
                    if (response.success) {
                        AllertSuccess(response.message, " فرایند  ");
                        


                    }
                    else

                        AllertError(response.message, " فرایند  ");
                },
                error: function (errResponse) {
                    AllertError("امکان ثبت وجود ندارد", "فرایند");
                    
                }
            });
        }


    }
});