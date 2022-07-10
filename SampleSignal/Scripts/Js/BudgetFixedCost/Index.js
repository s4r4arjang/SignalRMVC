
var BudgetFixedCost = {
    init: function () {
      //  $('.BudgetFixedGrid').removeClass('displayShow').addClass('displayNone');
        BudgetFixedCost.GetAllCostList();
    },



    GetAllCostList: function () {
        $("#BudgetFixedCostGrid").empty();
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/BudgetFixedCost/GetCostList',
                    dataType: "jsonp"
                },
                update: {
                    url: '/BudgetFixedCost/Edit',
                    dataType: "jsonp",
                    type: "post"

                },
                parameterMap: function (options, operation) {
                    options.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val();
                    return options;
                }
            },


            requestEnd: function (e) {
                //check the "response" argument to skip the local operations
                debugger
                if (e.type === "update") {
                    if (e.response.Status != undefined) {
                        if (e.response.Status) {

                            AllertSuccess(e.response.Message, "بودجه ریزی هزینه های ثابت ");
                        

                        }
                        else {

                            AllertError(e.response.Message, "بودجه ریزی هزینه های ثابت ");
                        }

                        var grid = $("#BudgetFixedCostGrid").data("kendoGrid");
                        grid.dataSource.read();
                        grid.refresh();
                    }


                }



            },
            batch: true,
            schema: {
                model: {
                    id: "BudgetFixedCostId",
                    fields: {
                        CostTitle: { type: "string", editable: false },
                        Path: { type: "string", editable: false },
                        Code: { type: "string", editable: false },
                        LastYearTotalFixedBudget: { editable: false, type: "number", validation: { required: true, min: 0 } },
                        LastYearAmount: { editable: false, type: "number", validation: { required: true, min: 0 } },
                        MoneyUnitTitle: { type: "string", editable: false },
                        ChangingPercent: { editable: true, type: "number", validation: { required: true } },
                        ChangingFixedAmount: { editable: true, type: "number", validation: { required: true } },
                        TotalFixedBudget: { editable: true, type: "number", validation: { required: true } },
                    }
                }
            },
            pageSize: 10,
        });
        record = 0;
        $("#BudgetFixedCostGrid").kendoGrid({
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
                responsive: false

            },
            filterable: {
                mode: "row"
            },
            toolbar: ["save", "cancel"],
            columns: [
                {
                    title: "ردیف",
                    template: "#= ++record #",
                    width: 50
                },
                { field: "Path", title: "مسیر " },

                { field: "Code", title: "کد " },
                { field: "CostTitle", title: "عنوان هزینه" },
                { field: "MoneyUnitTitle", title: "واحد پولی" },

                
                    {
                        field: "LastYearTotalFixedBudget", title: "بودجه سال قبل  ",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.LastYearTotalFixedBudget) + '</span>';
                    }
                },
                {
                    field: "LastYearAmount", title: "عملکرد سال قبل",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.LastYearAmount) + '</span>';
                    }
                },
                {
                    field: "ChangingPercent", title: "درصد تغییرات",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.ChangingPercent) + '</span>';
                    }
                }, {
                    field: "ChangingFixedAmount", title: "مقدار ثابت تغییرات",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.ChangingFixedAmount) + '</span>';
                    }
                },
                {
                    field: "TotalFixedBudget", title: "بودجه ثابت کل", format: "{0}", editor: customEditordisabled,
                    template: function (dataItem) {
                        return '<span disabled class="number">' + SetThousandSeprator(dataItem.TotalFixedBudget) + '</span>';
                    }
                },
                {
                    command: [
                       

                      


                        {
                            name: "BudgetPeriod",
                            text: ' بودجه دوره',

                            click: GetDetails  
                        },
                    ],
                    title: "عملیات",
                    width: 300
                }


            ],
            editable: "incell",
            cellClose: function (event) {
                debugger;
                var LastYearAmount = event.model.get("LastYearAmount");
                var ChangingPercent = event.model.get("ChangingPercent");
                var ChangingFixedAmount = event.model.get("ChangingFixedAmount");

                var TotalFixedBudget = (LastYearAmount * (1 + (ChangingPercent / 100))) + ChangingFixedAmount;
                event.model.set("TotalFixedBudget", TotalFixedBudget);


                event.container.parent().find('.k-window-title').text(event.model.isNew() ? "ایجاد" : "ویرایش");
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });

      
        function GetDetails(e) {

       
            e.preventDefault();
            e.stopPropagation();
            var dataItemRole = this.dataItem($(e.currentTarget).closest("tr"));
            var BudgetFixedCostId = dataItemRole.BudgetFixedCostId;
            var TotalFixedBudget = dataItemRole.TotalFixedBudget;
            var CostTitle = dataItemRole.CostTitle;
            var MenuId = 'BudgetFixedCost';
            var TabUrl = '/BudgetFixedCost/Details?Id=' + BudgetFixedCostId + '&Title=' + CostTitle + '&TotalFixedBudget=' + TotalFixedBudget;
            var TabScriptAddress = '/Scripts/Js/BudgetFixedCost/Details.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
     
        }
    },


}
BudgetFixedCost.init();


function LoadCosts() {
   
    var token = $('input[name="__RequestVerificationToken"]').val();
    $.ajax({
        url: "/BudgetFixedCost/SetCosts/" + $("#PeriodId.BudgetFixed").val(),
        dataType: "json",
        type: "post",
        data:
        {
            __RequestVerificationToken : token 
        },
        success: function (response) {

            if (response.Status) {
                AllertSuccess(response.Message, "بودجه ریزی");
                var grid = $("#BudgetFixedCostGrid").data("kendoGrid");
                grid.dataSource.read();
                grid.refresh();

            }
            else

                AllertWarning(response.Message, "بودجه ریزی");
           
        },
        error: function (response) {
            debugger;
            AllertError('خطا در برقراری ارتباط', "بودجه ریزی");
        }
    })
}

function customEditordisabled(container, options) {
    $('<input disabled data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            decimals: 7,
            format: "n6"
        });
}

function callBudget() {

    debugger;
    var Y = $("#PeriodId.BudgetFixed").val();
    if (Y === "") {
        $('.BudgetFixedGrid').removeClass('displayShow').addClass('displayNone');



    }
    else {
        debugger;

        $('.BudgetFixedGrid').removeClass('displayNone').addClass('displayShow');
        var BudgetFixedCostListGrid = $("#BudgetFixedCostGrid").data("kendoGrid");
        BudgetFixedCostListGrid.dataSource.transport.options.read.url = '/BudgetFixedCost/GetCostList/' + $("#PeriodId.BudgetFixed").val();
        BudgetFixedCostListGrid.dataSource.transport.options.update.url = '/BudgetFixedCost/Edit?PeriodId=' + $("#PeriodId.BudgetFixed").val();
        BudgetFixedCostListGrid.dataSource.resizable
        BudgetFixedCostListGrid.dataSource.read();






    }

}