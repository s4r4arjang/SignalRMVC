var dataBoundCheck = true;
var DetailStaffPartBranchCost = {
    init: function () {
        DetailStaffPartBranchCost.GetDetailStaffPartBranchCost();
    },
    GetDetailStaffPartBranchCost: function () {
        debugger;
        var crudServiceBaseUrl = "/StaffPartBranchCost",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/DetailsList/" + document.getElementById('BranchStaffId').value,
                        dataType: "json"
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
                        id: "BranchId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },

                            Price : { type: "number", validation: { required: true } },
                        },



                    },
                },
                pageSize: 10
            });
        record = 0;
        $("#DetailStaffPartBranchCostGrid").kendoGrid({
            //toolbar: ["create"],

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

         
                { field: "Title", title: "عنوان " },
                {
                    field: "Price", title: "مبلغ"
                   , format: "{0:n}"
                },
                {
                    command: [
                        {
                            name: "customEdit",
                            text: 'تسهیم  مبلغ مرحله',
                            iconClass: "k-icon k-i-edit",
                            click: ProductStepBranch,

                        },
                        {
                            name: "customDeActive",
                            text: '<span > <i class="fa fa-ban" aria-hidden="true"></i> شعبه ستادی </span>',

                          
                           // click: ProductStepBranch,

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
                    if (dataItems[i].OperationTypeId ===1) {
                        $(row).find(".k-grid-customEdit").css('display', 'show');;
                        $(row).find(".k-grid-customDeActive").css('display', 'none');;

                    }
                    else {
                        $(row).find(".k-grid-customEdit").css('display', 'none');;
                        $(row).find(".k-grid-customDeActive").css('display', 'show');;
                      
                    }
                }
                dataBoundCheck = false;


            }
        });


        function ProductStepBranch(e) {

            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var BranchId = dataItem.BranchId;
            var BranchTitle = dataItem.Title;
            var totalPrice = dataItem.Price;
            var MenuId = 'StaffPartBranchCost';
            var TabUrl = '/StaffPartBranchCost/ProductStepBranch?BranchId=' + BranchId + "&BranchStaffId=" + $('#BranchStaffId').val() + "&StaffBranchTitle=" + $('#StaffBranchTitle').val() + "&BranchTitle=" + BranchTitle + "&Price=" + totalPrice;
            var TabScriptAddress = '/Scripts/Js/StaffPartBranchCost/ProductStepBranch.js';
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
DetailStaffPartBranchCost.init();
