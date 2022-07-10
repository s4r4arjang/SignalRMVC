var record;
var ProcessActivityAccountStructure = {
    init: function () {
        ProcessActivityAccountStructure.GetProcessActivityAccountStructure();
    },
    GetProcessActivityAccountStructure: function () {
        var crudServiceBaseUrl = "/ProcessActivityAccountStructure",
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
                                ProcessActivityAccountStructureId: options.models[0].ProcessActivityAccountStructureId
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
                        var grid = $("#ProcessActivityAccountStructureGrid").data("kendoGrid");
                        grid.dataSource.read();
                    }
             



                },

           
                batch: true,
                schema: {
                    model: {
                        id: "ProcessActivityAccountStructureId",
                        fields: {
                            AccountTreeTitleId: { type: "number", validation: { required: true } },
                            ActivityTreeTitleId: { type: "number", validation: { required: true } },
                            Title: { type: "string", validation: { required: true } },
                            ProcessTitle: { type: "string", validation: { required: true } },
                            ActivityAccountTreeTitle: { type: "string", validation: { required: true } },
                          HasActivity: {type: "string", editable: false},

                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#ProcessActivityAccountStructureGrid").kendoGrid({
            toolbar: ["create"/*, "excel"*/],
            //excel: {
            //    fileName: "لیست دوایر.xlsx",
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
                { field: "ProcessTitle", title: "فرایند" },
                
                { field: "ActivityAccountTreeTitle", title: "عنوان ساختار هزینه / فعالیت هزینه " },
                {
                    field: "HasActivity", title: " فعالیت دارد",
                    filterable: false,
                    template: function (dataItem) {
                        if (dataItem.HasActivity == 'true') {
                            return "<i class='fas fa-check'></i>";
                        } else {
                            return "<span>__</span>";
                        }
                    }
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
                            click: deleteProcessActivityAccountStructure
                        },
                        {
                            name: "firstCustom",
                            text: ' مراحل',
                            iconClass: "k-icon k-i-plus",
                            click: assignCostToProductstep
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
                $('#ProcessActivityAccountStructureGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });

        //صفحه ی اتصال هزینه به فعالیت
        function assignCostToProductstep(event) {
           
            event.preventDefault();
            event.stopPropagation();
            var dataItemActivityTreeTitle = this.dataItem($(event.currentTarget).closest("tr"));
            var ProcessActivityAccountStructureId = dataItemActivityTreeTitle.ProcessActivityAccountStructureId;
          

      
            var MenuId = 'ProcessActivityAccountStructure';
            var TabUrl = '/ProcessActivityAccountStructure/ProductStep/' + ProcessActivityAccountStructureId;
            var TabScriptAddress = '/Scripts/Js/ProcessActivityAccountStructure/ProductStep.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }

        //آپدیت رکورد
        function customEdit(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
         
            var rowId = dataItem.ProcessActivityAccountStructureId;

            var MenuId = 'ProcessActivityAccountStructure';
            var TabUrl = '/ProcessActivityAccountStructure/Edit/' + rowId;
            var TabScriptAddress = '/Scripts/Js/ProcessActivityAccountStructure/Update.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        };
        //حذف رکورد گرید
        function deleteProcessActivityAccountStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItemActivityTreeTitle = this.dataItem($(event.currentTarget).closest("tr"));
            var ProcessActivityAccountStructureId = dataItemActivityTreeTitle.ProcessActivityAccountStructureId;
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
                                url: '/ProcessActivityAccountStructure/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': ProcessActivityAccountStructureId,
                                    __RequestVerificationToken : token
                                },
                                success: function (response) {
                                    debugger;
                                    if (response.Status) {
                                        $('#ProcessActivityAccountStructureGrid').data('kendoGrid').dataSource.read();

                                        toastr.success(response.Message, "فعالیت - هزینه ", option);


                                    }
                                    else {

                                        toastr.error(response.Message, "فعالیت - هزینه ", option);
                                    }

                                },
                                error: function (errResponse) {

                                    toastr.error("خطا در عملیات", "فعالیت - هزینه ", option);
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
        // افزودن رکورد جدید
        $(".k-grid-add").on("click",
            function (e) {
          
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'ProcessActivityAccountStructure';
                var TabUrl = '/ProcessActivityAccountStructure/Create';
           var TabScriptAddress = '/Scripts/Js/ProcessActivityAccountStructure/Create.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });


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
ProcessActivityAccountStructure.init();