var record;
var BranchNew = {
    init: function () {
        BranchNew.GetBranchNew();

    },
    GetBranchNew: function () {
        var crudServiceBaseUrl = "/BranchNew",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'BranchNew/GetList?ParameterId=' + document.getElementById('ParameterId').value + "&BranchType=" + document.getElementById('BranchType1').value,

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
                                BranchNewId: options.models[0].BranchNewId
                            };
                        }
                    }

                },
                requestEnd: function (e) {
                    var option = {
                        "timeOut": "0",
                        "closeButton": true,
                        "positionClass": "toast-bottom-full-width",
                        "timeOut": "4000",
                    }
                    //check the "response" argument to skip the local operations
                    if (e.type === "create" || e.type === "update") {
                        if (e.response.Status)
                            toastr.success(e.response.Message, "شعب", option);
                        else
                            toastr.error(e.response.Message, "شعب", option);

                        var grid = $("#BranchNewGrid").data("kendoGrid");
                        grid.dataSource.read();
                    }




                },
                batch: true,
                schema: {
                    model: {
                        id: "Id",
                        fields: {
                            Title: { type: "string", validation: { required: true } },

                        },
                        fields: {
                            Code: { type: "string", validation: { required: true } },

                        },
                        fields: {
                            BranchTypeTitle: { type: "string", validation: { required: true } },

                        },
                        fields: {
                            OperationTypeTitle: { type: "string", validation: { required: true } },

                        },
                        fields: {
                            IsActive: { type: "boolean", validation: { required: true } },

                        },

                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#BranchNewGrid").kendoGrid({
            toolbar: ["create", "excel"],
            excel: {
                fileName: "لیست شعب.xlsx",
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
                { field: "Code", title: "کد" },
                { field: "BranchTypeTitle", title: "نوع شعبه" },
                { field: "OperationTypeTitle", title: "نوع فعالیت" },


                { field: "IsActive", title: "فعال", template: function (dataItem) { return dataItem.IsActive ? "<i class='fas fa-check'></i>" : "<span>غیر فعال</span>"; } },
                {
                    command: [{
                        name: "customEdit", text: 'ویرایش', iconClass: "k-icon k-i-edit", click: customEdit
                    },
                    {

                        name: "customDeActive",
                        text: '<span > <i class="fa fa-ban" aria-hidden="true"></i> غیرفعال </span>',

                        click: DeActiveBranch
                    }, {
                        name: "customActive",
                        text: 'فعال',
                        click: ActiveBranch
                    },

                    ]
                    ,
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
                $('#BranchNewGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function (e) {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                }
                else {
                    record = 0;
                }

            },
            dataBound: function (e) {

                dataItems = e.sender.dataSource.view();
                for (var i = 0; i < dataItems.length; i++) {
                    debugger;
                    var isactive = dataItems[i].get("IsActive");
                    var row = this.tbody.find("[data-uid='" + dataItems[i].uid + "']");
                    if (isactive === false) {


                        $(row).find(".k-grid-customDeActive").css('display', 'none');;
                        $(row).find(".k-grid-customEdit").css('display', 'none');;
                        $(row).find(".k-grid-customActive").css('display', 'show');;
                    }
                    else {
                        $(row).find(".k-grid-customActive").css('display', 'none');;
                    }
                }


            }
        });

        //آپدیت رکورد
        function customEdit(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            var rowId = dataItem.Id;


            $.ajax({
                type: "GET",
                url: "/BranchNew/Edit/" + rowId,
                url: "/BranchNew/Edit?id=" + rowId + "&BranchType=" + document.getElementById('BranchType1').value,
                dataType: "html",
                success: function (response) {

                    $('#ListBranch').html(response);




                },

            });

        };
        // افزودن رکورد جدید
        $(".k-grid-add").on("click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();
                $.ajax({
                    type: "GET",
                    url: "/BranchNew/Create?ParameterId=" + document.getElementById('ParameterId').value + "&BranchType=" + document.getElementById('BranchType1').value,

                    dataType: "html",
                    success: function (response) {

                        $('#ListBranch').html(response);




                    },

                });

            });
        // فعال
        function ActiveBranch(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var Id = dataItem.Id;
            bootbox.confirm({
                title: "فعال کردن شعبه!",
                message: "آیا از  فعال کردن شعبه مورد نظر اطمینان دارید؟",
                className: 'rubberBand animated',
                buttons: {
                    cancel: {
                        className: 'btn-information',
                        label: '<i class="fa fa-times"></i> انصراف'
                    },
                    confirm: {
                        className: 'btn-success',
                        label: '<i class="fa fa-check"></i> فعال'
                    }
                },
                callback: function (result) {
                    if (result == true) {
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/BranchNew/Active',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': Id
                                },
                                success: function (response) {

                                    if (response.Status == true) {
                                        messageClass = 'success';
                                        $('#BranchNewGrid').data('kendoGrid').dataSource.read();
                                        $('#BranchNewGrid').data('kendoGrid').refresh();
                                        toastr.success(response.Message, "شعبه", {
                                            "timeOut": "0",
                                            "closeButton": true,
                                            "positionClass": "toast-bottom-full-width",
                                            "timeOut": "4000",
                                        });
                                    } else {
                                        toastr.error(response.Message, "شعبه", {

                                            "timeOut": "0",
                                            "closeButton": true,
                                            "positionClass": "toast-bottom-full-width",
                                            "timeOut": "4000",
                                        });
                                    }

                                },
                                error: function () {

                                    toastr.error("خطا در ثبت", "شعبه", {
                                        "timeOut": "0",
                                        "timeOut": "4000",
                                        "closeButton": true,
                                        "positionClass": "toast-bottom-full-width",
                                    });
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

        //حذف رکورد گرید
        function DeActiveBranch(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var Id = dataItem.Id;
            bootbox.confirm({
                title: "غیر فعال کردن شعبه!",
                message: "آیا از غیر فعال کردن شعبه مورد نظر اطمینان دارید؟",
                className: 'rubberBand animated',
                buttons: {
                    cancel: {
                        className: 'btn-information',
                        label: '<i class="fa fa-times"></i> انصراف'
                    },
                    confirm: {
                        className: 'btn-danger',
                        label: '<i class="fa fa-check"></i> غیرفعال'
                    }
                },
                callback: function (result) {
                    if (result == true) {
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/BranchNew/DeActive',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': Id
                                },
                                success: function (response) {

                                    if (response.Status == true) {
                                        messageClass = 'success';
                                        $('#BranchNewGrid').data('kendoGrid').dataSource.read();
                                        $('#BranchNewGrid').data('kendoGrid').refresh();
                                        toastr.success(response.Message, "شعبه", {
                                            "timeOut": "0",
                                            "closeButton": true,
                                            "positionClass": "toast-bottom-full-width",
                                            "timeOut": "4000",
                                        });
                                    } else {
                                        toastr.error(response.Message, "شعبه", {

                                            "timeOut": "0",
                                            "closeButton": true,
                                            "positionClass": "toast-bottom-full-width",
                                            "timeOut": "4000",
                                        });
                                    }

                                },
                                error: function () {

                                    toastr.error("خطا در ثبت", "شعبه", {
                                        "timeOut": "0",
                                        "timeOut": "4000",
                                        "closeButton": true,
                                        "positionClass": "toast-bottom-full-width",
                                    });
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
    },


    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
BranchNew.init();


