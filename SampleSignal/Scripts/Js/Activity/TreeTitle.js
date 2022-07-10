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
        //if ($('#ActiveActivityTreeId').val() != '') {
        //    hiddenActivateActivity = true;
        //}
        $("#activityTreeTitleGrid").kendoGrid({
            toolbar: ["create"/*, "excel"*/],
            //excel: {
            //    fileName: "لیست عناوین کدینگ فعالیت.xlsx",
            //    proxyURL: "",
            //    filterable: true
            //},
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
                //        if (dataItem.Id == $('#ActiveActivityTreeId').val()) {
                //            return "<i class='fas fa-check'></i>";
                //        } else {
                //            return "<span>__</span>";
                //        }
                //    }
                //},
                {
                    command: [
                        //{
                        //    name: "firstCustom",
                        //    text: 'افزودن هزینه غیر مستقیم',
                        //    iconClass: "k-icon k-i-plus",
                        //    click: assignCostToActivity
                        //},
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
                //{
                //    name: "StructureFirst",
                //    text: 'کپی',
                //    iconClass: "k-icon k-i-copy",
                //    className: 'text-green',
                //    click: copyActivityStructure
                //},
                //{
                //    name: "StructureSecond",
                //    text: 'انتقال',
                //    iconClass: "k-icon k-i-paste",
                //    className: 'text-red',
                //    click: pasteActivityStructure
                //},
            ],
            title: "ساختار",
            width: 250
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
        //صفحه ی اتصال هزینه به فعالیت
        function assignCostToActivity(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItemActivityTreeTitle = this.dataItem($(event.currentTarget).closest("tr"));
            var activityTreeTitleId = dataItemActivityTreeTitle.ActivityTreeTitleId;
            var MenuId = 'Activity';
            var TabUrl = '/ActivityCost/Index?activityTreeTitleId=' + activityTreeTitleId;
            var TabScriptAddress = '/Scripts/Js/ActivityCost/Index.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        //ویرایش رکورد گرید
        function editActivityStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItemActivityTreeTitle = this.dataItem($(event.currentTarget).closest("tr"));
            var ActivityTreeTitleId = dataItemActivityTreeTitle.ActivityTreeTitleId;
            var MenuId = 'Activity';
            var TabUrl = '/Activity/EditTreeTitle?id=' + ActivityTreeTitleId;
            var TabScriptAddress = '/Scripts/Js/Activity/EditTreeTitle.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        // افزودن رکورد جدید
        $('#tabview_Activity').find(".k-grid-add").on("click",
            function (event) {
                event.preventDefault();
                event.stopPropagation();
                var MenuId = 'Activity';
                var TabUrl = '/Activity/CreateTreeTitle';
                var TabScriptAddress = '/Scripts/Js/Activity/CreateTreeTitle.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });
        //حذف رکورد گرید
        function deleteActivityStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItemActivityTreeTitle = this.dataItem($(event.currentTarget).closest("tr"));
            var activityTreeTitleId = dataItemActivityTreeTitle.ActivityTreeTitleId;
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
                        $.ajax(
                            {
                                type: 'GET',
                                url: '/Activity/DeleteTreeTitle',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': activityTreeTitleId
                                },
                                success: function (response) {
                                    debugger;
                                    if (response.Status) {
                                        $('#activityTreeTitleGrid').data('kendoGrid').dataSource.read();

                                        toastr.success(response.Message, "کدینگ فعالیت", option);


                                    }
                                    else {

                                        toastr.error(response.Message, "کدینگ فعالیت", option);
                                    }

                                },
                                error: function (errResponse) {

                                    toastr.error("  امکان حذف وجود ندارد", " کدینگ فعالیت", option);
                                  
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
        function getActivityStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            var rowId = dataItem.ActivityTreeTitleId;
            var MenuId = 'Activity';
            var TabUrl = '/Activity/ActivityStructure?id=' + rowId;
            var TabScriptAddress = '/Scripts/Js/Activity/ActivityStructure.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);

        }
        //کپی ساختار
        function copyActivityStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            activitySourceId = dataItem.Id;
            var currentUid = dataItem.uid;
            var currentRow = $("tr[data-uid='" + currentUid + "']");
            currentRow.addClass('copied').siblings().removeClass('copied');  
        }

        //انتقال ساختار
        function pasteActivityStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            var activityDistinationId = dataItem.Id;
            if (activitySourceId != '') {
                $.ajax(
                    {
                        type: 'GET',
                        url: '/Activity/CopyAllStructureOfTreeTitle',
                        dataType: 'json',
                        async: true,
                        data: {
                            'treeTitle': activitySourceId,
                            'destTreeTitle': activityDistinationId
                        },
                        success: function (response) {
                            var messageClass = '';
                            if (response.Status == true) {
                                messageClass = 'success';
                                $('#activityTreeTitleGrid').data('kendoGrid').dataSource.read();
                                $('#activityTreeTitleGrid').data('kendoGrid').refresh();
                            } else {
                                messageClass = 'danger';
                            }
                            kendo.ui.progress($('#activityTreeTitleGrid'), false);
                            $('#messageActivity').fadeIn().html('<div class= "alert alert-' +
                                messageClass +
                                ' alert-dismissible">' +
                                '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                '<strong>' +
                                response.Message +
                                '</strong>' +
                                '</div>').delay(5000).fadeOut(800);
                            var offset = -270;
                            $('html, body').animate({
                                scrollTop: $("#messageActivity").offset().top + offset
                            },
                                500);
                        },
                        error: function () {
                            kendo.ui.progress($('#activityTreeTitleGrid'), false);
                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                            ActivityTreeTitle.Error(errorMessage);
                        },
                    });
            }
            else {
                var errorMessage = 'لطفا ابتدا ساختار مورد نظر را کپی کنید';
                kendo.ui.progress($('#activityTreeTitleGrid'), false);
                ActivityTreeTitle.Error(errorMessage);
            }
        }
        //فعال کردن ساختار
        //function SetDefaultActivityStructure(e) {
        //    e.preventDefault();
        //    e.stopPropagation();
        //    kendo.ui.progress($('#activityTreeTitleGrid'), true);
        //    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        //    var rowId = dataItem.Id;
        //    $.ajax(
        //        {
        //            type: 'GET',
        //            url: '/Activity/SetActiveActivityTree',
        //            dataType: 'json',
        //            async: true,
        //            data: { activityTreeId: rowId },
        //            success: function (response) {
        //                kendo.ui.progress($('#activityTreeTitleGrid'), false);
        //                var messageClass = '';
        //                if (response.Status == true) {
        //                    $('#ActiveActivityTreeId').val(rowId);
        //                    messageClass = 'success';
        //                }
        //                else {
        //                    messageClass = 'danger';
        //                }
        //                $('#messageActivity').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
        //                    '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
        //                    '<strong>' +
        //                    response.Message +
        //                    '</strong>' +
        //                    '</div>').delay(5000).fadeOut(800);
        //                $('#activityTreeTitleGrid').data('kendoGrid').dataSource.read();
        //                $('#activityTreeTitleGrid').data('kendoGrid').refresh();
        //                var offset = -270;
        //                $('html, body').animate({
        //                    scrollTop: $("#messageActivity").offset().top + offset
        //                }, 500);
        //            },
        //            error: function () {
        //                kendo.ui.progress($('#activityTreeTitleGrid'), false);
        //                var errorMessage = 'بروز خطا در برقراری ارتباط';
        //                ActivityTreeTitle.Error(errorMessage);
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
ActivityTreeTitle.init();