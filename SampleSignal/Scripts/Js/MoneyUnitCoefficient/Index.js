var MoneyUnitCoefficient = {
    init: function () {

        MoneyUnitCoefficient.GetAllMoneyUnits();
    },
    GetAllMoneyUnits: function () {
        debugger;
        var crudServiceBaseUrl = "/MoneyUnitCoefficient",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetList",
                        dataType: "json"
                    },
                   
                    update: {
                        url: crudServiceBaseUrl + "/Edit",
                        dataType: "json",
                        type: "post",

                    },

                   
                    parameterMap: function (options, operation) {
                        options.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val();
                        return options;
                    }
                },
                requestEnd: function (e) {

                    if (e.type === "update") {
                        var grid = $("#MoneyUnitCoefficientGrid").data("kendoGrid");
                        grid.dataSource.read();
                    }
                },
                 requestEnd: function (e) {
                   
                    if (e.type === "update") {
                        if (e.response.Status != undefined) {
                            if (e.response.Status) {
                                toastr.success(e.response.Message, ",واحد پولی", ToasterOptionMessage);
                                var grid = $("#MoneyUnitCoefficientGrid").data("kendoGrid");
                                grid.dataSource.read();
                                grid.refresh();
                                //MoneyUnitCoefficient.init();

                            }
                            else {
                                toastr.error(e.response.Message, "واحد پولی", ToasterOptionMessage
                                );
                            }

                            var grid = $("#MoneyUnitCoefficientGrid").data("kendoGrid");
                            grid.dataSource.read();
                        }


                    }



                },
                batch: true,
                schema: {
                    model: {
                        id: "MoneyUnitCoefficientId",
                        fields: {
                            MoneyTitle : { type: "string", editable: false },
                            Coefficient : { editable: true, type: "number", validation: { required: true , min:0} },
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#MoneyUnitCoefficientGrid").kendoGrid({
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
                { field: "MoneyTitle", title: "واحد پولی", editable: false },

                { field: "Coefficient", title: "ضریب واحد پولی", format: "{0:0.00}"/*, editor: customEditor*/ },



            ],
            editable: true,
           
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
MoneyUnitCoefficient.init();


function LoadMoneyUnit() {
    debugger;
    var form = $('#__AjaxAntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    $.ajax({
        url: "/MoneyUnitCoefficient/SetMoneyUnitCoefficient",
        dataType: "json",
        type: "POST",
        data:
        {
            __RequestVerificationToken: token
        },
        success: function (response) {

            if (response.Status) {
                AllertSuccess(response.Message, "واحد پولی");

                MoneyUnitCoefficient.init();

            }
            else {
                AllertWarning(response.Message, "واحد پولی");
            }
        },
        error: function (response) {
            debugger;
            AllertError(response.Message, "خطا در ثبت");
            
        }
    })
}

//function customEditor(container, options) {
//    $('<input  data-bind="value:' + options.field + '"/>')
//        .appendTo(container)
//        .kendoNumericTextBox({
//            decimals: 7,
//            format: "0:0.00"
//        });
//}


