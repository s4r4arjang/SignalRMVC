var selectedProcessIds = [];
var globalProcessActivityAccountStructureId;
var FiscalYearBranchProcess = {
    init: function () {
        debugger;
        FiscalYearBranchProcess.AddListener();
       
    },
    AddListener: function () {
        debugger;
        //دریافت آی دی درخت اهداف
        $(document).ready(function () {
            debugger;
            $('#BoxBranch').removeClass('displayShow').addClass('displayNone');
      
            $('#YearId').on('change',
                function () {
                    $('#BoxBranch').removeClass('displayShow').addClass('displayNone');
                    debugger;
                    var d = $('#YearId').val();
                    if (d == "") {
                        $('#BoxProcessAssigned').removeClass('displayShow').addClass('displayNone');
                        $('#BoxProcessNotAssigned').removeClass('displayShow').addClass('displayNone');
      8              
                        
                    }
                    else {
                        FiscalYearBranchProcess.GetAllProcessForAssigningToYear();

                        FiscalYearBranchProcess.GetAllProcessAssignedToYear();
                    }
               
                });
            
            $('#AssignProcessToYear').on('click',
                function () {
                    FiscalYearBranchProcess.AssignProcessToYear();
                });

            $('#AssignBranchToProcess').on('click',
                function () {
                    FiscalYearBranchProcess.AssignBranchToProcess();
                });
        });
    },
    //افزودن شعبه
    AssignBranchToProcess: function () {
        debugger;
    
        //var selectedIds = $("#BranchListGrid").data("kendoGrid").selectedKeyNames();
        //selectedProcessIds = [];
        //for (i = 0; i < selectedIds.length; i++) {

        //    selectedProcessIds.push(parseInt(selectedIds[i]));
        //}


        var gridData = $("#BranchListGrid").data("kendoGrid").dataSource.data();

        selectedProcessIds = [];
        gridData.forEach(function (dataItem) {

            if (true === dataItem.IsAssigned) {

                selectedProcessIds.push(parseInt(dataItem.BranchId));
            }
        })

       // selectedProcessIds = JSON.stringify(selectedProcessIds);

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

                data: {
                    'YearId': $("#YearId").val(),
                    'ProcessActivityAccountStructureId': $("#ProcessActivityAccountStructureId").val(),
                    'BranchId': selectedProcessIds,
                    __RequestVerificationToken : token
                },
                success: function (response) {
                    var messageClass = '';
                    if (response.Status == true) {

                        toastr.success(response.Message, "شعبه ", option);

                        //var BranchListGrid = $("#BranchListGrid").data("kendoGrid");
                        //BranchListGrid.clearSelection();
                        //BranchListGrid.dataSource.read();
                        //BranchListGrid.refresh();
                        FiscalYearBranchProcess.GetBranch($("#YearId").val(), globalProcessActivityAccountStructureId)

                    }
                    else {
                        toastr.error(response.Message, " شعبه  ", option);
                    }



                },
                error: function () {

                    toastr.error('بروز خطا در برقراری ارتباط', "شعبه ", option);
                },
            });
    },

    AssignProcessToYear: function () {
        $('#BoxBranch').removeClass('displayShow').addClass('displayNone');
        selectedProcessIds = JSON.stringify(selectedProcessIds);

        var option = {
            "timeOut": "0",
            "closeButton": true,
            "positionClass": "toast-bottom-full-width",
            "timeOut": "4000",
        }
        var model = {
            'YearId': $("#YearId").val(),
            'ProcessId': selectedProcessIds
        }
        var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]', form).val();
        $.ajax(
            {
                type: 'Post',
                url: '/FiscalYearBranchProcess/AssignProcessToYear',
                dataType: 'json',
         
                data: {
                    'YearId': $("#YearId").val(),
                    'ProcessId': selectedProcessIds,
                    __RequestVerificationToken : token
                },
                success: function (response) {
                    var messageClass = '';
                    if (response.Status == true) {
                      
                        toastr.success(response.Message, "سال - فرایند ", option);

                        var ProcessNotAssignedListGrid = $("#ProcessNotAssignedListGrid").data("kendoGrid");
                        ProcessNotAssignedListGrid.clearSelection();
                        ProcessNotAssignedListGrid.dataSource.read();
                        ProcessNotAssignedListGrid.refresh();

                        var ProcessAssignedListGrid = $("#ProcessAssignedListGrid").data("kendoGrid");
                        ProcessAssignedListGrid.clearSelection();
                        ProcessAssignedListGrid.dataSource.read();
                        ProcessAssignedListGrid.refresh();

                    }
                    else {
                        toastr.error(response.Message, "سال - فرایند ",  option);
                    }

                 

                },
                error: function () {
                   
                    toastr.error('بروز خطا در برقراری ارتباط', "سال - فرایند ", option);
                },
            });
    },
    GetAllProcessForAssigningToYear: function () {
        $('#BoxProcessAssigned').removeClass('displayNone').addClass('displayShow');
        $('#BoxProcessNotAssigned').removeClass('displayNone').addClass('displayShow');
        debugger;
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {

                    url: '/FiscalYearBranchProcess/GetNotAdded/' + $("#YearId").val(),
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
                    id: "ProcessActivityAccountStructureId",
                    fields: {
                        Title: { type: "string", editable: false },
                        ProcessTitle: { type: "string", editable: false },
                        ActivityAccountTreeTitle: { type: "string", editable: false },
                        
                        //ParentCode: { type: "string", editable: false, hidden: true },
                        //Code: { type: "string", editable: false, hidden: true },
                        //CostCode: { type: "string", editable: false },
                        //Path: { type: "string", editable: false },

                    }
                }
            },
            pageSize: 10
        });
        record = 0;
        $("#ProcessNotAssignedListGrid").kendoGrid({
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
                { selectable: true, width: "50px" },
               
                {
                    width: 50,
                    title: "ردیف",
                    template: "#= ++record #",
                },
                { field: "Title", title: "عنوان " },
                { field: "ProcessTitle", title: "فرایند " },
                { field: "ActivityAccountTreeTitle", title: "فعالیت - هزینه" },
          
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
        function onChange(arg) {
            debugger;
            var selectedIds = [];
            selectedIds = this.selectedKeyNames();
            selectedProcessIds = [];
            for (i = 0; i < selectedIds.length; i++) {

                selectedProcessIds.push(parseInt(selectedIds[i]));
            }
            if (selectedProcessIds.length > 0) {
                $('#AssignProcessToYear').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#AssignProcessToYear').removeClass('displayShow').addClass('displayNone');
            }
        }
    },



    GetAllProcessAssignedToYear: function () {
        $('#BoxProcessAssigned').removeClass('displayNone').addClass('displayShow');
        $('#BoxProcessNotAssigned').removeClass('displayNone').addClass('displayShow');
        debugger;
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {

                    url: '/FiscalYearBranchProcess/GetAdded/' + $("#YearId").val(),
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
                    id: "ProcessActivityAccountStructureId",
                    fields: {
                        Title: { type: "string", editable: false },
                        ProcessTitle: { type: "string", editable: false },
                        ActivityAccountTreeTitle: { type: "string", editable: false },


                    }
                }
            },
            pageSize: 10
        });
        record = 0;
        $("#ProcessAssignedListGrid").kendoGrid({
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
                { field: "ProcessTitle", title: "فرایند " },
                { field: "ActivityAccountTreeTitle", title: "فعالیت - هزینه" },
                {
                    command: [
                        {
                            name: "customDelete",
                            text: 'حذف ',
                            iconClass: "k-icon k-i-close",
                            click: RemoveAssignedProcess
                        }, {
                            name: "BranchAssigned",
                            text: ' شعبه',
                           
                            click: SetBranchAssigned
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
            e.preventDefault();
            $('#BoxBranch').removeClass('displayShow').addClass('displayNone');
            var dataItemProcess = this.dataItem($(e.currentTarget).closest("tr"));
            var ProcessActivityAccountStructureId = dataItemProcess.ProcessActivityAccountStructureId;
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
                        var option = {
                            "timeOut": "0",
                            "closeButton": true,
                            "positionClass": "toast-bottom-full-width",
                            "timeOut": "4000",
                        }
                        debugger;
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        $.ajax(
                            {

                                type: 'Post',
                                url: '/FiscalYearBranchProcess/UnAssignProcessToYear',
                                dataType: 'json',

                                data: {
                                    'YearId': $("#YearId").val(),
                                    'ProcessActivityAccountStructureId': ProcessActivityAccountStructureId,
                                    __RequestVerificationToken : token
                                },

                             
                                success: function (response) {
                                 
                                    if (response.Status == true) {

                                        toastr.success(response.Message, "سال - فرایند ", option);

                                        var ProcessNotAssignedListGrid = $("#ProcessNotAssignedListGrid").data("kendoGrid");
                                        ProcessNotAssignedListGrid.clearSelection();
                                        ProcessNotAssignedListGrid.dataSource.read();
                                        ProcessNotAssignedListGrid.refresh();

                                        var ProcessAssignedListGrid = $("#ProcessAssignedListGrid").data("kendoGrid");
                                        ProcessAssignedListGrid.clearSelection();
                                        ProcessAssignedListGrid.dataSource.read();
                                        ProcessAssignedListGrid.refresh();

                                    }
                                    else {
                                        toastr.error(response.Message, "سال - فرایند ", option);
                                    }



                                },
                                error: function () {

                                    toastr.error('بروز خطا در برقراری ارتباط', "سال - فرایند ", option);
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
       // شعبه
        function SetBranchAssigned(e) {
            e.preventDefault();
        
         
            var dataItemProcess = this.dataItem($(e.currentTarget).closest("tr"));
            $("#ProcessActivityAccountStructureId").val(dataItemProcess.ProcessActivityAccountStructureId)
            FiscalYearBranchProcess.GetBranch($("#YearId").val(), dataItemProcess.ProcessActivityAccountStructureId)
            globalProcessActivityAccountStructureId = dataItemProcess.ProcessActivityAccountStructureId;
            //$('#HeadBranchTitle').text("شعبه های " + dataItemProcess.Title);
        }
    },
    GetBranch: function (YearId, ProcessActivityAccountStructureId) {
        var databoundCheck = true;
        $('#BoxBranch').removeClass('displayNone').addClass('displayShow');
        $("#BranchListGrid").empty();
        var crudServiceBaseUrl = "/FiscalYearBranchProcess",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/BranchProcess?YearId=" + YearId + "&ProcessActivityAccountStructureId=" + ProcessActivityAccountStructureId,
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
                            IsAssigned: { type: "number", editable: false },
                          
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#BranchListGrid").kendoGrid({
            dataSource: dataSource,
            //sortable: true,
            batch: true,
            resizable: true,
            round: false,
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


          
            columns: [
                //{ selectable: true, width: "50px" },
                {
                    field: "IsAssigned",
                    title: "<input id='checkAll' type='checkbox'  />",

                    template: '<input type="checkbox" #=IsAssigned ? \'checked="checked"\' : "" # class="chkbx" />',
                    width: 50,
                    // editable: function (e) { return false; }
                    filterable: false,
                },
                {
                    title: "ردیف",
                    template: "#= ++record #",
                    width: 50
                },
                { field: "Title", title: " شعبه" },
           /*     { field: "IsAssigned", title: " IsAssigned" },*/
               
            ],
            editable: true,
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
            dataBound: function (e) {
                //var grid = $("#BranchListGrid").getKendoGrid();
                //dataItems = e.sender.dataSource.view();
                //debugger
                //for (var i = 0; i < dataItems.length; i++) {
                //        var IsAssigned = dataItems[i].get("IsAssigned");
                //        if (IsAssigned == 1) {
                //            debugger
                //            var row = this.tbody.find("[data-uid='" + dataItems[i].uid + "']");


                //            grid.select(row)


                //        }
                    
                //}

                if (databoundCheck == true) {
                    dataItems = e.sender.dataSource.data();
                    var checkall = true;
                    var i;
                    for (i = 0; i < dataItems.length; i++) {
                        if (dataItems[i].IsAssigned == false) {
                            checkall = false;
                            $('#BranchListGrid #checkAll').prop('checked', false);
                            break;
                        }


                    }
                    if (checkall == true) {
                        $('#BranchListGrid #checkAll').prop('checked', true);
                    }
                    databoundCheck = false;
                }
            }
        });

        $("#BranchListGrid .k-grid-content").on("change", "input.chkbx", function (e) {
            var grid = $("#BranchListGrid").data("kendoGrid"),
                dataItem = grid.dataItem($(e.target).closest("tr"));
            $(e.target).closest("td").prepend("<span class='k-dirty'></span>");
            dataItem.IsAssigned = this.checked;
            dataItem.dirty = true;
            if ($(this).is(':checked')) {
                $(this).attr('checked', 'checked');
            }
            else {
                $(this).removeAttr('checked');
            }
        })


        $("#BranchListGrid .k-grid-content").on("click", "input.chkbx", function (e) {
            debugger;
            var grid = $("#BranchListGrid").data("kendoGrid"),
                dataItem = grid.dataItem($(e.target).closest("tr"));
            $(e.target).closest("td").prepend("<span class='k-dirty'></span>");
            dataItem.IsAssigned = this.checked;
            dataItem.dirty = true;
            if ($(this).is(':checked')) {
                $(this).attr('checked', 'checked');
            }
            else {
                $(this).removeAttr('checked');
            }
            var grid = $("#BranchListGrid").data("kendoGrid");

            oldPageSize = grid.dataSource.pageSize();
            var currentPage = grid.dataSource.page();
            grid.dataSource.pageSize(grid.dataSource.data().length);
            var c = $('#BranchListGrid  input.chkbx').length;
            var ccheck = $('#BranchListGrid  input.chkbx[checked]').length;

            if (c === ccheck) {

                $('#BranchListGrid #checkAll').prop('checked', true);
            }
            else {
                $('#BranchListGrid #checkAll').prop('checked', false);
            }
            grid.dataSource.pageSize(oldPageSize);
            grid.dataSource.page(currentPage);
        });
        $('#BranchListGrid #checkAll').click(function () {
            debugger;
            var grid = $("#BranchListGrid").data("kendoGrid");

            oldPageSize = grid.dataSource.pageSize();
            var currentPage = grid.dataSource.page();
            grid.dataSource.pageSize(grid.dataSource.data().length);


            var list = $('#BranchListGrid  input.chkbx');

            if ($(this).is(':checked')) {
                $('#BranchListGrid #checkAll').attr('checked', 'checked');

                //.attr('checked', 'checked');
                list.each(function (index, value) {
                    $(this).attr('checked', 'checked');
                    $(this).trigger("change");
                });


            }
            else {
                $('#BranchListGrid #checkAll').removeAttr('checked');
                list.each(function (index, value) {
                    $(this).removeAttr('checked');
                    $(this).trigger("change");
                });


                //  $('#BranchListGrid  input.chkbx').removeAttr('checked');
            }
            grid.dataSource.pageSize(oldPageSize);
            grid.dataSource.page(currentPage);
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



