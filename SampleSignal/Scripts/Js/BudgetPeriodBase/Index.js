
$("#frm-BudjetPeriodBase").submit(function (e) {
    debugger;
    e.preventDefault();
}).validate
    ({
        rules: {
            PeriodId: { required: true },
        },

        messages: {
        },
        submitHandler: function (form) {
           
            $.ajax(
                {
                    type: 'POST',
                    url: '/BudgetPeriodBase/Index/' + $('#PeriodId1.BudgetPeriodBase').val(),
                    dataType: 'json',
                    async: false,
                    data: $(form).serialize(),
                    success: function (response) {
                    
                        if (response.Status) {

                           
                            AllertSuccess(response.Message, "دوره مبنای بودجه");
                            debugger;
                        }
                        else {

                            AllertError(response.Message, "دوره مبنای بودجه");
                        }

                    },
                    error: function (errResponse) {

                        AllertError("خطا در عملیات", "دوره مبنای بودجه");
                    }
                });
        }
    });