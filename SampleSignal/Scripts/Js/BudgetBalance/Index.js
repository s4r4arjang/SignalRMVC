var record;
var BudgetBalance = {
    init: function () {
        BudgetBalance.GetBudgetBalance();
    },
    GetBudgetBalance: function () {
      
        $.ajax({
            type: "GET",
            url: "/BudgetBalance/index",

            dataType: "html",
            success: function (response) {

                $('#Balancediv').html(response);




            },

        });

    },
  
}
BudgetBalance.init();