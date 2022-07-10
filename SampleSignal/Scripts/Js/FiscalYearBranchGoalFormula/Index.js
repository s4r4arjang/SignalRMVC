//var selectedFiscalBranchIds = [];

var FiscalYearBranchGoalFormula = {
    init: function () {
        $('#Cal #BoxFisicalBranchAssigned').removeClass('displayShow').addClass('displayNone');
        $('#Cal #BoxFisicalBranchNotAssigned').removeClass('displayShow').addClass('displayNone');
        debugger;
        FiscalYearBranchGoalFormula.AddListener();
        FiscalYearBranchGoalFormula.GetAllBranchAssigned();
        FiscalYearBranchGoalFormula.GetAllUnAssigned();
    },
    AddListener: function () {
        debugger;
        //دریافت آی دی درخت اهداف
        $(document).ready(function () {
            debugger;
            

            $('#Cal #FisicalAssignBranch2').on('click',
                function () {
                    FiscalYearBranchGoalFormula.FisicalAssignBranch();
                });
        });
    },
    

    FisicalAssignBranch: function () {
        debugger;
        
        var FisicalBranchSelectedIds = $("#Cal #FisicalBranchNotAssignedListGrid").data("kendoGrid").selectedKeyNames();
        FisicalBranchSelectedIdsInt = [];
        for (i = 0; i < FisicalBranchSelectedIds.length; i++) {

            FisicalBranchSelectedIdsInt.push(parseInt(FisicalBranchSelectedIds[i]));
        }
        
        var token = $('input[name="__RequestVerificationToken"]').val();
        $.ajax(
            {
                type: 'Post',
                url: '/FiscalYearBranchGoalFormula/FisicalAssignBranch',
                dataType: 'json',
            
                data: {
                    'FiscalYearId': $("#Cal #YearId").val(),
                    'GoalTreeTitleId': $("#Cal #GoalTreeTitleId").val(),
                    'BranchIds': FisicalBranchSelectedIdsInt,
                    __RequestVerificationToken : token

                },

                success: function (response) {
                    if (response.Status) {
                        AllertSuccess(response.Message, "سال مالی ");



                        var FisicalBranchNotAssignedListGrid = $("#Cal #FisicalBranchNotAssignedListGrid").data("kendoGrid");
                        FisicalBranchNotAssignedListGrid.clearSelection();

                        FisicalBranchNotAssignedListGrid.dataSource.read();

                        FisicalBranchNotAssignedListGrid.refresh();


                        var FisicalBranchAssignedListGrid = $("#Cal #FisicalBranchAssignedListGrid").data("kendoGrid");
                        FisicalBranchAssignedListGrid.clearSelection();

                        FisicalBranchAssignedListGrid.dataSource.read();

                        FisicalBranchAssignedListGrid.refresh();

                    }
                    else

                        AllertError(response.Message, "سال مالی ");
                },

                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    //CostActivity.Error(errorMessage);
                    FiscalYearBranchGoalFormula.Error(errorMessage);
                },
            });
    },
    GetAllUnAssigned: function () {
        debugger;
       
        $('#Cal #BoxFisicalBranchAssigned').removeClass('displayNone').addClass('displayShow');
        $('#Cal #BoxFisicalBranchNotAssigned').removeClass('displayNone').addClass('displayShow');
        $("#Cal #FisicalBranchNotAssignedListGrid").empty();
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
                            

                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#Cal #FisicalBranchNotAssignedListGrid").kendoGrid({
            dataSource: dataSource,
            //sortable: true,
            batch: true,
            resizable: true,
            round: false,
            columnMenu: false,
            persistSelection: true,
            change: FisicalonChange,
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

        function FisicalonChange(arg) {
            debugger;

            var FisicalBranchSelectedIds = $("#Cal #FisicalBranchNotAssignedListGrid").data("kendoGrid").selectedKeyNames();
            FisicalBranchSelectedIdsInt = [];
            for (i = 0; i < FisicalBranchSelectedIds.length; i++) {

                FisicalBranchSelectedIdsInt.push(parseInt(FisicalBranchSelectedIds[i]));
            }
            //var selectedIds = [];
            //selectedIds = this.selectedKeyNames();
            //selectedFiscalBranchIds = [];
            //for (i = 0; i < selectedIds.length; i++) {

            //    selectedFiscalBranchIds.push(parseInt(selectedIds[i]));
            //}
            if (FisicalBranchSelectedIdsInt.length > 0) {
                $('#Cal #FisicalAssignBranch').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#Cal #FisicalAssignBranch').removeClass('displayShow').addClass('displayNone');
            }
        }
    },
   



    GetAllBranchAssigned: function () {

        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    
                    url:'',
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
                    id: "FiscalYearBranchGoalFormulaId",
                    fields: {
                        Title: { type: "string", editable: false },
                        


                    }
                }
            },
            pageSize: 10
        });
        record = 0;
        $("#Cal #FisicalBranchAssignedListGrid").kendoGrid({
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
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var BranchGoalFormulaId = dataItem.FiscalYearBranchGoalFormulaId;
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
                        
                        var token = $('input[name="__RequestVerificationToken"]').val();
                        $.ajax(
                            {

                                type: 'Post',
                                url: '/FiscalYearBranchGoalFormula/UnAssignFisicalBranch',
                                dataType: 'json',

                                data: {
  
                                    'FiscalYearBranchGoalFormulaId': BranchGoalFormulaId,
                                    __RequestVerificationToken : token
                                },


                                success: function (response) {

                                    if (response.Status == true) {
                                        var FisicalBranchAssignedListGrid = $("#Cal #FisicalBranchNotAssignedListGrid").data("kendoGrid");
                                        FisicalBranchAssignedListGrid.dataSource.transport.options.read.url = '/FiscalYearBranchGoalFormula/UnAssignedBranch?FiscalYearId=' + $("#Cal #YearId").val() + "&GoalTreeTitleId=" + $("#Cal #GoalTreeTitleId").val();
                                        FisicalBranchAssignedListGrid.dataSource.read();

                                        $('#Cal #FisicalBranchAssignedListGrid').data('kendoGrid').dataSource.read();
                                        $('#Cal #FisicalBranchAssignedListGrid').data('kendoGrid').refresh();
                                        AllertSuccess(response.Message, "سال مالی ");
                                        

                                       

                                    }
                                    else {
                                        AllertError(response.Message, "سال مالی ");
                                    }



                                },
                                error: function () {

                                    AllertError('بروز خطا در برقراری ارتباط', "سال مالی ");
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
FiscalYearBranchGoalFormula.init();

function callChangefunc()
{

                    debugger;
                    var Y = $('#Cal #YearId').val();
                    var G = $('#Cal #GoalTreeTitleId').val();
                    if (Y === "" || G === "" ) {
                        $('#Cal #BoxFisicalBranchAssigned').removeClass('displayShow').addClass('displayNone');
                        $('#Cal #BoxFisicalBranchNotAssigned').removeClass('displayShow').addClass('displayNone');


                    }
                    else {
                        debugger
                    //    FiscalYearBranchGoalFormula.GetAllUnAssigned();

                        $('#Cal #BoxFisicalBranchAssigned').removeClass('displayNone').addClass('displayShow');
                        $('#Cal #BoxFisicalBranchNotAssigned').removeClass('displayNone').addClass('displayShow');

                        var FisicalBranchNotAssignedListGrid = $("#Cal #FisicalBranchNotAssignedListGrid").data("kendoGrid");
                        FisicalBranchNotAssignedListGrid.dataSource.transport.options.read.url = '/FiscalYearBranchGoalFormula/UnAssignedBranch?FiscalYearId=' + $("#Cal #YearId").val() + "&GoalTreeTitleId=" + $("#Cal #GoalTreeTitleId").val();
                        FisicalBranchNotAssignedListGrid.dataSource.read();

                        var FisicalBranchAssignedListGrid = $("#Cal #FisicalBranchAssignedListGrid").data("kendoGrid");
                        FisicalBranchAssignedListGrid.dataSource.transport.options.read.url = '/FiscalYearBranchGoalFormula/AssignedBranch?FiscalYearId=' + $("#Cal #YearId").val() + "&GoalTreeTitleId=" + $("#Cal #GoalTreeTitleId").val();
                        FisicalBranchAssignedListGrid.dataSource.read();
                    }

}



