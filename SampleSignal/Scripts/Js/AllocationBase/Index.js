
var AllocationBaseList = {
    init: function () {
        AllocationBaseList.GetAllocationBaseList();
    },
    GetAllocationBaseList: function () {
        debugger;
        var crudServiceBaseUrl = "/AllocationBase",
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
                        id: "AllocationBaseId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },



                        }
                    },
                },
                pageSize: 10
            });
        record = 0;
        $("#AllocationBaseGrid").kendoGrid({
            toolbar: ["create", "excel"],
            excel: {
                fileName: "لیست مبنا.xlsx",
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

                { field: "Title", title: "نام" },

                {
                    command: [
                        {
                            name: "customEdit",
                            text: 'ویرایش',
                            iconClass: "k-icon k-i-edit",
                            click: editAllocation
                        },

                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deleteAllocation
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

       // ویرایش رکورد گرید
        function editAllocation(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItemAllocation = this.dataItem($(e.currentTarget).closest("tr"));
            var AllocationBaseId = dataItemAllocation.AllocationBaseId;
            var MenuId = 'AllocationBase';
            var TabUrl = '/AllocationBase/Edit?AllocationBaseId=' + AllocationBaseId;
            var TabScriptAddress = '/Scripts/Js/AllocationBase/Edit.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }

        //حذف رکورد گرید
        function deleteAllocation(e) {
            debugger;
            e.preventDefault();
            var dataItemAllocation = this.dataItem($(e.currentTarget).closest("tr"));
            var AllocationBaseId = dataItemAllocation.AllocationBaseId;
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
                                url: '/AllocationBase/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'AllocationBaseId': AllocationBaseId,
                                    __RequestVerificationToken: token
                                },
                                success: function (response) {
                                    if (response.Status) {
                                        toastr.success(response.Message, " تخصیص  ", option);
                                        AllocationBaseList.GetAllocationBaseList();
                                    }
                                    else

                                        toastr.error(response.Message, "تخصیص", option);
                                },
                                error: function () {
                                    toastr.error('بروز خطا در برقراری ارتباط', "تخصیص", option);

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
         //افزودن رکورد جدید
        $('#tabview_AllocationBase').find(".k-grid-add").on("click",
            function (e) {
                debugger;
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'AllocationBase';
                var TabUrl = '/AllocationBase/Create';
                var TabScriptAddress = '/Scripts/Js/AllocationBase/Create.js';
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
AllocationBaseList.init();
