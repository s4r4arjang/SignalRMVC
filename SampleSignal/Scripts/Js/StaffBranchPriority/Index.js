var record, listOfCosts = [];
var StaffBranchPriority = {
    init: function () {

        StaffBranchPriority.GetAllPriority();
    },
    //دریافت مجموع هزینه های وارد شده
    //GetTotalCosts: function () {
    //  //  var grid = $("#StaffBranchPriorityGrid").data("kendoGrid");

    ////    var data = grid.dataSource.data();
    //  //  let TotalCosts = data.map(item => item.TotalPrice).reduce((prev, next) => prev + next);
    //  //  $("[data-toalCost]").html(SetThousandSeprator(TotalCosts));
    //},

    GetAllPriority: function () {
        var crudServiceBaseUrl = "/StaffBranchPriority",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetList",
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
                },
                //requestEnd: function (e) {

                //    if (e.type === "update") {
                //        var grid = $("#StaffBranchPriorityGrid").data("kendoGrid");
                //        grid.dataSource.read();
                //    }
                //},
                //change: function (e) {
                //    StaffBranchPriority.GetTotalCosts();

                //}

                 requestEnd: function (e) {
                    //check the "response" argument to skip the local operations
                     debugger;
                    if (e.type === "update") {
                        if (e.response.Status != undefined) {
                            if (e.response.Status) {
                                AllertSuccess(e.response.Message, "اولویت ادارات ستادی");
                                var grid = $("#StaffBranchPriorityGrid").data("kendoGrid");
                                grid.dataSource.read();
                                grid.refresh();

                            }
                            else {
                                AllertError(e.response.Message, "اولویت ادارات ستادی");
                            }

                            var grid = $("#StaffBranchPriorityGrid").data("kendoGrid");
                            grid.dataSource.read();
                        }


                    }



                },
                batch: true,
                schema: {
                    model: {
                        id: "StaffBranchPriorityId",
                        fields: {
                            BranchTitle : { type: "string", editable: false },
                            PriorityValue : { editable: true, type: "number", validation: { required: true } },
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#StaffBranchPriorityGrid").kendoGrid({
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
            toolbar: ["save", "cancel", "excel"],
            excel: {
                fileName: "لیست ادارت ستادی.xlsx",
                proxyURL: "",
                filterable: true
            },
            columns: [
                {
                    title: "ردیف",
                    template: "#= ++record #",
                    width: 50
                },
                { field: "BranchTitle", title: " عنوان ادارات ستادی", editable: false },

                { field: "PriorityValue", title: "مقدار", format: "{0}", editor: customEditor },



            ],
            editable: true,
            //edit: function (event) {

            //    var LastYearAmount = event.model.get("LastYearAmount");
            //    var ChangingPercent = event.model.get("ChangingPercent");
            //    var ChangingFixedAmount = event.model.get("ChangingFixedAmount");

            //    var TotalFixedBudget = (LastYearAmount * (1 + (ChangingPercent / 100))) + ChangingFixedAmount;
            //    event.model.set("TotalFixedBudget", TotalFixedBudget);

            //    //if (final == 0) {
            //    //    event.model.set("BudgetedFinalTariffRate", BudgetedTariffRate);
            //    //}

            //    event.container.parent().find('.k-window-title').text(event.model.isNew() ? "ایجاد" : "ویرایش");
            //},
            dataBinding: function () {
                debugger;
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });
        //function categoryDropDownEditor(container, options) {
        //    $('<input required name="' + options.field + '"/>')
        //        .appendTo(container)
        //        .kendoDropDownList({
        //            autoBind: true,
        //            dataTextField: "Title",
        //            dataValueField: "Id",
        //            dataSource: new kendo.data.DataSource({
        //                transport: {
        //                    read: {
        //                        url: '/MoneyUnit/GetList',
        //                        dataType: "jsonp",
        //                        type: 'GET'
        //                    }
        //                },
        //            })
        //        });
        //}
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
StaffBranchPriority.init();


function LoadStaffBranch() {
    debugger;
    var token = $('input[name="__RequestVerificationToken"]').val();
    $.ajax({
        url: "/StaffBranchPriority/SetPiriority",
        dataType: "json",
        type: "POST",
        data:
        {
            __RequestVerificationToken : token
        },
        success: function (response) {

            if (response.Status) {
                AllertSuccess(response.Message, "اولویت ادارات ستادی");
               // StaffBranchPriority.init();
                var grid = $("#StaffBranchPriorityGrid").data("kendoGrid");
                grid.dataSource.read();
                grid.refresh();

            }
            else
            AllertWarning(response.Message, "اولویت ادارات ستادی");
            var grid = $("#StaffBranchPriorityGrid").data("kendoGrid");
            grid.dataSource.read();
            grid.refresh();
        },
        error: function (response) {
            debugger;
            AllertError(response.Message, "اولویت ادارات ستادی");
        }
    })
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