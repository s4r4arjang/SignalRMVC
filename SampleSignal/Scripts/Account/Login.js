var Login = {
    init: function () {
        Login.Addlistener();
    },
    Addlistener: function () {
        $('#frm-login').find('.input').keypress(function (e) {
            if (e.which == 13) {
                $('#frm-login').submit();
                return false;
            }
        });
        //$(document).ready(function () {
        //        $('.formInput').on('focus',
        //            function () {
        //                $('.button').removeClass('ziroScale').addClass('visible');
        //            });
        //    });
    },
}
document.addEventListener('DOMContentLoaded', Login.init, false);
