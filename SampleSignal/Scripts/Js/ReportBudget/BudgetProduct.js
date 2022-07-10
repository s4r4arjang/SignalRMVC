var record, TotalProcessBaseCosting, totalProductCostingValue;
BudgetProduct = {
    init: function () {
      
        BudgetProduct.AddListener();
    },
    AddListener: function () {
        //دریافت بهای تمام شده هر بخش و تعیین درصد آن
        $(document).ready(function () {




            var ProcessId = parseInt($('#BudgetProductProcessId').val());
            var BranchId = parseInt($('#BudgetProductBranchId').val());
            var FiscalYearId = parseInt($('#BudgetProductFiscalYearId').val());
            var PeriodId = parseInt($('#BudgetProductPeriodId').val());
            BudgetProduct.GetBudgetProduct(ProcessId, BranchId, FiscalYearId, PeriodId);
        });
    },
    GetBudgetProduct: function (ProcessId, BranchId, FiscalYearId, PeriodId) {

        var crudServiceBaseUrl = "/ReportBudget",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + '/BudgetProductList?FiscalYearId=' + FiscalYearId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId + '&ProcessId=' + ProcessId,
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
                        id: "ProductId",
                        fields: {
                            ProductTitle: { type: "string", editable: false },
                            ActivityBudget: { type: "number", editable: false },
                            DirectCostBudget: { type: "number", editable: false },
                            DirectWageBudget: { type: "number", editable: false },
                            StaffBudget: { type: "number", editable: false },
                            TotalBudget: { type: "number", editable: false },

                        }
                    }
                },
                pageSize: 10
                , aggregate:
                    [
                        { field: "ActivityBudget", aggregate: "sum" },
                        { field: "DirectCostBudget", aggregate: "sum" },
                        { field: "DirectWageBudget", aggregate: "sum" },
                        { field: "StaffBudget", aggregate: "sum" },
                        { field: "TotalBudget", aggregate: "sum" }
                    ]
            });
        record = 0;
        $("#ReportBudgetProductGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "جزئیات بهای تمام شده فرایند.xlsx",
                proxyURL: "",
                filterable: true
            },
            excelExport: function (e) { ExcelSetup(e, cleanupText($('[data-Direct]').text()), "ReportBudgetProductGrid") },
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
            detailTemplate: kendo.template($("#ReportBudgetproductStepSubGrid").html()),
            detailInit: detailInitBudgetProductStep,
            dataBound: function () {
                //this.expandRow(this.tbody.find("tr.k-master-row").first());
            },
            columns: [
                {
                    width: 50,
                    title: "ردیف",
                    template: "#= ++record #",
                },
                { field: "ProductTitle", title: "عنوان برنامه", footerTemplate: "مجموع" },
                {
                    field: "ActivityBudget", title: "بودجه هزینه غیرمستقیم  ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.ActivityBudget) + '</span>';
                    }
                },
                {
                    field: "DirectCostBudget", title: "بودجه هزینه مستقیم  ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.DirectCostBudget) + '</span>';
                    }
                },
                {
                    field: "DirectWageBudget", title: "بودجه دستمزد مستقیم  ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.DirectWageBudget) + '</span>';
                    }
                },
                {
                    field: "StaffBudget", title: "بودجه پشتیبانی  ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.StaffBudget) + '</span>';
                    }
                },
                {
                    field: "TotalBudget", title: "کل بودجه ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.TotalBudget) + '</span>';
                    }
                },

            ],
            filterable: {
                mode: "row"
            },
            editable: "popup",
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });
        function detailInitBudgetProductStep(e) {
            debugger;
            var ProductId = e.data.ProductId;
            var FiscalYearId = e.data.FiscalYearId;
            var BranchId = e.data.BranchId;
            var PeriodId = e.data.PeriodId;
            var ProcessId = e.data.ProcessId;


            var detailRow = e.detailRow;
            detailRow.find(".tabstrip").kendoTabStrip({
                animation: {
                    open: { effects: "fadeIn" }
                }
            });
            var crudServiceBaseUrl = "/ReportBudget",
                dataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: crudServiceBaseUrl + '/BudgetProductStepList?FiscalYearId=' + FiscalYearId + " &ProductId=" + ProductId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId + '&ProcessId=' + ProcessId,
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
                            id: "ProductStepId",
                            fields: {

                                ProductStepTitle: { type: "string", editable: false },
                                ActivityBudget: { type: "number", editable: false },
                                DirectCostBudget: { type: "number", editable: false },
                                DirectWageBudget: { type: "number", editable: false },
                                StaffBudget: { type: "number", editable: false },
                                TotalBudget: { type: "number", editable: false },
                            }
                        }
                    },
                    pageSize: 10
                    , aggregate:
                        [
                            { field: "ActivityBudget", aggregate: "sum" },
                            { field: "DirectCostBudget", aggregate: "sum" },
                            { field: "DirectWageBudget", aggregate: "sum" },
                            { field: "StaffBudget", aggregate: "sum" },
                            { field: "TotalBudget", aggregate: "sum" }
                        ]
                });
            //record = 0;
            detailRow.find(".productStep").kendoGrid({
                toolbar: ["excel"],
                excel: {
                    fileName: "جزئیات بهای تمام شده برنامه.xlsx",
                    proxyURL: "",
                    filterable: true
                },// excelExport: function (e) { ExcelSetup(e, cleanupText($('[data-Direct]').text()), "productStep") },
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
                    { field: "ProductStepTitle", title: "عنوان مرحله", footerTemplate: "مجموع" },

                    {
                        field: "ActivityBudget", title: "بودجه هزینه غیرمستقیم  ",
                        aggregates: ["sum"], footerTemplate: "#=sum#",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.ActivityBudget) + '</span>';
                        }
                    },
                    {
                        field: "DirectCostBudget", title: "بودجه هزینه مستقیم  ",
                        aggregates: ["sum"], footerTemplate: "#=sum#",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.DirectCostBudget) + '</span>';
                        }
                    },
                    {
                        field: "DirectWageBudget", title: "بودجه دستمزد مستقیم  ",
                        aggregates: ["sum"], footerTemplate: "#=sum#",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.DirectWageBudget) + '</span>';
                        }
                    },
                    {
                        field: "StaffBudget", title: "بودجه پشتیبانی  ",
                        aggregates: ["sum"], footerTemplate: "#=sum#",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.StaffBudget) + '</span>';
                        }
                    },
                    {
                        field: "TotalBudget", title: "کل بودجه ",
                        aggregates: ["sum"], footerTemplate: "#=sum#",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.TotalBudget) + '</span>';
                        }
                    },
                    {
                        command: [
                            { name: "BudgetProductStepDetailsCustom", text: "<span class='customIcon iconInfo'>جزئیات</span>"/*, click: BudgetProductStepDetails*/ },
                        ],
                        title: "عملیات"
                    }
                ],
                editable: "popup",
                //dataBinding: function () {
                //    if (this.dataSource.pageSize() != undefined) {
                //        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                //    } else {
                //        record = 0;
                //    }
                //},
            });
        }
        //جزئیات بهای تمام شده
        //function BudgetProductStepDetails(e) {
        //    e.stopPropagation();
        //    e.preventDefault();
        //    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        //    var ProductStepId = dataItem.ProductStepId;
        //    var BranchId = dataItem.BranchId;
        //    var PeriodId = dataItem.PeriodId;



        //    var MenuId = 'ActivityBaseCosting';
        //    var TabUrl = '/ReportBudget/BudgetProductStepDetails?ProductStepId=' + ProductStepId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId,
        //    var TabScriptAddress = '/Scripts/Js/ReportBudget/BudgetProductStepDetails.js';
        //    CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        //}
    },

}
BudgetProduct.init();
function ExcelSetup(e, lastTitle, TableName) {
    debugger
    var sheet = e.workbook.sheets[0];
    sheet.frozenRows = 5;
    sheet.mergedCells = ["A3:B3", "A1:B1", "A2:B2", "C1:D1", "C2:D2", "C3:D3", "A4:D4"];
    sheet.name = "Orders";
    sheet.hAlign = "center";
    for (var CurrentRowIdx = 0; CurrentRowIdx < sheet.rows.length; CurrentRowIdx++) {
        var row = sheet.rows[CurrentRowIdx];
        sheet.rows[CurrentRowIdx].cells.reverse();   //reverse for rtl coulms 
        for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
            sheet.rows[i].cells[ci].hAlign = "center";
        }
        //if (CurrentRowIdx > 0) {//first row is header
        //    if (TableName == "productStep") {

        //        row.cells[0].value = GetpercentValue(e.data[CurrentRowIdx - 1].TotalCosting, totalProductCostingValue); //
        //    } else {
        //        row.cells[0].value = GetpercentValue(e.data[CurrentRowIdx - 1].Costing, TotalProcessBaseCosting); //
        //    }
        //}

    }
    var myHeaders = [{
        value: cleanupText($("[data-PricingTitleExcel]").text()),
        textAlign: "center",
        background: "#60b5ff",
        color: "#ffffff",
        fontSize: 18,
        verticalAlign: "center",
    }, {
        value: $("[data-ProgramTitleExcel]").text().trim(),
        textAlign: "center",
        background: "#60b5ff",
        color: "#ffffff",
        fontSize: 18,
        verticalAlign: "center",

    }];
    var myHeaders1 = [{
        value: "",
        textAlign: "center",
        background: "#60b5ff",
        color: "#ffffff",
        fontSize: 16,
        verticalAlign: "center",
    }, {
        value: "تاریخ گزارش :" + $("[data-CurrentDate]").attr("data-CurrentDate"),
        textAlign: "center",
        background: "#60b5ff",
        color: "#ffffff",
        fontSize: 16,
        verticalAlign: "center",
    }];
    var myHeaders2 = [{
        value: cleanupText($('[data-activeFiscalYearPeriodName]').text().trim()),
        textAlign: "center",
        background: "#60b5ff",
        color: "#ffffff",
        fontSize: 14,
        verticalAlign: "center",
    }, {
        value: cleanupText($('[data-activefiscalyearname]').text().trim()),
        textAlign: "center",
        background: "#60b5ff",
        color: "#ffffff",
        fontSize: 14,
        verticalAlign: "center",
    }];
    var myHeadersFinal = [{
        value: lastTitle,
        textAlign: "center",
        background: "#60b5ff",
        color: "#ffffff",
        fontSize: 14,
        verticalAlign: "center",
    }];

    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70, width: 100 },
        { cells: myHeaders1, type: "header", height: 40, width: 100 },
        { cells: myHeaders2, type: "header", height: 40 },
        { cells: myHeadersFinal, type: "header", height: 40 });
}
function GetpercentValue(value, Total) {
    var percentProductStepValue;
    if (value == 0) {
        percentProductStepValue = 0;
    } else {
        percentProductStepValue = ((value / Total) * 100).toFixed(2);
    }
    return percentProductStepValue;
}

