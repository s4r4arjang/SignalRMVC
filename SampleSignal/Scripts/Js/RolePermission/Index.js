//var record;
//var source = document.getElementById("FacialYearTemplate").innerHTML;
//var template = Handlebars.compile(source);

var Permission = {
    init: function () {
        Permission.GetPermissionList();   
      
      
    },
    GetPermissionList: function () {
        var crudServiceBaseUrl = "/Permission",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetPermissionList",
                        dataType: "jsonp"
                    },
                    update: {
                        url: crudServiceBaseUrl + "/Update",
                        dataType: "jsonp"
                    },
                    destroy: {
                        url: crudServiceBaseUrl + "/Delete",
                        dataType: "jsonp",
                        function(e) {
                            e.error();
                        }
                    },
                    create: {
                        url: crudServiceBaseUrl + "/Create",
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
                        id: "Id",
                        fields: {
                           
                            PermissionType: { type: "string", validation: { required: true } },
                            PermissionCode: { type: "string", validation: { required: true } },
                           
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#PermissionListGrid").kendoGrid({
            toolbar: ["create", "excel"],
            excel: {
                fileName: "لیست حقوق دسترسی.xlsx",
                proxyURL: "",
                filterable: true
            },
            dataSource: dataSource,
            sortable: true,
            resizable: false,
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
                //{ field: "Title", title: "عنوان" },
                  { field: "PermissionType", title: "نوع حقوق دسترسی" },
                    { field: "PermissionCode", title: "حق دسترسی" },
                     
                {
                    command: [ {
                            name: "customEdit",
                            text: 'ویرایش',
                            iconClass: "k-icon k-i-edit",
                            click: editPermission
                        } ,
                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deletePermission
                        }
                       
                    ],
                    title: "عملیات"
                }
            ],
            editable: "popup",
            edit: function (event) {
                event.container.find(".k-edit-label:first").hide();
                event.container.find(".k-edit-field:first").hide();
                event.container.parent().find('.k-window-title').text(event.model.isNew() ? "ایجاد" : "ویرایش");
            },
            cancel: function (e) {
                $('#PermissionListGrid').data("kendoGrid").cancelChanges(); 
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });
           //ویرایش رکورد گرید
        function editPermission(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItemPermission = this.dataItem($(e.currentTarget).closest("tr"));
            var PermissionId = dataItemPermission.Id;
            var MenuId = 'PermissionList';
            var TabUrl = '/Permission/Update?id=' + PermissionId;
            var TabScriptAddress = '/Scripts/Js/Permission/Update.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
         // افزودن رکورد جدید
        $('#tabview_PermissionList').find(".k-grid-add").on("click",
            function (e) {
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'PermissionList';
                var TabUrl = '/Permission/Create';
                var TabScriptAddress = '/Scripts/Js/Permission/Create.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });
        //حذف رکورد گرید
        function deletePermission(e) {
            e.preventDefault();
            var dataItemProcess = this.dataItem($(e.currentTarget).closest("tr"));
            var processId = dataItemProcess.Id;
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
                    if (result == true) {
                        $.ajax(
                            {
                                type: 'Post',
                                url: '/Permission/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': processId
                                },
                                success: function (response) {
                                    var messageClass = '';
                                    if (response.Status == true) {
                                        messageClass = 'success';
                                        $('#PermissionListGrid').data('kendoGrid').dataSource.read();
                                        $('#PermissionListGrid').data('kendoGrid').refresh();
                                    }
                                    else {
                                        messageClass = 'danger';
                                    }
                                    $('#messageProcessList').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                                        '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                        '<strong>' +
                                        response.Message +
                                        '</strong>' +
                                        '</div>').delay(5000).fadeOut(800);
                                    var offset = -270;
                                  
                                },
                                error: function () {
                                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                                    Process.Error(errorMessage);
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
      
    }
   
}

Permission.init();