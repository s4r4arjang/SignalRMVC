var record;
var SWOTFactor = {
    init: function () {
        SWOTFactor.GetSWOTFactor();
    },
    GetSWOTFactor: function () {
        var crudServiceBaseUrl = "/SWOTAnalysis",
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
                                SWOTFactorId: options.models[0].SWOTFactorId
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
                        
                        var grid = $("#SWOTFactorGrid").data("kendoGrid");
                        grid.dataSource.read();
                    }
             



                },
                batch: true,
                schema: {
                    model: {
                        id: "SWOTFactorId",
                        fields: {
                            SWOTMainFactorTitle: { type: "string", validation: { required: true } },
                            SubFactorTitle: { type: "string", validation: { required: true } },
                          
                            SubjectCount: { type: "number", validation: { required: true } },
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#SWOTFactorGrid").kendoGrid({
            toolbar: ["create", "excel"],
            excel: {
                fileName: " output.xlsx",
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
                { field: "SWOTMainFactorTitle", title: "عنوان عامل اصلی" },
              
                {
                    field: "SubFactorTitle", title: "عنوان عامل فرعی"

                },
                { field: "SubjectCount", title: "تعداد موضوعات  " },
                {
                    command: [
                        {
                            name: "customEdit", text: 'ویرایش', iconClass: "k-icon k-i-edit", click: customEdit
                        },
                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deletefactor
                        },
                        {
                            name: "addsubject", text: ' موضوعات', iconClass: "k-icon k-i-edit", click: addsubject
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
                $('#SWOTFactorGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });

        //حذف رکورد گرید
        function deletefactor(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var id = dataItem.SWOTFactorId;

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
                                url: '/SWOTAnalysis/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': id
                                },
                                success: function (response) {
                                    var messageClass = '';

                                    if (response.Status == true) {
                                        messageClass = 'success';
                                        $('#SWOTFactorGrid').data('kendoGrid').dataSource.read();
                                        $('#SWOTFactorGrid').data('kendoGrid').refresh();
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
        // addsubject
        function addsubject(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            var rowId = dataItem.SWOTFactorId;
            var tabTitle = dataItem.SubFactorTitle;

            var MenuId = 'SWOTAnalysis' ;
            var TabUrl = '/SWOTSubject/Index/' + rowId;
            var TabScriptAddress = '/Scripts/Js/SWOTSubject/Index.js';
          
          CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        };
        //آپدیت رکورد
        function customEdit(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            var rowId = dataItem.SWOTFactorId;

            var MenuId = 'SWOTAnalysis';
            var TabUrl = '/SWOTAnalysis/Edit/' + rowId;
            var TabScriptAddress = '/Scripts/Js/SWOTAnalysis/Update.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        };

        // افزودن رکورد جدید
        $(".k-grid-add").on("click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'SWOTAnalysis';
                var TabUrl = '/SWOTAnalysis/Create';
                var TabScriptAddress = '/Scripts/Js/SWOTAnalysis/Create.js';
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
SWOTFactor.init();