
var ProductGoal = {
    init: function () {
        $('.ProductGoalGrid').removeClass('displayShow').addClass('displayNone');
        ProductGoal.GetAllProductGoal();
    },
    

    GetAllProductGoal: function () {
       
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: '',
                        dataType: "jsonp"
                    },
                    update: {
                        url:'',
                        dataType: "jsonp",
                        type: "post"

                    },
                    parameterMap: function (options, operation) {
                        debugger;
                        options.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val();
                        return options;
                    }
                },
               

                requestEnd: function (e) {
                    //check the "response" argument to skip the local operations
                    debugger;
                    if (e.type === "update") {
                        if (e.response.Status != undefined) {
                            if (e.response.Status) {
                                AllertSuccess(e.response.Message, "مدیریت عملکرد");
                                var grid = $("#ProductGoalGrid").data("kendoGrid");
                                grid.dataSource.read();
                                grid.refresh();

                            }
                            else {
                                AllertError(e.response.Message, "مدیریت عملکرد");
                            }

                            var grid = $("#ProductGoalGrid").data("kendoGrid");
                            grid.dataSource.read();
                        }


                    }



                },
                batch: true,
                schema: {
                    model: {
                        id: "IncomeId",
                        fields: {
                            Type: { type: "number", editable: false },
                            Title: { type: "string", editable: false },
                            Path: { type: "string", editable: false },
                            StructureTitle : { type: "string", editable: false },
                            Count: { editable: true, type: "number", validation: { required: true, min: 0 } },
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#ProductGoalGrid").kendoGrid({
            dataSource: dataSource,
            sortable: true,
            batch: true,
            resizable: true,
            columnMenu: false,
            persistSelection: true,
            navigatable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                serverPaging: true,
                serverFiltering: true,
                responsive: false
            },
            filterable: {
                mode: "row"
            },
            toolbar: ["save", "cancel"],
            columns: [
                {
                    title: "ردیف",
                    template: "#= ++record #",
                    width: 50
                },
                {
                    field: "Type", title: "نوع هدف", filterable: false, template: function (dataItem) { return dataItem.Type == 1 ? "برنامه" : "<span>درآمد</span>"; }
                },
                { field: "Title ", title: " عنوان", editable: false },
                { field: "Path ", title: "مسیر", editable: false },
                { field: "StructureTitle", title: "عنوان ساختار", editable: false },
                { field: "Count  ", title: "تعداد", format: "{0}", editor: customEditor },



            ],
            editable: true,
           
            dataBinding: function () {
                debugger;
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });
        
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
ProductGoal.init();

function callProductGoal() {

    debugger;
    var Y = $("#PeriodId.ProductGoal").val();
    if (Y === "") {
        $('.ProductGoalGrid').removeClass('displayShow').addClass('displayNone');



    }
    else {
        debugger


        $('.ProductGoalGrid').removeClass('displayNone').addClass('displayShow');
        var ProductGoalGrid = $("#ProductGoalGrid").data("kendoGrid");
        ProductGoalGrid.dataSource.transport.options.read.url = "/OperationManagement/ProductGoalList?GoalId=" + $("#GoalId").val() + "&PeriodId=" + $("#PeriodId").val();
        ProductGoalGrid.dataSource.transport.options.update.url = "/OperationManagement/Edit?PeriodId=" + $("#PeriodId.ProductGoal").val();
        ProductGoalGrid.dataSource.read();

    }

}


function customEditor(container, options) {
    $('<input required  data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            decimals: 7,
            format: "n6",
            min: 0,

        });


}