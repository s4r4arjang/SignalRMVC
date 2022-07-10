var record;
FiscalYearPeriods = {
    init: function () {
        FiscalYearPeriods.GetPeriods();
    },
    GetPeriods: function () {
        if ($('#ActiveFiscalYearId').val() != "") {

            $(document).ready(function() {
                var crudServiceBaseUrl = "/Period",
                    dataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: crudServiceBaseUrl +
                                    "/GetAllByFiscalYear?fiscalYearId=" +
                                    $('#ActiveFiscalYearId').val(),
                                dataType: "jsonp"
                            },
                            parameterMap: function(options, operation) {
                                if (operation !== "read" && options.models) {
                                    return { models: kendo.stringify(options.models) };
                                }
                            }
                        },
                        batch: true,
                        schema: {
                            model: {
                                id: "Id",
                                fields: {
                                    FiscalYearTitle: { type: "string", validation: { required: true } },
                                    Title: { type: "string", validation: { required: true } },
                                    StartDatePer: { type: "string", validation: { required: true } },
                                    EndDatePer: { type: "string", validation: { required: true } },
                                    IsActive: { type: "string", editable: false },
                                }
                            }
                        },
                        pageSize: 10
                    });
                record = 0;
                $("#fiscalYearPeriodGrid").kendoGrid({
                    toolbar: ["excel"],
                    excel: {
                        fileName: "دوره.xlsx",
                        proxyURL: "",
                        filterable: true
                    },
                    dataSource: dataSource,
                    sortable: true,
                    resizable: true,
                    columnMenu: false,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        serverPaging: true,
                        serverFiltering: true,
                    },
                    filterable: {
                        mode: "row"
                    },
                    columns: [
                        {
                            width: 50,
                            title: "ردیف",
                            template: "#= ++record #",
                        },
                        {
                            field: "Title",
                            title: "عنوان دوره"
                        },
                        {
                            field: "FiscalYearTitle",
                            title: "عنوان سال مالی",
                            template: function(dataItem) { return $('.activeFiscalYearName').html(); }
                        },
                        { field: "StartDatePer", title: "تاریخ شروع" },
                        { field: "EndDatePer", title: "تاریخ خاتمه" },
                        {
                            field: "IsActive",
                            title: "وضعیت",
                            filterable: false,
                            template: function(dataItem) {
                                if (dataItem.Id == $('#activeperiodId').val()) {
                                    return "<i class='fas fa-check'></i>";
                                } else {
                                    return "<span>__</span>";
                                }
                            }
                        },
                        //{
                        //    command: [
                        //        { name: "firstCustom", text: "<span class='customIcon iconActive'>فعالسازی</span>", click: SetDefaultPeriod },
                        //    ],
                        //}
                    ],
                    editable: "popup",
                    dataBinding: function () {
                        if (this.dataSource.pageSize() != undefined) {
                            record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                        } else {
                            record = 0;
                        }
                    },
                });

                function SetDefaultPeriod(e) {
                  
                    e.preventDefault();
                    kendo.ui.progress($('#fiscalYearPeriodGrid'), true);
                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                    var rowId = dataItem.Id;
                    $.ajax(
                        {
                            type: 'POST',
                            url: '/Period/SetActivePeriod',
                            dataType: 'json',
                            async: true,
                            data: { periodId: rowId },
                            success: function (response) {
                                FiscalYearPeriods.LoadAllSessions();
                                kendo.ui.progress($('#fiscalYearPeriodGrid'), false);
                                var messageClass = '';
                                if (response.Status == true) {
                                    messageClass = 'success';
                                    FiscalYearPeriods.GetActiveItemsForFiscalYearPeriod();
                                } else {
                                    messageClass = 'danger';
                                }
                                $('#messageFiscalYearPeriods').fadeIn().html('<div class= "alert alert-' +
                                    messageClass +
                                    ' alert-dismissible">' +
                                    '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                    '<strong>' +
                                    response.Message +
                                    '</strong>' +
                                    '</div>').delay(5000).fadeOut(800);
                                $('#fiscalYearPeriodGrid').data('kendoGrid').refresh();
                            }
                        });
                }
            });
        } else {
            $('#messageFiscalYearPeriods').fadeIn().html('<div class= "alert alert-danger alert-dismissible">' +
                '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                '<strong>' +
                'سال مالی فعال وجود ندارد.' +
                '</strong>' +
                '</div>').delay(5000).fadeOut(800);
        }
    },
    //دریافت سشن ها بصورت پارشیال
    LoadAllSessions: function () {
        $.ajax({
            type: "GET",
            url: "/Home/SessionPartial",
            contentType: "application/json; charset=utf-8",
            dataType: "html",
            async: false,
            success: function (response) {
                $('#allSessions').html(response);
            },
            error: function () {
                $('#allSessions').html('<h6 class="errorPart">بروز خطا در بارگذاری</h4>');
            },
        });
    },
    //دریافت عناوین فعال آیتم های فعال(دوره)
    GetActiveItemsForFiscalYearPeriod: function () {
        //دریافت دوره فعال هر کاربر
        $.ajax({
            type: 'GET',
            url: '/Period/GetActivePeriodTitle',
            dataType: 'json',
            cache: false,
            success: function (response) {
                if (response != '') {
                    $('.ActivFiscalYearPeriod').find('.text').html(response);
                } else {
                    $('.ActivFiscalYearPeriod').find('.text').html('__');
                }
            },
            error: function () {
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                FiscalYearPeriods.Error(errorMessage);
            },
        });
    },
    Error: function (errorMessage) {
        kendo.ui.progress($('#fiscalYearPeriodGrid'), false);
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
FiscalYearPeriods.init();
