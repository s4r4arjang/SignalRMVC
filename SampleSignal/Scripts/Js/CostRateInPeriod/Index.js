var record, listOfCosts = [];
var CostRateInPeriod = {
    init: function () {

        CostRateInPeriod.GetAllCostList();
    },
  
    GetTotalCosts: function () {
     },

    GetAllCostList: function () {
        var crudServiceBaseUrl = "/CostRateInPeriod",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetCostList",
                        dataType: "jsonp"
                    },
                    update: {
                        url: crudServiceBaseUrl + "/Edit",
                        dataType: "json",
                        type: "post"

                    },
                    parameterMap: function (options, operation) {
                        options.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val();
                        return options;
                    }
                }

                ,
                requestEnd: function (e) {
                    //check the "response" argument to skip the local operations

                    if (e.type === "update") {
                        if (e.response.Status != undefined) {
                            if (e.response.Status) {
                                toastr.success(e.response.Message, ",بودجه ریزی هزینه های ثابت", {
                                    "timeOut": "0",
                                    "closeButton": true,
                                    "positionClass": "toast-bottom-full-width",
                                    "timeOut": "4000",
                                });
                         

                            }
                            else {
                                toastr.error(e.response.Message, "بودجه ریزی هزینه های ثابت", {
                                    "timeOut": "0",
                                    "closeButton": true,
                                    "positionClass": "toast-bottom-full-width",
                                    "timeOut": "4000",
                                });
                            }

                            var grid = $("#CostRateInPeriodGrid").data("kendoGrid");
                            grid.dataSource.read();
                        }
                    }
                },
                batch: true,
                schema: {
                    model: {
                        id: "CostRateInPeriodId",
                        fields: {
                            CostTitle: { type: "string", editable: false },
                            CostPath: { type: "string", editable: false },
                            CostCode: { type: "string", editable: false },
                            MoneyUnitTitle: { type: "string", editable: false },

                            Rate: { editable: true, type: "number", validation: { required: true, min: 0 } },
                            RealRate: { editable: true, type: "number", validation: { required: true, min: 0 } },
                            AssignedCapacity: { editable: false, type: "number", validation: { required: true, min: 0 } },
                            CalculatePrice: { editable: true, type: "number", validation: { required: true, min: 0 } },
                            Capacity: { editable: false, type: "number", validation: { required: true, min: 0 } },
                        
                            Price: { editable: true, type: "number", validation: { required: true } },
                            InflationPercentage: { editable: true, type: "number", validation: { required: true } },


                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#CostRateInPeriodGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: " هزینه ها.xlsx",
                proxyURL: "",
                filterable: true
            },
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
                { field: "CostPath", title: "مسیر " },

                { field: "CostCode", title: "کد " },
                { field: "CostTitle", title: "عنوان هزینه" },

                { field: "MoneyUnitTitle", title: "واحد پولی " },

              
                {
                    field: "Price", title: "مبلغ کل", format: "{0}",editor: customEditor,
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.Price) + '</span>';
                    }
                },
                {
                    field: "CalculatePrice", title: "مبلغ محاسباتی", editor: customEditordisabled,
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.CalculatePrice) + '</span>';
                    }
                },
                {
                    field: "InflationPercentage", title: "نرخ تورم ", format: "{0}", editor: customEditor,
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.InflationPercentage) + '</span>';
                    }
                },
                {
                    field: "Capacity", title: "ظرفیت ", format: "{0}", editor: customEditor,
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.Capacity) + '</span>';
                    }
                },
                {
                    field: "AssignedCapacity", title: "تخصیص یافته  ", format: "{0}", editor: customEditor,
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.AssignedCapacity) + '</span>';
                    }
                },

                {
                    field: "Rate", title: " نرخ ظرفیت  ", editor: customEditordisabled,
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.Rate) + '</span>';
                    }
                },
                {
                    field: "RealRate", title: "نرخ واقعی  ", editor: customEditordisabled,
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.RealRate) + '</span>';
                    }
                }
                ,



            ],
            editable: "incell",
            cellClose: function (e) {
                debugger;
                var dataItem = e.sender.dataItem($(e.container).parent())
                Price = dataItem["Price"];
              //  CalculatePrice = dataItem["CalculatePrice"];
                Capacity = dataItem["Capacity"];
                AssignedCapacity = dataItem["AssignedCapacity"];
                operationpercent = dataItem["OperationPercent"];

                CalculatePrice = Price * (operationpercent / 100)
                Rate = 0;
                if (Capacity !== 0)
                    Rate = CalculatePrice / Capacity;
                RealRate = 0;
                if (AssignedCapacity !== 0)
                    RealRate = CalculatePrice / AssignedCapacity;

                dataItem.set("CalculatePrice", CalculatePrice);
                dataItem.set("Rate", Rate);
                dataItem.set("RealRate", RealRate);
            },

        
            dataBinding: function () {
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
CostRateInPeriod.init();
function customEditordisabled(container, options) {
    $('<input disabled data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            decimals: 7,
            format: "n6"
        });
}
function customEditor(container, options) {
    $('<input  data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            decimals: 7,
            format: "n6",
            min: 0,
        });
}

function LoadCostRateInPeriod() {
    var form = $('#__AjaxAntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    $.ajax({
        url: "/CostRateInPeriod/SetCostRateInPeriods",
        dataType: "json",
        type: "post",
        data:
        {
            __RequestVerificationToken : token
        } ,
        success: function (response) {

            if (response.Status) {
                AllertSuccess(response.Message,"نرخ هزینه در دوره")

                

            }
            else
                AllertError(response.Message, "نرخ هزینه در دوره")
            var grid = $("#CostRateInPeriodGrid").data("kendoGrid");
            grid.dataSource.read();
            grid.refresh();
        },
        error: function (errResponse) {
            debugger;
            AllertError("خطا در ثبت",  "نرخ هزینه در دوره")
      
        }
    })
}

