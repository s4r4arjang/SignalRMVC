var databoundCheck = true;
var RolesList = {
    init: function () {
        debugger
        RolesList.GetRoles();
        $('#AssignRoleToUser').on('click',
            function () {
                RolesList.AssignRoleToUser();
            });
    },
    //GetRoles: function (e) {
    //    e.preventDefault();

    //},

    GetRoles: function () {
        debugger;


        $('#BoxRole').removeClass('displayNone').addClass('displayShow');

        //var crudServiceBaseUrl = "/FiscalYearBranchProcess",
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/Users/GetRolesList?UserId=" + document.getElementById('UserId').value,
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
                    id: "RoleId",
                    fields: {
                        PersianTitle: { type: "string", editable: false },
                        Title: { type: "string", editable: false },
                       /* HasRole: { type: "boolean", editable: false },*/
                    }
                }
            },
            pageSize: 10
        });
        record = 0;
        $("#RoleListGrid").kendoGrid({
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
                    field: "HasRole",
                    title: "<input id='checkAll' type='checkbox'  />",

                    template: '<input type="checkbox" #= HasRole ? \'checked="checked"\' : "" # class="chkbx" />',
                    width: 110,
                    editable: function (e) { return false; }
                },
                {
                    title: "ردیف",
                    template: "#= ++record #",
                    width: 50
                },

                { field: "PersianTitle", title: "نام" },
                //   { field: "HasRole", title: "وجود دسترسی", },


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
                debugger;
                if (databoundCheck == true) {
                    dataItems = e.sender.dataSource.data();
                    var i;
                    var checkall = true;
                    for (i = 0; i < dataItems.length; i++)
                    {
                        if (dataItems[i].HasRole == false)
                        {
                            checkall = false;
                            $('#RoleListGrid #checkAll').prop('checked', false);
                            break;
                        }


                    }
                    if (checkall == true) {
                        $('#RoleListGrid #checkAll').prop('checked', true);
                    }
                    databoundCheck = false;
                }

            }


        });

        $("#RoleListGrid .k-grid-content").on("change", "input.chkbx", function (e) {
            var grid = $("#RoleListGrid").data("kendoGrid"),
                dataItem = grid.dataItem($(e.target).closest("tr"));
            $(e.target).closest("td").prepend("<span class='k-dirty'></span>");
            dataItem.HasRole = this.checked;
            dataItem.dirty = true;
            if ($(this).is(':checked')) {
                $(this).attr('checked', 'checked');
            }
            else {
                $(this).removeAttr('checked');
            }
        })


        $("#RoleListGrid .k-grid-content").on("click", "input.chkbx", function (e) {
            debugger;
            var grid = $("#RoleListGrid").data("kendoGrid"),
                dataItem = grid.dataItem($(e.target).closest("tr"));
            $(e.target).closest("td").prepend("<span class='k-dirty'></span>");
            dataItem.HasRole = this.checked;
            dataItem.dirty = true;
            if ($(this).is(':checked')) {
                $(this).attr('checked', 'checked');
            }
            else {
                $(this).removeAttr('checked');
            }
            var grid = $("#RoleListGrid").data("kendoGrid");

            oldPageSize = grid.dataSource.pageSize();
            var currentPage = grid.dataSource.page();
            grid.dataSource.pageSize(grid.dataSource.data().length);
            var c = $('#RoleListGrid  input.chkbx').length;
            var ccheck = $('#RoleListGrid  input.chkbx[checked]').length;

            if (c === ccheck) {

                $('#RoleListGrid #checkAll').prop('checked', true);
            }
            else {
                $('#RoleListGrid #checkAll').prop('checked', false);
            }
            grid.dataSource.pageSize(oldPageSize);
            grid.dataSource.page(currentPage);
        });
        $('#RoleListGrid #checkAll').click(function () {
            debugger;
            var grid = $("#RoleListGrid").data("kendoGrid");

            oldPageSize = grid.dataSource.pageSize();
            var currentPage = grid.dataSource.page();
            grid.dataSource.pageSize(grid.dataSource.data().length);


            var list = $('#RoleListGrid  input.chkbx');

            if ($(this).is(':checked')) {
                $('#RoleListGrid #checkAll').attr('checked', 'checked');

                //.attr('checked', 'checked');
                list.each(function (index, value) {
                    $(this).attr('checked', 'checked');
                    $(this).trigger("change");
                });


            }
            else {
                $('#RoleListGrid #checkAll').removeAttr('checked');
                list.each(function (index, value) {
                    $(this).removeAttr('checked');
                    $(this).trigger("change");
                });


                //  $('#PermissionListGrid  input.chkbx').removeAttr('checked');
            }
            grid.dataSource.pageSize(oldPageSize);
            grid.dataSource.page(currentPage);
        });

    },
    AssignRoleToUser: function () {
        debugger;

        var gridData = $("#RoleListGrid").data("kendoGrid").dataSource.data();

        selectedRolesIds = [];
        gridData.forEach(function (dataItem) {

            if (true === dataItem.HasRole) {

                selectedRolesIds.push(parseInt(dataItem.RoleId));
            }
        })
        // selectedRolesIds = JSON.stringify(selectedRolesIds);

        var option = {
            "timeOut": "0",
            "closeButton": true,
            "positionClass": "toast-bottom-full-width",
            "timeOut": "4000",
        }

        //var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]').val();

        $.ajax(
            {
                type: 'Post',
                url: '/Users/SetRoleToUser',
                dataType: 'json',

                data: {
                    /*'YearId': $("#YearId").val(),*/
                    'UserId': document.getElementById('UserId').value,
                    'Roles': selectedRolesIds,
                    __RequestVerificationToken: token,
                },
                success: function (response) {
                    var messageClass = '';
                    if (response.Status == true) {

                        toastr.success(response.Message, "دسترسی ", option);

                        var RoleListGrid = $("#RoleListGrid").data("kendoGrid");
                        RoleListGrid.clearSelection();
                        RoleListGrid.dataSource.read();
                        RoleListGrid.refresh();


                    }
                    else {
                        toastr.error(response.Message, " نقش  ", option);
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
RolesList.init();

