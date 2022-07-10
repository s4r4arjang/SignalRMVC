var record;
var ProductStepBranch = {
    init: function () {
        ProductStepBranch.GetProductStepBranch();
    },
    GetProductStepBranch: function () {
        var crudServiceBaseUrl = "/StaffPartBranchCost",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/ProductStepBranchList?BranchId=" + $('#BranchId').val() + "&BranchStaffId=" + $('#BranchStaffId').val(),
                        dataType: "json"
                    },
                    update: {
                        url: crudServiceBaseUrl + "/EditProductStepBranch",
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
                        if (e.response.Status != undefined) {
                            if (e.response.Status) {
                                toastr.success(e.response.Message, "تسهیم یکطرفه", ToasterOptionMessage);
                                var grid = $("#ProductStepBranchGrid").data("kendoGrid");
                                grid.dataSource.read();
                                grid.refresh();

                            }
                            else {
                                toastr.error(e.response.Message, "تسهیم یکطرفه", ToasterOptionMessage
                                );
                            }

                            var grid = $("#ProductStepBranchGrid").data("kendoGrid");
                            grid.dataSource.read();
                        }


                    }



                },


                batch: true,
                schema: {
                    model: {
                        id: "ProductStepId",
                        fields: {
                            BranchId: { type: "number" },
                            PeriodId: { type: "number" },
                            StaffBranchId: { type: "number" },
                            ProductStepTitle: { type: "string", editable: false },
                            ProcessTitle: { type: "string", editable: false },
                            Price: { editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#ProductStepBranchGrid").kendoGrid({
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
                { field: "ProductStepTitle", title: "عنوان مرحله" },
                { field: "ProcessTitle", title: "عنوان فرایند" },
                { field: "Price", title: "مبلغ"/*, editor: customEditor */ },
            ],

            editable: true,
            edit: function (event) {
           
                event.container.parent().find('.k-window-title').text(event.model.isNew() ? "ایجاد" : "ویرایش");
            },
            cancel: function (e) {
                $('#ProductStepBranchGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },

            dataBound: function (e) {
                debugger;
                var datalength = e.sender.dataSource.data().length;
                var totalsum = 0;
                if (datalength > 0) {
                    for (var i = 0; i < datalength; i++) {
                        totalsum += e.sender.dataSource.data()[i].Price;
                    }
                }
                $("#PriceAssigned").text(totalsum);


            }
        });

    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
ProductStepBranch.init();

function LoadProductStepBranch() {
    debugger;
    var token = $('input[name="__RequestVerificationToken"]').val();
    $.ajax({
        url: "/StaffPartBranchCost/LoadProductStepBranch?BranchId=" + $('#BranchId').val()  +  "&BranchStaffId=" + $('#BranchStaffId').val(),
        dataType: "json",
        type: "POST",
        data:
        {
            __RequestVerificationToken: token   
        },
        success: function (response) {

            if (response.Status) {
                AllertSuccess(response.Message, " تسهیم یکطرفه ");

                var grid = $("#ProductStepBranchGrid").data("kendoGrid");
                grid.dataSource.read();
                grid.refresh();

            }
            else {
                AllertWarning(response.Message, "  تسهیم یکطرفه  ");
            }
        },
        error: function (response) {

            AllertError("خطا در ثبت", "  تسهیم یکطرفه  ");

        }
    })
}

