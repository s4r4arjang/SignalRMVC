var record;
var StaffPart = {
    init: function () {
        StaffPart.GetStaffPart();
    },
    GetStaffPart: function () {
            var crudServiceBaseUrl = "/StaffPart",
                dataSource = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: crudServiceBaseUrl + "/GetList" ,
                            dataType: "json"
                        },
                        //update: {
                        //    url: crudServiceBaseUrl + "/Update",
                        //    dataType: "json",
                        //    type:"post"
                        //},
                        //create: {
                        //    url: crudServiceBaseUrl + "/Create",
                        //    dataType: "json",
                        //    type: "post",
                        //    //data: data: function() {
                        //    //    return kendo.antiForgeryTokens();
                        //    //}
                        //},

                        parameterMap: function (options, operation) {
                            if (operation !== "read" && operation !== "destroy" && options.models) {
                                return {
                                    model: options.models[0] 
                                };
                                
                            }
                            if (operation == "destroy") {

                                return {
                                    StaffPartId: options.models[0].StaffPartId
                                };
                            }
                        }
                    },
                    requestEnd: function (e) {
                        debugger;

                        if (e.type === "destroy") {
                            if (e.Status != undefined) {
                                if (e.Status) {
                                    AllertSuccess(e.Message, "دوایر");
                                 

                                }
                                else {
                                    AllertError(e.Message, "دوایر");
                                }

                                var grid = $("#StaffPartGrid").data("kendoGrid");
                                grid.dataSource.read();
                            }


                        }



                    },
                    batch: true,
                    schema: {
                        model: {
                            id: "StaffPartId",
                            fields: {
                                Title: { type: "string", validation: { required: true } },
                                 }
                        }
                    },
                    pageSize: 10
            });
            record = 0;
            $("#StaffPartGrid").kendoGrid({
                toolbar: ["create", "excel"],
                excel: {
                    fileName: "لیست دوایر.xlsx",
                    proxyURL: "",
                    filterable: true
                },
                dataSource: dataSource,
                sortable: true,
                resizable: true,
                onSave:onSave,
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
                    { field: "Title", title: "عنوان" },
                        {
                            command: [
                                {
                                    name: "edit",
                                    text: 'ویرایش',
                                    iconClass: "k-icon k-i-edit",
                                    click: editStaffPart
                                 
                                }
                                ,
                                {

                                    name: "customDeActive",
                                    text: '<span > <i class="fa fa-ban" aria-hidden="true"></i> غیرفعال </span>',

                                    click: DeActiveStaffPart

                                },
                                {
                                    name: "customActive",
                                    text: 'فعال',
                                    click: ActiveStaffPart

                                },
                                
                        ],
                        title: "عملیات"
                    }
                ],

                //editable: "popup",
                //edit: function (event) {
                //    event.container.find(".k-edit-label:first").hide();
                //    event.container.find(".k-edit-field:first").hide();
                //    event.container.parent().find('.k-window-title').text(event.model.isNew() ? "ایجاد" : "ویرایش");
                //},
                cancel: function (e) {
                    $('#StaffPartGrid').data("kendoGrid").cancelChanges();
                },
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
                            $(row).find(".k-grid-edit").css('display', 'none');;

                          
                            $(row).find(".k-grid-customActive").css('display', 'show');;

                         


                        }
                        else {
                            $(row).find(".k-grid-customActive").css('display', 'none');;
                        }
                    }


                }
        });
        
        function editStaffPart(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItemStaffPart = this.dataItem($(e.currentTarget).closest("tr"));
            debugger;
            var StaffPartId = dataItemStaffPart.StaffPartId;
            var MenuId = 'StaffPart';
            var TabUrl = '/StaffPart/Update/' + StaffPartId;
            var TabScriptAddress = '/Scripts/Js/StaffPart/Edit.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        function onSave(e) {
            
        }
        function ActiveStaffPart(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var StaffPartId = dataItem.StaffPartId;
            bootbox.confirm({
                title: "حذف اطلاعات!",
                message: "آیا از فعال کردن رکورد مورد نظر اطمینان دارید؟",
                className: 'rubberBand animated',
                buttons: {
                    cancel: {
                        className: 'btn-information',
                        label: '<i class="fa fa-times"></i> انصراف'
                    },
                    confirm: {
                        className: 'btn-success ',
                        label: '<i class="customActive fa fa-check"></i> فعال',
                        
                    }
                },
                callback: function (result) {
                    debugger

                    if (result == true) {

                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        $.ajax(
                            {
                                type: 'Post',
                                url: '/StaffPart/Active',
                                dataType: 'json',
                                async: false,
                                 data:  {
                                    __RequestVerificationToken: token,
                                     Id: StaffPartId
                                },
                                success: function (response) {

                                    if (response.Status === true) {
                                        AllertSuccess(response.Message, "دوایر ");

                                    }
                                    else {
                                        AllertSuccess(response.Message, " دوایر");
                                    }
                                    $('#StaffPartGrid').data('kendoGrid').dataSource.read();
                                    $('#StaffPartGrid').data('kendoGrid').refresh();
                                },
                                error: function () {

                                    AllertError("خطا در ثبت عملیات", " دوایر");
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
        //حذف رکورد گرید
        function DeActiveStaffPart(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var StaffPartId = dataItem.StaffPartId;
            bootbox.confirm({
                title: "حذف اطلاعات!",
                message: "آیا از حذف رکورد مورد نظر اطمینان دارید؟",
                className: 'rubberBand animated',
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
                    debugger

                    if (result == true) {

                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();

                        $.ajax(
                            {
                                type: 'Post',
                                url: '/StaffPart/DeActive',
                                dataType: 'json',
                                async: false,

                                data:  {
                                    __RequestVerificationToken: token,
                                    Id: StaffPartId
                                },
                                
                                success: function (response) {

                                    if (response.Status === true) {
                                        AllertSuccess(response.Message, "دوایر ");

                                    }
                                    else {
                                        AllertSuccess(response.Message, " دوایر");
                                    }
                                    $('#StaffPartGrid').data('kendoGrid').dataSource.read();
                                    $('#StaffPartGrid').data('kendoGrid').refresh();
                                },
                                error: function () {

                                    AllertError("خطا در ثبت عملیات", " دوایر");
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

        $('#tabview_StaffPart').find(".k-grid-add").on("click",
            function (e) {
                debugger;
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'StaffPart';
                var TabUrl = '/StaffPart/Create';
                var TabScriptAddress = '/Scripts/Js/StaffPart/Create.js';
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
StaffPart.init();