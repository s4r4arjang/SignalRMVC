

$("#frm-editProcess").submit(function (e) {
    debugger;
    e.preventDefault();
}).validate({
    rules: {
        ActivityTreeTitleId : { required: true },
        Title : { required: true },
        
    },
    messages: {

    },
    submitHandler: function (form) {
        var Title = $('#Title').val();
        var ProcessId = $('#ProcessId').val();

        var model = { 'ProcessId': ProcessId, 'Title': Title };

        if ($(form)[0].checkValidity()) {
            var form = $('#frm-editProcess');
            var token = $('input[name="__RequestVerificationToken"]', form).val();

            $.ajax({
                type: "POST",
                url: '/ProcessNew/Edit',
                data:
                {
                    model,
                    __RequestVerificationToken: token
                },
                success: function (response) {
                    if (response.Status) {
                        AllertSuccess(response.Message, "فرایند/برنامه/مرحله ");



                    }
                    else

                        AllertError(response.Message, "فرایند/برنامه/مرحله");
                },
                error: function () {

                    AllertError("امکان ویرایش وجود ندارد", " فرایند/برنامه/مرحله ");
                }
            });
        }


    }
});