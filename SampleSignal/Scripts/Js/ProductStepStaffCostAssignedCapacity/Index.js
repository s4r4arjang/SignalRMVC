var dataBoundCheck = true;
var ProductStepStaffCostAssignedCapacity = {
    init: function () {
        ProductStepStaffCostAssignedCapacity.GetProductStepStaffCostAssignedCapacity();
    },
    GetProductStepStaffCostAssignedCapacity: function () {
        debugger;
        var crudServiceBaseUrl = "/ProductStepStaffCostAssignedCapacity",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetList",
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
                        id: "CostId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },

                            CostTypeTitle: { type: "string", validation: { required: true } },
                            Path: { type: "string", validation: { required: true } },
                            Capacity: { type: "string", validation: { required: true } },
                        },
                 
                        
                        
                    },
                },
                pageSize: 10
            });
        record = 0;
        $("#ProductStepStaffCostAssignedCapacityGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "تخصیص هزینه های پشتیبانی.xlsx",
                proxyURL: "",
                filterable: true
            },
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

                { field: "Title", title: "عنوان هزینه" },
                { field: "CostTypeTitle", title: "نوع هزینه" },
                { field: "Path", title: "مسیر" },
                { field: "Capacity", title: "ظرفیت" },

                {
                    command: [
                        {
                            name: "SetstaffCostAssigned",
                            text: 'تخصیص',
                            iconClass: "k-icon k-i-edit",
                            click: SetstaffCostAssigned,
                        //    template: "#if(Capacity == 0) {# #} else if(Capacity >=0) {#" +
                        //        "<div style='background-color:lightgreen'> <a href="\#" onclick="showName();"></a> <span>#=ChoiceCode#</span> </div>#}"
     
                        //} ,
                        
                        

                        //{
                        //    name: "customDelete",
                        //    text: 'حذف',
                        //    iconClass: "k-icon k-i-close",
                        //    click: deleteAllocation
                        },
                    ],
                    title: "عملیات",
                    width: 300
                }
            ],
            editable: "popup",
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
            dataBound: function (e) {
              
                    debugger;
                    //dataItems = e.sender.dataSource.view();
                    dataItems = e.sender.dataSource.data();
                    for (var i = 0; i < dataItems.length; i++) {
                        debugger;
                        //var Capacity = dataItems[i].get("Capacity");
                        var row = this.tbody.find("[data-uid='" + dataItems[i].uid + "']");
                        if (dataItems[i].Capacity> 0) {
                            $(row).find(".k-grid-customEdit").css('display', 'show');;

                          
                        }
                        else {
                            $(row).find(".k-grid-customEdit").css('display', 'none');;
                        }
                    }
                    dataBoundCheck = false;

                
            }
        });

        function SetstaffCostAssigned(e) {

            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItemCost = this.dataItem($(e.currentTarget).closest("tr"));
            var CostId = dataItemCost.CostId;
            var Title = dataItemCost.Title;
            var Capacity = dataItemCost.Capacity;
            var MenuId = 'ProductStepStaffCostAssignedCapacity';
            var TabUrl = '/ProductStepStaffCostAssignedCapacity/Cost?CostId=' + CostId + "&Capacity=" + Capacity + "&Title=" + Title  ;
            var TabScriptAddress = '/Scripts/Js/ProductStepStaffCostAssignedCapacity/ProductStepStaffCost.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            //e.preventDefault();
            //var dataItemProcess = this.dataItem($(e.currentTarget).closest("tr"));
            //$("#ProcessActivityAccountStructureId").val(dataItemProcess.RoleId)
            //RoleList.GetPermission( dataItemProcess.RoleId)

            //$('#HeadPermissionTitle').text("دسترسی ها  " + dataItemProcess.Title);
        }
    },

    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
ProductStepStaffCostAssignedCapacity.init();

function LoadProductStepStaffCostAssignedCapacity() {

    var form = $('#__AjaxAntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    $.ajax({
        url: '/ProductStepStaffCostAssignedCapacity/SetProductStepCostAssignedCapacity' /*+ document.getElementById('AllocationBaseId').value*/,
        dataType: "json",
        type: "POST",
        data:
        {
            __RequestVerificationToken : token
        },
        success: function (response) {

            if (response.Status) {
                toastr.success(response.Message, "تخصیص هزینه", {
                    "timeOut": "0",
                    "closeButton": true,
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "4000",
                });
                /*BranchAllocationBaseAssignedValue.init();*/

                var grid = $("#ProductStepStaffCostAssignedCapacityGrid").data("kendoGrid");
                grid.dataSource.read();
                grid.refresh();
            }
            else

                toastr.warning(response.Message, "تخصیص هزینه", {
                    "timeOut": "0",
                    "closeButton": true,
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "4000",
                });
        },
        error: function (errResponse) {
            debugger;
            toastr.error("خطا در ثبت", "مقادیر", {
                "timeOut": "0",
                "timeOut": "4000",
                "closeButton": true,
                "positionClass": "toast-bottom-full-width",
            });
        }
    })
}
