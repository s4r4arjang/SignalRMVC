
var BranchAllocationBaseAssignedValue = {
    init: function () {

        BranchAllocationBaseAssignedValue.GetBranchAllocationBaseAssignedValueList();
    },
    //دریافت مجموع هزینه های وارد شده
    //GetTotalCosts: function () {
    //  //  var grid = $("#BranchAllocationGrid").data("kendoGrid");

    ////    var data = grid.dataSource.data();
    //  //  let TotalCosts = data.map(item => item.TotalPrice).reduce((prev, next) => prev + next);
    //  //  $("[data-toalCost]").html(SetThousandSeprator(TotalCosts));
    //},
    GetBranchAllocationBaseAssignedValueList: function () {
        debugger;
        var crudServiceBaseUrl = "/BranchAllocationBaseAssign",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url:'/BranchAllocationBaseAssign/GetListBranchAllocation/' + document.getElementById('AllocationBaseId').value,
                        dataType: "jsonp"
                    },
                    update: {
                        url: '/BranchAllocationBaseAssign/Edit',
                         /* document.getElementById('AllocationBaseId').value*/
                        dataType: "json",
                        type: "post"

                    },
                    parameterMap: function (options, operation) {
                        options.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val();
                        return options;
                    }
                },
               
                //change: function (e) {
                //    BranchAllocationBaseAssignedValue.GetTotalCosts();

                //}

                 requestEnd: function (e) {
                    //check the "response" argument to skip the local operations

                    if (e.type === "update") {
                        if (e.response.Status != undefined) {
                            if (e.response.Status) {
                                toastr.success(e.response.Message, ",مقادیر تخصیص داده شده", {
                                    "timeOut": "0",
                                    "closeButton": true,
                                    "positionClass": "toast-bottom-full-width",
                                    "timeOut": "4000",
                                });
                                var grid = $("#BranchAllocationGrid").data("kendoGrid");
                                grid.dataSource.read();
                                grid.refresh();

                            }
                            else {
                                toastr.error(e.response.Message, "مقادیر تخصیص داده شده", {
                                    "timeOut": "0",
                                    "closeButton": true,
                                    "positionClass": "toast-bottom-full-width",
                                    "timeOut": "4000",
                                });
                            }

                            var grid = $("#BranchAllocationGrid").data("kendoGrid");
                            grid.dataSource.read();
                        }


                    }



                },
                batch: true,
                schema: {
                    model: {
                        id: "BranchAllocationBaseAssignId",
                        fields: {
                            BranchTitle : { type: "string", editable: false },
                            AllocationBaseValue  : { editable: true, type: "number", validation: { required: true } },
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#BranchAllocationGrid").kendoGrid({
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
                { field: "BranchTitle", title: " عنوان شعب", editable: false },

                { field: "AllocationBaseValue", title: "مقدار", format: "{0}", editor: customEditor },



            ],
            editable: true,
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });
       
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
BranchAllocationBaseAssignedValue.init();


function LoadBranchAllocationBaseAssignValues() {
 
    var form = $('#__AjaxAntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    $.ajax({
        url: '/BranchAllocationBaseAssign/SetBranchAllocationBaseValue/' + document.getElementById('AllocationBaseId').value,
        dataType: "json",
        type: "POST",
        data:
        {
            __RequestVerificationToken : token
        },
        success: function (response) {

            if (response.Status) {
                toastr.success(response.Message, "بروزرسانی", {
                    "timeOut": "0",
                    "closeButton": true,
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "4000",
                });
                //BranchAllocationBaseAssignedValue.init();
                var grid = $("#BranchAllocationGrid").data("kendoGrid");
                grid.dataSource.read();
                grid.refresh();

            }
            else

                toastr.warning(response.Message, "بروزرسانی", {
                    "timeOut": "0",
                    "closeButton": true,
                    "positionClass": "toast-bottom-full-width",
                    "timeOut": "4000",
                });

            var grid = $("#BranchAllocationGrid").data("kendoGrid");
            grid.dataSource.read();
            grid.refresh();
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

function customEditor(container, options) {
    $('<input  data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            decimals: 7,
            format: "n6"
        });
}