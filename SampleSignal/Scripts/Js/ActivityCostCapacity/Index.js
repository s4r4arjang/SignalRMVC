var record, listOfActivities = [];
var ActivityCostCapacity = {
    init: function () {
        ActivityCostCapacity.GetActivities();
        ActivityCostCapacity.AddListener();
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
                    ActivityCostCapacity.Error(errorMessage);
                },
            });
    },
    AddListener: function () {
        $(document).ready(function () {
            ActivityCostCapacity.GetCostTree(); 
        });
    },
    GetCostTree: function () {
        function onChangeIndirectCostTree(e) {
            var treeData = $('#InDirectCostTree').data('kendoTreeView'),
                selected = treeData.select(),
                item = treeData.dataItem(selected);
            var costId = item.Id;
            var costDriverId = item.CostDriverId;
            if (item.hasChildren == true) {
                e.preventDefault();
                $('#LisAssigningCapacityListBox').removeClass('displayShow').addClass('displayNone');
            } else {
                $('#LisAssigningCapacityListBox').removeClass('displayNone').addClass('displayShow');
                ActivityCostCapacity.LisAssigningCapacity(costId);
            }
        }
        var rootUrl = "/ActivityCost";
        var data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/GetInDirectCostList",
                    dataType: "jsonp"
                }
            },
            schema: {
                model: {
                    id: "Id",
                    hasChildren: "HasChild",
                }
            },
        });
        $("#InDirectCostTree").kendoTreeView({
            dataSource: data,
            dataTextField: "Title",
            change: onChangeIndirectCostTree
        });
    },
    LisAssigningCapacity: function (costId) {
        $.ajax(
            {
                type: 'POST',
                url: '/CostRateInPeriod/GetCostRate',
                dataType: 'json',
                async: false,
                data: { 'costId': costId },
                success: function (response) {
                    if (response.Capacity != null) {
                        $('#tabview_ActivityCostCapacity').find('.unitCapacity').html(response.Capacity);
                    }
                    if (response.TotalAssignedCapacity != null) {
                        $('#tabview_ActivityCostCapacity').find('.unitTotalAssignedCapacity').html(response.TotalAssignedCapacity);
                    }
                    if (response.Capacity != null && response.TotalAssignedCapacity != null) {
                        $('#tabview_ActivityCostCapacity').find('.unitUnAssignedCapacity').html((response.Capacity) - (response.TotalAssignedCapacity));
                    }
                    if (response.UnitCostTitle != null) {
                        $('#tabview_ActivityCostCapacity').find('.unitName').html(response.UnitCostTitle);
                    }
                },
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط'; 
                    ActivityCostCapacity.Error(errorMessage);
                },
            });
        $("#LisAssigningCapacityListGrid").empty();
        var crudServiceBaseUrl = "/ActivityCost",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/ListAssigningCapacity?costId=" + costId,
                        dataType: "jsonp"
                    },
                    update: {
                        url: crudServiceBaseUrl + "/AssignCapacity",
                        dataType: "jsonp"
                    },
                    parameterMap: function (options, operation) {
                        if (operation !== "read" && options.models) {
                            return { models: kendo.stringify(options.models) };
                        }
                    }
                }
                , 
                requestEnd: function(e) {
    //check the "response" argument to skip the local operations
            
                  if (e.type === "update")
                  {
                      if (e.response.Status != undefined && !e.response.Status) {
                      bootbox.alert({
                 message: e.response.Message,
                locale: "fa"
               });
                var grid = $("#LisAssigningCapacityListGrid").data("kendoGrid");
               grid.dataSource.read();
                          }
                      ActivityCostCapacity.LisAssigningCapacity(costId);

                 }
                
                
                }
                ,
                batch: true,
                schema: {
                    model: {
                        id: "Id",
                        fields: {
                            ActivityTitle: { type: "string", editable: false },
                            ActivityPath: { type: "string", editable: false},
                            Capacity: { editable: true, type: "number", validation: { required: true, min: 0 } },
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#LisAssigningCapacityListGrid").kendoGrid({
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
            toolbar: ["excel","save", "cancel"],
            columns: [
                {
                    title: "ردیف",
                    template: "#= ++record #",
                    width: 50
                }, 
                { field: "ActivityTitle", title: "عنوان فعالیت" },
                {
                    field: "ActivityPath", title: "مسیر", template: function (dataItem) {
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
                { field: "Capacity", title: "تعداد",format: "{0}",editor:customEditor },
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
        function customEditor (container, options) {
          $('<input data-bind="value:' + options.field + '"/>')
              .appendTo(container)
              .kendoNumericTextBox({
                decimals: 7,
                format: "n6"
              });
      }
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
ActivityCostCapacity.init();