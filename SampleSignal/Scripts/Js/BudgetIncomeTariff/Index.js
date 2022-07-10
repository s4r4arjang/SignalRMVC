var record;
var BudgetIncomeTariff = {
    init: function () {
        BudgetIncomeTariff.GetBudgetIncomeTariff();
        BudgetIncomeTariff.GetBudgetIncomeTariffAccount();
    },
    GetBudgetIncomeTariff: function () {
        var crudServiceBaseUrl = "/BudgetIncomeTariff",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetList",
                        dataType: "json"
                    },
                    update: {
                        url: crudServiceBaseUrl + "/Update",
                        dataType: "json",
                        type: "post"
                    },
                 
                    parameterMap: function (options, operation) {
                        options.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val();
                        return options;
                    }

                },
                requestEnd: function (e) {
                    //check the "response" argument to skip the local operations

                    if (e.type === "update") {
                        if (e.response.Status !== undefined) {
                            if (e.response.Status) {

                                AllertSuccess(e.response.Message, "تعرفه درآمدی ");


                            }
                            else {

                                AllertError(e.response.Message, "تعرفه درآمدی");
                            }

                            var grid = $("#BudgetIncomeTariffGrid").data("kendoGrid");
                            grid.dataSource.read();
                            grid.refresh();
                        }
                  
                    }



                },
                batch: true,
                schema: {
                    model: {
                        id: "ProductId",
                        fields: {


                            ProductTitle: { type: "string", editable: false },
                            Path: { type: "string", editable: false },
                            MoneyUnitTitle: { type: "string", editable: false },
                            Coefficient: { type: "number", editable: false },
                            TariffRateLastYear: {
                                editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                            InflationRate: {
                                editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                            BudgetedTariffRate: {
                                editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                            BudgetedFinalTariffRate: {
                                editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#BudgetIncomeTariffGrid").kendoGrid({

            toolbar: ["save"],

            dataSource: dataSource,
            batch: true,
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
                { field: "ProductTitle", title: "عنوان خدمت" },
                { field: "Path", title: "مسیر" },
                { field: "MoneyUnitTitle", title: "واحد پولی" },
                { field: "Coefficient", title: "ضریب واحد پولی" },
                { field: "TariffRateLastYear", title: "نرخ تعرفه سال قبل", format: "{0}", editor: customEditor },
                { field: "InflationRate", title: "نرخ تورم", format: "{0}", editor: customEditor },
                {
                    field: "BudgetedTariffRate", title: "نرخ تعرفه بودجه شده محاسباتی",
                    format: "{0}", editor: customEditordisabled,
                    //media: "(display: -webkit-box !important;    - webkit - line - clamp: 2;    - webkit - box - orient: vertical;            white- space: normal;)"
                },
                {
                    field: "BudgetedFinalTariffRate", title: "نرخ تعرفه بودجه شده نهایی", format: "{0}", editor: customEditor,

                },


            ],

            editable: true,
            cellClose: function (event) {
              
                var final = event.model.get("BudgetedFinalTariffRate");
                var TariffRateLastYear = event.model.get("TariffRateLastYear");
                var InflationRate = event.model.get("InflationRate");
                var Coefficient = event.model.get("Coefficient");
                var BudgetedFinalTariffRate = event.model.get("BudgetedFinalTariffRate");
                var BudgetedTariffRate = TariffRateLastYear * (1 + (InflationRate / 100)) * Coefficient;
                event.model.set("BudgetedTariffRate", BudgetedTariffRate);
                if (BudgetedFinalTariffRate === 0) {
                    event.model.set("BudgetedFinalTariffRate", BudgetedTariffRate);
                }
        


                event.container.parent().find('.k-window-title').text(event.model.isNew() ? "ایجاد" : "ویرایش");
            },
      
            cancel: function (e) {
                $('#BudgetIncomeTariffGrid').data("kendoGrid").cancelChanges();
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
    GetBudgetIncomeTariffAccount: function () {
        var crudServiceBaseUrl = "/BudgetIncomeTariff",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetListAccount",
                        dataType: "json"
                    },
                    update: {
                        url: crudServiceBaseUrl + "/UpdateAccount",
                        dataType: "json",
                        type: "post"
                    },
               

                    parameterMap: function (options, operation) {
                        options.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val();
                        return options;
                    }

                },
                requestEnd: function (e) {
                    //check the "response" argument to skip the local operations
                    if (e.type === "update") {
                        if (e.response.Status !== undefined) {
                            if (e.response.Status) {

                                AllertSuccess(e.response.Message, "تعرفه درآمدی ");


                            }
                            else {

                                AllertError(e.response.Message, "تعرفه درآمدی");
                            }

                            var grid = $("#BudgetIncomeTariffAccountGrid").data("kendoGrid");
                            grid.dataSource.read();
                            grid.refresh();
                        }

                    }
                



                },
                batch: true,
                schema: {
                    model: {
                        id: "CostId",
                        fields: {

                            CostTitle: { type: "string", editable: false },
                            Path: { type: "string", editable: false },
                            MoneyUnitTitle: { type: "string", editable: false },
                            Coefficient: { type: "number", editable: false },
                            TariffRateLastYear: {
                                editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                            InflationRate: {
                                editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                            BudgetedTariffRate: {
                                editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                            BudgetedFinalTariffRate: {
                                editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#BudgetIncomeTariffAccountGrid").kendoGrid({

            toolbar: ["save"],

            dataSource: dataSource,
            batch: true,
            sortable: true,
            resizable: true,

            columnMenu: false,
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
            columns: [
                {
                    width: 50,
                    title: "ردیف",
                    template: "#= ++record #",
                },

                { field: "CostTitle", title: "عنوان حساب" },
                { field: "Path", title: "مسیر" },
                { field: "MoneyUnitTitle", title: "واحد پولی" },
                { field: "Coefficient", title: "ضریب واحد پولی" },
                { field: "TariffRateLastYear", title: "نرخ تعرفه سال قبل", format: "{0}", editor: customEditor },
                { field: "InflationRate", title: "نرخ تورم", format: "{0}", editor: customEditor },
                {
                    field: "BudgetedTariffRate", title: "نرخ تعرفه بودجه شده محاسباتی",
                    format: "{0}", editor: customEditordisabled,
                    //media: "(display: -webkit-box !important;    - webkit - line - clamp: 2;    - webkit - box - orient: vertical;            white- space: normal;)"
                },
                {
                    field: "BudgetedFinalTariffRate", title: "نرخ تعرفه بودجه شده نهایی", format: "{0}", editor: customEditor,

                },


            ],

            editable: true,
            cellClose: function (event) {

                var final = event.model.get("BudgetedFinalTariffRate");
                var TariffRateLastYear = event.model.get("TariffRateLastYear");
                var InflationRate = event.model.get("InflationRate");
                var Coefficient = event.model.get("Coefficient");
                var BudgetedTariffRate = TariffRateLastYear * (1 + (InflationRate / 100)) * Coefficient;
                event.model.set("BudgetedTariffRate", BudgetedTariffRate);
                event.model.set("BudgetedFinalTariffRate", BudgetedTariffRate);
             


                event.container.parent().find('.k-window-title').text(event.model.isNew() ? "ایجاد" : "ویرایش");
            },
    
            cancel: function (e) {
                $('#BudgetIncomeTariffAccountGrid').data("kendoGrid").cancelChanges();
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
   
}
BudgetIncomeTariff.init();

function customEditor(container, options) {
    $('<input data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            decimals: 7,
            format: "n6"
        });
}

function customEditordisabled(container, options) {
    $('<input disabled data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            decimals: 7,
            format: "n6"
        });
}


function LoadIncome() {
    var token = $('input[name="__RequestVerificationToken"]').val();
    $.ajax({
        url: "/BudgetIncomeTariff/LoadIncomeTariff",
        dataType: "json",
        type: "post",
        data:
        {
            __RequestVerificationToken :token
        },
        success: function (response) {

            if (response.Status) {
                AllertSuccess(response.Message, "تعرفه درآمدی ");
                var BudgetIncomeTariffAccountGrid = $("#BudgetIncomeTariffAccountGrid").data("kendoGrid");
                BudgetIncomeTariffAccountGrid.dataSource.read();
                BudgetIncomeTariffAccountGrid.refresh();
                var BudgetIncomeTariffGrid = $("#BudgetIncomeTariffGrid").data("kendoGrid");
                BudgetIncomeTariffGrid.dataSource.read();
                BudgetIncomeTariffGrid.refresh();
            }
            else

                AllertWarning(response.Message, "تعرفه درآمدی");

        },
        error: function (response) {

            AllertError('خطا در برقراری ارتباط', "تعرفه درآمدی");
        }
    })
}