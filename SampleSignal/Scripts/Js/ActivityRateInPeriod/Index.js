var record, listOfActivities=[];
var ActivityRateInPeriod = {
    init: function () {
        ActivityRateInPeriod.GetActivities();
        ActivityRateInPeriod.GetAllActivityList();
    },
    //دریافت لیست فعالیت های بمنظور نمایش مسیر در گرید
    GetActivities: function () {
        $.ajax(
            {
                type: 'GET',
                url: '/Activity/GetActivityByTreeTitle',
                dataType: 'json',
                async: false,
                success: function (response) {
                    if (response.length > 0) {
                        listOfActivities = response;
                    }
                },
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    ActivityRateInPeriod.Error(errorMessage);
                },
            });
    },
    GetAllActivityList: function () {
        var crudServiceBaseUrl = "/ActivityRateInPeriod",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetActivityList",
                        dataType: "jsonp"
                    },
                    update: {
                        url: crudServiceBaseUrl + "/AssignRateInPeriod",
                        dataType: "jsonp"
                    },
                    parameterMap: function (options, operation) {
                        if (operation !== "read" && options.models) {
                            return { models: kendo.stringify(options.models) };
                        }
                    }
                },
                batch: true,
                schema: {
                    model: {
                        id: "Id",
                        fields: {
                            ActivityTitle: { type: "string", editable: false },
                            ActivityPath: { type: "string", editable: false },
                            TotalAssignedCapacity: { type: "string", editable: false },
                            Capacity: { editable: false, type: "number" },
                            Rate: { editable: false, type: "number", validation: { required: true, min: 0 } },
                            Total: { editable: false, type: "number"},
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#ListAllActivityGrid").kendoGrid({
            dataSource: dataSource,
            sortable: true,
            batch: true,
            resizable: true,
            columnMenu: false,
            persistSelection: true,
            navigatable: true,
             excelExport:function (e) { ExcelSetup(e,"لیست فعالیت")},
            pageable: {
                refresh: true,
                pageSizes: true,
                serverPaging: true,
                serverFiltering: true,

            },
            filterable: {
                mode: "row"
            },
            toolbar: ["excel"],
            columns: [
                {
                    title: "ردیف",
                    template: "#= ++record #",
                    width: 50
                },
                { field: "ActivityTitle", title: "عنوان فعالیت" },
                {
                    field: "ActivityPath", title: "مسیر", template: function(dataItem) {
                        if (dataItem.ActivityPath != null) {
                            var listOfIds = (dataItem.ActivityPath).split(',');
                            var fullPath = '';
                            for (i = 0; i < listOfIds.length; i++) {
                                if (listOfIds[i] != '') {
                                    var activity = listOfActivities.find(element => element.Value == listOfIds[i]);
                                    if (activity != null) {
                                        if (fullPath == '') {
                                            fullPath = activity.Text;
                                        } else {
                                            fullPath = fullPath + '>>' + activity.Text;
                                        }
                                    }
                                }
                            }
                            return fullPath;
                        } else {
                            return '<span>__<span>'
                        }
                    }
                },
                { field: "TotalAssignedCapacity", title: "ظرفیت تخصیص یافته" },
                { field: "Capacity", title: "ظرفیت کل" },
                {
                    field: "Rate", title: "بهای تمام شده فعالیت",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.Rate.toFixed(2)) + '</span>';
                    }
                }, {
                    field: "Total", title: "مبلغ کل فعالیت",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator((dataItem.Rate * dataItem.Capacity).toFixed(2)) + '</span>';
                    }
                },
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
ActivityRateInPeriod.init();
function ExcelSetup(e,CustomeTitle){

                  var sheet = e.workbook.sheets[0];
                //  sheet.frozenRows = 4;
                //  sheet.mergedCells = ["A3:B3","A1:D1","A2:D2","C3:D3"];
                //  sheet.name = "Orders";
                //sheet.hAlign="Center";
               
   
           for (var i = 0; i < sheet.rows.length; i++) {
            sheet.rows[i].cells.reverse();    
            for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
              sheet.rows[i].cells[ci].hAlign = "Center";
            }
          }
                  
                }