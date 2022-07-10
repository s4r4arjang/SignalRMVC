var record;
var StaffActivityInProductStep = {
    init: function () {
        debugger
        StaffActivityInProductStep.UnAssignedStaffActivity();
        StaffActivityInProductStep.AssignedStaffActivity();
    },
    UnAssignedStaffActivity: function () {
        debugger;
        var crudServiceBaseUrl = "/StaffActivityInProductStep",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'ActivityInProductStep/StaffActivityList?ProcessActivityAccountStructureId=' + document.getElementById('ProcessActivityAccountStructureId').value + "&ProductStepId=" + document.getElementById('ProductStepId').value ,
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
        $("#UnAssignedStaffActivityGrid").kendoGrid({
         
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
                $('#UnAssignedStaffActivityGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });



        $('#AssigningStaffActivity').on('click',
            function () {
          
                debugger;
                StaffActivityInProductStep.AssigningStaffActivity();
            });

        function onChange(arg) {
            debugger;
            var selectedIds = [];
            selectedIds = this.selectedKeyNames();
     
            if (selectedIds.length > 0) {
                $('#AssigningStaffActivityBox').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#AssigningStaffActivityBox').removeClass('displayShow').addClass('displayNone');
            }
        }

    },



    AssignedStaffActivity: function () {
        debugger;
        var crudServiceBaseUrl = "/StaffActivityInProductStep",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'ActivityInProductStep/GetAssignedStaffActivityList?ProcessActivityAccountStructureId=' + document.getElementById('ProcessActivityAccountStructureId').value + "&ProductStepId=" + document.getElementById('ProductStepId').value,
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
        $("#AssignedStaffActivityGrid").kendoGrid({

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
                $('#AssignedStaffActivityGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });



        $('#DeleteAssignedStaffActivity').on('click',
            function () {

                debugger;
                StaffActivityInProductStep.DeleteAssignedStaffActivity();
            });

        function OnChangeAssigned(arg)
        {
            debugger;
            var selectedIds2 = [];
            selectedIds2 = this.selectedKeyNames();

            if (selectedIds2.length > 0) {
                $('#DeleteAssignedStaffActivityBox').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#DeleteAssignedStaffActivityBox').removeClass('displayShow').addClass('displayNone');
            }
        }

    },
    AssigningStaffActivity: function () {
        debugger;
       // selectedCostIds = JSON.stringify(selectedCostIds);
        //alert(selectedCostIds)
        //var ProcessActivityAccountStructure = $('#ProcessActivityAccountStructureId').val();
        //var ProductStep = $('#ProductStepId').val();
        //alert(ProcessActivityAccountStructure);
        var StaffActivityselectedIds = $("#UnAssignedStaffActivityGrid").data("kendoGrid").selectedKeyNames();
        StaffActivityselectedIdsint = [];
        for (i = 0; i < StaffActivityselectedIds.length; i++) {

            StaffActivityselectedIdsint.push(parseInt(StaffActivityselectedIds[i]));
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
                    'ActivityId': StaffActivityselectedIdsint

                },

                success: function (response) {
                    if (response.Status) {
                        toastr.success(response.Message, "فرایند - فعالیت ", option);
                        //$('#exampleModal').modal('toggle');


                   

                        var UnAssignedActivityGrid = $("#UnAssignedStaffActivityGrid").data("kendoGrid");
                        UnAssignedActivityGrid.clearSelection();

                        UnAssignedActivityGrid.dataSource.read();

                        UnAssignedActivityGrid.refresh();


                        var AssignedActivity = $("#AssignedStaffActivityGrid").data("kendoGrid");
                        AssignedActivity.clearSelection();

                        AssignedActivity.dataSource.read();

                        AssignedActivity.refresh();

                    }
                    else

                        toastr.error(response.Message, "فرایند - فعالیت", option);
                },
        
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    //CostActivity.Error(errorMessage);
                    StaffActivityInProductStep.Error(errorMessage);
                },
            });
    },
    DeleteAssignedStaffActivity: function () {
        debugger;
        var ActivityselectedIds = $("#AssignedStaffActivityGrid").data("kendoGrid").selectedKeyNames();
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




                        var UnAssignedActivityGrid = $("#UnAssignedStaffActivityGrid").data("kendoGrid");
                        UnAssignedActivityGrid.clearSelection();
                       
                        UnAssignedActivityGrid.dataSource.read();

                        UnAssignedActivityGrid.refresh();


                        var AssignedActivityGrid = $("#AssignedStaffActivityGrid").data("kendoGrid");
                        AssignedActivityGrid.clearSelection();

                        AssignedActivityGrid.dataSource.read();

                        AssignedActivityGrid.refresh();
                    }
                    else

                        toastr.error(response.Message, "فرایند - فعالیت", option);
                },

                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    //CostActivity.Error(errorMessage);
                    StaffActivityInProductStep.Error(errorMessage);
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
StaffActivityInProductStep.init();