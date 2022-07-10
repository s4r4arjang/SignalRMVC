

$("#frm-editTreeTitleActivity").submit(function (e) {
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
        var ActivityTreeTitleId = $('#ActivityTreeTitleId').val();

        var model = { 'ActivityTreeTitleId': ActivityTreeTitleId, 'Title': Title };

        if ($(form)[0].checkValidity()) {
            var form = $('#frm-editTreeTitleActivity');
            var token = $('input[name="__RequestVerificationToken"]', form).val();
            $.ajax({
                type: "POST",
                url: '/ActivityNew/EditTreeTitle',
                data:
                {
                    model,
                    __RequestVerificationToken: token,
                },
                success: function (response) {
                    if (response.Status) {
                        AllertSuccess(response.Message, " کدینگ فعالیت ");



                    }
                    else

                        AllertError(response.Message, "کدینگ فعالیت");
                },
                error: function () {

                    AllertError("امکان ویرایش وجود ندارد", " کدینگ فعالیت ");
                }
            });
        }


    }
});