
var BenchMark = {
    init: function () {
        BenchMark.GetBenchMark();
    },
    GetBenchMark: function () {
        var crudServiceBaseUrl = "/BenchMark",
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
                        id: "BenchMarkId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },
                            IsActive: { type: "boolean", validation: { required: true } },
                        }
                    },
                },
                pageSize: 10
            });
        record = 0;
        $("#BenchMarkGrid").kendoGrid({
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
               
                { field: "Title", title: "عنوان " },
                { field: "IsActive", title: "فعال", template: function (dataItem) { return dataItem.IsActive ? "<i class='fas fa-check'></i>" : "<span>غیر فعال</span>"; } },
               
                {
                    command: [
                        {
                            name: "customEdit",
                            text: 'ویرایش',
                            iconClass: "k-icon k-i-edit",
                            click: editBenchMark
                        },
                     
                       
                        {

                            name: "customDeActive",
                            text: '<span > <i class="fa fa-ban" aria-hidden="true"></i> غیرفعال </span>',

                            click: DeActiveBenchMark
                        },
                        {
                            name: "customActive",
                            text: 'فعال',
                            click: ActiveBenchMark
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
    
        //ویرایش رکورد گرید
        function editBenchMark(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var BenchMarkId  = dataItem.BenchMarkId;
            var MenuId = 'BenchMark';
            var TabUrl = '/BenchMark/Edit/' + BenchMarkId;
            var TabScriptAddress = '/Scripts/Js/BenchMark/Edit.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
       
        //غیرفعال رکورد گرید
        function DeActiveBenchMark(e) {
            debugger;
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var BenchMarkId = dataItem.BenchMarkId;
            bootbox.confirm({
                title: "سنجه",
                message: "آیا از غیر فعال کردن اطمینان دارید؟",
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
                   
                    if (result == true) {
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/BenchMark/DeActive/' + BenchMarkId,
                                dataType: 'json',
                                async: false,
                                
                                success: function (response) {
                                    if (response.Status) {
                                        AllertSuccess(response.Message, "سنجه");
                                        var grid = $("#BenchMarkGrid").data("kendoGrid");
                                        grid.dataSource.read();
                                        grid.refresh();
                                    }
                                    else {
                                        AllertError(response.Message, "سنجه");
                                    }
                                    var grid = $("#BenchMarkGrid").data("kendoGrid");
                                    grid.dataSource.read();

                                },


                                error: function () {
                                    AllertError(response.Message, "سنجه");
                                 
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
        function ActiveBenchMark(e) {
            debugger;
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var BenchMarkId = dataItem.BenchMarkId;
            bootbox.confirm({
                title: "سنجه",
                message: "آیا از  فعال کردن اطمینان دارید؟",
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
                    
                    if (result == true) {
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/BenchMark/Active/' + BenchMarkId,
                                dataType: 'json',
                                async: false,
                                success: function (response) {
                                    if (response.Status) {
                                        AllertSuccess(response.Message, "سنجه");
                                        var grid = $("#BenchMarkGrid").data("kendoGrid");
                                        grid.dataSource.read();
                                        grid.refresh();
                                    }
                                    else {
                                        AllertError(response.Message, "سنجه");
                                    }
                                    var grid = $("#BenchMarkGrid").data("kendoGrid");
                                    grid.dataSource.read();
                                },
                                error: function () {
                                    AllertError(response.Message, "سنجه");

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
        $('#tabview_BenchMark').find(".k-grid-add").on("click",
            function (e) {
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'BenchMark';
                var TabUrl = '/BenchMark/Create';
                var TabScriptAddress = '/Scripts/Js/BenchMark/Create.js';
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
BenchMark.init();
