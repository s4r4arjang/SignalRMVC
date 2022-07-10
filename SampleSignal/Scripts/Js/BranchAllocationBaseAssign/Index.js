
var BranchAllocationBaseAssignList = {
    init: function () {
        BranchAllocationBaseAssignList.GetBranchAllocationBaseAssignList();
    },
    GetBranchAllocationBaseAssignList: function () {
        debugger;
        var crudServiceBaseUrl = "/BranchAllocationBaseAssign",
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
                        id: "AllocationBaseId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },



                        }
                    },
                },
                pageSize: 10
            });
        record = 0;
        $("#BranchAllocationBaseAssignGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "لیست مبناها.xlsx",
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

                { field: "Title", title: "عنوان مبنا" },

                {
                    command: [
                        {
                            name: "customEdit",
                            text: 'تخصیص',
                            iconClass: "k-icon k-i-edit",
                            click: SetStaffBarnchAssigned
                        },

                        //{
                        //    name: "customDelete",
                        //    text: 'حذف',
                        //    iconClass: "k-icon k-i-close",
                        //    click: deleteAllocation
                        //},
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
        });



      //لیست شعب تخصیص داده شده 
        function SetStaffBarnchAssigned(e) {

            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItemAllocationBase = this.dataItem($(e.currentTarget).closest("tr"));
            var AllocationBaseId = dataItemAllocationBase.AllocationBaseId;
            var MenuId = 'BranchAllocationBaseAssign';
                          
            var TabUrl = '/BranchAllocationBaseAssign/BranchAllocationBaseAssinedIndex/' + AllocationBaseId;
            var TabScriptAddress = '/Scripts/Js/BranchAllocationBaseAssign/BranchAllocation.js';
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
BranchAllocationBaseAssignList.init();
