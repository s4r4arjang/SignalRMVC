var record;
var BranchNew = {
    init: function () {
        BranchNew.GetBranchNew();
    },
    GetBranchNew: function () {
        var crudServiceBaseUrl = "/ProcessActivityAccountStructure",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetProductStepList/" + document.getElementById('ProcessActivityAccountStructureId').value,

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
                                BranchNewId: options.models[0].BranchNewId
                            };
                        }
                    }

                },

                batch: true,
                schema: {
                    model: {
                        id: "ProductStepId",
                        ProcessTitle: { type: "string", validation: { required: true } },
                            ProductStepTitle: { type: "string", validation: { required: true } },

                      
                       
                            ProcessActivityAccountStructureId: { type: "number", validation: { required: true } },
                        
                      

                       
                            Path: { type: "string", validation: { required: true } },

                    


                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#ProductStepNewGrid").kendoGrid({
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
          
                { field: "ProductStepTitle", title: "عنوان مرحله" },
                { field: "Path", title: "مسیر" },
                { field: "ProcessTitle", title: "فرایند " },


                

                {
                    command: [
                        //{
                        //    name: "customDirectCost", text: 'هزینه- فعالیت', iconClass: "k-icon", click: customCostAndOperation
                        //},
                        //{
                        //    name: "customDirectCost", text: 'هزینه مستقیم', iconClass: "k-icon", click: customDirectCost
                        //},
                        //{
                        //    name: "customStaff", text: 'هزینه پشتیبانی', iconClass: "k-icon", click: customStaff
                        //},
                        //{
                        //    name: "customDirectWage", text: 'هزینه دستمزد مستقیم', iconClass: "k-icon", click: customDirectWage
                        //},
                        //{
                        //    name: "OperationalActivity", text: 'فعالیت عملیاتی', iconClass: "k-icon", click: OperationalActivity
                        //},

                        //{
                        //    name: "StaffActivity", text: 'فعالیت پشتیبانی', iconClass: "k-icon", click: StaffActivity
                        //},

                        {
                            name: "TotalCost", text: 'فرمول برنامه', iconClass: "k-icon", click: TotalCost
                        },
                    ]
                    ,
                    title: "عملیات"
                }
            ],

            editable: "popup",
            edit: function (event) {

                event.container.find(".k-edit-label:first").hide();
                event.container.find(".k-edit-field:first").hide();
                event.container.parent().find('.k-window-title').text(event.model.isNew() ? "ایجاد" : "ویرایش");
                $(event.container).parent().css({
                    width: '600px',
                    height: '300px'
                });
            },
            cancel: function (e) {
                $('#ProductStepNewGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function (e) {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                }
                else {
                    record = 0;
                }

            },
            //dataBound: function (e) {

            //    dataItems = e.sender.dataSource.view();
            //    for (var i = 0; i < dataItems.length; i++) {
            //        debugger;
            //        var isactive = dataItems[i].get("IsActive");
            //        var row = this.tbody.find("[data-uid='" + dataItems[i].uid + "']");
            //        if (isactive === false) {


            //            $(row).find(".k-grid-customDeActive").css('display', 'none');;
            //            $(row).find(".k-grid-customEdit").css('display', 'none');;
            //            $(row).find(".k-grid-customActive").css('display', 'show');;
            //        }
            //        else {
            //            $(row).find(".k-grid-customActive").css('display', 'none');;
            //        }
            //    }


            //}
        });

        //هزینه-فعالیت
        //function customCostAndOperation(e) {
        //    debugger;
        //    e.preventDefault();
        //    e.stopPropagation();
        //    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

        //    var MenuId = 'ProcessActivityAccountStructure';
        //    var TabUrl = '/CostInProductStep/Index?ProcessActivityAccountStructureId=' + dataItem.ProcessActivityAccountStructureId + "&ProductStepId=" + dataItem.ProductStepId;
        //    var TabScriptAddress = '/Scripts/Js/CostInProductStep/DirectCost.js';
        //    CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);

        //};

        // هزینه مستقیم

        function customDirectCost(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            
            var MenuId = 'ProcessActivityAccountStructure';
            var TabUrl = '/CostInProductStep/Index?ProcessActivityAccountStructureId=' + dataItem.ProcessActivityAccountStructureId + "&ProductStepId=" + dataItem.ProductStepId;
            var TabScriptAddress = '/Scripts/Js/CostInProductStep/DirectCost.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);

        };
         // هزینه کل
        function TotalCost(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var MenuId = 'ProcessActivityAccountStructure';
            var TabUrl = '/ProductStepCostActivity/Index?ProcessActivityAccountStructureId=' + dataItem.ProcessActivityAccountStructureId + "&ProductStepId=" + dataItem.ProductStepId + "&ProductStepTitle=" + dataItem.ProductStepTitle;
            var TabScriptAddress = '/Scripts/Js/ProductStepCostActivity/Index.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        };

         // دستمزد مستقیم
        function customDirectWage(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var MenuId = 'ProcessActivityAccountStructure';
            var TabUrl = '/CostInProductStep/DirectWage?ProcessActivityAccountStructureId=' + dataItem.ProcessActivityAccountStructureId + "&ProductStepId=" + dataItem.ProductStepId + "&ProductStepTitle=" + dataItem.ProductStepTitle;
            var TabScriptAddress = '/Scripts/Js/CostInProductStep/DirectWage.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        };

        //هزینه پشتیبانی
        function customStaff(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var MenuId = 'ProcessActivityAccountStructure';
            var TabUrl = '/CostInProductStep/Staff?ProcessActivityAccountStructureId=' + dataItem.ProcessActivityAccountStructureId + "&ProductStepId=" + dataItem.ProductStepId;
            var TabScriptAddress = '/Scripts/Js/CostInProductStep/StaffCost.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);

        };

        //فعالیت عملیاتی
        function OperationalActivity(e)
        {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var MenuId = 'ProcessActivityAccountStructure';
            var TabUrl = '/ActivityInProductStep/OperationalActivity?ProcessActivityAccountStructureId=' + dataItem.ProcessActivityAccountStructureId + "&ProductStepId=" + dataItem.ProductStepId;
            var TabScriptAddress = '/Scripts/Js/ActivityInProductStep/operationalActivity.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);

        };

        //فعالیت پشتیبانی
        function StaffActivity(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var MenuId = 'ProcessActivityAccountStructure';
            var TabUrl = '/ActivityInProductStep/StaffActivity?ProcessActivityAccountStructureId=' + dataItem.ProcessActivityAccountStructureId + "&ProductStepId=" + dataItem.ProductStepId;
            var TabScriptAddress = '/Scripts/Js/ActivityInProductStep/StaffActivity.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);

        };
        // افزودن رکورد جدید
        $(".k-grid-add").on("click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();
                $.ajax({
                    type: "GET",
                    url: "/BranchNew/Create/" + ParameterId,

                    dataType: "html",
                    success: function (response) {

                        $('#ListBranch').html(response);




                    },

                });

            });


      
    },


    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
BranchNew.init();


