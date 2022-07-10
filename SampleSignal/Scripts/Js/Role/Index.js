var idState, branchName, provinceName, cityName, notificationType, nitificationMessage, record;
var RoleList = {
    init: function () {
        RoleList.GetRoleList();
    },
    GetRoleList: function () {
        var crudServiceBaseUrl = "/Role",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetList",
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
                        id: "RoleId ",
                        fields: {
                            Title: { type: "string", validation: { required: true } },
                            PersianTitle: { type: "string", validation: { required: true } },
                           
                          

                        }
                    },
                },
                pageSize: 10
            });
        record = 0;
        $("#RoleGrid").kendoGrid({
            toolbar: ["create"],
      
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
               
                { field: "Title", title: "نام انگلیسی" },
                { field: "PersianTitle", title: "نام فارسی", },
             
               
                {
                    command: [
                        {
                            name: "customEdit",
                            text: 'ویرایش',
                            iconClass: "k-icon k-i-edit",
                            click: editUser
                        },
                     
                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deleteUser
                        },


                        {
                            name: "PermissionAssigned",
                            text: ' دسترسی',

                            click: SetPermissionAssigned
                        },
                    ],
                    title: "عملیات",
                    width: 300
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

        //ویرایش رکورد گرید
        function editUser(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItemRole = this.dataItem($(e.currentTarget).closest("tr"));
            var RoleId = dataItemRole.RoleId;
            var MenuId = 'Role';
            var TabUrl = '/Role/Edit?RoleId=' + RoleId;
            var TabScriptAddress = '/Scripts/Js/Role/Edit.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }

        //اتصال دسترسی ها 
        function SetPermissionAssigned(e) {

            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItemRole = this.dataItem($(e.currentTarget).closest("tr"));
            var RoleId = dataItemRole.RoleId;
            var MenuId = 'Role';
            var TabUrl = '/Role/Permissions?RoleId=' + RoleId + '&PersianTitle=' + dataItemRole.PersianTitle;
            var TabScriptAddress = '/Scripts/Js/Role/PermissionList.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            //e.preventDefault();


            //var dataItemProcess = this.dataItem($(e.currentTarget).closest("tr"));
            //$("#ProcessActivityAccountStructureId").val(dataItemProcess.RoleId)
            //RoleList.GetPermission( dataItemProcess.RoleId)

            //$('#HeadPermissionTitle').text("دسترسی ها  " + dataItemProcess.Title);
        }

       
        //حذف رکورد گرید
        function deleteUser(e) {
            debugger;
            e.preventDefault();
            var dataItemRole = this.dataItem($(e.currentTarget).closest("tr"));
            var RoleId = dataItemRole.RoleId;
            bootbox.confirm({
                title: "حذف اطلاعات!",
                message: "آیا از حذف رکورد مورد نظر اطمینان دارید؟",
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
                    var option = {
                        "timeOut": "0",
                        "closeButton": true,
                        "positionClass": "toast-bottom-full-width",
                        "timeOut": "4000",
                    }
                    if (result == true) {
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/Role/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'RoleId': RoleId,
                                    __RequestVerificationToken : token
                                },
                                success: function (response) {
                                    if (response.Status) {
                                        toastr.success(response.Message, " نقش  ", option);
                                        RoleList.GetRoleList();
                                    }
                                    else

                                        toastr.error(response.Message, "نقش", option);
                                },
                                error: function () {
                                    toastr.error('بروز خطا در برقراری ارتباط', "نقش", option);
                                 
                                },
                            });
                    }
                }
            }).find('.modal-content').css({
                'margin-top': function() {
                    var w = $('.content').height();
                    var b = $(".modal-dialog").height();
                    var h = (w - b) / 2;
                    return h + "px";
                }
            });
        }
        // افزودن رکورد جدید
        $('#tabview_Role').find(".k-grid-add").on("click",
            function (e) {
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'Role';
                var TabUrl = '/Role/Create';
                var TabScriptAddress = '/Scripts/Js/Role/Create.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });
    },

    //GetPermission: function (RoleId) {
    //    $('#BoxPermission').removeClass('displayNone').addClass('displayShow');
    //    $("#PermissionListGrid").empty();
    //    //var crudServiceBaseUrl = "/FiscalYearBranchProcess",
    //        dataSource = new kendo.data.DataSource({
    //            transport: {
    //                read: {
    //                    url: "/Role?RoleId=" + RoleId,
    //                    dataType: "jsonp"
    //                },

    //                parameterMap: function (options, operation) {
    //                    if (operation !== "read" && options.models) {

    //                        return { models: options.models };
    //                    }
    //                }
    //            },

    //            batch: true,
    //            schema: {
    //                model: {
    //                    id: "RoleId",
    //                    fields: {
    //                        Title: { type: "string", editable: false },
    //                        PersianTitle: { type: "string", editable: false },

    //                    }
    //                }
    //            },
    //            pageSize: 10
    //        });
    //    record = 0;
    //    $("#PermissionListGrid").kendoGrid({
    //        dataSource: dataSource,
    //        sortable: true,
    //        batch: true,
    //        resizable: true,
    //        round: false,
    //        columnMenu: false,
    //        persistSelection: true,
    //        navigatable: true,
    //        pageable: {
    //            refresh: true,
    //            pageSizes: true,
    //            serverPaging: true,
    //            serverFiltering: true,

    //        },
    //        filterable: {
    //            mode: "row"
    //        },



    //        columns: [
    //            { selectable: true, width: "50px" },
    //            {
    //                title: "ردیف",
    //                template: "#= ++record #",
    //                width: 50
    //            },

    //            { field: "Title", title: "نام انگلیسی" },
    //            { field: "PersianTitle", title: "نام فارسی", },
    //            /*     { field: "IsAssigned", title: " IsAssigned" },*/

    //        ],
    //        editable: true,
    //        dataBinding: function () {
    //            if (this.dataSource.pageSize() != undefined) {
    //                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
    //            } else {
    //                record = 0;
    //            }
    //        },
    //        //dataBound: function (e) {
    //        //    var grid = $("#PermissionListGrid").getKendoGrid();

    //        //    dataItems = e.sender.dataSource.view();
    //        //    debugger
    //        //    for (var i = 0; i < dataItems.length; i++) {
    //        //        var IsAssigned = dataItems[i].get("IsAssigned");
    //        //        if (IsAssigned == 1) {
    //        //            debugger
    //        //            var row = this.tbody.find("[data-uid='" + dataItems[i].uid + "']");


    //        //            grid.select(row)


    //        //        }
    //        //    }
    //        //}
    //    });


    //},
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
RoleList.init();
