
$("#ReportBudgetTariffIncomeYear").on("change", function () {

    $("#ReportBudgetTariffIncomePeriod").val(null).trigger('change');
    var year = $("#ReportBudgetTariffIncomeYear").val();
    if (year != "") {
        $("#ReportBudgetTariffIncomePeriod").val(null).trigger('change');
        $.ajax({
            type: 'Get',
            url: '/UserSetting/Period',
            dataType: 'json',
            data: { id: year },
            success: function (response) {
                var period =
                    '<option value >دوره مالی را انتخاب کنید </option>';
                $.each(response, function (index, value) {

                    period += '<option value="' + value.PeriodId + '">' + value.Title + '</option>';

                });

                $("#ReportBudgetTariffIncomePeriod").html(period);
            }
        })

    }
    else {
        var period =
            '<option value >دوره مالی را انتخاب کنید </option>';
        $("#ReportBudgetTariffIncomePeriod").html(period);
    }
})
$("#frm-ReportBudgetTariffIncome").submit(function (e) {

    e.preventDefault();
}).validate({
    rules: {


        ReportBudgetTariffIncomeBranch: { required: true },
        ReportBudgetTariffIncomeYear: { required: true },
        //ReportBudgetTariffIncomePeriod: { required: true },
    },

    messages: {
    },
    submitHandler: function (form) {
        $('#BoxReportBudgetTariffIncome').removeClass('displayNone').addClass('displayShow');
     /*   $('#BoxReportBudgetTariffIncomeProduct').removeClass('displayShow').addClass('displayNone');*/
        
        var BranchId = parseInt($('#ReportBudgetTariffIncomeBranch').val());
        var FiscalYearId = parseInt($('#ReportBudgetTariffIncomeYear').val());
        var PeriodId = parseInt($('#ReportBudgetTariffIncomePeriod').val());


   
        var ReportBudgetTariffIncomeGrid = $("#ReportBudgetTariffIncomeGrid").data("kendoGrid");
        ReportBudgetTariffIncomeGrid.dataSource.transport.options.read.url = '/ReportBudgetTariffIncome/BudgetTariffIncomeList?FiscalYearId=' + FiscalYearId + "&PeriodId=" + PeriodId + "&BranchId=" + BranchId;
        ReportBudgetTariffIncomeGrid.dataSource.read();

    }
});


var ReportBudgetTariffIncome = {
    init: function () {

        ReportBudgetTariffIncome.GetAllTariffIncome();
        //ReportBudgetTariffIncome.ProductBudgetGoal();
    },
    GetAllTariffIncome: function () {

        $('#BoxReportBudgetTariffIncome').removeClass('displayNone').addClass('displayShow');
      //  $('#BoxReportBudgetTariffIncomeProduct').removeClass('displayShow').addClass('displayNone');
        

        dataSource = new kendo.data.DataSource({
            transport: {
                read: {

                    url: '',
                    dataType: "jsonp"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return { models: kendo.stringify(options.models) };
                    }
                }
            },
            batch: true,




            schema: {
                model: {
                    id: "IncomeId",
                    fields: {
                        IncomeType: { type: "number", editable: false },
                        IncomeTitle: { type: "string", editable: false },
                        MoneyTitle: { type: "string", editable: false },
                        BudgetFinal : { type: "number", editable: false },
        



                    }
                }
            },
            pageSize: 10
            , aggregate:
                [
                    { field: "BudgetFinal", aggregate: "sum" },
                  
                ]
        });
        record = 0;
        $("#ReportBudgetTariffIncomeGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "جزئیات بهای تمام شده فرایند.xlsx",
                proxyURL: "",
                filterable: true,
                allPages: true
            },
            excelExport: function (e) {
                ExcelSetupHasib(e, $('#ReportBudgetTariffIncomePeriod option:selected').text(), $('#ReportBudgetTariffIncomeYear option:selected').text(), $('#ReportBudgetTariffIncomeBranch option:selected').text())

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
                { field: "IncomeTitle", title: "عنوان", footerTemplate: "مجموع" },
                {
                    field: "IncomeType", title: "نوع ",
                    template: function (dataItem) {
                        return dataItem.IncomeType === 2 ? "برنامه" : "<span>درآمد</span>";
                    }
                },
             
         
                { field: "MoneyTitle", title: "واحد پولی" },
                {
                    field: "BudgetFinal", title: " تعرفه بودجه شده   ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.BudgetFinal) + '</span>';
                    }
                },
            

                //{
                //    command: [
                //        { name: "thirdCustom", text: "<span class='customIcon iconInfo'>جزئیات</span>" },
                //    ],
                //    title: "عملیات"
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
    

    },


}
ReportBudgetTariffIncome.init();