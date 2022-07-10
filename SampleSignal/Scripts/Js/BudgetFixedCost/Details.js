
var BudgetFixedCostDetails = {
    init: function () {
      //  $('.BudgetFixedGrid').removeClass('displayShow').addClass('displayNone');
        BudgetFixedCostDetails.GetAllCostList();
    },



    GetAllCostList: function () {
        $("#BudgetFixedCosDetailstGrid").empty();
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/BudgetFixedCost/GetDetailsList/' + $('#BudgetFixedCostId').val(),
                    dataType: "jsonp"
                },
                update: {
                    url: '/BudgetFixedCost/EditDetails',
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

                        var grid = $("#BudgetFixedCosDetailstGrid").data("kendoGrid");
                        grid.dataSource.read();
                        grid.refresh();
                    }


                }



            },
            batch: true,
            schema: {
                model: {
                    id: "PeriodId",
                    fields: {
                        PeriodTitle: { type: "string", editable: false },
                 
                        TotalFixedBudget: { editable: true, type: "number", validation: { required: true } },
                    }
                }
            },
            pageSize: 10,
        });
        record = 0;
        $("#BudgetFixedCosDetailstGrid").kendoGrid({
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
              
                { field: "PeriodTitle", title: "عنوان هزینه" },
            
                {
                    field: "TotalFixedBudget", title: "بودجه ثابت کل", format: "{0}",
                    template: function (dataItem) {
                        return '<span  class="number">' + SetThousandSeprator(dataItem.TotalFixedBudget) + '</span>';
                    }
                },
        


            ],
            editable: "incell",
   
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });

    },

}
BudgetFixedCostDetails.init();





