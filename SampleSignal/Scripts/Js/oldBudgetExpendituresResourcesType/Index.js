var record;
var BudgetExpendituresResourcesType = {
    init: function () {
        BudgetExpendituresResourcesType.GetBudgetExpendituresResourcesType();
    },
    GetBudgetExpendituresResourcesType: function () {
        var crudServiceBaseUrl = "/BudgetExpendituresResourcesType",
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
                                BudgetExpendituresResourcesTypeId: options.models[0].BudgetExpendituresResourcesTypeId
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
                            toastr.success(e.response.Message, "نوع مصارف و منابع بودجه", option);
                        else
                            toastr.error(e.response.Message, "نوع مصارف و منابع بودجه", option);
                  
                        var grid = $("#BudgetExpendituresResourcesTypeGrid").data("kendoGrid");
                        grid.dataSource.read();
                    }
             



                },
                batch: true,
                schema: {
                    model: {
                        id: "BudgetExpendituresResourcesTypeId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },
                            BudgetType: { type: "string", validation: { required: true } },
                            Description: { type: "string", validation: { required: false } },
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#BudgetExpendituresResourcesTypeGrid").kendoGrid({
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
                {
                    field: "BudgetType", title: "نوع", filterable: false, editor: dropDownEditor, template: function (dataItem) { return dataItem.BudgetType == 1 ? "منابع بودجه" : "<span>مصارف بودجه</span>"; }


                },
                {
                    field: "Description", title: "توضیحات",editor:textarea

                },
                {
                    command: ["edit",
                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deleteType
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
                $('#BudgetExpendituresResourcesTypeGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });
        
        function dropDownEditor(container, options) {
            $('<select name="' + options.field + '" class="k-input k-textbox" data-bind="value:' + options.field + '" required><option value=1 selected>منابع بودجه </option><option value=2> مصارف بودجه</option></select>').appendTo(container);

        };
        function textarea(container, options) {
            $('<textarea name="' + options.field + '"  rows="3" cols="50">' + options.field
                + '</textarea > ').appendTo(container);
            

        };
        //حذف رکورد گرید
        function deleteType(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var loanTypeId = dataItem.BudgetExpendituresResourcesTypeId;
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
                    if (result == true) {
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/BudgetExpendituresResourcesType/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': loanTypeId
                                },
                                success: function (response) {
                                    var messageClass = '';
                                    if (response.Status == true) {
                                        messageClass = 'success';
                                        $('#BudgetExpendituresResourcesTypeGrid').data('kendoGrid').dataSource.read();
                                        $('#BudgetExpendituresResourcesTypeGrid').data('kendoGrid').refresh();
                                    } else {
                                        messageClass = 'danger';
                                    }
                                    $('#messageLoanType').fadeIn().html('<div class= "alert alert-' +
                                        messageClass +
                                        ' alert-dismissible">' +
                                        '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                        '<strong>' +
                                        response.Message +
                                        '</strong>' +
                                        '</div>').delay(5000).fadeOut(800);
                                    var offset = -270;
                                    $('html, body').animate({
                                        scrollTop: $("#messageLoanType").offset().top + offset
                                    },
                                        500);
                                },
                                error: function () {
                                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                                    LoanType.Error(errorMessage);
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
BudgetExpendituresResourcesType.init();