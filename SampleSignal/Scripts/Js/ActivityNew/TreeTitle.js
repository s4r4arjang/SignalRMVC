var activitySourceId = '', record;
var ActivityTreeTitle = {
    init: function () {
        ActivityTreeTitle.GetAllActivityTreeTitle();
    },
    GetAllActivityTreeTitle: function () {
        var crudServiceBaseUrl = "/Activity",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetAllActivityTreeTitle",
                        dataType: "jsonp",
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
                        id: "ActivityTreeTitleId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },
                          
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        
        $("#activityTreeTitleGrid").kendoGrid({
            toolbar: ["create", "excel"],
            excel: {
                fileName: "لیست عناوین کدینگ فعالیت.xlsx",
                proxyURL: "",
                filterable: true
            },
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
                { field: "Title", title: "عنوان" },
            
                {
                    command: [
                        
                        {
                            name: "customEdit",
                            text: 'ویرایش',
                            iconClass: "k-icon k-i-edit",
                            click: editActivityStructure
                        },
                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deleteActivityStructure
                        },
                    ],
                    title: "عملیات",
                    width: 350
                },
            {
                command: [
                    { name: "StructureThird", text: "<span class='customIcon text-blue iconStructure'>ساختار</span>", click: getActivityStructure },
                
            ],
            title: "ساختار",
            width: 250
        }
            ],

            editable: "popup",
            dataBinding: function () {
                if (this.dataSource.pageSize() !== undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });
        
        //ویرایش رکورد گرید
        function editActivityStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItemActivityTreeTitle = this.dataItem($(event.currentTarget).closest("tr"));
            var ActivityTreeTitleId = dataItemActivityTreeTitle.ActivityTreeTitleId;
            var MenuId = 'ActivityNew';
            var TabUrl = '/ActivityNew/EditTreeTitle?id=' + ActivityTreeTitleId;
            var TabScriptAddress = '/Scripts/Js/ActivityNew/EditTreeTitle.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        // افزودن رکورد جدید
        $('#tabview_ActivityNew').find(".k-grid-add").on("click",
            function (event) {
                event.preventDefault();
                event.stopPropagation();
                var MenuId = 'ActivityNew';
                var TabUrl = '/ActivityNew/CreateTreeTitle';
                var TabScriptAddress = '/Scripts/Js/ActivityNew/CreateTreeTitle.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });
        //حذف رکورد گرید
        function deleteActivityStructure(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var ActivityTreeTitleId = dataItem.ActivityTreeTitleId;
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
                    debugger;
                    if (result === true) {
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/ActivityNew/DeleteTreeTitle',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': ActivityTreeTitleId,
                                    __RequestVerificationToken: token
                                },
                                success: function (response) {
                                    debugger;
                                    if (response.Status) {
                                        AllertSuccess(response.Message, "کدینگ فعالیت");
                                        //DriverList.GetDriverList();
                                        var grid = $("#activityTreeTitleGrid").data("kendoGrid");
                                        grid.dataSource.read();
                                        grid.refresh();

                                    }
                                    else {
                                        AllertError(response.Message, "کدینگ فعالیت");

                                    }
                                },
                                error: function () {
                                    AllertError('امکان حذف وجود ندارد', "کدینگ فعالیت");

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
        //مشاهده ساختار
        function getActivityStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            var ActivityTreeTitleId = dataItem.ActivityTreeTitleId;
            var MenuId = 'ActivityNew';
            var TabUrl = '/ActivityNew/ActivityStructure?id=' + ActivityTreeTitleId + " &Title=" + dataItem.Title;
            var TabScriptAddress = '/Scripts/Js/ActivityNew/ActivityStructure.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);

        }
       
        
    },
   
}
ActivityTreeTitle.init();