var record;
var ProcessTreeTitle = {
    init: function () {
        ProcessTreeTitle.GetAllProcessTreeTitle();
    },
    GetAllProcessTreeTitle: function () {
        var crudServiceBaseUrl = "/ProcessNew",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/ProcessList",
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
                        id: "ProcessId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },

                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        
        $("#ProcessTreeTitleGrid").kendoGrid({
            toolbar: ["create", "excel"],
            excel: {
                fileName: "لیست فرایند/برنامه/مرحله.xlsx",
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
                            click: editProcessStructure
                        },
                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deleteProcessStructure
                        },
                    ],
                    title: "عملیات",
                    width: 350
                },
                {
                    command: [
                        { name: "StructureThird", text: "<span class='customIcon text-blue iconStructure'>ساختار</span>", click: getProductStructure },
                       
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
        function editProcessStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItemProcess = this.dataItem($(event.currentTarget).closest("tr"));
            var ProcessId = dataItemProcess.ProcessId;
            var MenuId = 'ProcessNew';
            var TabUrl = '/ProcessNew/Edit?id=' + ProcessId;
            var TabScriptAddress = '/Scripts/Js/ProcessNew/Edit.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        // افزودن رکورد جدید
        $('#tabview_ProcessNew').find(".k-grid-add").on("click",
            function (event) {
                event.preventDefault();
                event.stopPropagation();
                var MenuId = 'ProcessNew';
                var TabUrl = '/ProcessNew/Create';
                var TabScriptAddress = '/Scripts/Js/ProcessNew/Create.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });
        //حذف رکورد گرید
        function deleteProcessStructure(e) {
            debugger;
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var ProcessId = dataItem.ProcessId;
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
                        var token = $('input[name="__RequestVerificationToken"]').val();
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/ProcessNew/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': ProcessId,
                                    __RequestVerificationToken : token
                                },
                                success: function (response) {
                                    debugger;
                                    if (response.Status) {
                                        AllertSuccess(response.Message, "فرایند/برنامه/مرحله");
                                        
                                        var grid = $("#ProcessTreeTitleGrid").data("kendoGrid");
                                        grid.dataSource.read();
                                        grid.refresh();

                                    }
                                    else {
                                        AllertError(response.Message, "فرایند/برنامه/مرحله");

                                    }
                                },
                                error: function () {
                                    AllertError('امکان حذف وجود ندارد', "فرایند/برنامه/مرحله");

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
        function getProductStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            var ProcessId = dataItem.ProcessId;
            var MenuId = 'ProcessNew';
            var TabUrl = '/ProductNew/ProductStructure?id=' + ProcessId + " &Title=" + dataItem.Title;
            var TabScriptAddress = '/Scripts/Js/ProductNew/ProductStructure.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);

        }
        

        
    },
   
}
ProcessTreeTitle.init();