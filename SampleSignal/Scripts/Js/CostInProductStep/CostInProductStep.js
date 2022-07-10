var record;
var ProcessActivityAccountStructure = {
    init: function () {
        ProcessActivityAccountStructure.GetProcessActivityAccountStructure();
    },
    GetProcessActivityAccountStructure: function () {
        var crudServiceBaseUrl = "/CostInProductStep",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetProductStepList",
                        dataType: "json"
                    },
         
                    parameterMap: function (options, operation) {
                        if (operation !== "read" && operation !== "destroy" && options.models) {
                            return {
                                model: options.models[0]
                            };

                        }
                        if (operation == "destroy") {

                            return {
                                ProcessActivityAccountStructureId: options.models[0].ProcessActivityAccountStructureId
                            };
                        }
                    }

                },
          
                batch: true,
                schema: {
                    model: {
                        id: "ProcessActivityAccountStructureId",
                        fields: {
                            AccountTreeTitleId: { type: "number", validation: { required: true } },
                            ActivityTreeTitleId: { type: "number", validation: { required: true } },
                            Title: { type: "string", validation: { required: true } },
                            ProcessTitle: { type: "string", validation: { required: true } },
                            ActivityAccountTreeTitle: { type: "string", validation: { required: true } },
                            HasActivity: { type: "string", editable: false },

                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#ProcessActivityAccountStructureGrid").kendoGrid({
            toolbar: ["create"/*, "excel"*/],
            //excel: {
            //    fileName: "لیست دوایر.xlsx",
            //    proxyURL: "",
            //    filterable: true
            //},
            dataSource: dataSource,
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
                { field: "Title", title: "عنوان" },
                { field: "ProcessTitle", title: "فرایند" },

                { field: "ActivityAccountTreeTitle", title: "عنوان ساختار هزینه / فعالیت هزینه " },
          
            ],

            editable: "popup",
      
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
ProcessActivityAccountStructure.init();