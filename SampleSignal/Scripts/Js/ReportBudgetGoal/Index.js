
$("#ReportBudgetGoalYear").on("change", function () {

    $("#ReportBudgetGoalPeriod").val(null).trigger('change');
    var year = $("#ReportBudgetGoalYear").val();
    if (year != "") {
        $("#ReportBudgetGoalPeriod").val(null).trigger('change');
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

                $("#ReportBudgetGoalPeriod").html(period);
            }
        })

    }
    else {
        var period =
            '<option value >دوره مالی را انتخاب کنید </option>';
        $("#ReportBudgetGoalPeriod").html(period);
    }
})
$("#frm-ReportBudgetGoal").submit(function (e) {

    e.preventDefault();
}).validate({
    rules: {


        ReportBudgetGoalBranch: { required: true },
        ReportBudgetGoalYear: { required: true },
        //ReportBudgetGoalPeriod: { required: true },
    },

    messages: {
    },
    submitHandler: function (form) {
        $('#BoxReportBudgetGoalProcess').removeClass('displayNone').addClass('displayShow');
        $('#BoxReportBudgetGoalProduct').removeClass('displayShow').addClass('displayNone');
        
        var BranchId = parseInt($('#ReportBudgetGoalBranch').val());
        var FiscalYearId = parseInt($('#ReportBudgetGoalYear').val());
        var PeriodId = parseInt($('#ReportBudgetGoalPeriod').val());


        var ReportFilter = {

            'BranchId': BranchId,
            'FiscalYearId': FiscalYearId,
            'PeriodId': PeriodId,
        }
        var ReportBudgetGoalProcessGrid = $("#ReportBudgetGoalProcessGrid").data("kendoGrid");
        ReportBudgetGoalProcessGrid.dataSource.transport.options.read.url = '/ReportBudgetGoal/BudgetGoalProcessList?FiscalYearId=' + FiscalYearId + "&PeriodId=" + PeriodId + "&BranchId=" + BranchId;
        ReportBudgetGoalProcessGrid.dataSource.read();

    }
});


var ReportBudgetGoalProcess = {
    init: function () {

        ReportBudgetGoalProcess.GetAllProcess();
        //ReportBudgetGoalProcess.ProductBudgetGoal();
    },
    GetAllProcess: function () {

        $('#BoxReportBudgetGoalProcess').removeClass('displayNone').addClass('displayShow');
        $('#BoxReportBudgetGoalProduct').removeClass('displayShow').addClass('displayNone');
        

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
                    id: "GoalId",
                    fields: {
                        Title: { type: "string", editable: false },
                        

                        BudgetActivity : { type: "number", editable: false },
                        BudgetDirectCost : { type: "number", editable: false },
                        BudgetDirectWage : { type: "number", editable: false },
                        BudgetStaff : { type: "number", editable: false },
                        BudgetTotal : { type: "number", editable: false },



                    }
                }
            },
            pageSize: 10
            , aggregate:
                [
                    { field: "BudgetActivity", aggregate: "sum" },
                    { field: "BudgetDirectCost", aggregate: "sum" },
                    { field: "BudgetDirectWage", aggregate: "sum" },
                    { field: "BudgetStaff", aggregate: "sum" },
                    { field: "BudgetTotal", aggregate: "sum" }
                ]
        });
        record = 0;
        $("#ReportBudgetGoalProcessGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "جزئیات بودجه  اهداف.xlsx",
                proxyURL: "",
                filterable: true,
                allPages: true
            },
            excelExport: function (e) {
                ExcelSetupHasib(e, $('#ReportBudgetGoalPeriod option:selected').text(), $('#ReportBudgetGoalYear option:selected').text(), $('#ReportBudgetGoalBranch option:selected').text())
                
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
                { field: "Title", title: "عنوان", footerTemplate: "مجموع" },
                

                {
                    field: "BudgetActivity", title: "بودجه هزینه غیرمستقیم  ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.BudgetActivity) + '</span>';
                    }
                },
                {
                    field: "BudgetDirectCost", title: "بودجه هزینه مستقیم  ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.BudgetDirectCost) + '</span>';
                    }
                },
                {
                    field: "BudgetDirectWage", title: "بودجه دستمزد مستقیم  ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.BudgetDirectWage) + '</span>';
                    }
                },
                {
                    field: "BudgetStaff", title: "بودجه پشتیبانی  ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.BudgetStaff) + '</span>';
                    }
                },
                {
                    field: "BudgetTotal", title: "کل بودجه ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.BudgetTotal) + '</span>';
                    }
                },

                {
                    command: [
                        { name: "thirdCustom", text: "<span class='customIcon iconInfo'>جزئیات</span>", click: ProductBudgetGoal },
                    ],
                    title: "عملیات"
                }
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
        //جزئیات   بودجه محصولات
        function ProductBudgetGoal(e) {
            debugger;
            $('#BoxReportBudgetGoalProcess').removeClass('displayNone').addClass('displayShow');
            $('#BoxReportBudgetGoalProduct').removeClass('displayNone').addClass('displayShow');
            var BranchId = parseInt($('#ReportBudgetGoalBranch').val());
            var FiscalYearId = parseInt($('#ReportBudgetGoalYear').val());
            var PeriodId = parseInt($('#ReportBudgetGoalPeriod').val());
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var GoalId = dataItem.GoalId;
            $('#BoxReportBudgetGoalProduct .title-box').html(dataItem.Title);
            debugger;
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {

                        url: '/ReportBudgetGoal/BudgetGoalProductList?FiscalYearId=' + FiscalYearId + "&PeriodId=" + PeriodId + "&BranchId=" + BranchId + "&GoalId=" + GoalId,
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
                            ProcessTitle: { type: "string", editable: false },
                            Path: { type: "string", editable: false },
                            BudgetActivity: { type: "number", editable: false },
                            BudgetDirectCost: { type: "number", editable: false },
                            BudgetDirectWage: { type: "number", editable: false },
                            BudgetStaff: { type: "number", editable: false },
                            BudgetTotal: { type: "number", editable: false },



                        }
                    }
                },
                pageSize: 10
                , aggregate:
                    [
                        { field: "BudgetActivity", aggregate: "sum" },
                        { field: "BudgetDirectCost", aggregate: "sum" },
                        { field: "BudgetDirectWage", aggregate: "sum" },
                        { field: "BudgetStaff", aggregate: "sum" },
                        { field: "BudgetTotal", aggregate: "sum" }
                    ]
            });
            record = 0;
            $("#ReportBudgetGoalProductGrid").kendoGrid({
                toolbar: ["excel"],
                excel: {
                    fileName: "جزئیات بودجه  برنامه در اهداف.xlsx",
                    proxyURL: "",
                    filterable: true,
                    allPages: true
                },
                excelExport: function (e) {
                    ExcelSetupHasib(e, $('#ReportBudgetGoalPeriod option:selected').text(), $('#ReportBudgetGoalYear option:selected').text(), $('#ReportBudgetGoalBranch option:selected').text())

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
                    { field: "ProductTitle", title: " عنوان مرحله", footerTemplate: "مجموع" },
                    { field: "ProcessTitle", title: "عنوان فرایند" },
                    { field: "Path", title: "مسیر" },
                   

                    {
                        field: "BudgetActivity", title: "بودجه هزینه غیرمستقیم  ",
                        aggregates: ["sum"], footerTemplate: "#=sum#",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.BudgetActivity) + '</span>';
                        }
                    },
                    {
                        field: "BudgetDirectCost", title: "بودجه هزینه مستقیم  ",
                        aggregates: ["sum"], footerTemplate: "#=sum#",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.BudgetDirectCost) + '</span>';
                        }
                    },
                    {
                        field: "BudgetDirectWage", title: "بودجه دستمزد مستقیم  ",
                        aggregates: ["sum"], footerTemplate: "#=sum#",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.BudgetDirectWage) + '</span>';
                        }
                    },
                    {
                        field: "BudgetStaff", title: "بودجه پشتیبانی  ",
                        aggregates: ["sum"], footerTemplate: "#=sum#",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.BudgetStaff) + '</span>';
                        }
                    },
                    {
                        field: "BudgetTotal", title: "کل بودجه ",
                        aggregates: ["sum"], footerTemplate: "#=sum#",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.BudgetTotal) + '</span>';
                        }
                    },

                    //{
                    //    command: [
                    //        { name: "thirdCustom", text: "<span class='customIcon iconInfo'>جزئیات</span>", /*click: ProductBudgetGoal*/ },
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

        }

    },


}
ReportBudgetGoalProcess.init();