var record;
var StaffCost = {
    init: function () {
        StaffCost.GetStaffCost();
    },
    GetStaffCost: function () {
      
        $.ajax({
            type: "GET",
            url: "/staffcost/index",

            dataType: "html",
            success: function (response) {

                $('#tashim').html(response);




            },

        });

    },
  
}
StaffCost.init();