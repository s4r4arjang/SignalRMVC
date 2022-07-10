var record;
var BudgetProcess = {
    init: function () {

        BudgetProcess.GetBudgetList();
    },
    GetBudgetList: function () {
        var crudServiceBaseUrl = "/Budget",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetListBudgetProcess/" + $('#PeriodId').val(),
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

                            ActivityBudget: { type: "number", editable: false },
                            DirectCostBudget: { type: "number", editable: false },
                            DirectWageBudget: { type: "number", editable: false },
                            StaffBudget: { type: "number", editable: false },
                            TotalBudget: { type: "number", editable: false },

                        }
                    },
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
        $("#BudgetProcessPeriodGrid").kendoGrid({
            toolbar: ["excel"],
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
                    editable: false
                },




                { field: "ProcessTitle", title: "عنوان", footerTemplate: "مجموع" },

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
            editable: true,
            dataBinding: function (e) {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }




            },

        });







    },

}
BudgetProcess.init();