$("#ReportCostingProcessYear").on("change", function () {

    $("#ReportCostingProcessPeriod").val(null).trigger('change');
    var year = $("#ReportCostingProcessYear").val();
    if (year != "") {
        $("#ReportCostingProcessPeriod").val(null).trigger('change');
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

                $("#ReportCostingProcessPeriod").html(period);
            }
        })

    }
    else {
        var period =
            '<option value >دوره مالی را انتخاب کنید </option>';
        $("#ReportCostingProcessPeriod").html(period);
    }
})


$("#frm-ReportCostingProcess").submit(function (e) {

    e.preventDefault();
}).validate({
    rules: {


        ReportCostingProcessBranch: { required: true },
        ReportCostingProcessYear: { required: true },
        ReportCostingProcessPeriod: { required: true },
    },

    messages: {
    },
    submitHandler: function (form) {

        var BranchId = parseInt($('#ReportCostingProcessBranch').val());
        var FiscalYearId = parseInt($('#ReportCostingProcessYear').val());
        var PeriodId = parseInt($('#ReportCostingProcessPeriod').val());


        $('#BoxReportCostingProcess').removeClass('displayNone').addClass('displayShow');
        $('#BoxReportCostingProduct').removeClass('displayShow').addClass('displayNone');

        var ReportCostingProcessGrid = $("#ReportCostingProcessGrid").data("kendoGrid");
        ReportCostingProcessGrid.dataSource.transport.options.read.url = '/ReportCostingProcess/ReportCostingProcessList?FiscalYearId=' + FiscalYearId + "&PeriodId=" + PeriodId + "&BranchId=" + BranchId;
        ReportCostingProcessGrid.dataSource.read();

    }
});


var ReportCostingProcess = {
    init: function () {


        ReportCostingProcess.GetAllProcess();
    },
    GetAllProcess: function () {



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
                    id: "ProcessId",
                    fields: {
                        ProcessTitle: { type: "string", editable: false },


                        Costing: { type: "number", editable: false },
                        RealCosting: { type: "number", editable: false },



                    }
                }
            },
            pageSize: 10
            , aggregate:
                [
                    { field: "Costing", aggregate: "sum" },
                    { field: "RealCosting", aggregate: "sum" },

                ]
        });
        record = 0;
        $("#ReportCostingProcessGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "جزئیات بهای تمام شده.xlsx",
                proxyURL: "",
                filterable: true,
                allPages: true
            },
            excelExport: function (e) {
                ExcelSetupHasib(e, $('#ReportCostingProcessPeriod option:selected').text(), $('#ReportCostingProcessYear option:selected').text(), $('#ReportCostingProcessBranch option:selected').text())

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
                { field: "ProcessTitle", title: "عنوان", footerTemplate: "مجموع" },

                {
                    field: "Costing", title: "بهای تمام شده    ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.Costing) + '</span>';
                    }
                },
                {
                    field: "RealCosting", title: "بهای تمام شده واقعی    ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.RealCosting) + '</span>';
                    }
                },


                {
                    command: [
                        { name: "thirdCustom", text: "<span class='customIcon iconInfo'>جزئیات</span>", click: ProductCosting },
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
        function ProductCosting(e) {
            debugger;
            $('#BoxReportCostingProduct').removeClass('displayNone').addClass('displayShow');
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var ProcessId = dataItem.ProcessId;
            var BranchId = parseInt($('#ReportCostingProcessBranch').val());
            var FiscalYearId = parseInt($('#ReportCostingProcessYear').val());
            var PeriodId = parseInt($('#ReportCostingProcessPeriod').val());
            $('#BoxReportCostingProduct .title-box').html(dataItem.ProcessTitle);
            var crudServiceBaseUrl = "/ReportCostingProcess",
                dataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: crudServiceBaseUrl + '/ReportCostingProductList?FiscalYearId=' + FiscalYearId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId + '&ProcessId=' + ProcessId,
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
                                Costing: { type: "number", editable: false },
                                RealCosting: { type: "number", editable: false },


                            }
                        }
                    },
                    pageSize: 10
                    , aggregate:
                        [
                            { field: "Costing", aggregate: "sum" },
                            { field: "RealCosting", aggregate: "sum" },

                        ]
                });
            record = 0;
            $("#ReportCostingProductGrid").kendoGrid({
                toolbar: ["excel"],
                excel: {
                    fileName: "جزئیات بهای تمام شده.xlsx",
                    proxyURL: "",
                    filterable: true,
                    allPages: true
                },
                excelExport: function (e) {
                    ExcelSetupHasib(e, $('#ReportCostingProcessPeriod option:selected').text(), $('#ReportCostingProcessYear option:selected').text(), $('#ReportCostingProcessBranch option:selected').text())

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
                detailTemplate: kendo.template($("#ReportCostingproductStepSubGrid").html()),
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
                        field: "Costing", title: "بهای تمام شده    ",
                        aggregates: ["sum"], footerTemplate: "#=sum#",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.Costing) + '</span>';
                        }
                    },
                    {
                        field: "RealCosting", title: "بهای تمام شده واقعی    ",
                        aggregates: ["sum"], footerTemplate: "#=sum#",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.RealCosting) + '</span>';
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

                //var ProcessId = e.data.ProcessId;

                var BranchId = parseInt($('#ReportCostingProcessBranch').val());
                var FiscalYearId = parseInt($('#ReportCostingProcessYear').val());
                var PeriodId = parseInt($('#ReportCostingProcessPeriod').val());

                var detailRow = e.detailRow;
                detailRow.find(".tabstrip").kendoTabStrip({
                    animation: {
                        open: { effects: "fadeIn" }
                    }
                });
                var crudServiceBaseUrl = "/ReportCostingProcess",
                    dataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: crudServiceBaseUrl + '/ReportCostingProductStepList?FiscalYearId=' + FiscalYearId + " &ProductId=" + ProductId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId,//+ '&ProcessId=' + ProcessId,
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
                                    OneCosting: { type: "number", editable: false },
                                    RealOneCosting: { type: "number", editable: false },
                                    TotalCosting: { type: "number", editable: false },
                                    RealTotalCosting: { type: "number", editable: false },
                                   
                                }
                            }
                        },
                        pageSize: 10
                        , aggregate:
                            [
                             
                                { field: "OneCosting", aggregate: "sum" },
                                { field: "RealOneCosting", aggregate: "sum" },
                                { field: "TotalCosting", aggregate: "sum" },
                                { field: "RealTotalCosting", aggregate: "sum" }
                            ]
                    });
                //record = 0;
                detailRow.find(".productStep").kendoGrid({
                    toolbar: ["excel"],
                    excel: {
                        fileName: "جزئیات بهای تمام شده.xlsx",
                        proxyURL: "",
                        filterable: true,
                        allPages: true
                    },
                    excelExport: function (e) {
                        ExcelSetupHasib(e, $('#ReportCostingProcessPeriod option:selected').text(), $('#ReportCostingProcessYear option:selected').text(), $('#ReportCostingProcessBranch option:selected').text())

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
                        { field: "ProductStepTitle", title: "عنوان مرحله", footerTemplate: "مجموع" },

                        {
                            field: "OneCosting", title: "بودجه هزینه غیرمستقیم  ",
                            aggregates: ["sum"], footerTemplate: "#=sum#",
                            template: function (dataItem) {
                                return '<span class="number">' + SetThousandSeprator(dataItem.OneCosting) + '</span>';
                            }
                        },
                        {
                            field: "RealOneCosting", title: "بودجه هزینه مستقیم  ",
                            aggregates: ["sum"], footerTemplate: "#=sum#",
                            template: function (dataItem) {
                                return '<span class="number">' + SetThousandSeprator(dataItem.RealOneCosting) + '</span>';
                            }
                        },
                        {
                            field: "TotalCosting", title: "بودجه دستمزد مستقیم  ",
                            aggregates: ["sum"], footerTemplate: "#=sum#",
                            template: function (dataItem) {
                                return '<span class="number">' + SetThousandSeprator(dataItem.TotalCosting) + '</span>';
                            }
                        },
                        {
                            field: "RealTotalCosting", title: "بودجه پشتیبانی  ",
                            aggregates: ["sum"], footerTemplate: "#=sum#",
                            template: function (dataItem) {
                                return '<span class="number">' + SetThousandSeprator(dataItem.RealTotalCosting) + '</span>';
                            }
                        },
                        {
                            command: [
                                { name: "thirdCustom3", text: "<span class='customIcon iconInfo'>هزینه مستقیم</span>", click: ProductStepDirectCost },
                                { name: "thirdCustom4", text: "<span class='customIcon iconInfo'> دستمزد</span>", click: ProductStepDirectWageCost },
                                { name: "thirdCustom5", text: "<span class='customIcon iconInfo'> پشتیبانی</span>", click: ProductStepStaffCost },
                                { name: "thirdCustom6", text: "<span class='customIcon iconInfo'> غیرمستقیم</span>", click: ProductStepIndirectCost2 },
                                { name: "thirdCustom7", text: "<span class='customIcon iconInfo'> فعالیت</span>", click: ProductStepActivity2 },
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
                // start
                function ProductStepActivity2(e) {
                    $('#BoxReportProductStepStaffCost').removeClass('displayShow').addClass('displayNone');
                    debugger;
                    $('#BoxReportProductStepDirectWageCost').removeClass('displayShow').addClass('displayNone');

                    $('#BoxReportProductStepDirectCost').removeClass('displayShow').addClass('displayNone');

                    $('#BoxReportProductStepIndirectCost').removeClass('displayShow').addClass('displayNone');
                    $('#BoxReportProductStepActivityCost').removeClass('displayNone').addClass('displayShow');
                    $('#BoxReportProductStepCostInActivity').removeClass('displayShow').addClass('displayNone');





                    var BranchId = parseInt($('#ReportCostingProcessBranch').val());
                    var FiscalYearId = parseInt($('#ReportCostingProcessYear').val());
                    var PeriodId = parseInt($('#ReportCostingProcessPeriod').val());

                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                    var ProductStepId = dataItem.ProductStepId;
                    $('#BoxReportProductStepActivityCost .title-box').html(dataItem.ProductStepTitle);
                    dataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: '/ReportCostingProcess/ReportProductStepActivity?FiscalYearId=' + FiscalYearId + " &ProductStepId=" + ProductStepId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId,//+ '&ProcessId=' + ProcessId,

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
                                id: "ActivityId",
                                fields: {

                                    ActivityTitle: { type: "string", editable: false },

                                    RealOneCost: { type: "number", editable: false },
                                    RealTotalCost: { type: "number", editable: false },
                                    OneCost: { type: "number", editable: false },
                                    TotalCost: { type: "number", editable: false },


                                }
                            }
                        },
                        pageSize: 10
                        , aggregate:
                            [
                                { field: "RealOneCost", aggregate: "sum" },
                                { field: "RealTotalCost", aggregate: "sum" },
                                { field: "OneCost", aggregate: "sum" },
                                { field: "TotalCost", aggregate: "sum" },
                            ]
                    });
                    record = 0;
                    $("#ReportProductStepActivityCostGrid").kendoGrid({
                        toolbar: ["excel"],
                        excel: {
                            fileName: "جزئیات بهای تمام شده.xlsx",
                            proxyURL: "",
                            filterable: true,
                            allPages: true
                        },
                        excelExport: function (e) {
                            ExcelSetupHasib(e, $('#ReportCostingProcessPeriod option:selected').text(), $('#ReportCostingProcessYear option:selected').text(), $('#ReportCostingProcessBranch option:selected').text())

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

                            { field: "ActivityTitle", title: " عنوان فعالیت ", footerTemplate: "مجموع" },


                            {
                                field: "OneCost", title: "هزینه ظرفیت یک واحد  ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.OneCost) + '</span>';
                                }
                            },
                            {
                                field: "RealOneCost", title: "هزینه واقعی یک واحد    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.RealOneCost) + '</span>';
                                }
                            },
                            {
                                field: "TotalCost", title: "هزینه ظرفیت  کل    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.TotalCost) + '</span>';
                                }
                            },
                            {
                                field: "RealTotalCost", title: "هزینه واقعی  کل    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.RealTotalCost) + '</span>';
                                }
                            },
                            {
                                command: [
                                    { name: "thirdCustom33", text: "<span class='customIcon iconInfo'>هزینه </span>", click: ProductStepCostinActivity22 },
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
                    function ProductStepCostinActivity22(e) {
                        $('#BoxReportProductStepStaffCost').removeClass('displayShow').addClass('displayNone');
                        debugger;
                        $('#BoxReportProductStepDirectWageCost').removeClass('displayShow').addClass('displayNone');

                        $('#BoxReportProductStepDirectCost').removeClass('displayShow').addClass('displayNone');

                        $('#BoxReportProductStepIndirectCost').removeClass('displayNone').addClass('displayNone');
                    
                        $('#BoxReportProductStepCostInActivity').removeClass('displayNone').addClass('displayShow');





                        var BranchId = parseInt($('#ReportCostingProcessBranch').val());
                        var FiscalYearId = parseInt($('#ReportCostingProcessYear').val());
                        var PeriodId = parseInt($('#ReportCostingProcessPeriod').val());

                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        var ProductStepId = dataItem.ProductStepId;
                        var ActivityId = dataItem.ActivityId;
                        $('#BoxReportProductStepCostInActivity .title-box').html(dataItem.ActivityTitle);
                        dataSource = new kendo.data.DataSource({
                            transport: {
                                read: {
                                    url: '/ReportCostingProcess/ReportProductStepCostInActivity?FiscalYearId=' + FiscalYearId + " &ProductStepId=" + ProductStepId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId + '&ActivityId=' + ActivityId,

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

                                        CostTitle: { type: "string", editable: false },

                                        RealOneCost: { type: "number", editable: false },
                                        RealTotalCost: { type: "number", editable: false },
                                        OneCost: { type: "number", editable: false },
                                        TotalCost: { type: "number", editable: false },


                                    }
                                }
                            },
                            pageSize: 10
                            , aggregate:
                                [
                                    { field: "RealOneCost", aggregate: "sum" },
                                    { field: "RealTotalCost", aggregate: "sum" },
                                    { field: "OneCost", aggregate: "sum" },
                                    { field: "TotalCost", aggregate: "sum" },
                                ]
                        });
                        record = 0;
                        $("#ReportProductStepCostInActivityGrid").kendoGrid({
                            toolbar: ["excel"],
                            excel: {
                                fileName: "جزئیات بهای تمام شده.xlsx",
                                proxyURL: "",
                                filterable: true,
                                allPages: true
                            },
                            excelExport: function (e) {
                                ExcelSetupHasib(e, $('#ReportCostingProcessPeriod option:selected').text(), $('#ReportCostingProcessYear option:selected').text(), $('#ReportCostingProcessBranch option:selected').text())

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

                                { field: "CostTitle", title: " عنوان هزینه ", footerTemplate: "مجموع" },


                                {
                                    field: "OneCost", title: "هزینه ظرفیت یک واحد  ",
                                    aggregates: ["sum"], footerTemplate: "#=sum#",
                                    template: function (dataItem) {
                                        return '<span class="number">' + SetThousandSeprator(dataItem.OneCost) + '</span>';
                                    }
                                },
                                {
                                    field: "RealOneCost", title: "هزینه واقعی یک واحد    ",
                                    aggregates: ["sum"], footerTemplate: "#=sum#",
                                    template: function (dataItem) {
                                        return '<span class="number">' + SetThousandSeprator(dataItem.RealOneCost) + '</span>';
                                    }
                                },
                                {
                                    field: "TotalCost", title: "هزینه ظرفیت  کل    ",
                                    aggregates: ["sum"], footerTemplate: "#=sum#",
                                    template: function (dataItem) {
                                        return '<span class="number">' + SetThousandSeprator(dataItem.TotalCost) + '</span>';
                                    }
                                },
                                {
                                    field: "RealTotalCost", title: "هزینه واقعی  کل    ",
                                    aggregates: ["sum"], footerTemplate: "#=sum#",
                                    template: function (dataItem) {
                                        return '<span class="number">' + SetThousandSeprator(dataItem.RealTotalCost) + '</span>';
                                    }
                                },
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

                }
                function ProductStepIndirectCost2(e) {
                    $('#BoxReportProductStepStaffCost').removeClass('displayShow').addClass('displayNone');
                    debugger;
                    $('#BoxReportProductStepDirectWageCost').removeClass('displayShow').addClass('displayNone');

                    $('#BoxReportProductStepDirectCost').removeClass('displayShow').addClass('displayNone');

                    $('#BoxReportProductStepIndirectCost').removeClass('displayNone').addClass('displayShow');
                    $('#BoxReportProductStepActivityCost').removeClass('displayShow').addClass('displayNone');
                    $('#BoxReportProductStepCostInActivity').removeClass('displayShow').addClass('displayNone');





                    var BranchId = parseInt($('#ReportCostingProcessBranch').val());
                    var FiscalYearId = parseInt($('#ReportCostingProcessYear').val());
                    var PeriodId = parseInt($('#ReportCostingProcessPeriod').val());

                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                    var ProductStepId = dataItem.ProductStepId;
                    $('#BoxReportProductStepIndirectCost .title-box').html(dataItem.ProductStepTitle);
                    dataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: '/ReportCostingProcess/ReportProductStepInDirectCostList?FiscalYearId=' + FiscalYearId + " &ProductStepId=" + ProductStepId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId,//+ '&ProcessId=' + ProcessId,

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

                                    CostTitle: { type: "string", editable: false },

                                    RealOneCost: { type: "number", editable: false },
                                    RealTotalCost: { type: "number", editable: false },
                                    OneCost: { type: "number", editable: false },
                                    TotalCost: { type: "number", editable: false },


                                }
                            }
                        },
                        pageSize: 10
                        , aggregate:
                            [
                                { field: "RealOneCost", aggregate: "sum" },
                                { field: "RealTotalCost", aggregate: "sum" },
                                { field: "OneCost", aggregate: "sum" },
                                { field: "TotalCost", aggregate: "sum" },
                            ]
                    });
                    record = 0;
                    $("#ReportProductStepIndirectCostGrid").kendoGrid({
                        toolbar: ["excel"],
                        excel: {
                            fileName: "جزئیات بهای تمام شده.xlsx",
                            proxyURL: "",
                            filterable: true,
                            allPages: true
                        },
                        excelExport: function (e) {
                            ExcelSetupHasib(e, $('#ReportCostingProcessPeriod option:selected').text(), $('#ReportCostingProcessYear option:selected').text(), $('#ReportCostingProcessBranch option:selected').text())

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

                            { field: "CostTitle", title: " عنوان هزینه ", footerTemplate: "مجموع" },


                            {
                                field: "OneCost", title: "هزینه ظرفیت یک واحد  ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.OneCost) + '</span>';
                                }
                            },
                            {
                                field: "RealOneCost", title: "هزینه واقعی یک واحد    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.RealOneCost) + '</span>';
                                }
                            },
                            {
                                field: "TotalCost", title: "هزینه ظرفیت  کل    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.TotalCost) + '</span>';
                                }
                            },
                            {
                                field: "RealTotalCost", title: "هزینه واقعی  کل    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.RealTotalCost) + '</span>';
                                }
                            },
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
                function ProductStepStaffCost(e) {
                    $('#BoxReportProductStepStaffCost').removeClass('displayNone').addClass('displayShow');
                    debugger;
                    $('#BoxReportProductStepDirectWageCost').removeClass('displayShow').addClass('displayNone');

                    $('#BoxReportProductStepDirectCost').removeClass('displayShow').addClass('displayNone');
                
                    $('#BoxReportProductStepIndirectCost').removeClass('displayShow').addClass('displayNone');
                    $('#BoxReportProductStepActivityCost').removeClass('displayShow').addClass('displayNone');
                    $('#BoxReportProductStepCostInActivity').removeClass('displayShow').addClass('displayNone');





                    var BranchId = parseInt($('#ReportCostingProcessBranch').val());
                    var FiscalYearId = parseInt($('#ReportCostingProcessYear').val());
                    var PeriodId = parseInt($('#ReportCostingProcessPeriod').val());

                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                    var ProductStepId = dataItem.ProductStepId;
                    $('#BoxReportProductStepStaffCost .title-box').html(dataItem.ProductStepTitle);
                    dataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: '/ReportCostingProcess/ReportProductStepStaffCostList?FiscalYearId=' + FiscalYearId + " &ProductStepId=" + ProductStepId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId,//+ '&ProcessId=' + ProcessId,

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

                                    CostTitle: { type: "string", editable: false },

                                    RealOneCost: { type: "number", editable: false },
                                    RealTotalCost: { type: "number", editable: false },
                                    OneCost: { type: "number", editable: false },
                                    TotalCost: { type: "number", editable: false },


                                }
                            }
                        },
                        pageSize: 10
                        , aggregate:
                            [
                                { field: "RealOneCost", aggregate: "sum" },
                                { field: "RealTotalCost", aggregate: "sum" },
                                { field: "OneCost", aggregate: "sum" },
                                { field: "TotalCost", aggregate: "sum" },
                            ]
                    });
                    record = 0;
                    $("#ReportProductStepStaffCostGrid").kendoGrid({
                        toolbar: ["excel"],
                        excel: {
                            fileName: "جزئیات بهای تمام شده.xlsx",
                            proxyURL: "",
                            filterable: true,
                            allPages: true
                        },
                        excelExport: function (e) {
                            ExcelSetupHasib(e, $('#ReportCostingProcessPeriod option:selected').text(), $('#ReportCostingProcessYear option:selected').text(), $('#ReportCostingProcessBranch option:selected').text())

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

                            { field: "CostTitle", title: " عنوان هزینه ", footerTemplate: "مجموع" },


                            {
                                field: "OneCost", title: "هزینه ظرفیت یک واحد  ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.OneCost) + '</span>';
                                }
                            },
                            {
                                field: "RealOneCost", title: "هزینه واقعی یک واحد    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.RealOneCost) + '</span>';
                                }
                            },
                            {
                                field: "TotalCost", title: "هزینه ظرفیت  کل    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.TotalCost) + '</span>';
                                }
                            },
                            {
                                field: "RealTotalCost", title: "هزینه واقعی  کل    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.RealTotalCost) + '</span>';
                                }
                            },
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
                function ProductStepDirectWageCost(e) {

                    debugger;
                    $('#BoxReportProductStepDirectWageCost').removeClass('displayNone').addClass('displayShow');

                    $('#BoxReportProductStepDirectCost').removeClass('displayShow').addClass('displayNone');
                    $('#BoxReportProductStepStaffCost').removeClass('displayShow').addClass('displayNone');
                    $('#BoxReportProductStepIndirectCost').removeClass('displayShow').addClass('displayNone');
                    $('#BoxReportProductStepActivityCost').removeClass('displayShow').addClass('displayNone');
                    $('#BoxReportProductStepCostInActivity').removeClass('displayShow').addClass('displayNone');
                  




                    var BranchId = parseInt($('#ReportCostingProcessBranch').val());
                    var FiscalYearId = parseInt($('#ReportCostingProcessYear').val());
                    var PeriodId = parseInt($('#ReportCostingProcessPeriod').val());

                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                    var ProductStepId = dataItem.ProductStepId;
                    $('#BoxReportProductStepDirectWageCost .title-box').html(dataItem.ProductStepTitle);
                    dataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: '/ReportCostingProcess/ReportProductStepDirectWageCostList?FiscalYearId=' + FiscalYearId + " &ProductStepId=" + ProductStepId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId,//+ '&ProcessId=' + ProcessId,

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

                                    CostTitle: { type: "string", editable: false },

                                    RealOneCost: { type: "number", editable: false },
                                    RealTotalCost: { type: "number", editable: false },
                                    OneCost: { type: "number", editable: false },
                                    TotalCost: { type: "number", editable: false },


                                }
                            }
                        },
                        pageSize: 10
                        , aggregate:
                            [
                                { field: "RealOneCost", aggregate: "sum" },
                                { field: "RealTotalCost", aggregate: "sum" },
                                { field: "OneCost", aggregate: "sum" },
                                { field: "TotalCost", aggregate: "sum" },
                            ]
                    });
                    record = 0;
                    $("#ReportProductStepDirectWageCostGrid").kendoGrid({
                        toolbar: ["excel"],
                        excel: {
                            fileName: "جزئیات بهای تمام شده.xlsx",
                            proxyURL: "",
                            filterable: true,
                            allPages: true
                        },
                        excelExport: function (e) {
                            ExcelSetupHasib(e, $('#ReportCostingProcessPeriod option:selected').text(), $('#ReportCostingProcessYear option:selected').text(), $('#ReportCostingProcessBranch option:selected').text())

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

                            { field: "CostTitle", title: " عنوان هزینه ", footerTemplate: "مجموع" },


                            {
                                field: "OneCost", title: "هزینه ظرفیت یک واحد  ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.OneCost) + '</span>';
                                }
                            },
                            {
                                field: "RealOneCost", title: "هزینه واقعی یک واحد    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.RealOneCost) + '</span>';
                                }
                            },
                            {
                                field: "TotalCost", title: "هزینه ظرفیت  کل    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.TotalCost) + '</span>';
                                }
                            },
                            {
                                field: "RealTotalCost", title: "هزینه واقعی  کل    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.RealTotalCost) + '</span>';
                                }
                            },
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
                function ProductStepDirectCost(e) {
                    $('#BoxReportProductStepDirectCost').removeClass('displayNone').addClass('displayShow');
                    $('#BoxReportProductStepDirectWageCost').removeClass('displayShow').addClass('displayNone');

              
                    $('#BoxReportProductStepStaffCost').removeClass('displayShow').addClass('displayNone');
                    $('#BoxReportProductStepIndirectCost').removeClass('displayShow').addClass('displayNone');
                    $('#BoxReportProductStepActivityCost').removeClass('displayShow').addClass('displayNone');
                    $('#BoxReportProductStepCostInActivity').removeClass('displayShow').addClass('displayNone');
                    debugger;
                    $('#BoxReportProductStepDirectCost').removeClass('displayNone').addClass('displayShow');
                    // $('#BoxReportBudgetGoalProduct').removeClass('displayNone').addClass('displayShow');
                    var BranchId = parseInt($('#ReportCostingProcessBranch').val());
                    var FiscalYearId = parseInt($('#ReportCostingProcessYear').val());
                    var PeriodId = parseInt($('#ReportCostingProcessPeriod').val());

                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                    var ProductStepId = dataItem.ProductStepId;
                    $('#BoxReportProductStepDirectCost .title-box').html(dataItem.ProductStepTitle);
                    dataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url:  '/ReportCostingProcess/ReportProductStepDirectCostList?FiscalYearId=' + FiscalYearId + " &ProductStepId=" + ProductStepId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId,//+ '&ProcessId=' + ProcessId,
                              
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
                                
                                    CostTitle: { type: "string", editable: false },

                                    RealOneCost: { type: "number", editable: false },
                                    RealTotalCost: { type: "number", editable: false },
                                    OneCost: { type: "number", editable: false },
                                    TotalCost: { type: "number", editable: false },


                                }
                            }
                        },
                        pageSize: 10
                        , aggregate:
                            [
                                { field: "RealOneCost", aggregate: "sum" },
                                { field: "RealTotalCost", aggregate: "sum" },
                                { field: "OneCost", aggregate: "sum" },
                                { field: "TotalCost", aggregate: "sum" },
                            ]
                    });
                    record = 0;
                    $("#ReportProductStepDirectCostGrid").kendoGrid({
                        toolbar: ["excel"],
                        excel: {
                            fileName: "جزئیات بهای تمام شده.xlsx",
                            proxyURL: "",
                            filterable: true,
                            allPages: true
                        },
                        excelExport: function (e) {
                            ExcelSetupHasib(e, $('#ReportCostingProcessPeriod option:selected').text(), $('#ReportCostingProcessYear option:selected').text(), $('#ReportCostingProcessBranch option:selected').text())

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

                            { field: "CostTitle", title: " عنوان هزینه ", footerTemplate: "مجموع" },


                            {
                                field: "OneCost", title: "هزینه ظرفیت یک واحد  ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.OneCost) + '</span>';
                                }
                            },
                            {
                                field: "RealOneCost", title: "هزینه واقعی یک واحد    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.RealOneCost) + '</span>';
                                }
                            },
                            {
                                field: "TotalCost", title: "هزینه ظرفیت  کل    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.TotalCost) + '</span>';
                                }
                            },
                            {
                                field: "RealTotalCost", title: "هزینه واقعی  کل    ",
                                aggregates: ["sum"], footerTemplate: "#=sum#",
                                template: function (dataItem) {
                                    return '<span class="number">' + SetThousandSeprator(dataItem.RealTotalCost) + '</span>';
                                }
                            },
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
                //  end
            }

        }

    },


}
ReportCostingProcess.init();


function ExcelSetup(e, lastTitle, TableName) {
    debugger
    var sheet = e.workbook.sheets[0];
    sheet.frozenRows = 5;
    sheet.mergedCells = ["A3:B3", "A1:B1", "A2:B2", "C1:D1", "C2:D2", "C3:D3", "A4:D4"];
    sheet.name = "Orders";
    sheet.hAlign = "right";
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