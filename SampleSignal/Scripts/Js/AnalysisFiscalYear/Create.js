var AnalysisFiscalYearCreate = {
    init: function () {
      //  AnalysisFiscalYearCreate.Addlistener();
        AnalysisFiscalYearCreate.createAnalysisFiscalYear();
    },

 

    createAnalysisFiscalYear: function() {

      

    $("#frm-createAnalysisFiscalYear").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
             
                Title: {
                  
                    required: true 
                },
                Year: {
                    required: true

                },
                StartDatePersian: { required: true },
                Budgetyear: { required: true },
             /*   EndDatePersian: { required: true },*/
            },
           
            messages: {
            },
            submitHandler: function (form) {
                var Title = $('#Title').val();
                var Year = parseInt($('#Year').val());
                var StartDatePersian = $('#StartDatePersian').val();
                var Budgetyear= parseInt($('#Budgetyear').val());
              /*  var EndDatePersian = $('#EndDatePersian').val();*/
                var BeforeYearId = parseInt($('#BeforeYearId').val());
                if (isNaN(BeforeYearId))
                    BeforeYearId = null;
                var fiscalYear = {
                    'Title': Title, 'Year': Year, 'StartDatePersian': StartDatePersian
                    //, 'EndDatePersian': EndDatePersian
                    , 'Budgetyear': Budgetyear
                    , 'BeforeYearId': BeforeYearId
                }
                var option = {
                    "timeOut": "0",
                    "closeButton": true,
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "4000",
                }
                $.ajax(
                    {
                        type: 'POST',
                        url: '/AnalysisFiscalYear/Create',
                        dataType: 'json',
                        async: false,
                        data: {
                            fiscalYear
                           
                        },
                        success: function (response) {
                            debugger;
                            if (response.Status) {

                                toastr.success(response.Message, " سال مالی", option);


                            }
                            else {

                                toastr.error(response.Message, " سال مالی", option);
                            }

                        },
                        error: function (errResponse) {

                            toastr.error("خطا در عملیات", " سال مالی", option);
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
AnalysisFiscalYearCreate.init();