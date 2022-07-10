var record;
var CostTotalCapacity = {
    init: function () {
        CostTotalCapacity.GetCostTotalCapacity();
    },
     GetCostTotalCapacity: function () {
         var crudServiceBaseUrl = "/CostTotalCapacity",
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
                        if (operation !== "read" && options.models) {

                            return { models: options.models };
                        }
                    }

                },
               requestEnd: function (e) {

                   if (e.type === "update") {
                       if (e.response.Status != undefined) {
                           if (e.response.Status) {
                               AllertSuccess(e.response.Message ,"ظرفیت کل هزینه")
                               var grid = $("#CostTotalCapacityGrid").data("kendoGrid");
                               grid.dataSource.read();
                               grid.refresh();

                           }
                           else {
                               AllertError(e.response.Message, "ظرفیت کل هزینه");
                              
                           }

                           var grid = $("#CostTotalCapacityGrid").data("kendoGrid");
                           grid.dataSource.read();
                       }


                   }



               },
                batch: true,
                schema: {
                    model: {
                        id: "CostTotalCapacityId",
                        fields: {

                            Title: { type: "string", editable: false },
                            CostTypeTitle: { type: "string", editable: false },
                            Path: { type: "string", editable: false },
                            Capacity: {
                                editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#CostTotalCapacityGrid").kendoGrid({
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
                { field: "Title", title: "عنوان هزینه" },
                { field: "CostTypeTitle", title: "نوع هزینه" },
                { field: "Path", title: "مسیر" },
                { field: "Capacity", title: "ظرفیت", format: "{0}"/*, editor: customEditor */},
            ],

            editable: true,
            cancel: function (e) {
                $('#CostTotalCapacityGrid').data("kendoGrid").cancelChanges();
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
 CostTotalCapacity.init();

function LoadCostTotalCapacity() {
    debugger;
    $.ajax({
        url: "/CostTotalCapacity/SetCostTotalCapacity",
        dataType: "json",
        type: "POST",
        success: function (response) {

            if (response.Status) {
                AllertSuccess(response.Message, "ظرفیت کل هزینه");

                CostTotalCapacity.init();

            }
            else {
                AllertWarning(response.Message, "ظرفیت کل هزینه");
            }
        },
        error: function (response) {
            debugger;
            AllertError(response.Message, "خطا در ثبت");

        }
    })
}
