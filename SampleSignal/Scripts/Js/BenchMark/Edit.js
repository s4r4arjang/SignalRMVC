
$("#frm-editBenchMark").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
        BenchMarkId : { required: true },

        Title : { required: true},
        
    },
   
    submitHandler: function (form) {
        debugger
       
        if ($(form)[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: '/BenchMark/Edit',
                data: $(form).serialize(),
                success: function (response) {
                    if (response.Status) {
                        AllertSuccess(response.Message, "سنجه");


                    }
                    else

                        AllertError(response.Message, "سنجه");
                },
                error: function (errResponse) {

                    AllertError("امکان ویرایش وجود ندارد", " سنجه ");
                }
            });
        }


    }
});