var record;
var Budget = {
    init: function () {
          
        Budget.GetBudgetList();
    },
    GetBudgetList: function () {
        var crudServiceBaseUrl = "/Budget",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetListPeriod",
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
                        id: "PeriodId",
                        fields: {
                            PeriodTitle: { type: "string", editable: false },
                            VariableBudget: { type: "number", editable: false },
                            FixedBudget: { type: "number", editable: false },
                            TotalBudget: { type: "number", editable: false },
                            
                        }
                    },
                },
                pageSize: 10
                , aggregate: [{ field: "TotalBudget", aggregate: "sum" },
                    { field: "VariableBudget", aggregate: "sum" },
                    { field: "FixedBudget", aggregate: "sum" }                ]
            });
      
        record = 0;
        $("#budgetPeriodGrid").kendoGrid({
        
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
              
             
                { field: "PeriodTitle", title: "عنوان", footerTemplate: "مجموع" },
               
                { field: "BaseYearTitle", title: "سال مبنا" },
                { field: "BasePeriodTitle", title: "دوره مبنا" },
                {
                    field: "BudgetState", title: "وضعیت",
                    template: function (dataItem) { return dataItem.BudgetState === true ? "محاسبه شده" : "<span>-</span>"; }
                },
              
                {
                    field: "VariableBudget", title: "بودجه مبتنی برعملکرد",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.VariableBudget) + '</span>';
                    }
                },
                {
                    field: "FixedBudget", title: "بودجه ثابت",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.FixedBudget) + '</span>';
                    }
                },
                {
                    field: "TotalBudget", title: "کل بودجه ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.TotalBudget) + '</span>';
                    }
                },
                {
                    command: [
                    
                     
                        { name: "firstCustom", text: "<span class='customIcon iconCalculate'>محاسبه بودجه</span>", click: computingBudget },
                       
                       
                       
                          
                    
                    ],
                    title: "عملیات",
                    width: 330
                },
                //{
                //    command: [
                //        { name: "StructureProcess", text: "<span class='customIcon iconInfo text-green'>بودجه فرایند</span>", click: BudgetProcess },
                //        { name: "StructureThird", text: "<span class='customIcon iconInfo text-blue'>جزئیات بر مبنای اهداف</span>", click: budgetDetailBasedGoal},
                //        { name: "StructureFirst", text: "<span class='customIcon iconInfo text-green'>جزئیات بر مبنای هزینه ها</span>", click: budgetDetailBasedCost },
                //        { name: "IncomeDetails", text: "<span class='customIcon iconInfo text-green'>جزئیات بر مبنای درآمد ها</span>", click: budgetDetailIncome },
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
              
                  


            },

        });
        

     
     
        //محاسبه بودجه
        function computingBudget(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItemBudget = this.dataItem($(e.currentTarget).closest("tr"));
            var PeriodId = dataItemBudget.PeriodId;
            kendo.ui.progress($('#budgetPeriodGrid'), true);
            var form = $('#__AjaxAntiForgeryForm');
            var token = $('input[name="__RequestVerificationToken"]', form).val();
            $.ajax(
                {
                    type: 'POST',
                    url: '/Budget/BudgetCalculate',
                    dataType: 'json',
                    async: true,
                    data: {
                        Id: PeriodId,
                        __RequestVerificationToken : token
                    },
                    success: function (response)
                    {
                    
                        kendo.ui.progress($('#budgetPeriodGrid'), false);
                        if (response.Status === true) {
                            var budgetPeriod = $("#budgetPeriodGrid").data("kendoGrid");
                            budgetPeriod.dataSource.read();
                            AllertSuccess(response.Message, "بودجه");
                        }
                        else {
                            AllertError(response.Message, "بودجه");
                        }

                        

                    },
                    error: function () {
                        kendo.ui.progress($('#budgetPeriodGrid'), false);
                        AllertError("خطا در محاسبه بودجه", "بودجه");
                      
                    },
                });
        }


        // بودجه   فرایند
        function BudgetProcess(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItemBudget = this.dataItem($(e.currentTarget).closest("tr"));
            var PeriodId = dataItemBudget.PeriodId;
            var MenuId = 'Budget';
            var TabUrl = '/Budget/BudgetProcess/' + PeriodId;
            var TabScriptAddress = '/Scripts/Js/Budget/BudgetProcess.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        
        //جزئیات بودجه بر مبنای اهداف
        function budgetDetailBasedGoal(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItemBudget = this.dataItem($(e.currentTarget).closest("tr"));
            var budgetId = dataItemBudget.Id;
            var MenuId = 'Budget';
            var TabUrl = '/Budget/BudgetDetail?budgetId=' + budgetId;
            var TabScriptAddress = '/Scripts/Js/Budget/BudgetDetail.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }

        //جزئیات بودجه بر مبنای درآمدها
        function budgetDetailIncome(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItemBudget = this.dataItem($(e.currentTarget).closest("tr"));
            var budgetId = dataItemBudget.Id;
            var MenuId = 'Budget';
            var TabUrl = '/BudgetIncomeBaseDetails/Index/' + budgetId;
            var TabScriptAddress = '/Scripts/Js/Budget/BudgetIncomeBaseDetails.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        //جزئیات بودجه بر مبنای هزینه ها
        function budgetDetailBasedCost(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItemBudget = this.dataItem($(e.currentTarget).closest("tr"));
            var budgetId = dataItemBudget.Id;
            var MenuId = 'Budget';
            if (dataItemBudget.BudgetCalculationType == 2) {
                var TabUrl = '/Budget/BudgetDetailBasedCost?budgetId=' + budgetId;
                var TabScriptAddress = '/Scripts/Js/Budget/ClasicBudgetDetailBasedCost.js';

            }
            else {
           
                var TabUrl = '/Budget/BudgetDetailBasedCost?budgetId=' + budgetId;
                var TabScriptAddress = '/Scripts/Js/Budget/BudgetDetailBasedCost.js';
            }
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