var selectedBranchIds = [];

var BranchComputationType = {
    init: function () {
        debugger;
        BranchComputationType.AddListener();
        BranchComputationType.GetAllProcessForAssigningToYear();
        BranchComputationType.GetAllProcessAssignedToYear();
     
    },
    AddListener: function () {
        debugger;
        //دریافت آی دی درخت اهداف
        $(document).ready(function () {
            debugger;
            $('#BoxBranch').removeClass('displayShow').addClass('displayNone');

            $('#FiscalComputationType').on('change',
                function () {
                    $('#BoxBranch').removeClass('displayShow').addClass('displayNone');
                    debugger;
                    var d = $('#FiscalComputationType').val();
                    if (d == "") {
                        $('#BoxBranchAssigned').removeClass('displayShow').addClass('displayNone');
                        $('#BoxBranchNotAssigned').removeClass('displayShow').addClass('displayNone');


                    }
                    else {
                        debugger
                      
                       // BranchComputationType.GetAllProcessAssignedToYear();
                      //  $('#BranchAssignedListGrid').data('kendoGrid').dataSource.read();
                      //  $('#BranchAssignedListGrid').data('kendoGrid').refresh();

                        var BranchNotAssignedListGrid = $("#BranchNotAssignedListGrid").data("kendoGrid");
                        BranchNotAssignedListGrid.dataSource.transport.options.read.url = '/BranchComputionType/UnAssignedBranchCostComputionTypeList?FiscalYear=' + $("#YearId").val() + "&costComputionType=" + $("#FiscalComputationType").val();
                        BranchNotAssignedListGrid.dataSource.read();

                        var BranchAssignedListGrid = $("#BranchAssignedListGrid").data("kendoGrid");
                        BranchAssignedListGrid.dataSource.transport.options.read.url = '/BranchComputionType/AssignedBranchCostComputionTypeList?YearId=' + $("#YearId").val() + "&computationType=" + $("#FiscalComputationType").val();
                        BranchAssignedListGrid.dataSource.read();
                    }

                });

            $('#AssignBranch').on('click',
                function () {
                    BranchComputationType.AssignBranch();
                });
        });
    },
   

    AssignBranch: function () {
        
        debugger;
        
        var BranchSelectedIds = $("#BranchNotAssignedListGrid").data("kendoGrid").selectedKeyNames();
        BranchSelectedIdsInt = [];
        for (i = 0; i < BranchSelectedIds.length; i++) {

            BranchSelectedIdsInt.push(parseInt(BranchSelectedIds[i]));
        }

        var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        $.ajax(
            {
                type: 'Post',
                url: '/BranchComputionType/AssignBranch',
                dataType: 'json',
                //   contentType: "application/json; charset=utf-8",
                //   async: true,
                data: {
                    'YearId': $("#YearId").val(),
                    'computationType': $("#FiscalComputationType").val(),
                    'BranchIds': BranchSelectedIdsInt,
                    __RequestVerificationToken : token

                },

                success: function (response) {
                    if (response.Status) {
                        AllertSuccess(response.Message, "نوع محاسبات بها ");



                        var BranchNotAssignedListGrid = $("#BranchNotAssignedListGrid").data("kendoGrid");
                        BranchNotAssignedListGrid.clearSelection();

                        BranchNotAssignedListGrid.dataSource.read();

                        BranchNotAssignedListGrid.refresh();


                        var BranchAssignedListGrid = $("#BranchAssignedListGrid").data("kendoGrid");
                        BranchAssignedListGrid.clearSelection();

                        BranchAssignedListGrid.dataSource.read();

                        BranchAssignedListGrid.refresh();

                    }
                    else

                        AllertError(response.Message, "نوع محاسبات بها ");
                },

                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    //CostActivity.Error(errorMessage);
                    BranchComputationType.Error(errorMessage);
                },
            });
    },
    GetAllProcessForAssigningToYear: function () {
        debugger;
       
        $('#BoxBranchAssigned').removeClass('displayNone').addClass('displayShow');
        $('#BoxBranchNotAssigned').removeClass('displayNone').addClass('displayShow');
        $("#BranchNotAssignedListGrid").empty();
       // var crudServiceBaseUrl = "/FiscalYearBranchProcess",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: '',
                        dataType: "jsonp"
                    },

                    parameterMap: function (options, operation) {
                        if (operation !== "read" && options.models) {

                            return { models: options.models };
                        }
                    }
                },

                batch: true,
                schema: {
                    model: {
                        id: "BranchId",
                        fields: {
                            Title: { type: "string", editable: false },
                            OperationType: { type: "string", editable: false },

                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#BranchNotAssignedListGrid").kendoGrid({
            dataSource: dataSource,
            //sortable: true,
            batch: true,
            resizable: true,
            round: false,
            columnMenu: false,
            persistSelection: true,
            change: onChange,
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



            columns: [
                { selectable: true, width: "50px" },

                {
                    width: 50,
                    title: "ردیف",
                    template: "#= ++record #",
                },
                { field: "Title", title: "عنوان " },
                { field: "OperationType", title: "نوع شعبه " },
                // { field: "ActivityAccountTreeTitle", title: "فعالیت - هزینه" },

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

        function onChange(arg) {
            debugger;

            var BranchSelectedIds = $("#BranchNotAssignedListGrid").data("kendoGrid").selectedKeyNames();
            BranchSelectedIdsInt = [];
            for (i = 0; i < BranchSelectedIds.length; i++) {

                BranchSelectedIdsInt.push(parseInt(BranchSelectedIds[i]));
            }
            //var selectedIds = [];
            //selectedIds = this.selectedKeyNames();
            //selectedBranchIds = [];
            //for (i = 0; i < selectedIds.length; i++) {

            //    selectedBranchIds.push(parseInt(selectedIds[i]));
            //}
            if (BranchSelectedIdsInt.length > 0) {
                $('#AssignBranch').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#AssignBranch').removeClass('displayShow').addClass('displayNone');
            }
        }
    },
   



    GetAllProcessAssignedToYear: function () {
        debugger;
        $('#BoxBranchAssigned').removeClass('displayNone').addClass('displayShow');
        $('#BoxBranchNotAssigned').removeClass('displayNone').addClass('displayShow');
        $("#BranchAssignedListGrid").empty();
        debugger;
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    //url: '/BranchComputionType/UnAssignedBranchList?FiscalYear=' + $("#YearId").val() + "&costComputionType=" + $("#FiscalComputationType").val(),
                    url:'',// '/BranchComputionType/AssignedBranchList?YearId=' + $("#YearId").val() + "&computationType=" + $("#FiscalComputationType").val(),
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
                    id: "BranchComputionTypeId",
                    fields: {
                        Title: { type: "string", editable: false },
                        OperationType: { type: "string", editable: false },
                        


                    }
                }
            },
            pageSize: 10
        });
        record = 0;
        $("#BranchAssignedListGrid").kendoGrid({
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
                { field: "Title", title: "عنوان " },
                { field: "OperationType", title: "نوع شعبه " },
 
                {
                    command: [
                        {
                            name: "customDelete",
                            text: 'حذف ',
                            iconClass: "k-icon k-i-close",
                            click: RemoveAssignedProcess
                        }, 
                    ],
                    title: "عملیات"
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
        //حذف اتصال   
        function RemoveAssignedProcess(e) {
            debugger;
            e.preventDefault();
            var dataItemBranch = this.dataItem($(e.currentTarget).closest("tr"));
            var BranchComputionTypeId = dataItemBranch.BranchComputionTypeId;
            bootbox.confirm({
                title: "حذف اطلاعات!",
                message: "آیا از حذف رکورد مورد نظر اطمینان دارید؟ در صورت حذف این رکورد تمامی شعب مربوط به آن حذف میشود",
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
                    if (result == true) {
                       
                        debugger;

                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        $.ajax(
                            {

                                type: 'Post',
                                url: '/BranchComputionType/UnAssignBranch',
                                dataType: 'json',

                                data: {
  
                                    'BranchComputionTypeId': BranchComputionTypeId,
                                    __RequestVerificationToken : token
                                },


                                success: function (response) {

                                    if (response.Status == true) {
                                        var BranchAssignedListGrid = $("#BranchNotAssignedListGrid").data("kendoGrid");
                                        BranchAssignedListGrid.dataSource.transport.options.read.url = '/BranchComputionType/UnAssignedBranchCostComputionTypeList?FiscalYear=' + $("#YearId").val() + "&costComputionType=" + $("#FiscalComputationType").val();
                                        BranchAssignedListGrid.dataSource.read();

                                        $('#BranchAssignedListGrid').data('kendoGrid').dataSource.read();
                                        $('#BranchAssignedListGrid').data('kendoGrid').refresh();
                                        AllertSuccess(response.Message, "نوع محاسبات بها ");
                                        

                                       

                                    }
                                    else {
                                        AllertError(response.Message, "نوع محاسبات بها ");
                                    }



                                },
                                error: function () {

                                    AllertError('بروز خطا در برقراری ارتباط', "نوع محاسبات بها ");
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
   
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
BranchComputationType.init();



