
var BlockIP = {
    init: function () {
        debugger
        BlockIP.GetBlockIP();
    },
    
    GetBlockIP: function () {
        
        var crudServiceBaseUrl = "/BlockIP",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetBlockIPs",
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
                        id: "BlockIPId",
                        fields: {
                            IPStart : { type: "string", validation: { required: true } },
                            IPEnd: {type: "string" ,validation: { required: false } },
                        }
                    },
                },
                pageSize: 10
            });
        record = 0;
        $("#BlockIPGrid").kendoGrid({
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
               
                { field: "IPStart", title: "IP شروع" },

                { field: "IPEnd", title: "IP پایان" },
                {
                    command: [
                        //{
                        //    name: "customEdit",
                        //    text: 'ویرایش',
                        //    iconClass: "k-icon k-i-edit",
                        //    click: editBlockIP
                        //},
                     
                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deleteBlockIP
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
        function editBlockIP(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItemBlockIP = this.dataItem($(e.currentTarget).closest("tr"));
            debugger;
            var BlockIPId = dataItemBlockIP.BlockIPId;
            var MenuId = 'BlockIP';
            var TabUrl = '/BlockIP/Edit/' + BlockIPId;
            var TabScriptAddress = '/Scripts/Js/BlockIP/Edit.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        //حذف رکورد گرید
        function deleteBlockIP(e) {
            
            e.preventDefault();
            var dataItemBlockIP = this.dataItem($(e.currentTarget).closest("tr"));
            var BlockIPId = dataItemBlockIP.BlockIPId;
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
                                url: '/BlockIP/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'Id': BlockIPId,
                                    __RequestVerificationToken: token
                                },
                                success: function (response) {
                                    debugger;
                                    if (response.Status) {
                                        AllertSuccess(response.Message, "IP");
                                        //BlockIP.GetBlockIP();
                                        var grid = $("#BlockIPGrid").data("kendoGrid");
                                        grid.dataSource.read();
                                        grid.refresh();

                                    }
                                    else {
                                        AllertError(response.Message, "IP");
                                        
                                    }
                                },
                                error: function () {
                                    AllertError('امکان حذف وجود ندارد', "IP");
                                 
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
        $('#tabview_BlockIP').find(".k-grid-add").on("click",
            function (e) {
                debugger;
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'BlockIP';
                var TabUrl = '/BlockIP/Create';
                var TabScriptAddress = '/Scripts/Js/BlockIP/Create.js';
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
BlockIP.init();


