var costSourceId = '', record;
var GoalTreeTitle = {
    init: function () {
        GoalTreeTitle.GetAllGoalTreeTitle();
    },
    GetAllGoalTreeTitle: function () {
        var crudServiceBaseUrl = "/Goal",
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
                        id: "GoalTreeTitleId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },
                          
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        //if ($('#ActiveCostTreeId').val() != '') {
        //    hiddenActivateCost = true;
        //}
        $("#GoalTreeTitleGrid").kendoGrid({
            toolbar: ["create"/*, "excel"*/],
            //excel: {
            //    fileName: "لیست عناوین کدینگ هزینه.xlsx",
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
            debugger;
            event.preventDefault();
            event.stopPropagation();
            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            var GoalTreeTitleId = dataItem.GoalTreeTitleId;
            var MenuId = 'Goal';
            var TabUrl = '/Goal/GoalEditTreeTitle?id=' + GoalTreeTitleId;
            var TabScriptAddress = '/Scripts/Js/Goal/GoalEditTreeTitle.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
        // افزودن رکورد جدید
        $(".k-grid-add").on("click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'Goal';
                var TabUrl = '/Goal/GoalCreateTreeTitle';
                var TabScriptAddress = '/Scripts/Js/Goal/GoalCreateTreeTitle.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });
        //حذف رکورد گرید
        function deleteCostStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            var AccountTreeTitleId = dataItem.GoalTreeTitleId;
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
                                url: '/Goal/DeleteTreeTitle',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': AccountTreeTitleId,
                                    __RequestVerificationToken : token
                                },
                                success: function (response) {
                                    debugger;
                                    if (response.Status) {
                                        $('#GoalTreeTitleGrid').data('kendoGrid').dataSource.read();
                                
                                        toastr.success(response.Message, "اهداف کلان", option);


                                    }
                                    else {

                                        toastr.error(response.Message, "اهداف کلان", option);
                                    }

                                },
                                error: function (errResponse) {
                                    toastr.error("  امکان حذف وجود ندارد", "اهداف کلان", option);
                                   
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
            var GoalTreeTitleId = dataItem.GoalTreeTitleId;
            var MenuId = 'Goal';
            var TabUrl = '/Goal/GoalStructure?id=' + GoalTreeTitleId + " &Title=" + dataItem.Title;
            var TabScriptAddress = '/Scripts/Js/Goal/GoalTree.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);

        }
       
       
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
GoalTreeTitle.init();