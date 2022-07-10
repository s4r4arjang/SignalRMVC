var record, listOfCosts = [];
var BranchStaffPercentage = {
    init: function () {
        debugger;

        BranchStaffPercentage.GetBranchStaffPercentageList();
    },

    GetBranchStaffPercentageList: function () {
        debugger;
        var crudServiceBaseUrl = "/BranchStaffPercentage",
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
                //requestEnd: function (e) {

                //    if (e.type === "update") {
                //        var grid = $("#MoneyUnitCoefficientGrid").data("kendoGrid");
                //        grid.dataSource.read();
                //    }
                //},
                requestEnd: function (e) {

                    if (e.type === "update") {
                        if (e.response.Status != undefined) {
                            if (e.response.Status) {
                                toastr.success(e.response.Message, ",سهم پشتیبانی", ToasterOptionMessage);
                                var grid = $("#BranchStaffPercentageGrid").data("kendoGrid");
                                grid.dataSource.read();
                                grid.refresh();
                                //MoneyUnitCoefficient.init();

                            }
                            else {
                                toastr.error(e.response.Message, "سهم پشتیبانی", ToasterOptionMessage
                                );
                            }

                            var grid = $("#BranchStaffPercentageGrid").data("kendoGrid");
                            grid.dataSource.read();
                        }


                    }



                },
                batch: true,
                schema: {
                    model: {
                        id: "BranchStaffPercentageId",
                        fields: {
                            BranchTitle: { type: "string", editable: false },
                            StaffPercent: { editable: true, type: "number", validation: { required: true, min: 0, max: 100 } },
                            OperationPercent: { editable: true, type: "number", validation: { required: true, min: 0, max: 100 } },
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#BranchStaffPercentageGrid").kendoGrid({
            dataSource: dataSource,
            sortable: true,
            batch: true,
            resizable: true,
            columnMenu: false,
            //change: OnChange,
            selectable: true,
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
               
                { field: "BranchTitle", title: "عنوان شعب" },

                {
                    field: "OperationPercent", title: "عدد عملیاتی",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.OperationPercent) + '</span>';
                    }
                },
                {
                    field: "StaffPercent", title: "عدد پشتیبانی", format: "{0}", editor: customEditordisabled,
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.StaffPercent) + '</span>';
                    }
                }, 
                


            ],
            editable: "incell",
            cellClose: function (e) {
                debugger;
                var dataItem = e.sender.dataItem($(e.container).parent())
                Staff = dataItem["StaffPercent"];
                Operation = dataItem["OperationPercent"];
                dataItem.set("StaffPercent", 100 - Operation);

            },
            //edit: function (event) {
            //    debugger;
            //    var OperationPercent = event.model.get("OperationPercent");
            //    var StaffPercent = event.model.get("StaffPercent");
            //    StaffPercent = (100 - OperationPercent);
            //    event.model.set("StaffPercent", StaffPercent);
            // //   event.container.parent().find('.k-window-title').text(event.model.isNew() ? "ایجاد" : "ویرایش");
            ////    //if (final == 0) {
            ////    //    event.model.set("BudgetedFinalTariffRate", BudgetedTariffRate);
            ////    //}

            ////    event.container.parent().find('.k-window-title').text(event.model.isNew() ? "ایجاد" : "ویرایش");
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


    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
BranchStaffPercentage.init();


function LoadBranchStaffPercentage() {
    debugger;
    var token = $('input[name="__RequestVerificationToken"]').val();
    $.ajax({
        url: "/BranchStaffPercentage/SetBranchStaffPersentage",
        dataType: "json",
        type: "post",
        data:
            { __RequestVerificationToken: token } ,
        success: function (response) {

            if (response.Status) {
                AllertSuccess(response.Message, "سهم پشتیبانی");
               // BranchStaffPercentage.init();
           
                var grid = $("#BranchStaffPercentageGrid").data("kendoGrid");
                grid.dataSource.read();
                grid.refresh();

            }
            else
            AllertWarning(response.Message, "سهم پشتیبانی");
            var grid = $("#BranchStaffPercentageGrid").data("kendoGrid");
            grid.dataSource.read();
            grid.refresh();
        },
        error: function (errResponse) {
            debugger;
            AllertError(response.Message, "سهم پشتیبانی");
        }
        //success: function (response) {


        //    var option = {
        //        "timeOut": "0",
        //        "closeButton": true,
        //        "positionClass": "toast-bottom-full-width",
        //        "timeOut": "4000",
        //    }

        //    if (response.Status) {
        //        toastr.success(response.Message, "سهم پشتیبانی ", option);
        //        BranchStaffPercentage.init();
        //        var grid = $("#BranchStaffPercentageGrid").data("kendoGrid").refresh();;
        //        //grid.dataSource.read();
        //        grid.refresh();
        //    }
        //    else {
        //        toastr.warning(response.Message, "سهم پشتیبانی", option);
        //    }
        //},
        //error: function (errResponse) {
        //    debugger;
        //    toastr.error("خطا در ثبت", "مقادیر", {
        //        "timeOut": "0",
        //        "timeOut": "4000",
        //        "closeButton": true,
        //        "positionClass": "toast-bottom-full-width",
        //    });
        //}
    })
}

function customEditordisabled(container, options) {
    $('<input disabled data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            decimals: 7,
            format: "n6"
        });
}