var record;
var OperationalActivityInProductStep = {
    init: function () {
        debugger
        OperationalActivityInProductStep.GetUnAssignedActivityInProductStep();
        OperationalActivityInProductStep.GetAssignedActivityInProductStep();
    },
    GetUnAssignedActivityInProductStep: function () {
        debugger;
        var crudServiceBaseUrl = "/OperationalActivityInProductStep",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'ActivityInProductStep/GetOperationalActivityList?ProcessActivityAccountStructureId=' + document.getElementById('ProcessActivityAccountStructureId').value + "&ProductStepId=" + document.getElementById('ProductStepId').value ,
                        dataType: "json"
                    },
                 

                },

                batch: true,
                schema: {
                    model: {
                        id: "ActivityId",
                        fields: {
                         
                         
                            Title: { type: "string", validation: { required: true } },
                            Path: { type: "string", validation: { required: true } },
                      

                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#UnAssignedOperationalActivityGrid").kendoGrid({
         
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
                      selectable: true, width: "50px" },
                { width: 50,
                    title: "ردیف",
                    template: "#= ++record #",
                },
                { field: "Title", title: "عنوان" },
                { field: "Path", title: "فرایند" }

             
          
            ],

            editable: "popup",
        
            cancel: function (e) {
                debugger;
                $('#UnAssignedOperationalActivityGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });



        $('#AssigningOperationalActivity').on('click',
            function () {
          
                debugger;
                OperationalActivityInProductStep.AssigningOperationalActivity();
            });

        function onChange(arg) {
            debugger;
            var selectedIds = [];
            selectedIds = this.selectedKeyNames();
     
            if (selectedIds.length > 0) {
                $('#AssigningOperationalActivityBox').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#AssigningOperationalActivityBox').removeClass('displayShow').addClass('displayNone');
            }
        }

    },



    GetAssignedActivityInProductStep: function () {
        debugger;
        var crudServiceBaseUrl = "/OperationalActivityInProductStep",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'ActivityInProductStep/GetAssignedOperationalActivityList?ProcessActivityAccountStructureId=' + document.getElementById('ProcessActivityAccountStructureId').value + "&ProductStepId=" + document.getElementById('ProductStepId').value,
                        dataType: "json"
                    },


                },

                batch: true,
                schema: {
                    model: {
                        id: "ActivityId",
                        fields: {


                            Title: { type: "string", validation: { required: true } },
                            Path: { type: "string", validation: { required: true } },


                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#AssignedOperationalActivityGrid").kendoGrid({

            dataSource: dataSource,
            sortable: true,
            resizable: true,
            columnMenu: false,
            persistSelection: true,
            change: OnChangeAssigned,
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
                { field: "Title", title: "عنوان" },
                { field: "Path", title: "فرایند" }



            ],

            editable: "popup",

            cancel: function (e) {
                debugger;
                $('#AssignedOperationalActivityGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });



        $('#DeleteAssignedOperationalActivity').on('click',
            function () {

                debugger;
                OperationalActivityInProductStep.DeleteAssignedOperationalActivity();
            });

        function OnChangeAssigned(arg)
        {
            debugger;
            var selectedIds2 = [];
            selectedIds2 = this.selectedKeyNames();

            if (selectedIds2.length > 0) {
                $('#DeleteAssignedOperationalActivityBox').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#DeleteAssignedOperationalActivityBox').removeClass('displayShow').addClass('displayNone');
            }
        }

    },
    AssigningOperationalActivity: function () {
        debugger;
       // selectedCostIds = JSON.stringify(selectedCostIds);
        //alert(selectedCostIds)
        //var ProcessActivityAccountStructure = $('#ProcessActivityAccountStructureId').val();
        //var ProductStep = $('#ProductStepId').val();
        //alert(ProcessActivityAccountStructure);
        var DirectCostselectedIds = $("#UnAssignedOperationalActivityGrid").data("kendoGrid").selectedKeyNames();
        DirectCostselectedIdsint = [];
        for (i = 0; i < DirectCostselectedIds.length; i++) {

            DirectCostselectedIdsint.push(parseInt(DirectCostselectedIds[i]));
        }

        var option = {
            "timeOut": "0",
            "closeButton": true,
            "positionClass": "toast-bottom-full-width",
            "timeOut": "4000",
        }

        $.ajax(
            {
                type: 'Post',
                url: '/ActivityInProductStep/Assign',
                dataType: 'json',
             //   contentType: "application/json; charset=utf-8",
             //   async: true,
                data: {
                    'ProductStepId': $("#ProductStepId").val(),
                    'ProcessActivityAccountStructureId': $("#ProcessActivityAccountStructureId").val(),
                    'ActivityId': DirectCostselectedIdsint

                },

                success: function (response) {
                    if (response.Status) {
                        toastr.success(response.Message, "فرایند - فعالیت ", option);
                        //$('#exampleModal').modal('toggle');


                   

                        var UnAssignedActivityGrid = $("#UnAssignedOperationalActivityGrid").data("kendoGrid");
                        UnAssignedActivityGrid.clearSelection();

                        UnAssignedActivityGrid.dataSource.read();

                        UnAssignedActivityGrid.refresh();


                        var AssignedActivity = $("#AssignedOperationalActivityGrid").data("kendoGrid");
                        AssignedActivity.clearSelection();

                        AssignedActivity.dataSource.read();

                        AssignedActivity.refresh();

                    }
                    else

                        toastr.error(response.Message, "فرایند - هزینه", option);
                },
        
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    //CostActivity.Error(errorMessage);
                    OperationalActivityInProductStep.Error(errorMessage);
                },
            });
    },
    DeleteAssignedOperationalActivity: function () {
        debugger;
        var ActivityselectedIds = $("#AssignedOperationalActivityGrid").data("kendoGrid").selectedKeyNames();
        ActivityselectedIdsint = [];
        for (i = 0; i < ActivityselectedIds.length; i++) {

            ActivityselectedIdsint.push(parseInt(ActivityselectedIds[i]));
        }

        var option = {
            "timeOut": "0",
            "closeButton": true,
            "positionClass": "toast-bottom-full-width",
            "timeOut": "4000",
        }

        $.ajax(
            {
                type: 'POST',
                url: '/ActivityInProductStep/Delete',
                dataType: 'json',
                //contentType: "application/json; charset=utf-8",
                //async: true,
                data: {
                    'ActivityId': ActivityselectedIdsint, 'ProcessActivityAccountStructureId': $('#ProcessActivityAccountStructureId').val(), 'ProductStepId': $('#ProductStepId').val()
                },

                success: function (response) {
                    debugger;
                    if (response.Status) {
                        toastr.success(response.Message, "مرحله - فعالیت ", option);
                        //$('#exampleModal').modal('toggle');




                        var UnAssignedActivityGrid = $("#UnAssignedOperationalActivityGrid").data("kendoGrid");
                        UnAssignedActivityGrid.clearSelection();
                       
                        UnAssignedActivityGrid.dataSource.read();

                        UnAssignedActivityGrid.refresh();


                        var AssignedActivityGrid = $("#AssignedOperationalActivityGrid").data("kendoGrid");
                        AssignedActivityGrid.clearSelection();

                        AssignedActivityGrid.dataSource.read();

                        AssignedActivityGrid.refresh();
                    }
                    else

                        toastr.error(response.Message, "فرایند - هزینه", option);
                },

                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    //CostActivity.Error(errorMessage);
                    OperationalActivityInProductStep.Error(errorMessage);
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
OperationalActivityInProductStep.init();