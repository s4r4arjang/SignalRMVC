var record, listOfCosts = [];
var ProductStepOperate = {
    init: function () {
        debugger;

        ProductStepOperate.GetProductStepOperateList();
    },

    GetProductStepOperateList: function () {
        debugger;
        var crudServiceBaseUrl = "/ProductStepOperate",
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
                    //check the "response" argument to skip the local operations
                    debugger;
                    if (e.type === "update") {
                        if (e.response.Status != undefined) {
                            if (e.response.Status) {
                                AllertSuccess(e.response.Message, "اقدام به عملیات");
                          

                            }
                            else {
                                AllertError(e.response.Message, "اقدام به عملیات");
                            }

                            var grid = $("#ProductStepOperateGrid").data("kendoGrid");
                            grid.dataSource.read();
                            grid.refresh();
                        }


                    }



                },
                batch: true,
                schema: {
                    model: {
                        id: "ProductStepOperateId",
                        fields: {
                            ProductStepTitle: { type: "string", editable: false },
                            ProcessTitle: { type: "string", editable: false },
                            Path: { type: "string", editable: false },
                            Completed: { editable: true, type: "number" ,validation: { required: true, min: 0} },
                            Operated : { editable: true, type: "number", validation: { required: true, min: 0 } },
                           
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#ProductStepOperateGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "اقدام به عملیات.xlsx",
                proxyURL: "",
                filterable: true
            },
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
            editable: true,
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
               
                { field: "ProductStepTitle", title: "عنوان مرحله" },

                { field: "ProcessTitle", title: "عنوان فرایند" },
                { field: "Path", title: "مسیر" },

                {
                    field: "Completed", title: "تعداد تکمیل شده", 
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.Completed) + '</span>';
                    }
                },

                {
                    field: "Operated", title: "تعداد اقدام به عملیات", /*editor: customEditordisabled,*/
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.Operated) + '</span>';
                    }
                }, 
                


            ],
           
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

}
ProductStepOperate.init();


function LoadProductStepOperate() {
    debugger;
    var form = $('#__AjaxAntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    $.ajax({
        url: "/ProductStepOperate/SetProductStepOperate",
        dataType: "json",
        type: "post",
        data:
        {
            __RequestVerificationToken : token
        },
        success: function (response) {

            if (response.Status) {
                AllertSuccess(response.Message, "اقدام به عملیات");
               // ProductStepOperate.init();
           
              

            }
            else
            AllertWarning(response.Message, "اقدام به عملیات");
            var grid = $("#ProductStepOperateGrid").data("kendoGrid");
            grid.dataSource.read();
            grid.refresh();
        },
        error: function (errResponse) {
            debugger;
            AllertError("خطا در ثبت عملیات", "اقدام به عملیات");
        }
       
    })
}

