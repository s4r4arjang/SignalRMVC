var record;
var ParameterType = {
    init: function () {
        ParameterType.GetParameterType();
    },
    GetParameterType: function () {
        var crudServiceBaseUrl = "/BranchParameterType",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetList",
                        dataType: "json"
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
                                ParameterTypeId: options.models[0].ParameterTypeId
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
                            toastr.success(e.response.Message, "نوع پارامتر   ", option);
                        else
                            toastr.error(e.response.Message, "نوع پارامتر", option);
                  
                        var grid = $("#ParameterTypeGrid").data("kendoGrid");
                        grid.dataSource.read();
                    }
             



                },
                batch: true,
                schema: {
                    model: {
                        id: "ParameterTypeId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },
                            //HasBranch: { type: "boolean" },
                    
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#ParameterTypeGrid").kendoGrid({
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
           //     { field: "HasBranch", title: "دارای شعبه", template: function (dataItem) { return dataItem.HasBranch ? "<i class='fas fa-check'></i>" : "<span>ندارد</span>"; }},
               
                {

                    command: [

                        {
                            name: "customEdit",
                            text: 'ویرایش',
                            iconClass: "k-icon k-i-edit",
                            click: editBranchParameterType
                        },

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

            cancel: function (e) {
                $('#ParameterTypeGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });

        function editBranchParameterType(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var ParameterTypeId = dataItem.ParameterTypeId;
            var MenuId = 'BranchParameterType';
            var TabUrl = '/BranchParameterType/Edit/' + ParameterTypeId;
            var TabScriptAddress = '/Scripts/Js/BranchParameterType/Edit.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }

        //حذف رکورد گرید
        function deleteType(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var loanTypeId = dataItem.ParameterTypeId;
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
                        var form = $('#__AjaxAntiForgeryForm');
                        var token = $('input[name="__RequestVerificationToken"]', form).val();
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/BranchParameterType/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': loanTypeId,
                                    __RequestVerificationToken: token
                                },
                                success: function (response) {
                                    var messageClass = '';
                                    if (response.Status == true) {
                                        messageClass = 'success';
                                        $('#ParameterTypeGrid').data('kendoGrid').dataSource.read();
                                        $('#ParameterTypeGrid').data('kendoGrid').refresh();
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

        $('#tabview_BranchParameterType').find(".k-grid-add").on("click",
            function (e) {
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'BranchParameterType';
                var TabUrl = '/BranchParameterType/Create';
                var TabScriptAddress = '/Scripts/Js/BranchParameterType/Create.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });

        function customBoolEditor(container, options) {
            $('<input class="k-checkbox" type="checkbox" name="HasBranch" data-type="boolean" data-bind="checked:HasBranch">').appendTo(container);
        }
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
ParameterType.init();