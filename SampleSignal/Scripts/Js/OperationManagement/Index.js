var record;
var Budget = {
    init: function () {

        Budget.GetBudgetList();
    },
    GetBudgetList: function () {
        var crudServiceBaseUrl = "/OperationManagement",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetList",
                        dataType: "jsonp"
                    },
                    update: {
                        url: crudServiceBaseUrl + "/Update",
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
                        id: "GoalId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },
                            Path : { type: "string", validation: { required: true } },
                            //BudgetCalculationType: { type: "int", editable: false },
                            //TotalBudget: { type: "number", editable: false },
                            //Status: {
                            //    type: "string", editable: false
                            //},
                        }
                    },
                },
                pageSize: 10
            });

        record = 0;
        $("#OperationManagementGrid").kendoGrid({
            //toolbar: [{ name: "create", text: "تعریف بودجه" }, "excel"],
            //excel: {
            //    fileName: "لیست عناوین بودجه.xlsx",
            //    proxyURL: "",
            //    filterable: true,
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
                    editable: false
                },
                //{
                //    name: "Id",
                //    hidden: true,
                //    template: function (dataItem) {
                //        return '<span class="rowId" id="' + dataItem.Id + '"></span>'
                //    }
                //},
                { field: "Title", title: "عنوان" },
                { field: "Path", title: "مسیر" },
                //{
                //    field: "IsZeroBaseBudgeting", title: "نوع محاسبه", template: function (dataItem) {
                //        if (dataItem.BudgetCalculationType == 1) {
                //            return '<span>محاسبه بر مبنای صفر(ZBB)</span>'
                //        }
                //        if (dataItem.BudgetCalculationType == 2) {
                //            return '<span> بودجه ریزی افزایشی (ABB)</span>'
                //        }
                //        else if (dataItem.BudgetCalculationType == 3) {
                //            return '<span>محاسبه بر مبنای سال مرجع</span>'
                //        }
                //    }
                //},
                //{
                //    field: "TotalBudget", title: "بودجه کل",
                //    template: function (dataItem) {
                //        return '<span class="number">' + SetThousandSeprator(dataItem.TotalBudget) + '</span>';
                //    }
                //},
                //{
                //    field: "Status", title: "بودجه فعال",
                //    filterable: false,
                //    template: function (dataItem) {
                //        if (dataItem.ActiveBudget) {
                //            return "<i class='fas fa-check'></i>";
                //        } else {
                //            return "<span>__</span>";
                //        }
                //    }
                //},
                {
                    command: [

                        { name: "secondCustom", text: "<span class='customIcon iconInfo'>برنامه</span>", click: assignProductToGoals },
                      
                        /*       { name: "activateCustom", text: "<span class='customIcon iconActive'>فعالسازی بودجه</span>", click: activateBudget },*/

                        //{
                        //    name: "customDelete",
                        //    text: 'حذف',
                        //    iconClass: "k-icon k-i-close",
                        //    click: deleteBudget
                        //},
                    ],
                    title: "عملیات",
                    width: 330
                },
                //{
                //    command: [
                //        { name: "StructureThird", text: "<span class='customIcon iconInfo text-blue'>جزئیات بر مبنای اهداف</span>", click: budgetDetailBasedGoal },
                //        { name: "StructureFirst", text: "<span class='customIcon iconInfo text-green'>جزئیات بر مبنای هزینه ها</span>", click: budgetDetailBasedCost },
                //    ],
                //    title: "ساختار",
                //    width: 200
                //},
            ],
            editable: true,
            dataBinding: function (e) {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }




            }
            //dataBound: function (e) {
            //    dataItems = e.sender.dataSource.view();

            //    for (var i = 0; i < dataItems.length; i++) {
            //        var product = dataItems[i].get("BudgetCalculationType");
            //        if (product === 2) {
            //            var row = this.tbody.find("[data-uid='" + dataItems[i].uid + "']");

            //            var t = $(row).find(".k-grid-secondCustom");
            //            $(t).css("display", "none");
            //            $(row).find(".k-grid-StructureThird").hide();


            //        }
            //    }
            //}
        });
        // افزودن رکورد جدید
        $('#tabview_Budget').find(".k-grid-add").on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var MenuId = 'Budget';
            var TabUrl = '/Budget/Create';
            var TabScriptAddress = '/Scripts/Js/Budget/Create.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        });
        //محاسبه بودجه
        function computingBudget(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItemBudget = this.dataItem($(e.currentTarget).closest("tr"));
            var budgetId = dataItemBudget.Id;
            kendo.ui.progress($('#OperationManagementGrid'), true);
            $.ajax(
                {
                    type: 'GET',
                    url: '/Budget/CalculateBudget',
                    dataType: 'json',
                    async: true,
                    data: { budgetId: budgetId },
                    success: function (response) {
                        kendo.ui.progress($('#OperationManagementGrid'), false);
                        var messageClass = '';
                        if (response.Status == true) {
                            messageClass = 'success';
                        }
                        else {
                            messageClass = 'danger';
                        }
                        $('#messageBudgetList').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                            '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                            '<strong>' +
                            response.Message +
                            '</strong>' +
                            '</div>').delay(5000).fadeOut(800);
                        $('#OperationManagementGrid').data('kendoGrid').dataSource.read();
                        $('#OperationManagementGrid').data('kendoGrid').refresh();
                        var offset = -270;
                        $('html, body').animate({
                            scrollTop: $("#messageBudgetList").offset().top + offset
                        }, 500);
                    },
                    error: function () {
                        var errorMessage = 'بروز خطا در برقراری ارتباط';
                        Budget.Error(errorMessage);
                    },
                });
        }
        //سناریوی بودجه
        function assignProductToGoals(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItemBudget = this.dataItem($(e.currentTarget).closest("tr"));
            var GoalId = dataItemBudget.GoalId;
            var MenuId = 'OperationManagement';
            var TabUrl = '/OperationManagement/ProductGoal?GoalId=' + GoalId + "&Title=" + dataItemBudget.Title;
            var TabScriptAddress = '/Scripts/Js/OperationManagement/ProductGoal.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
     
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    }
}
Budget.init();