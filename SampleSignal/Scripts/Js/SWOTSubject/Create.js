$("#CreateForm").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {
       
        SWOTMainFactorId: { required: true },
        SubFactorTitle: { required: true },
        SubjectCount: { number: true, required: true },
   


    },
    messages: {
    },
    submitHandler: function (form) {
        debugger
        if ($(form)[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: '/SWOTSubject/Create',
                data: $(form).serialize(),
                success: function (response) {
                    if (response.success) {
                        toastr.success(response.message, "مقادیر", {
                            "timeOut": "0",
                            "closeButton": true,
                            "positionClass": "toast-bottom-full-width",
                            "timeOut": "4000",
                        });
                  

                    }
                    else

                        toastr.error(response.message, "مقادیر", {
                            "timeOut": "0",
                            "closeButton": true,
                            "positionClass": "toast-bottom-full-width",
                            "timeOut": "4000",
                        });
                },
                error: function (errResponse) {

                    toastr.error("خطا در ثبت", "مقادیر", {
                        "timeOut": "0",
                        "timeOut": "4000",
                        "closeButton": true,
                        "positionClass": "toast-bottom-full-width",
                    });
                }
            });
        }


    }
});