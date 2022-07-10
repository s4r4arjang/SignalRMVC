var record;
var BudgetExpendituresResources = {
    init: function () {
        BudgetExpendituresResources.GetBudgetExpendituresResources();
    },
    GetBudgetExpendituresResources: function () {
        var crudServiceBaseUrl = "/BudgetExpendituresResources",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetList",
                        dataType: "json"
                    },
                    update: {
                        url: crudServiceBaseUrl + "/Edit",
                        dataType: "json",
                        type: "post"
                    },
                    create: {
                        url: crudServiceBaseUrl + "/Create",
                        dataType: "json",
                        type: "post"
                    },
                    destroy: {
                        url: crudServiceBaseUrl + "/Delete",
                        dataType: "json",
                        type: "post"
                    },
                    parameterMap: function (options, operation) {
                        if (operation !== "read" && operation !== "destroy" && options.models) {
                            return {
                                model: options.models[0]
                            };

                        }
                        if (operation == "destroy") {

                            return {
                                BudgetExpendituresResourcesId: options.models[0].BudgetExpendituresResourcesId
                            };
                        }
                    }
                
                },
                requestEnd: function (e) {
                    //check the "response" argument to skip the local operations
                    if (e.type === "create" || e.type === "update") {
                        bootbox.alert({
                            message: e.response.Message,
                            locale: "fa"
                        });
                        var grid = $("#BudgetExpendituresResourcesGrid").data("kendoGrid");
                        grid.dataSource.read();
                    }
             



                },
                batch: true,
                schema: {
                    model: {
                        id: "BudgetExpendituresResourcesId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },
                            BudgetExpenditureResourceTypeTitle: { type: "string", validation: { required: true } },
                            OfferedAmount: { type: "number", validation: { required: true } },
                            ApprovedAmount: { type: "number", validation: { required: true } },
                            IntendedAmount: { type: "number", validation: { required: true } },
                            Description: { type: "string", validation: { required: false } },
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#BudgetExpendituresResourcesGrid").kendoGrid({
            toolbar: ["create", "excel"],
            excel: {
                fileName: "لیست دوایر.xlsx",
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
                { field: "TypeTiTle", title: "نوع اصلی" },
                { field: "BudgetExpenditureResourceTypeTitle", title: "نوع فرعی" },

                { field: "TotalAmount", title: "مبلغ کل" },
                { field: "LastYearsApprovedAmount", title: "مبلغ مصوب  سنوات گذشته" },
                
                { field: "OfferedAmount", title: "مبلغ پیشنهادی سازمان" },
                { field: "ApprovedAmount", title: "مبلغ مصوب سازمان" },
                { field: "IntendedAmount", title: "مبلغ مورد نظر سازمان" },
            
                
              
                {
                    field: "Description", title: "توضیحات",editor:textarea

                },
                {
                    command: [
                        {
                            name: "customEdit", text: 'ویرایش', iconClass: "k-icon k-i-edit", click: customEdit
                        },


                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deleteBudgetExpenditure
                        },
                    ],
                    title: "عملیات"
                }
            ],

            editable: "popup",
            edit: function (event) {
               
              event.container.find(".k-edit-label:first").hide();
                event.container.find(".k-edit-field:first").hide();
                event.container.parent().find('.k-window-title').text(event.model.isNew() ? "ایجاد" : "ویرایش");
                $(event.container).parent().css({
                    width: '600px',
                    height: '300px'
                });
            },
            cancel: function (e) {
                $('#BudgetExpendituresResourcesGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });

        //آپدیت رکورد
        function customEdit(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
         
            var rowId = dataItem.BudgetExpendituresResourcesId;

            var MenuId = 'BudgetExpendituresResources';
            var TabUrl = '/BudgetExpendituresResources/Edit/' + rowId;
            var TabScriptAddress = '/Scripts/Js/BudgetExpendituresResources/Update.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        };
        // افزودن رکورد جدید
        $(".k-grid-add").on("click",
            function (e) {
          
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'BudgetExpendituresResources';
                var TabUrl = '/BudgetExpendituresResources/Create';
           var TabScriptAddress = '/Scripts/Js/BudgetExpendituresResources/Create.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });
        //حذف رکورد
        function deleteBudgetExpenditure(e) {

            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var BudgetExpendituresResourcesId = dataItem.BudgetExpendituresResourcesId;
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
                                url: '/BudgetExpendituresResources/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'Id': BudgetExpendituresResourcesId,
                                    __RequestVerificationToken : token
                                },
                                success: function (response) {
                                    debugger;
                                    if (response.Status) {
                                        AllertSuccess(response.Message, "بودجه منابع و مصارف");
                                        //DriverList.GetDriverList();
                                        var grid = $("#BudgetExpendituresResourcesGrid").data("kendoGrid");
                                        grid.dataSource.read();
                                        grid.refresh();

                                    }
                                    else {
                                        AllertError(response.Message, "بودجه منابع و مصارف");

                                    }
                                },
                                error: function () {
                                    AllertError('امکان حذف وجود ندارد', "بودجه منابع و مصارف");

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
        function dropDownEditor(container, options) {
            $('<select name="' + options.field + '" class="k-input k-textbox" data-bind="value:' + options.field + '" required><option value=1 selected>منابع بودجه </option><option value=2> مصارف بودجه</option></select>').appendTo(container);

        };
        function textarea(container, options) {
            $('<textarea name="' + options.field + '"  rows="3" cols="50">' + options.field
                + '</textarea > ').appendTo(container);
            

        };
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
BudgetExpendituresResources.init();