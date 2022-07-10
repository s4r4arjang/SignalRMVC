
var Userlist = {
    init: function () {
        Userlist.GetUserlist();
    },
    GetUserlist: function () {
        var crudServiceBaseUrl = "/Users",
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
                    } ,
                    
                },
                batch: true,
                schema: {
                    model: {
                        id: "UserId ",
                        fields: {
                            FullName: { type: "string", validation: { required: true } },
                            UserName: { type: "string", validation: { required: true } },
                            IsActive: { type: "boolean", validation: { required: true } },
                          

                        }
                    },
                },
                pageSize: 10
            });
        record = 0;
        $("#UserGrid").kendoGrid({
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
               
                { field: "FullName", title: "نام " },
                { field: "UserName", title: "نام کاربری", },
                { field: "IsActive", title: "فعال", template: function (dataItem) { return dataItem.IsActive ? "<i class='fas fa-check'></i>" : "<span>غیر فعال</span>"; } },
               
                {
                    command: [
                        {
                            name: "customEdit",
                            text: 'ویرایش',
                            iconClass: "k-icon k-i-edit",
                            click: editUser
                        },
                     
                       
                        {

                            name: "customDeActive",
                            text: '<span > <i class="fa fa-ban" aria-hidden="true"></i> غیرفعال </span>',

                            click: DeActiveUser
                        },
                        {
                            name: "customActive",
                            text: 'فعال',
                           click: ActiveUser
                        },

                        {
                            name: "customRole",
                            text: 'نقش',
                            click: ShowRoles
                        },

                        {
                            name: "customChangePassword",
                            text: 'تغییر پسورد',
                            click: ChangePassword
                        },

                        {
                            name: "customBranch",
                            text: 'شعبه',
                            click: AddBranch
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
            dataBound: function (e) {
                debugger;
                dataItems = e.sender.dataSource.view();
                for (var i = 0; i < dataItems.length; i++) {
                    debugger;
                    var isactive = dataItems[i].get("IsActive");
                    var row = this.tbody.find("[data-uid='" + dataItems[i].uid + "']");
                    if (isactive === false) {


                        $(row).find(".k-grid-customDeActive").css('display', 'none');;
                        $(row).find(".k-grid-customEdit").css('display', 'none');;
                        
                        $(row).find(".k-grid-customRole").css('display', 'none');;
                        $(row).find(".k-grid-customActive").css('display', 'show');;

                        $(row).find(".k-grid-customChangePassword").css('display', 'none');;
                        $(row).find(".k-grid-customBranch").css('display', 'none');;


                    }
                    else {
                        $(row).find(".k-grid-customActive").css('display', 'none');;
                    }
                }


            }
        });

        //اتصال دسترسی ها 
        function SetPermissionAssigned(e) {

            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItemUser = this.dataItem($(e.currentTarget).closest("tr"));
            var UserId = dataItemUser.UserId;
            var MenuId = 'Users';
            var TabUrl = '/Users/UserPermission?UserId=' + UserId + '&PersianTitle=' + dataItemUser.FullName;
            var TabScriptAddress = '/Scripts/Js/Users/UserPermissionList.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            //e.preventDefault();


            //var dataItemProcess = this.dataItem($(e.currentTarget).closest("tr"));
            //$("#ProcessActivityAccountStructureId").val(dataItemProcess.RoleId)
            //RoleList.GetPermission( dataItemProcess.RoleId)

            //$('#HeadPermissionTitle').text("دسترسی ها  " + dataItemProcess.Title);
        }
    //نمایش نقش های کاربر
        function ShowRoles(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var UserId = dataItem.UserId;
            var MenuId = 'Users';
            var TabUrl = '/Users/Roles?UserId=' + UserId + '&RoleTitle=' + "نقش های کاربر";
            var TabScriptAddress = '/Scripts/Js/Users/RoleList.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        //ویرایش رکورد گرید
        function editUser(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var UserId = dataItem.UserId;
            var MenuId = 'Users';
            var TabUrl = '/Users/Edit/' + UserId;
            var TabScriptAddress = '/Scripts/Js/Users/Edit.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        //تغییر پسورد
        function ChangePassword(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var userId = dataItem.UserId;
            var MenuId = 'Users';
            var TabUrl = '/Users/ChangePassword/' + userId;
            var TabScriptAddress = '/Scripts/Js/Users/ChangePassword.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }

        //اضافه کردن شعبه به کاربر
        function AddBranch(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var UserId = dataItem.UserId;
            var MenuId = 'Users';
            var TabUrl = '/Users/Branches?UserId=' + UserId + '&BranchTitle=' + "شعبه";
            var TabScriptAddress = '/Scripts/Js/Users/BranchList.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
  
        //غیرفعال رکورد گرید
        function DeActiveUser(e) {
            debugger;
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var UserId = dataItem.UserId;
            bootbox.confirm({
                title: "مدیریت کاربران",
                message: "آیا از غیر فعال کردن کاربر مورد نظر اطمینان دارید؟",
                buttons: {
                    cancel: {
                        className: 'btn-information',
                        label: '<i class="fa fa-times"></i> انصراف'
                    },
                    confirm: {
                        className: 'btn-customDelete',
                        label: '<i class="fa fa-check"></i> غیرفعال'
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
                        var token = $('input[name="__RequestVerificationToken"]',form).val();
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/Users/DeActive',
                                dataType: 'json',
                                async: false,
                                data:  {
                                    __RequestVerificationToken: token,
                                    Id: UserId
                                },
                                //data: {
                                //    'UserId': UserId
                                //},
                                success: function (response) {
                                    if (response.Status) {
                                        toastr.success(response.Message, " کاربر  ", option);
                                        var grid = $("#UserGrid").data("kendoGrid");
                                        grid.dataSource.read();
                                        grid.refresh();
                                    }
                                    else {
                                        toastr.error(response.Message, "کاربر", option);
                                    }
                                    var grid = $("#UserGrid").data("kendoGrid");
                                    grid.dataSource.read();

                                },


                                error: function () {
                                    toastr.error('بروز خطا در برقراری ارتباط', "کاربر", option);
                                 
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
        function ActiveUser(e) {
            debugger;
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var UserId = dataItem.UserId;
            bootbox.confirm({
                title: "مدیریت کاربران",
                message: "آیا از  فعال کردن کاربر مورد نظر اطمینان دارید؟",
                buttons: {
                    cancel: {
                        className: 'btn-information',
                        label: '<i class="fa fa-times"></i> انصراف'
                    },
                    confirm: {
                       /* 'btn-customsuccess'*/
                        className: 'btn-success',
                        label: '<i class="fa fa-check"></i> فعال'
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
                        debugger
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/Users/Active',
                                dataType: 'json',
                                async: false,
                                data: {
                                    __RequestVerificationToken: token,
                                    Id: UserId
                                },
                                success: function (response) {
                                    if (response.Status) {
                                        toastr.success(response.Message, " کاربر  ", option);
                                        var grid = $("#UserGrid").data("kendoGrid");
                                        grid.dataSource.read();
                                        grid.refresh();
                                    }
                                    else {
                                        toastr.error(response.Message, "کاربر", option);
                                    }
                                    var grid = $("#UserGrid").data("kendoGrid");
                                    grid.dataSource.read();
                                },
                                error: function () {
                                    toastr.error('بروز خطا در برقراری ارتباط', "کاربر", option);

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
        // افزودن رکورد جدید
        $('#tabview_Users').find(".k-grid-add").on("click",
            function (e) {
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'Users';
                var TabUrl = '/Users/Create';
                var TabScriptAddress = '/Scripts/Js/Users/Create.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
Userlist.init();
