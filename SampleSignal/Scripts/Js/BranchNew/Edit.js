$("#EditForm").submit(function (e) {
    debugger;
    e.preventDefault();
}).validate({
    rules: {
        Title: { required: true },
        Code: { required: true },
        OperationTypeId: { required: true },
        BranchParameterId: { required: true },
        BranchTypeId: { required: true },


    },
    messages: {
    },
    submitHandler: function (form) {
        //var model = {
        //    Title: $("#Title").val(),
        //    Code: $("#Code").val(),
        //    BranchParameterId: $("#BranchParameterId").val(),
        //    BranchTypeId: $("#BranchTypeId").val(),
        //    OperationTypeId: $("#OperationTypeId").val()
        //};
        debugger
        if ($(form)[0].checkValidity()) {
            $.ajax({
                type: "POST",
                url: '/BranchNew/Edit',
                data:$(form).serialize(),
                    
                success: function (response) {
                    debugger;
                    if (response.Status) {
                      
                        toastr.success(response.Message, "شعبه", {
                            "timeOut": "0",
                            "closeButton": true,
                            "positionClass": "toast-bottom-full-width",
                            "timeOut": "4000",
                        });


                    }
                    else {
                    
                        toastr.error(response.Message, "شعبه", {

                            "timeOut": "0",
                            "closeButton": true,
                            "positionClass": "toast-bottom-full-width",
                            "timeOut": "4000",
                        });
                    }
                       
                },
                error: function (errResponse) {
                
                    toastr.error("خطا در ثبت", "شعبه", {
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