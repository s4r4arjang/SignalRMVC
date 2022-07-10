
$("#ReportBudgetCostYear").on("change", function () {

    $("#ReportBudgetCostPeriod").val(null).trigger('change');
    var year = $("#ReportBudgetCostYear").val();
    if (year != "") {
        $("#ReportBudgetCostPeriod").val(null).trigger('change');
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

                $("#ReportBudgetCostPeriod").html(period);
            }
        })

    }
    else {
        var period =
            '<option value >دوره مالی را انتخاب کنید </option>';
        $("#ReportBudgetCostPeriod").html(period);
    }
})
$("#frm-ReportBudgetCost").submit(function (e) {

    e.preventDefault();
}).validate({
    rules: {


        ReportBudgetCostBranch: { required: true },
        ReportBudgetCostYear: { required: true },
        //ReportBudgetCostPeriod: { required: true },
    },

    messages: {
    },
    submitHandler: function (form) {
        $('#BoxReportBudgetCost').removeClass('displayNone').addClass('displayShow');
     /*   $('#BoxReportBudgetCostProduct').removeClass('displayShow').addClass('displayNone');*/
        
        var BranchId = parseInt($('#ReportBudgetCostBranch').val());
        var FiscalYearId = parseInt($('#ReportBudgetCostYear').val());
        var PeriodId = parseInt($('#ReportBudgetCostPeriod').val());


   
        var ReportBudgetCostGrid = $("#ReportBudgetCostGrid").data("kendoGrid");
        ReportBudgetCostGrid.dataSource.transport.options.read.url = '/ReportBudgetCost/BudgetCostList?FiscalYearId=' + FiscalYearId + "&PeriodId=" + PeriodId + "&BranchId=" + BranchId;
        ReportBudgetCostGrid.dataSource.read();

    }
});


var ReportBudgetCost = {
    init: function () {

        ReportBudgetCost.GetAllBudgetCost();
        //ReportBudgetCost.ProductBudgetGoal();
    },
    GetAllBudgetCost: function () {

        $('#BoxReportBudgetCost').removeClass('displayNone').addClass('displayShow');
      //  $('#BoxReportBudgetCostProduct').removeClass('displayShow').addClass('displayNone');
        

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
                    id: "CostId",
                    fields: {
                        DynamicType: { type: "number", editable: false },
                        CostTitle: { type: "string", editable: false },
                        CostTypeTitle: { type: "string", editable: false },
                        BudgetPrice : { type: "number", editable: false },
        

                        

                    }
                }
            },
            pageSize: 10
            , aggregate:
                [
                    { field: "BudgetPrice", aggregate: "sum" },
                  
                ]
        });
        record = 0;
        $("#ReportBudgetCostGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "جزئیات بودجه  شده هزینه.xlsx",
                proxyURL: "",
                filterable: true,
                allPages: true
            },
            excelExport: function (e) {
                ExcelSetupHasib(e, $('#ReportBudgetCostPeriod option:selected').text(), $('#ReportBudgetCostYear option:selected').text(), $('#ReportBudgetCostBranch option:selected').text())

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
                { field: "CostTitle", title: "عنوان", footerTemplate: "مجموع" },
                { field: "CostTypeTitle", title: "نوح حساب", footerTemplate: "مجموع" },
                
                {
                    field: "DynamicType", title: "نوع هزینه ",
                    template: function (dataItem) {
                        return dataItem.DynamicType === 1 ? "ثابت" : "<span>متغیر</span>";
                    }
                },
             
         
              
                {
                    field: "BudgetPrice", title: "  بودجه هزینه   ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.BudgetPrice) + '</span>';
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
ReportBudgetCost.init();