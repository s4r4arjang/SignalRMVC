var BudgetMoneyUnitCoefficient = {
    init: function () {

        BudgetMoneyUnitCoefficient.GetAllBudgetMoneyUnits();
    },
    GetAllBudgetMoneyUnits: function () {
       
        var crudServiceBaseUrl = "/BudgetMoneyUnitCoefficient",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetList",
                        dataType: "json"
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
                },
         
                 requestEnd: function (e) {
                   
                    if (e.type === "update") {
                        if (e.response.Status !== undefined) {
                            if (e.response.Status) {
                                AllertSuccess(e.response.Message, "واحد پولی");
                                var grid = $("#BudgetMoneyUnitCoefficientGrid").data("kendoGrid");
                                grid.dataSource.read();
                                grid.refresh();
                             

                            }
                            else {
            
                                AllertError(e.response.Message, "واحد پولی");
                            }

                         
                        }


                    }



                },
                batch: true,
                schema: {
                    model: {
                        id: "BudgetMoneyUnitCoefficientId",
                        fields: {
                            MoneyTitle : { type: "string", editable: false },
                            Coefficient : { editable: true, type: "number", validation: { required: true , min:0} },
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#BudgetMoneyUnitCoefficientGrid").kendoGrid({
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

                { field: "Coefficient", title: "ضریب واحد پولی", format: "{0:0.00}"},



            ],
            editable: true,
           
            dataBinding: function () {
                if (this.dataSource.pageSize() !== undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });
        
    },
  
}
BudgetMoneyUnitCoefficient.init();


function LoadBudgetMoneyUnit() {
    var form = $('#__AjaxAntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    $.ajax({
        url: "/BudgetMoneyUnitCoefficient/SetBudgetMoneyUnitCoefficient",
        dataType: "json",
        type: "POST",
        data:
        {
            __RequestVerificationToken : token
        },
        success: function (response) {

            if (response.Status) {
                AllertSuccess(response.Message, "واحد پولی");

                var grid = $("#BudgetMoneyUnitCoefficientGrid").data("kendoGrid");
                grid.dataSource.read();
                grid.refresh();

            }
            else {
                AllertWarning(response.Message, "واحد پولی");
            }
        },
        error: function (response) {
           
            AllertError(response.Message, "خطا در ثبت");
            
        }
    })
}


