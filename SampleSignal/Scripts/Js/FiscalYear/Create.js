var FiscalYearCreate = {
    init: function () {
      //  FiscalYearCreate.Addlistener();
        FiscalYearCreate.CreateFiscalYear();
    },
    //Addlistener: function() {
    //    var roleId = $('#RoleId').val();
    //    //if (roleId === "Administrator") {
    //    //    FiscalYearCreate.GetAllBranch();
    //    //}
    //    $(document).ready(function() {
    //        //ایجاد combo سال مالی
    //        var contentFiscalYear = '<option disabled>سال مالی را انتخاب نمائید</option>';
    //        $.ajax({
    //            type: 'GET',
    //            url: '/FiscalYear/ListYearDropDown',
    //            dataType: 'json',
    //            async: false,
    //            success: function(response) {
    //                if (response.length > 0) {
    //                    for (i = 0; i < response.length; i++) {
    //                        if (response[i].Selected == true) {
    //                            contentFiscalYear += '<option selected value="' +
    //                                response[i].Value +
    //                                '">' +
    //                                response[i].Text +
    //                                '</option>';
    //                        } else {
    //                            contentFiscalYear += '<option value="' +
    //                                response[i].Value +
    //                                '">' +
    //                                response[i].Text +
    //                                '</option>';
    //                        }
    //                    }
    //                }
    //                $("#Year").html(contentFiscalYear);
    //            },
    //            error: function() {
    //                var errorMessage = 'بروز خطا در برقراری ارتباط';
    //                FiscalYearCreate.Error(errorMessage);
    //            },
    //        });
    //    });
    


    //},
    CreateFiscalYear: function() {

        var isValid = '';

        //$.validator.addMethod("UniqFiscalYearTitle",
        //    function(value, element, options) {
        //        var BranchIdForCheck = parseInt($('#branchIdCreateFiscalYear').val());
        //        if ($('#Title').val() != "") {
        //            $.ajax({
        //                type: 'GET',
        //                url: '/FiscalYear/CheckTitleExist',
        //                dataType: 'json',
        //                async: false,
        //                data: { 'title': value, 'branchId': BranchIdForCheck },
        //                success: function(response) {
        //                    if (response.Status == false) {
        //                        isValid = true;
        //                    } else {
        //                        isValid = false;
        //                    }
        //                },
        //                error: function() {
        //                    var errorMessage = 'بروز خطا در برقراری ارتباط';
        //                    FiscalYearCreate.Error(errorMessage);
        //                },
        //            });
        //            if (this.optional(element) || isValid == true) {
        //                return true;
        //            } else {
        //                return this.optional(element);
        //            }
        //        }
        //    });
    $("#frm-createFiscalYear").submit(function (e) {
            e.preventDefault();
    }).validate
        ({
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
                var form = $('#frm-createFiscalYear');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/FiscalYear/Create',
                        dataType: 'json',
                        async: false,
                        data: {
                            fiscalYear,
                            __RequestVerificationToken : token
                           
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
FiscalYearCreate.init();