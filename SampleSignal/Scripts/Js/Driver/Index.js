
var DriverList = {
    init: function () {
        DriverList.GetDriverList();
    },
    GetDriverList: function () {
        
        var crudServiceBaseUrl = "/Driver",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/DriverList",
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
                        id: "DriverId",
                        fields: {
                            Title : { type: "string", validation: { required: true } },
                            UnitType: {type: "string" ,validation: { required: true } },
                            

                        }
                    },
                },
                pageSize: 10
            });
        record = 0;
        $("#DriverGrid").kendoGrid({
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
               
                { field: "Title", title: "عنوان محرک" },
                {
                    field: "UnitType", title: "نوع محرک", filterable: false, template: function (dataItem) {
                        return dataItem.UnitType === "1"
                            ? "محرک هزینه" : "<span>محرک فعالیت</span>";
                    }
                },
             
               
                {
                    command: [
                        {
                            name: "customEdit",
                            text: 'ویرایش',
                            iconClass: "k-icon k-i-edit",
                            click: editDriver
                        },
                     
                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deleteDriver
                        },

                    ],
                    title: "عملیات",
                    width: 300
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
        function editDriver(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItemDriver = this.dataItem($(e.currentTarget).closest("tr"));
            debugger;
            var DriverId = dataItemDriver.DriverId;
            var MenuId = 'Driver';
            var TabUrl = '/Driver/Edit/' + DriverId;
            var TabScriptAddress = '/Scripts/Js/Driver/Edit.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        //حذف رکورد گرید
        function deleteDriver(e) {
            
            e.preventDefault();
            var dataItemDriver = this.dataItem($(e.currentTarget).closest("tr"));
            var DriverId = dataItemDriver.DriverId;
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
                    if (result == true) {
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/Driver/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'Id': DriverId,
                                    __RequestVerificationToken: token
                                },
                                success: function (response) {
                                    debugger;
                                    if (response.Status) {
                                        AllertSuccess(response.Message, "محرک");
                                        //DriverList.GetDriverList();
                                        var grid = $("#DriverGrid").data("kendoGrid");
                                        grid.dataSource.read();
                                        grid.refresh();

                                    }
                                    else {
                                        AllertError(response.Message, "محرک");
                                        
                                    }
                                },
                                error: function () {
                                    AllertError('امکان حذف وجود ندارد', "محرک");
                                 
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
        $('#tabview_Driver').find(".k-grid-add").on("click",
            function (e) {
                debugger;
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'Driver';
                var TabUrl = '/Driver/Create';
                var TabScriptAddress = '/Scripts/Js/Driver/Create.js';
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
DriverList.init();