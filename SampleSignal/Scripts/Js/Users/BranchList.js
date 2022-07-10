var databoundCheck = true;
var BranchList = {
    init: function () {
        debugger
        BranchList.GetBranches();
        $('#AssignBranchToUser').on('click',
            function () {
                BranchList.AssignBranchToUser();
            });
    },
    //GetBranches: function (e) {
    //    e.preventDefault();

    //},

    GetBranches: function () {
        debugger;


        $('#BoxBranch').removeClass('displayNone').addClass('displayShow');

        //var crudServiceBaseUrl = "/FiscalYearBranchProcess",
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Users/GetBranchList?UserId=" + document.getElementById('UserId').value,
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
                        BranchTitle : { type: "string", editable: false },
                        Code : { type: "string", editable: false },
                        HasBranch : { type: "boolean", editable: false },
                    }
                }
            },
            pageSize: 10
        });
        record = 0;
        $("#UserBranchGrid").kendoGrid({
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
                    field: "HasBranch",
                    title: "<input id='checkAll' type='checkbox'  />",

                    template: '<input type="checkbox" #= HasBranch ? \'checked="checked"\' : "" # class="chkbx" />',
                    width: 110,
                    editable: function (e) { return false; }
                },
                {
                    title: "ردیف",
                    template: "#= ++record #",
                    width: 50
                },

                { field: "BranchTitle", title: "نام" },
               


            ],
            editable: true,
            dataBinding: function () {
                //debugger;
                //var c = $('#UserBranchGrid  input.chkbx').length;
                //var ccheck = $('#UserBranchGrid  input.chkbx[checked]').length;

                //if (c === ccheck && ccheck>0) {

                //    $('#UserBranchGrid #checkAll').attr('checked', 'checked');
                //}
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
            dataBound: function (e) {
                debugger;
                if (databoundCheck == true) {
                    dataItems = e.sender.dataSource.data();
                    var checkall = true;
                    var i;
                    for (i = 0; i < dataItems.length; i++) {
                        if (dataItems[i].HasBranch == false) {
                            checkall = false;
                            $('#UserBranchGrid #checkAll').prop('checked', false);
                            break;
                        }

                        if (checkall == true)
                        {
                            $('#UserBranchGrid #checkAll').prop('checked', true);
                        }
                    }
                    databoundCheck = false;
                }

            }


        });

        $("#UserBranchGrid .k-grid-content").on("change", "input.chkbx", function (e) {
            debugger;
            var grid = $("#UserBranchGrid").data("kendoGrid"),
                dataItem = grid.dataItem($(e.target).closest("tr"));
            $(e.target).closest("td").prepend("<span class='k-dirty'></span>");
            dataItem.HasBranch = this.checked;
            dataItem.dirty = true;
            if ($(this).is(':checked')) {
                $(this).attr('checked', 'checked');
            }
            else {
                $(this).removeAttr('checked');
            }
        })


        $("#UserBranchGrid .k-grid-content").on("click", "input.chkbx", function (e) {
            debugger;
            var grid = $("#UserBranchGrid").data("kendoGrid"),
                dataItem = grid.dataItem($(e.target).closest("tr"));
            $(e.target).closest("td").prepend("<span class='k-dirty'></span>");
            dataItem.HasBranch = this.checked;
            dataItem.dirty = true;
            if ($(this).is(':checked')) {
                $(this).attr('checked', 'checked');
            }
            else {
                $(this).removeAttr('checked');
            }
            var grid = $("#UserBranchGrid").data("kendoGrid");

            oldPageSize = grid.dataSource.pageSize();
            var currentPage = grid.dataSource.page();
            grid.dataSource.pageSize(grid.dataSource.data().length);
            var c = $('#UserBranchGrid  input.chkbx').length;
            var ccheck = $('#UserBranchGrid  input.chkbx[checked]').length;

            if (c === ccheck) {

                $('#UserBranchGrid #checkAll').prop('checked', true);
            }
            else {
                $('#UserBranchGrid #checkAll').prop('checked', false);
            }
            grid.dataSource.pageSize(oldPageSize);
            grid.dataSource.page(currentPage);
        });
        $('#UserBranchGrid #checkAll').click(function () {
            debugger;
            var grid = $("#UserBranchGrid").data("kendoGrid");

            oldPageSize = grid.dataSource.pageSize();
            var currentPage = grid.dataSource.page();
            grid.dataSource.pageSize(grid.dataSource.data().length);


            var list = $('#UserBranchGrid  input.chkbx');

            if ($(this).is(':checked')) {
                $('#UserBranchGrid #checkAll').prop('checked', true)

                //.attr('checked', 'checked');
                list.each(function (index, value) {
                    $(this).prop('checked', true)
                    $(this).trigger("change");
                });


            }
            else {
                $('#UserBranchGrid #checkAll').prop('checked', false)
                list.each(function (index, value) {
                    $(this).prop('checked', false)
                    $(this).trigger("change");
                });


                //  $('#UserBranchGrid  input.chkbx').removeAttr('checked');
            }
            grid.dataSource.pageSize(oldPageSize);
            grid.dataSource.page(currentPage);
        });

    },
    AssignBranchToUser: function () {
        debugger;


        //var selectedIds = $("#UserBranchGrid").data("kendoGrid").selectedKeyNames();
        //selectedBranchIds = [];
        //for (i = 0; i < selectedIds.length; i++) {

        //    selectedBranchIds.push(parseInt(selectedIds[i]));
        //}


        var gridData = $("#UserBranchGrid").data("kendoGrid").dataSource.data();

        selectedBranchIds = [];
        gridData.forEach(function (dataItem) {

            if (true === dataItem.HasBranch) {

                selectedBranchIds.push(parseInt(dataItem.BranchId));
            }
        })
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
                url: '/Users/SetBranchToUser',
                dataType: 'json',

                data: {
                    'UserId': document.getElementById('UserId').value,
                    'BranchIds': selectedBranchIds,
                    __RequestVerificationToken : token
                },
                success: function (response) {
                    var messageClass = '';
                    if (response.Status == true) {

                        toastr.success(response.Message, "شعبه ", option);

                        var UserBranchGrid = $("#UserBranchGrid").data("kendoGrid");
                        UserBranchGrid.clearSelection();
                        UserBranchGrid.dataSource.read();
                        UserBranchGrid.refresh();


                    }
                    else {
                        toastr.error(response.Message, " شعبه  ", option);
                    }



                },
                error: function () {

                    toastr.error('بروز خطا در برقراری ارتباط', "نقش ", option);
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
BranchList.init();

