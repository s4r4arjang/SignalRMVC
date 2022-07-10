var record;
var CostInProductStep = {
    init: function () {
        debugger
        CostInProductStep.GetCostUnAssignedInProductStep();
        CostInProductStep.GetCostAssignedInProductStep();
    },
    GetCostUnAssignedInProductStep: function () {
        debugger;
        var crudServiceBaseUrl = "/CostInProductStep",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'CostInProductStep/GetList?ProcessActivityAccountStructureId=' + document.getElementById('ProcessActivityAccountStructureId').value + "&ProductStepId=" + document.getElementById('ProductStepId').value ,
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
        $("#DirectUnAssignedCostListGrid").kendoGrid({
         
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
                $('#DirectUnAssignedCostListGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });



        $('#DirectAssignCost').on('click',
            function () {
          
                debugger;
                CostInProductStep.DirectAssignCost();
            });

        function onChange(arg) {
            debugger;
            var selectedIds = [];
            selectedIds = this.selectedKeyNames();
     
            if (selectedIds.length > 0) {
                $('#DirectAssignCostBox').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#DirectAssignCostBox').removeClass('displayShow').addClass('displayNone');
            }
        }

    },



    GetCostAssignedInProductStep: function () {
        debugger;
        var crudServiceBaseUrl = "/CostInProductStep",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'CostInProductStep/GetListAssigned?ProcessActivityAccountStructureId=' + document.getElementById('ProcessActivityAccountStructureId').value + "&ProductStepId=" + document.getElementById('ProductStepId').value,
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
        $("#DirectAssignedCostsListGrid").kendoGrid({

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
                $('#DirectAssignedCostsListGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });



        $('#DeleteAssignedCost').on('click',
            function () {

                debugger;
                CostInProductStep.DeleteAssignedCost();
            });

        function OnChangeAssigned(arg)
        {
            debugger;
            var selectedIds2 = [];
            selectedIds2 = this.selectedKeyNames();

            if (selectedIds2.length > 0) {
                $('#DeleteAssignedCostBox').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#DeleteAssignedCostBox').removeClass('displayShow').addClass('displayNone');
            }
        }

    },
    DirectAssignCost: function () {
        debugger;
       // selectedCostIds = JSON.stringify(selectedCostIds);
        //alert(selectedCostIds)
        //var ProcessActivityAccountStructure = $('#ProcessActivityAccountStructureId').val();
        //var ProductStep = $('#ProductStepId').val();
        //alert(ProcessActivityAccountStructure);
        var DirectCostselectedIds = $("#DirectUnAssignedCostListGrid").data("kendoGrid").selectedKeyNames();
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


                   

                        var DirectUnAssignedCostListGrid = $("#DirectUnAssignedCostListGrid").data("kendoGrid");
                        DirectUnAssignedCostListGrid.clearSelection();

                        DirectUnAssignedCostListGrid.dataSource.read();

                        DirectUnAssignedCostListGrid.refresh();


                        var DirectAssignedCostsList = $("#DirectAssignedCostsListGrid").data("kendoGrid");
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
                    CostInProductStep.Error(errorMessage);
                },
            });
    },
    DeleteAssignedCost: function () {
        debugger;
        var DirectCostselectedIds = $("#DirectAssignedCostsListGrid").data("kendoGrid").selectedKeyNames();
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
                    __RequestVerificationToken: token
                },

                success: function (response) {
                    debugger;
                    if (response.Status) {
                        toastr.success(response.Message, "فرایند - هزینه ", option);
                        //$('#exampleModal').modal('toggle');




                        var DirectUnAssignedCostListGrid = $("#DirectUnAssignedCostListGrid").data("kendoGrid");
                        DirectUnAssignedCostListGrid.clearSelection();
                       
                        DirectUnAssignedCostListGrid.dataSource.read();

                        DirectUnAssignedCostListGrid.refresh();


                        var DirectAssignedCostsList = $("#DirectAssignedCostsListGrid").data("kendoGrid");
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
                    CostInProductStep.Error(errorMessage);
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
CostInProductStep.init();