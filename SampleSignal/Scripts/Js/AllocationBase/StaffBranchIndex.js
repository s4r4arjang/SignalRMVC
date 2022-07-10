
var StaffBranchAllocationBaseList = {
    init: function () {
        StaffBranchAllocationBaseList.GetStaffBranchAllocationBaseList();
    },
    GetStaffBranchAllocationBaseList: function () {
        debugger;
        var crudServiceBaseUrl = "/StaffBranchAllocationBase",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetStaffList",
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
        $("#StaffBranchAllocationBaseGrid").kendoGrid({
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

                { field: "Title", title: "عنوان مبنا" },

                {
                    command: [
                        {
                            name: "customEdit",
                            text: 'شعبه',
                            iconClass: "k-icon k-i-edit",
                            click: SetStaffBarnchAssigned
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
        });



       //تخصیص مبنا به شعب 
        function SetStaffBarnchAssigned(e) {

            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItemAllocationBase = this.dataItem($(e.currentTarget).closest("tr"));
            var AllocationBaseId = dataItemAllocationBase.AllocationBaseId;
            var MenuId = 'StaffAllocationBase';
                          
            var TabUrl = '/StaffBranchAllocationBase/StaffBranches?AllocationBaseId=' + AllocationBaseId + "&Title=" + dataItemAllocationBase.Title;
            var TabScriptAddress = '/Scripts/Js/AllocationBase/StaffBranch.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
    },

    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
StaffBranchAllocationBaseList.init();
