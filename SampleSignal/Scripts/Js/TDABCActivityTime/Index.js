var record;
var TDABCActivityTime = {
    init: function () {
        TDABCActivityTime.GetTDABCActivityTime();
    },
    GetTDABCActivityTime: function () {
        debugger;
        var crudServiceBaseUrl = "/TDABCActivityTime",
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
                        debugger;
                        options.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val();
                        return options;
                    }

                },
               
           
                requestEnd: function (e) {
                    debugger;

                    if (e.type === "update") {
                        if (e.response.Status != undefined) {
                            if (e.response.Status) {
                                AllertSuccess(e.response.Message, "زمان سنجی فعالیت ها");
                                var grid = $("#TDABCActivityTimeGrid").data("kendoGrid");
                                grid.dataSource.read();
                                grid.refresh();

                            }
                            else {
                                AllertError(e.response.Message, "زمان سنجی فعالیت ها");
                            }

                            var grid = $("#TDABCActivityTimeGrid").data("kendoGrid");
                            grid.dataSource.read();
                        }


                    }



                },
                batch: true,
                schema: {
                    model: {
                        id: "TDABCActivityTimeId",
                        fields: {

                            Title: { type: "string", editable: false },
                            Path: { type: "string" , editable: false },
                            ActivityTime: {
                                editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#TDABCActivityTimeGrid").kendoGrid({
            toolbar: ["save", "excel"],
            excel: {
                fileName: "زمان سنجی فعالیت ها.xlsx",
                proxyURL: "",
                filterable: true
            },
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
                { field: "Title", title: "فعالیت" },
                { field: "Path", title: "مسیر", editable: false},
                { field: "ActivityTime", title: "زمان یک واحد فعالیت ( دقیقه ) ", format: "{0}"},


            ],

            editable: true,
            cancel: function (e) {
                $('#TDABCActivityTimeGrid').data("kendoGrid").cancelChanges();
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
        aler("dsg");
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
TDABCActivityTime.init();
function LoadActivityTime() {
    debugger;
    var form = $('#__AjaxAntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    $.ajax({
        url: "/TDABCActivityTime/SetActivityTime",
        dataType: "json",
        type: "post",
        data:
        {
            __RequestVerificationToken: token
        },
        success: function (response) {
            if (response.Status) {
                AllertSuccess(response.Message, "زمان سنجی فعالیت");
                var grid = $("#TDABCActivityTimeGrid").data("kendoGrid");
                grid.dataSource.read();
                grid.refresh();
               

            }
            else

            AllertWarning(response.Message, "زمان سنجی فعالیت");
            var grid = $("#TDABCActivityTimeGrid").data("kendoGrid");
            grid.dataSource.read();
            grid.refresh();
        },
        error: function (errResponse) {
            debugger;
            AllertError("مقادیر", "بروزرسانی");
        }
    })
}
