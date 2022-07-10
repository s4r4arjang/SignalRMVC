
var ProductStepStaffCost = {
    init: function () {

        ProductStepStaffCost.GetProductStepStaffCostList();
    },
   
    GetProductStepStaffCostList: function () {
        debugger;
      
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: '/ProductStepStaffCostAssignedCapacity/ProductStepCost/' + document.getElementById('StaffCostId').value,
                        dataType: "jsonp"
                    },
                    update: {
                        url: '/ProductStepStaffCostAssignedCapacity/Edit?CostId=' + document.getElementById('StaffCostId').value,
                        dataType: "json",
                        type: "post"

                    },
                    parameterMap: function (options, operation) {
                        options.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val();
                        return options;
                    }
                },
               
                //change: function (e) {
                //    ProductStepStaffCost.GetTotalCosts();

                //}

                 requestEnd: function (e) {
                    //check the "response" argument to skip the local operations

                    if (e.type === "update") {
                        if (e.response.Status != undefined) {
                            if (e.response.Status) {
                                AllertSuccess(e.response.Message, "مراحل تخصیص داده شده");
                                //var grid = $("#ProductStepStaffCostGrid").data("kendoGrid");
                                //grid.dataSource.read();
                                //grid.refresh();

                            }
                            else {
                                AllertError(e.response.Message, "مراحل تخصیص داده شده");
                            }

                            var grid = $("#ProductStepStaffCostGrid").data("kendoGrid");
                            grid.dataSource.read();
                            grid.refresh();
                        }


                    }



                },
                batch: true,
                schema: {
                    model: {
                        id: "ProductStepCostAssignedCapacityId",
                        fields: {
                            ProductStepTitle: { type: "string", editable: false },
                            ProcessTitle: { type: "string", editable: false },
                            Path: { type: "string", editable: false },
                            AssignCapacity: { editable: true, type: "number", validation: { required: true, min: 0} },
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#ProductStepStaffCostGrid").kendoGrid({
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
                { field: "ProductStepTitle", title: "مرحله", editable: false },
                { field: "ProcessTitle", title: "فرایند", editable: false },
                { field: "Path", title: "مسیر", editable: false },

                { field: "AssignCapacity", title: "ظرفیت تخصیص یافته", format: "{0}"/*, editor: customEditor*/ },



            ],
            editable: true,
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
                        totalsum += e.sender.dataSource.data()[i].AssignCapacity;
                    }
                }
                $("#StaffAssigned").text(totalsum);


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
ProductStepStaffCost.init();

