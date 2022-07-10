
    //addListener: function () {
    //    //جدا کننده روی فشردن دکمه
    //    $('.seprator').keyup(function (event) {
    //        // skip for arrow keys
    //        if (event.which >= 37 && event.which <= 40) return;

    //        // format number
    //        $(this).val(function (index, value) {
    //            return value
    //                    .replace(/\D/g, "")
    //                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    //                ;
    //        });f
    //    });
    //    //جدا کننده روی لود
    //        $(document).ready(function() {
    //            $('.seprator').each(function() {
    //                // format number
    //                $(this).val(function(index, value) {
    //                    return value
    //                        .replace(/\D/g, "")
    //                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //                });
    //            });
    //        });
    //    $(document).ready(function () {
    //        $('.sepratorText').each(function () {
    //            // format number
    //            $(this).html(function (index, value) {
    //                return value
    //                        .replace(/\D/g, "")
    //                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    //                    ;
    //            });
    //        });
    //    });
    //},
function SetThousandSeprator(value) {
    
    if(value==0)
        return 0;
    var num_parts = value.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
    }