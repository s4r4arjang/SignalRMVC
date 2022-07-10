//var selectedBranchIds = [];

var AnalysisYearBranchGoalFormula = {
    init: function () {
        debugger;
        AnalysisYearBranchGoalFormula.AddListener();
        AnalysisYearBranchGoalFormula.GetAllBranchAssigned();
        AnalysisYearBranchGoalFormula.GetAllUnAssigned();
    },
    AddListener: function () {
        debugger;
        //دریافت آی دی درخت اهداف
        $(document).ready(function () {
            $('#Analysis #AnalysisBoxBranchAssigned').removeClass('displayNone').addClass('displayShow');
            $('#Analysis #AnalysisBoxBranchNotAssigned').removeClass('displayNone').addClass('displayShow');
               

            $('#Analysis #AnalysisAssignBranch2').on('click',
              
                function () {
                    debugger;
                    AnalysisYearBranchGoalFormula.AnalysisAssignBranch();
                });
        });
    },
   

    AnalysisAssignBranch: function () {
        debugger;
        

        var AnalysisBranchSelectedIds = $("#Analysis #AnalysisBranchNotAssignedListGrid").data("kendoGrid").selectedKeyNames();
        AnalysisBranchSelectedIdsInt = [];
        for (i = 0; i < AnalysisBranchSelectedIds.length; i++) {

            AnalysisBranchSelectedIdsInt.push(parseInt(AnalysisBranchSelectedIds[i]));
        }
        
        var token = $('input[name="__RequestVerificationToken"]').val();
        $.ajax(
            {
                type: 'Post',
                url: '/AnalysisYearBranchGoalFormula/AnalysisAssignBranch',
                dataType: 'json',
                //   contentType: "application/json; charset=utf-8",
                //   async: true,
                data: {
                    'FiscalYearId': $("#Analysis #YearId").val(),
                    'GoalTreeTitleId': $("#Analysis #GoalTreeTitleId").val(),
                    'BranchIds': AnalysisBranchSelectedIdsInt,
                    __RequestVerificationToken : token

                },

                success: function (response) {
                    if (response.Status) {
                        AllertSuccess(response.Message, "سال آنالیز ");



                        var AnalysisBranchNotAssignedListGrid = $("#Analysis #AnalysisBranchNotAssignedListGrid").data("kendoGrid");
                        AnalysisBranchNotAssignedListGrid.clearSelection();

                        AnalysisBranchNotAssignedListGrid.dataSource.read();

                        AnalysisBranchNotAssignedListGrid.refresh();


                        var AnalysisBranchAssignedListGrid = $("#Analysis #AnalysisBranchAssignedListGrid").data("kendoGrid");
                        AnalysisBranchAssignedListGrid.clearSelection();

                        AnalysisBranchAssignedListGrid.dataSource.read();

                        AnalysisBranchAssignedListGrid.refresh();

                    }
                    else

                        AllertError(response.Message, "سال آنالیز ");
                },

                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    //CostActivity.Error(errorMessage);
                    AnalysisYearBranchGoalFormula.Error(errorMessage);
                },
            });
    },
    GetAllUnAssigned: function () {
        debugger;
       
        $('#Analysis #AnalysisBoxBranchAssigned').removeClass('displayNone').addClass('displayShow');
        $('#Analysis #AnalysisBoxBranchNotAssigned').removeClass('displayNone').addClass('displayShow');
        $("#Analysis #AnalysisBranchNotAssignedListGrid").empty();
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
        $("#Analysis #AnalysisBranchNotAssignedListGrid").kendoGrid({
            dataSource: dataSource,
            //sortable: true,
            batch: true,
            resizable: true,
            round: false,
            columnMenu: false,
            persistSelection: true,
            change: AnalysisonChange,
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

        function AnalysisonChange(arg) {
            debugger;

            var AnalysisBranchSelectedIds = $("#Analysis #AnalysisBranchNotAssignedListGrid").data("kendoGrid").selectedKeyNames();
            AnalysisBranchSelectedIdsInt = [];
            for (i = 0; i < AnalysisBranchSelectedIds.length; i++) {

                AnalysisBranchSelectedIdsInt.push(parseInt(AnalysisBranchSelectedIds[i]));
            }
            //var selectedIds = [];
            //selectedIds = this.selectedKeyNames();
            //selectedBranchIds = [];
            //for (i = 0; i < selectedIds.length; i++) {

            //    selectedBranchIds.push(parseInt(selectedIds[i]));
            //}
            if (AnalysisBranchSelectedIdsInt.length > 0) {
                $('#Analysis #AnalysisAssignBranch').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#Analysis #AnalysisAssignBranch').removeClass('displayShow').addClass('displayNone');
            }
        }
    },
   



    GetAllBranchAssigned: function () {
        debugger;
        //$('#Analysis #AnalysisBoxBranchAssigned').removeClass('displayNone').addClass('displayShow');
        //$('#Analysis #AnalysisBoxBranchNotAssigned').removeClass('displayNone').addClass('displayShow');
        debugger;
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
        $("#Analysis #AnalysisBranchAssignedListGrid").kendoGrid({
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
                                url: '/AnalysisYearBranchGoalFormula/AnalysisUnAssignBranch',
                                dataType: 'json',

                                data: {
  
                                    'FiscalYearBranchGoalFormulaId': BranchGoalFormulaId,
                                    __RequestVerificationToken : token
                                },


                                success: function (response) {

                                    if (response.Status == true) {
                                        var AnalysisBranchAssignedListGrid = $("#Analysis #AnalysisBranchNotAssignedListGrid").data("kendoGrid");
                                        AnalysisBranchAssignedListGrid.dataSource.transport.options.read.url = '/AnalysisYearBranchGoalFormula/UnAssignedBranch?FiscalYearId=' + $("#Analysis #YearId").val() + "&GoalTreeTitleId=" + $("#Analysis #GoalTreeTitleId").val();
                                        AnalysisBranchAssignedListGrid.dataSource.read();

                                        $('#Analysis #AnalysisBranchAssignedListGrid').data('kendoGrid').dataSource.read();
                                        $('#Analysis #AnalysisBranchAssignedListGrid').data('kendoGrid').refresh();
                                        AllertSuccess(response.Message, "نوع محاسبات بها ");
                                        

                                       

                                    }
                                    else {
                                        AllertError(response.Message, "سال آنالیز ");
                                    }



                                },
                                error: function () {

                                    AllertError('بروز خطا در برقراری ارتباط', "سال آنالیز ");
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
AnalysisYearBranchGoalFormula.init();

function callChangeAnalysisfunc() {

    var Y = $('#Analysis #YearId').val();
    var G = $('#Analysis #GoalTreeTitleId').val();
    if (Y === "" || G === "") {
        $('#Analysis #AnalysisBoxBranchAssigned').removeClass('displayShow').addClass('displayNone');
        $('#Analysis #AnalysisBoxBranchNotAssigned').removeClass('displayShow').addClass('displayNone');


    }
    else {
 
        $('#Analysis #AnalysisBoxBranchAssigned').removeClass('displayNone').addClass('displayShow');
        $('#Analysis #AnalysisBoxBranchNotAssigned').removeClass('displayNone').addClass('displayShow');

        var AnalysisBranchNotAssignedListGrid = $("#Analysis #AnalysisBranchNotAssignedListGrid").data("kendoGrid");
        AnalysisBranchNotAssignedListGrid.dataSource.transport.options.read.url = '/AnalysisYearBranchGoalFormula/UnAssignedBranch?FiscalYearId=' + $("#Analysis #YearId").val() + "&GoalTreeTitleId=" + $("#Analysis #GoalTreeTitleId").val();
        AnalysisBranchNotAssignedListGrid.dataSource.read();

        var AnalysisBranchAssignedListGrid = $("#Analysis #AnalysisBranchAssignedListGrid").data("kendoGrid");
        AnalysisBranchAssignedListGrid.dataSource.transport.options.read.url = '/AnalysisYearBranchGoalFormula/AssignedBranch?FiscalYearId=' + $("#Analysis #YearId").val() + "&GoalTreeTitleId=" + $("#Analysis #GoalTreeTitleId").val();
        AnalysisBranchAssignedListGrid.dataSource.read();
    }

}



