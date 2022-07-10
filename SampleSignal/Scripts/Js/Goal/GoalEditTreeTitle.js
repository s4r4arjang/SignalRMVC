var GoalEditTreeTitle = {
    init: function () {
        GoalEditTreeTitle.EditGoalTree();
    },
    EditGoalTree: function () {
        debugger;
        $("#frm-editTreeTitleGoal").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },
           
            },
            messages: {
            },
            submitHandler: function (form) {
                var Title = $('#Title').val();
                var GoalTreeTitleId = $('#GoalTreeTitleId').val();
            
                var model = { 'GoalTreeTitleId': GoalTreeTitleId, 'Title': Title };
                var form = $('#frm-editTreeTitleGoal');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Goal/GoalEditTreeTitle',
                        dataType: 'json',
                        async: false,
                        data:
                        {
                            model,
                            __RequestVerificationToken : token
                        },
                        success: function (response) {
                            debugger;
                            if (response.Status) {

                                AllertSuccess(response.Message, "اهداف ");


                            }
                            else {

                                AllertError(response.Message, "اهداف ");
                            }

                        },
                        error: function (errResponse) {

                            
                            AllertError("بروز خطا در برقراری ارتباط", "اهداف ");
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
GoalEditTreeTitle.init();