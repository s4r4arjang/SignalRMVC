var costSourceId = '', record;
var CostTreeTitle = {
    init: function () {
        CostTreeTitle.GetAllCostTreeTitle();
    },
    GetAllCostTreeTitle: function () {
        var crudServiceBaseUrl = "/Cost",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetAllCostTreeTitle",
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
                        id: "AccountTreeTitleId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },
                          
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        if ($('#ActiveCostTreeId').val() !== '') {
            hiddenActivateCost = true;
        }
        $("#costTreeTitleGrid").kendoGrid({
            toolbar: ["create", "excel"],
            excel: {
                fileName: "لیست عناوین کدینگ هزینه.xlsx",
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
              
                //{
                //    field: "Status", title: "کدینگ فعال",
                //    filterable: false,
                //    template: function (dataItem) {
                //        if (dataItem.Id == $('#ActiveCostTreeId').val()) {
                //            return "<i class='fas fa-check'></i>";
                //        } else {
                //            return "<span>__</span>";
                //        }
                //    }
                //},
                {
                    command: [
                        {
                            name: "customEdit",
                            text: 'ویرایش',
                            iconClass: "k-icon k-i-edit",
                            click: editCostStructure
                        },
                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deleteCostStructure
                        },
                    ],
                    title: "عملیات",
                    width: 200
                },
                //{
                //    command: [
                //        {
                //            name: "firstCustom", text: "<span class='customIcon iconActive'>فعالسازی</span>", click: SetDefaultCostStructure,
                //        },
                //    ],
                //    title: "فعالسازی",
                //},
                {
                    command: [
                        { name: "StructureThird", text: "<span class='customIcon text-blue iconStructure'>ساختار</span>", click: getCostStructure },
                        //{
                        //    name: "StructureFirst",
                        //    text: 'کپی',
                        //    iconClass: "k-icon k-i-copy",
                        //    className: 'text-green',
                        //    click: copyCostStructure
                        //},
                        //{
                        //    name: "StructureSecond",
                        //    text: 'انتقال',
                        //    iconClass: "k-icon k-i-paste",
                        //    className: 'text-red',
                        //    click: pasteCostStructure
                        //},
                    ],
                    title: "ساختار",
                    width: 250
                },
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
        //ویرایش رکورد گرید
        function editCostStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItemCostTreeTitle = this.dataItem($(event.currentTarget).closest("tr"));
            var AccountTreeTitleId = dataItemCostTreeTitle.AccountTreeTitleId;
            var MenuId = 'Cost';
            var TabUrl = '/Cost/EditTreeTitle?id=' + AccountTreeTitleId;
            var TabScriptAddress = '/Scripts/Js/Cost/EditTreeTitle.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        // افزودن رکورد جدید
        $('#tabview_Cost').find(".k-grid-add").on("click",
            function (event) {
                event.preventDefault();
                event.stopPropagation();
                var MenuId = 'Cost';
                var TabUrl = '/Cost/CreateTreeTitle';
                var TabScriptAddress = '/Scripts/Js/Cost/CreateTreeTitle.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });
        //حذف رکورد گرید
        function deleteCostStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItemCostTreeTitle = this.dataItem($(event.currentTarget).closest("tr"));
            var AccountTreeTitleId = dataItemCostTreeTitle.AccountTreeTitleId;
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
                        var option = {
                            "timeOut": "0",
                            "closeButton": true,
                            "positionClass": "toast-bottom-full-width",
                            "timeOut": "4000",
                        }

                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/Cost/DeleteTreeTitle',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': AccountTreeTitleId,
                                    __RequestVerificationToken: token
                                },
                                success: function (response) {
                                    debugger;
                                    if (response.Status) {
                                        $('#costTreeTitleGrid').data('kendoGrid').dataSource.read();
                                
                                        toastr.success(response.Message, "کدینگ حساب", option);


                                    }
                                    else {

                                        toastr.error(response.Message, "کدینگ حساب", option);
                                    }

                                },
                                error: function (errResponse) {
                                    toastr.error("  امکان حذف وجود ندارد", " کدینگ حساب", option);
                                   
                                }
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
        function getCostStructure(event) {
            debugger;
            event.preventDefault();
            event.stopPropagation();
            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            var AccountTreeTitleId = dataItem.AccountTreeTitleId;
            var MenuId = 'Cost';
            var TabUrl = '/CostNew/CostStructure?id=' + AccountTreeTitleId + " &Title=" + dataItem.Title;
            var TabScriptAddress = '/Scripts/Js/Cost/CostStructure.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);

        }
        
        //function getCostStructureOld(event) {
        //    event.preventDefault();
        //    event.stopPropagation();
        //    var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
        //    var rowId = dataItem.AccountTreeTitleId;
        //    var MenuId = 'Cost';
        //    var TabUrl = '/Cost/CostStructure?id=' + rowId;
        //    var TabScriptAddress = '/Scripts/Js/Cost/CostStructureOld.js';
        //    CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);

        //}
        //کپی ساختار
        function copyCostStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            costSourceId = dataItem.Id;
            var currentUid = dataItem.uid;
            var currentRow = $("tr[data-uid='" + currentUid + "']");
            currentRow.addClass('copied').siblings().removeClass('copied');  
        }

        //انتقال ساختار
        function pasteCostStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            kendo.ui.progress($('#costTreeTitleGrid'), true);
            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            var costDistinationId = dataItem.Id;
            if (costSourceId != '') {
                $.ajax(
                    {
                        type: 'GET',
                        url: '/Cost/CopyAllStructureOfTreeTitle',
                        dataType: 'json',
                        async: true,
                        data: {
                            'treeTitle': costSourceId,
                            'destTreeTitle': costDistinationId
                        },
                        success: function(response) {
                            var messageClass = '';
                            if (response.Status == true) {
                                messageClass = 'success';
                                $('#costTreeTitleGrid').data('kendoGrid').dataSource.read();
                                $('#costTreeTitleGrid').data('kendoGrid').refresh();
                            } else {
                                messageClass = 'danger';
                            }
                            kendo.ui.progress($('#costTreeTitleGrid'), false);
                            $('#messageCost').fadeIn().html('<div class= "alert alert-' +
                                messageClass +
                                ' alert-dismissible">' +
                                '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                '<strong>' +
                                response.Message +
                                '</strong>' +
                                '</div>').delay(5000).fadeOut(800);
                            var offset = -270;
                            $('html, body').animate({
                                    scrollTop: $("#messageCost").offset().top + offset
                                },
                                500);
                        },
                        error: function () {
                            kendo.ui.progress($('#costTreeTitleGrid'), false);
                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                            CostTreeTitle.Error(errorMessage);
                        },
                    });
        }
        else
        {
                var errorMessage = 'لطفا ابتدا ساختار مورد نظر را کپی کنید';
                kendo.ui.progress($('#costTreeTitleGrid'), false);
            CostTreeTitle.Error(errorMessage);
        }
        }
        //فعال کردن ساختار
        //function SetDefaultCostStructure(e) {
        //    e.preventDefault();
        //    e.stopPropagation();
        //    kendo.ui.progress($('#costTreeTitleGrid'), true);
        //    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        //    var rowId = dataItem.Id;
        //    $.ajax(
        //        {
        //            type: 'GET',
        //            url: '/Cost/SetActiveCostTree',
        //            dataType: 'json',
        //            async: true,
        //            data: { costTreeId: rowId },
        //            success: function (response) {
        //                kendo.ui.progress($('#costTreeTitleGrid'), false);
        //                var messageClass = '';
        //                if (response.Status == true) {
        //                    $('#ActiveCostTreeId').val(rowId);
        //                    messageClass = 'success';
        //                }
        //                else {
        //                    messageClass = 'danger';
        //                }
        //                $('#messageCost').html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
        //                    '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
        //                    '<strong>' +
        //                    response.Message +
        //                    '</strong>' +
        //                    '</div>').delay(5000).fadeOut(800);
        //                $('#costTreeTitleGrid').data('kendoGrid').dataSource.read();
        //                $('#costTreeTitleGrid').data('kendoGrid').refresh();
        //                var offset = -270;
        //                $('html, body').animate({
        //                    scrollTop: $("#messageCost").offset().top + offset
        //                }, 500);
        //            },
        //            error: function () {
        //                kendo.ui.progress($('#costTreeTitleGrid'), false);
        //                var errorMessage = 'بروز خطا در برقراری ارتباط';
        //                CostTreeTitle.Error(errorMessage);
        //            },
        //        });
        //}
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
CostTreeTitle.init();