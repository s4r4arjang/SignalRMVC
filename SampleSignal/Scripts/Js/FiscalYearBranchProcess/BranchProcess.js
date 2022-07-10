var record;
var FiscalYearBranchProcess = {
    init: function () {
        debugger
        FiscalYearBranchProcess.GetUnAssignedFiscalYearBranchProcess();
       FiscalYearBranchProcess.GetAssignedFiscalYearBranchProcess();
    },
    GetUnAssignedFiscalYearBranchProcess: function () {
        debugger;
        var crudServiceBaseUrl = "/FiscalYearBranchProcess",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                    
                        url: crudServiceBaseUrl + '/BranchUnAssign?YearId=' + document.getElementById('YearId').value + "&ProcessActivityAccountStructureId=" + document.getElementById('ProcessActivityAccountStructureId').value,
                        dataType: "jsonp"
                    },


                },

                batch: true,
                schema: {
                    model: {
                        id: "BranchId",
                        fields: {


                            Title: { type: "string", validation: { required: true } },
                        


                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#BranchUnAssignedGrid").kendoGrid({

            dataSource: dataSource,
            sortable: true,
            resizable: true,
            columnMenu: false,
            persistSelection: true,
            change: onChange,
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
                    selectable: true, width: "50px"
                },
                {
                    width: 50,
                    title: "ردیف",
                    template: "#= ++record #",
                },
                { field: "Title", title: "عنوان شعبه" },
           



            ],

            editable: "popup",

            cancel: function (e) {
                debugger;
                $('#BranchUnAssignedGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });



        $('#AssigningBranch').on('click',
            function () {

                debugger;
                FiscalYearBranchProcess.AssignBranch();
            });

        function onChange(arg) {
            debugger;
            var selectedIds = [];
            selectedIds = this.selectedKeyNames();

            if (selectedIds.length > 0) {
                $('#BranchUnAssignedBox').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#BranchUnAssignedBox').removeClass('displayShow').addClass('displayNone');
            }
        }

    },



    GetAssignedFiscalYearBranchProcess: function () {
        debugger;
        var crudServiceBaseUrl = "/FiscalYearBranchProcess",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + '/BranchAssign?YearId=' + document.getElementById('YearId').value + "&ProcessActivityAccountStructureId=" + document.getElementById('ProcessActivityAccountStructureId').value,
                        dataType: "jsonp"
                    },


                },

                batch: true,
                schema: {
                    model: {
                        id: "FiscalYearBranchProcessFormulaId",
                        fields: {


                            Title: { type: "string", validation: { required: true } },
                      


                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#BranchAssignedGrid").kendoGrid({

            dataSource: dataSource,
            sortable: true,
            resizable: true,
            columnMenu: false,
           // persistSelection: true,
         
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
                //{
                //    selectable: true, width: "50px"
                //},
                {
                    width: 50,
                    title: "ردیف",
                    template: "#= ++record #",
                },
                { field: "Title", title: "عنوان" },
         
                {
                    command: [
                       

                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deleteBranch
                        },


                       
                    ],
                    title: "عملیات",
                    width: 300
                }


            ],

            editable: "popup",

            cancel: function (e) {
                debugger;
                $('#BranchAssignedGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });


        //حذف رکورد گرید
        function deleteBranch(e) {
            debugger;
            e.preventDefault();
            var dataItem= this.dataItem($(e.currentTarget).closest("tr"));
            var FiscalYearBranchProcessFormulaId = dataItem.FiscalYearBranchProcessFormulaId;
            bootbox.confirm({
                title: "حذف اطلاعات!",
                message: "آیا از حذف رکورد مورد نظر اطمینان دارید؟",
                buttons: {
                    cancel: {
                        className: 'btn-information',
                        label: '<i class="fa fa-times"></i> انصراف'
                    },
                    confirm: {
                        className: 'btn-customDelete',
                        label: '<i class="fa fa-check"></i> حذف'
                    }
                },
                callback: function (result) {
                    var option = {
                        "timeOut": "0",
                        "closeButton": true,
                        "positionClass": "toast-bottom-full-width",
                        "timeOut": "4000",
                    }
                    if (result == true) {
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/FiscalYearBranchProcess/Delete/' + FiscalYearBranchProcessFormulaId,
                                dataType: 'json',
                                async: false,
                                data: {
                                    __RequestVerificationToken : token
                                },
                                success: function (response) {
                                    if (response.Status) {
                                        toastr.success(response.Message, " فرمول  ", option);
                                        var DirectUnAssignedCostListGrid = $("#BranchUnAssignedGrid").data("kendoGrid");
                                        DirectUnAssignedCostListGrid.clearSelection();

                                        DirectUnAssignedCostListGrid.dataSource.read();

                                        DirectUnAssignedCostListGrid.refresh();


                                        var DirectAssignedCostsList = $("#BranchAssignedGrid").data("kendoGrid");
                                        DirectAssignedCostsList.clearSelection();

                                        DirectAssignedCostsList.dataSource.read();

                                        DirectAssignedCostsList.refresh();
                                    }
                                    else

                                        toastr.error(response.Message, "فرمول", option);
                                },
                                error: function () {
                                    toastr.error('بروز خطا در برقراری ارتباط', "نقش", option);

                                },
                            });
                    }
                }
            }).find('.modal-content').css({
                'margin-top': function () {
                    var w = $('.content').height();
                    var b = $(".modal-dialog").height();
                    var h = (w - b) / 2;
                    return h + "px";
                }
            });
        }
  

       

    },
    AssignBranch: function () {
 

        var BranchselectedIds = $("#BranchUnAssignedGrid").data("kendoGrid").selectedKeyNames();
        BranchselectedIdsint = [];
        for (i = 0; i < BranchselectedIds.length; i++) {

            BranchselectedIdsint.push(parseInt(BranchselectedIds[i]));
        }

        var option = {
            "timeOut": "0",
            "closeButton": true,
            "positionClass": "toast-bottom-full-width",
            "timeOut": "4000",
        }
        var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        $.ajax(
            {
                type: 'Post',
                url: '/FiscalYearBranchProcess/SetBranch',
                dataType: 'json',
                //   contentType: "application/json; charset=utf-8",
                //   async: true,
                data: {
                    'YearId': $("#YearId").val(),
                    'ProcessActivityAccountStructureId': $("#ProcessActivityAccountStructureId").val(),
                    'BranchId': BranchselectedIdsint,
                    __RequestVerificationToken : token

                },

                success: function (response) {
                    if (response.Status) {
                        toastr.success(response.Message, "فرمول ", option);
                        //$('#exampleModal').modal('toggle');




                        var DirectUnAssignedCostListGrid = $("#BranchUnAssignedGrid").data("kendoGrid");
                        DirectUnAssignedCostListGrid.clearSelection();

                        DirectUnAssignedCostListGrid.dataSource.read();

                        DirectUnAssignedCostListGrid.refresh();


                        var DirectAssignedCostsList = $("#BranchAssignedGrid").data("kendoGrid");
                        DirectAssignedCostsList.clearSelection();

                        DirectAssignedCostsList.dataSource.read();

                        DirectAssignedCostsList.refresh();

                    }
                    else

                        toastr.error(response.Message, "فرمول", option);
                },

                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    //CostActivity.Error(errorMessage);
                    FiscalYearBranchProcess.Error(errorMessage);
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
FiscalYearBranchProcess.init();