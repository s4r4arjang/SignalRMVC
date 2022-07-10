
var BudgetCostInflationCoefficient = {
    init: function () {
        BudgetCostInflationCoefficient.GetAllBudgetCostInflationCoefficient();
    },
    GetAllBudgetCostInflationCoefficient: function () {
        var crudServiceBaseUrl = "/BudgetCostInflationCoefficient",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/ListBudgetCostInflationCoefficient",
                        dataType: "jsonp",
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
                        id: "AccountTreeTitleId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },
                          
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        
        $("#BudgetCostInflationCoefficientGrid").kendoGrid({
            /*toolbar: ["create"],*/
            
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
                { field: "Title", title: "عنوان" },
            
               
            {
                command: [
                    { name: "StructureThird", text: "<span class='customIcon text-blue iconStructure'>تورم</span>", click: getBudgetCostInflationCoefficientStructure },
                
            ],
            title: "تورم",
            width: 250
        }
            ],

            editable: "popup",
            dataBinding: function () {
                if (this.dataSource.pageSize() !== undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });
        
        
        //مشاهده نرخ تورم
        function getBudgetCostInflationCoefficientStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            var AccountTreeTitleId = dataItem.AccountTreeTitleId;
            var MenuId = 'BudgetCostInflationCoefficient';
            var TabUrl = '/BudgetCostInflationCoefficient/BudgetCostInflationStructure?id=' + AccountTreeTitleId + " &Title=" + dataItem.Title;
            var TabScriptAddress = '/Scripts/Js/BudgetCostInflationCoefficient/BudgetCostInflationStructure.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);

        }
       
    },
    
}
BudgetCostInflationCoefficient.init();