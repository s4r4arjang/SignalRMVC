
var moneyUnitNew = {
    init: function () {
        moneyUnitNew.GetmoneyUnitNew();
    },
    GetmoneyUnitNew: function () {

        var crudServiceBaseUrl = "/MoneyUnitNew",
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
                        id: "moneyUnitId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },
                            IsDefault: { type: "boolean", editable: false, },
                            /*IsBase: { type: "boolean", editable: false, },*/
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#moneyUnitNewGrid").kendoGrid({
            toolbar: ["create", "excel"],
            excel: {
                fileName: "واحد پولی.xlsx",
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
                /*{ field: "IsDefault", title: "واحد فعال", template: function (dataItem) { return dataItem.IsDefault ? "<i class='fas fa-check'></i>" : "<span>__</span>"; } },*/
                /*{ field: "IsBase", title: "واحد مرجع", template: function (dataItem) { return dataItem.IsBase ? "<i class='fas fa-check'></i>" : "<span>__</span>"; } },*/
                {
                    command: [
                        {
                            name: "customEdit",
                            text: 'ویرایش',
                            iconClass: "k-icon k-i-edit",
                            click: editMoneyUnitNew
                        },

                       
                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deletemoneyUnitNew
                        },
                       
                        { name: "secondCustom", text: "<span class='customIcon iconInfo'>مرجع</span>", click: SetBase }
                    ],
                    title: "عملیات",
                    width: 350
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

        function editMoneyUnitNew(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var MoneyUnitId = dataItem.MoneyUnitId;
            var MenuId = 'MoneyUnitNew';
            var TabUrl = '/MoneyUnitNew/Edit/' + MoneyUnitId;
            var TabScriptAddress = '/Scripts/Js/MoneyUnitNew/Edit.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        function SetBase(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var MoneyUnitId = dataItem.MoneyUnitId;
            var form = $('#__AjaxAntiForgeryForm');
            var token = $('input[name="__RequestVerificationToken"]', form).val();

            $.ajax(
                {
                    type: 'POST',
                    url: '/MoneyUnitNew/ChangeBase',
                    dataType: 'json',
                    async: false,

                    data: {
                        'id': MoneyUnitId,
                       __RequestVerificationToken: token,
                    },
                    success: function (response) {

                        if (response.Status === true) {
                            AllertSuccess(response.Message, "واحد پولی");

                        }
                        else {
                            AllertSuccess(response.Message, "واحد پولی");
                        }
                        $('#moneyUnitNewGrid').data('kendoGrid').dataSource.read();
                        $('#moneyUnitNewGrid').data('kendoGrid').refresh();
                    },
                    error: function () {

                        AllertError("خطا در ثبت عملیات", "واحد پولی");
                    },
                });
        }
        //حذف رکورد گرید
        function deletemoneyUnitNew(e) {
            e.preventDefault();
            var dataItemmoneyUnit = this.dataItem($(e.currentTarget).closest("tr"));
            var moneyUnitId = dataItemmoneyUnit.MoneyUnitId;
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
                    if (result === true) {
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();

                        $.ajax(
                            {
                                type: 'POST',
                                url: '/MoneyUnitNew/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'Id': moneyUnitId,
                                    __RequestVerificationToken: token,
                                },
                                success: function (response) {

                                    if (response.Status === true) {
                                        AllertSuccess(response.Message, "واحد پولی");

                                    }
                                    else {
                                        AllertError(response.Message, "واحد پولی");
                                    }
                                    $('#moneyUnitNewGrid').data('kendoGrid').dataSource.read();
                                    $('#moneyUnitNewGrid').data('kendoGrid').refresh();
                                },
                                error: function () {

                                    AllertError("امکان حذف وجود ندارد", "واحد پولی");
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
        $('#tabview_MoneyUnitNew').find(".k-grid-add").on("click",
            function (e) {
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'MoneyUnitNew';
                var TabUrl = '/MoneyUnitNew/Create';
                var TabScriptAddress = '/Scripts/Js/MoneyUnitNew/Create.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });
    },
   
}
moneyUnitNew.init();