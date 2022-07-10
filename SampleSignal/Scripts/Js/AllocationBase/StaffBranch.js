var databoundCheck = true;
var StaffBranchList = {
    init: function () {
        debugger
        StaffBranchList.GetStaffBranch();
        $('#AssignStaffBranchToAllocationBase').on('click',
            function () {
                StaffBranchList.AssignStaffBranchToAllocationBase();
            });
    },
    //GetStaffBranch: function (e) {
    //    e.preventDefault();

    //},

    GetStaffBranch: function () {
        debugger;


        $('#BoxStaffBranch').removeClass('displayNone').addClass('displayShow');

        //var crudServiceBaseUrl = "/FiscalYearBranchProcess",
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/StaffBranchAllocationBase/GetStaffBranchAllocationBase?AllocationBaseId=" + document.getElementById('AllocationBaseId').value,
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
                    id: "StaffBranchId",
                    fields: {
                        Title : { type: "string", editable: false },
                       /* HasStaffBranch : { type: "boolean", editable: false },*/

                    }
                }
            },
            pageSize: 10
        });
        record = 0;
        $("#StaffBranchListGrid").kendoGrid({
            dataSource: dataSource,
            // sortable: true,
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
                //  serverFiltering: true,

            },
            //filterable: {
            //    mode: "row"
            //},



            columns: [
                // { selectable: true, width: "50px" },
                {
                    field: "HasStaffBranch",
                    title: "<input id='checkAll' type='checkbox'  />",

                    template: '<input type="checkbox" #= HasStaffBranch ? \'checked="checked"\' : "" # class="chkbx"  />',
                    width: 110,
                    editable: function (e) { return false; }
                },
                {
                    title: "ردیف",
                    template: "#= ++record #",
                    width: 50
                },

                { field: "Title", title: "عنوان شعبه" },
                //   { field: "HasPermission", title: "وجود دسترسی", },


            ],
            editable: true,
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },

            //dataBound: function (e) {
            //    var grid = $("#StaffBranchListGrid").getKendoGrid();

            //    dataItems = e.sender.dataSource.view();
            //    debugger
            //    for (var i = 0; i < dataItems.length; i++) {
            //        var HasStaffBranch = dataItems[i].get("HasStaffBranch");
            //        if (HasStaffBranch == 1) {
            //            debugger
            //            var row = this.tbody.find("[data-uid='" + dataItems[i].uid + "']");


            //            grid.select(row)


            //        }
            //    }
            //},
            dataBound: function (e) {
                debugger;
                if (databoundCheck == true) {
                    dataItems = e.sender.dataSource.data();
                    var i;
                    var checkall = true;
                    for (i = 0; i < dataItems.length; i++) {
                        if (dataItems[i].HasStaffBranch == false) {
                            checkall = false;
                            $('#StaffBranchListGrid #checkAll').prop('checked', false);
                            break;
                        }


                    }
                    if (checkall == true) {
                        $('#StaffBranchListGrid #checkAll').prop('checked', true);
                    }
                    databoundCheck = false;
                }

            }




        });
        $("#StaffBranchListGrid .k-grid-content").on("change", "input.chkbx", function (e) {
            var grid = $("#StaffBranchListGrid").data("kendoGrid"),
                dataItem = grid.dataItem($(e.target).closest("tr"));
            $(e.target).closest("td").prepend("<span class='k-dirty'></span>");
            dataItem.HasStaffBranch = this.checked;
            dataItem.dirty = true;
            if ($(this).is(':checked')) {
                $(this).attr('checked', 'checked');
            }
            else {
                $(this).removeAttr('checked');
            }
        })


        $("#StaffBranchListGrid .k-grid-content").on("click", "input.chkbx", function (e) {
            debugger;
            var grid = $("#StaffBranchListGrid").data("kendoGrid"),
                dataItem = grid.dataItem($(e.target).closest("tr"));
            $(e.target).closest("td").prepend("<span class='k-dirty'></span>");
            dataItem.HasStaffBranch = this.checked;
            dataItem.dirty = true;
            if ($(this).is(':checked')) {
                $(this).attr('checked', 'checked');
            }
            else {
                $(this).removeAttr('checked');
            }
            var grid = $("#StaffBranchListGrid").data("kendoGrid");

            oldPageSize = grid.dataSource.pageSize();
            var currentPage = grid.dataSource.page();
            grid.dataSource.pageSize(grid.dataSource.data().length);
            var c = $('#StaffBranchListGrid  input.chkbx').length;
            var ccheck = $('#StaffBranchListGrid  input.chkbx[checked]').length;

            if (c === ccheck) {

                $('#StaffBranchListGrid #checkAll').prop('checked', true);
            }
            else {
                $('#StaffBranchListGrid #checkAll').prop('checked', false);
            }
            grid.dataSource.pageSize(oldPageSize);
            grid.dataSource.page(currentPage);
        });
        $('#StaffBranchListGrid #checkAll').click(function () {
            debugger;
            var grid = $("#StaffBranchListGrid").data("kendoGrid");

            oldPageSize = grid.dataSource.pageSize();
            var currentPage = grid.dataSource.page();
            grid.dataSource.pageSize(grid.dataSource.data().length);


            var list = $('#StaffBranchListGrid  input.chkbx');

            if ($(this).is(':checked')) {
                $('#StaffBranchListGrid #checkAll').attr('checked', 'checked');

                //.attr('checked', 'checked');
                list.each(function (index, value) {
                    $(this).attr('checked', 'checked');
                    $(this).trigger("change");
                });


            }
            else {
                $('#StaffBranchListGrid #checkAll').removeAttr('checked');
                list.each(function (index, value) {
                    $(this).removeAttr('checked');
                    $(this).trigger("change");
                });


                //  $('#StaffBranchListGrid  input.chkbx').removeAttr('checked');
            }
            grid.dataSource.pageSize(oldPageSize);
            grid.dataSource.page(currentPage);
        });

    },
    AssignStaffBranchToAllocationBase: function () {
        debugger;


        var gridData = $("#StaffBranchListGrid").data("kendoGrid").dataSource.data();

        selectedStaffBranchIds = [];
        gridData.forEach(function (dataItem) {

            if (true === dataItem.HasStaffBranch) {

                selectedStaffBranchIds.push(parseInt(dataItem.StaffBranchId));
            }
        })
        // selectedStaffBranchIds = JSON.stringify(selectedStaffBranchIds);

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
                url: '/StaffBranchAllocationBase/SetStaffBranchToAllocationBase',
                dataType: 'json',

                data: {
                    /*'YearId': $("#YearId").val(),*/
                  //'FiscalYearId': document.getElementById('FiscalYearId').value,
                    'AllocationBaseId': document.getElementById('AllocationBaseId').value,
                    
                    'StaffBranchIds': selectedStaffBranchIds,
                    __RequestVerificationToken: token
                },
                success: function (response) {
                    var messageClass = '';
                    if (response.Status == true) {

                        toastr.success(response.Message, "تخصیص ", option);
                       /* StaffBranchList.GetStaffBranch();*/
                        var StaffBranchListGrid = $("#StaffBranchListGrid").data("kendoGrid");
                        StaffBranchListGrid.clearSelection();
                        StaffBranchListGrid.dataSource.read();
                       /* StaffBranchListGrid.refresh();*/


                    }
                    else {
                        toastr.error(response.Message, " تخصیص  ", option);
                    }



                },
                error: function () {

                    toastr.error('بروز خطا در برقراری ارتباط', "تخصیص ", option);
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
StaffBranchList.init();

