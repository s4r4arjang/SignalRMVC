var record;
var CostInDirectWage = {
    init: function () {
        debugger
        CostInDirectWage.GetUnAssignedDirectWageInProductStep();
        CostInDirectWage.GetAssignedDirectWageInProductStep();
    },
    GetUnAssignedDirectWageInProductStep: function () {
        debugger;
        var crudServiceBaseUrl = "/CostInDirectWage",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'CostInProductStep/GetDirectWageList?ProcessActivityAccountStructureId=' + document.getElementById('ProcessActivityAccountStructureId').value + "&ProductStepId=" + document.getElementById('ProductStepId').value ,
                        dataType: "json"
                    },
                 

                },

                batch: true,
                schema: {
                    model: {
                        id: "CostId",
                        fields: {
                         
                         
                            Title: { type: "string", validation: { required: true } },
                            Path: { type: "string", validation: { required: true } },
                      

                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#DirectWageUnAssignedGrid").kendoGrid({
         
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
                { field: "Path", title: "مسیر" }

             
          
            ],

            editable: "popup",
        
            cancel: function (e) {
                debugger;
                $('#DirectWageUnAssignedGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });



        $('#AssigningDirectWage').on('click',
            function () {
          
                debugger;
                CostInDirectWage.AssignDirectWage();
            });

        function onChange(arg) {
            debugger;
            var selectedIds = [];
            selectedIds = this.selectedKeyNames();
     
            if (selectedIds.length > 0) {
                $('#AssigningDirectWageBox').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#AssigningDirectWageBox').removeClass('displayShow').addClass('displayNone');
            }
        }

    },



    GetAssignedDirectWageInProductStep: function () {
        debugger;
        var crudServiceBaseUrl = "/CostInProductStep",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'CostInProductStep/GetDirectWageAssigned?ProcessActivityAccountStructureId=' + document.getElementById('ProcessActivityAccountStructureId').value + "&ProductStepId=" + document.getElementById('ProductStepId').value,
                        dataType: "json"
                    },


                },

                batch: true,
                schema: {
                    model: {
                        id: "CostId",
                        fields: {


                            Title: { type: "string", validation: { required: true } },
                            Path: { type: "string", validation: { required: true } },


                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#DirectWageAssignedGrid").kendoGrid({

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
                { field: "Path", title: "مسیر" }



            ],

            editable: "popup",

            cancel: function (e) {
                debugger;
                $('#DirectWageAssignedGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });



        $('#DeleteDirectWageAssigned').on('click',
            function () {

                debugger;
                CostInDirectWage.DeleteAssignedCost();
            });

        function OnChangeAssigned(arg)
        {
            debugger;
            var selectedIds2 = [];
            selectedIds2 = this.selectedKeyNames();

            if (selectedIds2.length > 0) {
                $('#DeleteDirectWageAssignedBox').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#DeleteDirectWageAssignedBox').removeClass('displayShow').addClass('displayNone');
            }
        }

    },
    AssignDirectWage: function () {
        debugger;
       // selectedCostIds = JSON.stringify(selectedCostIds);
        //alert(selectedCostIds)
        //var ProcessActivityAccountStructure = $('#ProcessActivityAccountStructureId').val();
        //var ProductStep = $('#ProductStepId').val();
        //alert(ProcessActivityAccountStructure);
        var DirectCostselectedIds = $("#DirectWageUnAssignedGrid").data("kendoGrid").selectedKeyNames();
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
        var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        $.ajax(
            {
                type: 'Post',
                url: '/CostInProductStep/Assign',
                dataType: 'json',
             //   contentType: "application/json; charset=utf-8",
             //   async: true,
                data: {
                    'ProductStepId': $("#ProductStepId").val(),
                    'ProcessActivityAccountStructureId': $("#ProcessActivityAccountStructureId").val(),
                    'costsId': DirectCostselectedIdsint,
                    __RequestVerificationToken : token

                },

                success: function (response) {
                    if (response.Status) {
                        toastr.success(response.Message, "فرایند - هزینه ", option);
                        //$('#exampleModal').modal('toggle');


                   

                        var DirectUnAssignedCostListGrid = $("#DirectWageUnAssignedGrid").data("kendoGrid");
                        DirectUnAssignedCostListGrid.clearSelection();

                        DirectUnAssignedCostListGrid.dataSource.read();

                        DirectUnAssignedCostListGrid.refresh();


                        var DirectAssignedCostsList = $("#DirectWageAssignedGrid").data("kendoGrid");
                        DirectAssignedCostsList.clearSelection();

                        DirectAssignedCostsList.dataSource.read();

                        DirectAssignedCostsList.refresh();

                    }
                    else

                        toastr.error(response.Message, "فرایند - هزینه", option);
                },
        
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    //CostActivity.Error(errorMessage);
                    CostInDirectWage.Error(errorMessage);
                },
            });
    },
    DeleteAssignedCost: function () {
        debugger;
        var DirectCostselectedIds = $("#DirectWageAssignedGrid").data("kendoGrid").selectedKeyNames();
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
        var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        $.ajax(
            {
                type: 'POST',
                url: '/CostInProductStep/Delete',
                dataType: 'json',
                //contentType: "application/json; charset=utf-8",
                //async: true,
                data: {
                    'costsId': DirectCostselectedIdsint, 'ProcessActivityAccountStructureId': $('#ProcessActivityAccountStructureId').val(), 'ProductStepId': $('#ProductStepId').val(),
                    __RequestVerificationToken : token
                },

                success: function (response) {
                    debugger;
                    if (response.Status) {
                        toastr.success(response.Message, "فرایند - هزینه ", option);
                        //$('#exampleModal').modal('toggle');




                        var DirectUnAssignedCostListGrid = $("#DirectWageUnAssignedGrid").data("kendoGrid");
                        DirectUnAssignedCostListGrid.clearSelection();
                       
                        DirectUnAssignedCostListGrid.dataSource.read();

                        DirectUnAssignedCostListGrid.refresh();


                        var DirectAssignedCostsList = $("#DirectWageAssignedGrid").data("kendoGrid");
                        DirectAssignedCostsList.clearSelection();

                        DirectAssignedCostsList.dataSource.read();

                        DirectAssignedCostsList.refresh();
                    }
                    else

                        toastr.error(response.Message, "فرایند - هزینه", option);
                },

                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    //CostActivity.Error(errorMessage);
                    CostInDirectWage.Error(errorMessage);
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
CostInDirectWage.init();