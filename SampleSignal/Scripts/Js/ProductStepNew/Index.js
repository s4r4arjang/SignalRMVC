var record, PartialProductId;
var ProductStep = {
    init: function () {
        PartialProductId = $('#PartialProductId.abc').val();
       
        debugger;
        ProductStep.GetAllProductStep();
    },
    GetAllProductStep: function () {
        var crudServiceBaseUrl = "/ProductStepNew",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/ProductStepList/" + document.getElementById("PartialProductId").value,
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
                        id: "ProductStepId",
                        fields: {
                            Title: {
                                type: "string", validation: { required: true }
                            },

                        }
                    }
                },
                pageSize: 10
            });
        record = 0;

        $("#ProductStepGrid").kendoGrid({
            toolbar: ["create"],

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
                    command: [

                        {
                            name: "customEdit",
                            text: 'ویرایش',
                            iconClass: "k-icon k-i-edit",
                            click: editProductStepStructure
                        },
                        {
                            name: "customDelete",
                            text: 'حذف',
                            iconClass: "k-icon k-i-close",
                            click: deleteProductStepStructure
                        },
                    ],
                    title: "عملیات",
                    width: 350
                },
                
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

        //ویرایش رکورد گرید
        function editProductStepStructure(event) {
            event.preventDefault();
            event.stopPropagation();
            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            var ProductStepId = dataItem.ProductStepId;

            $.ajax({
                type: "GET",
                url: "/ProductStepNew/Edit/" + ProductStepId ,
               
                dataType: "html",
                success: function (response) {

                    $('#ListProductStep').html(response);




                },

            });
            
        }


        // افزودن رکورد جدید 
        $(".k-grid-add").on("click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();
                $.ajax({
                    type: "GET",
                    url: "/ProductStepNew/Create/" + document.getElementById('PartialProductId').value ,

                    dataType: "html",
                    success: function (response) {

                        $('#ListProductStep').html(response);




                    },

                });

            });
        
        //حذف رکورد گرید
        function deleteProductStepStructure(e) {
            debugger;
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var ProductStepId = dataItem.ProductStepId;
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
                    if (result === true) {
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/ProductStepNew/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': ProductStepId
                                },
                                success: function (response) {
                                    debugger;
                                    if (response.Status) {
                                        AllertSuccess(response.Message, "مرحله");

                                        var grid = $("#ProductStepGrid").data("kendoGrid");
                                        grid.dataSource.read();
                                        grid.refresh();

                                    }
                                    else {
                                        AllertError(response.Message, "مرحله");

                                    }
                                },
                                error: function () {
                                    AllertError('امکان حذف وجود ندارد', "مرحله");

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

}
ProductStep.init();