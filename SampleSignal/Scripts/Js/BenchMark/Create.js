var BenchMarkCreation = {
    init: function () {
        BenchMarkCreation.CreateBenchMark();
    },
    CreateBenchMark: function () {

        $("#frm-addBenchMark").submit(function (e) {
            e.preventDefault();
        }).validate({

            rules: {

                Title: { required: true},
                



            },
           
            submitHandler: function (form) {
                debugger
                
                if ($(form)[0].checkValidity()) {
                    $.ajax({
                        type: "POST",
                        url: '/BenchMark/Create',
                        data: $(form).serialize(),
                        success: function (response) {
                            if (response.Status) {
                                AllertSuccess(response.Message, "سنجه");


                            }
                            else

                                AllertError(response.Message, "سنجه");
                        },
                        error: function (errResponse) {

                            AllertError("امکان ثبت وجود ندارد", " سنجه ");
                        }
                    });
                }


            }
        });
    }
}
BenchMarkCreation.init();