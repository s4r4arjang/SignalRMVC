function DirectWage() {

    debugger
    $('.customtab.active').removeClass('active').addClass('');
    $(this).addClass('.active');

    debugger
    $.ajax({
        type: "GET",
        url: '/CostInProductStep/DirectWage' ,

        dataType: "html",
        success: function (response) {

            $('#showcost').html(response);




        },

    });

    debugger
}
function StaffCost() {
    $('.customtab.active').removeClass('active').addClass('');
    $(this).addClass('.active');
    
    $.ajax({
        type: "GET",
        url: '/CostInProductStep/Staff',

        dataType: "html",
        success: function (response) {

            $('#showcost').html(response);




        },

    });
}

function DirectCost() {
    $('.customtab.active').removeClass('active');
    $(this).addClass('.active');
    //$(this).addClass("active");
   
     debugger;
    $.ajax({
        type: "GET",
        url: "/CostInProductStep/DirectCost",
        dataType: "html",
        success: function (response) {
            $('#showcost').html(response);
        },
    });
}
function OperationalActivity() {
    $.ajax({
        type:"GET",
        datatype: "html",
        url: "/ActivityInProductStep/OperationalActivity",
        success: function (response) {
            $('#showcost').html(response);
        },

    });
}

function StaffActivity() {
    $('.customtab.active').removeClass('active');
    $(this).addClass('active');
    $.ajax({
        type: "GET",
        dataType: "html",
        url: "/ActivityInProductStep/StaffActivity",
        success: function (response) {
            $('#showcost').html(response);
        },
    });
}

$(function () {

    debugger;
    DirectWage(); 
    $('li#directWage').addClass('active');
});


