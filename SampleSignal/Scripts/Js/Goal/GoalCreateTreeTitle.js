var CreateGoalTreeTitle = {
    init: function () {
        CreateGoalTreeTitle.CreateTreeTitleGoal();
    },
    CreateTreeTitleGoal: function () {
        $("#frm-createTreeTitleGoal").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true},
         
            },
            messages: {
            },
            submitHandler: function (form) {
                var Title = $('#Title').val();
         
                var model = { 'Title': Title };
                var form = $('#frm-createTreeTitleGoal');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Goal/GoalCreateTreeTitle',
                        dataType: 'json',
                        async: false,
                        data:
                        {
                            model,
                            __RequestVerificationToken: token
                        },
                        success: function (response) {
                            debugger;
                            if (response.Status) {

                                AllertSuccess(response.Message, "اهداف");


                            }
                            else {

                                AllertError(response.Message, "اهداف ");
                            }

                        },
                        error: function (errResponse) {

                           
                            AllertError("خطا در عملیات", "اهداف ");
                        }
                    });
            }
        });
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
CreateGoalTreeTitle.init();