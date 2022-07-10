$("#CreateForm").submit(function (e) {
    debugger;
    e.preventDefault();
   /* alert($("#OperationTypeId").val())*/
   
}).validate({
    rules: {
        Title: { required: true },
        Code: { required: true },
        Title: { required: true },
        BranchParameterId: { required: true },
        BranchTypeId: { required: true },
        OperationTypeId: { required: true },

    },
    messages: {
    },
    submitHandler: function (form) {
        debugger;
      

        //var model = {
        //    Title: $("#Title").val(),
        //    Code: $("#Code").val(),
        //    BranchParameterId: $("#BranchParameterId").val(),
        //    BranchTypeId: $("#BranchTypeId").val(),
        //    OperationTypeId: $("#OperationTypeId").val()
        //};
        if ($(form)[0].checkValidity()) {   
            $.ajax({
                type: "POST",
                url: '/BranchNew/Create',
                data:  $(form).serialize(),
                    
                success: function (response) {
                  
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