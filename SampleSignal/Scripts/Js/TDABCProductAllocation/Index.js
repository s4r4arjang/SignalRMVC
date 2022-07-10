var record, BulckAssign = false, selectedUnitsIds = [];
TDABCProductAllocation = {
    init: function () {
        TDABCProductAllocation.GetTDABCProductAllocation();
    },
    GetTDABCProductAllocation: function () {
        var crudServiceBaseUrl = "/TDABCProductAllocation",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetList",
                        dataType: "jsonp"
                    },

                    parameterMap: function (options, operation) {

                        options.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val();
                        return options;
                       
                    }
                },
                requestEnd: function (e) {
            

                    if (e.type === "update") {
                        if ((e.response.Status != undefined && !e.response.Status)) {
                            bootbox.alert({
                                message: e.response.Message,
                                locale: "fa"
                            });
                            var grid = $("#TDABCProductAllocationGrid").data("kendoGrid");
                            grid.dataSource.read();
                        }
                        else {
                            var grid = $("#TDABCProductAllocationGrid").data("kendoGrid");
                            grid.dataSource.read();
                        }

                    }



                },
                batch: true,
                schema: {
                    model: {
                        id: "ActivityId",
                        fields: {
                            Title: { type: "string", editable: false },
                            path: { type: "string", editable: false },
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#TDABCProductAllocationGrid").kendoGrid({
            //toolbar: [
            //    {
            //        name: "groupAssign", template:
            //            '<a class="k-button  " id="groupAssignProduct" onclick="MoveAllocationAll()"><span class="customIcon iconInfo" >انتقال  همه</span></a>'
            //    }
            //],
            toolbar: ["excel"],
            excel: {
                fileName: "تخصیص فعالیت ها.xlsx",
                proxyURL: "",
                filterable: true
            },
            dataSource: dataSource,
            batch: true,
            sortable: true,

            change: onChange,
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
                    title: "ردیف",
                    template: "#= ++record #",
                    width: 50
                },

                { field: "Title", title: "عنوان" },
                { field: "Path", title: "مسیر", editable: false },
                {
                    command: [
                        { name: "firstCustom", text: "<span class='customIcon iconInfo'>تخصیص</span>", click: GetProductsForActivity },
                        /*{ name: "secondCustom", text: "<span class='customIcon iconInfo'>انتقال ظرفیت</span>"*//*, click: MoveAllocation*//* },*/
                    ],
                    title: "عملیات"
                }
            ],
            editable: true,
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
          
        });
        //تخصیص محرک فعالیت
        function GetProductsForActivity(e) {
            //e.preventDefault();
            //e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var ActivityId = dataItem.ActivityId;
            var activitytitle = dataItem.Title;
            var t = "  تخصیص فعالیت  " + activitytitle 
            $("#ActivityTitleInProduct").text(t);
            TDABCProductAllocation.GetProductsForActivity(ActivityId);
        }
        function onChange(arg) {

            var selectedIds = this.selectedKeyNames();
            selectedUnitsIds = [];
            for (i = 0; i < selectedIds.length; i++) {
                selectedUnitsIds.push(parseInt(selectedIds[i]));
            }
            if (selectedUnitsIds.length > 0) {
                $('#groupAssignProduct').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#groupAssignProduct').removeClass('displayShow').addClass('displayNone');
            }
        }
        //انتقال ظرفیت محرک فعالیت
        //function MoveAllocation(e) {
        //    e.preventDefault();
        //    e.stopPropagation();
        //    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

        //    var ActivityId = dataItem.ActivityId;
        //    TDABCProductAllocation.MoveAllocation(ActivityId);
        //}
    
    },
    GetProductsForActivity: function (ActivityId) {
       
        $('#ProductsListForActivityBox').removeClass('displayNone').addClass('displayShow');
        $("#ProductsListForActivityGrid").empty();
        var crudServiceBaseUrl = "/TDABCProductAllocation",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetProductStepList/" + ActivityId,
                        dataType: "jsonp"
                    },
                    update: {
                        url: crudServiceBaseUrl + "/UpdateProductStepAllocate",
                        dataType: "json",
                        type: "post"
                    },
                    parameterMap: function (options, operation) {
                        options.__RequestVerificationToken = $("input[name=__RequestVerificationToken]").val();
                        return options;
                    }
                },
                requestEnd: function (e) {
                  
                    if (e.type === "update") {
                        if (e.response.Status != undefined) {
                            if (e.response.Status) {
                                toastr.success(e.response.Message, "تخصیص فعالیت ها", ToasterOptionMessage);
                                var grid = $("#ProductsListForActivityGrid").data("kendoGrid");
                                grid.dataSource.read();
                                grid.refresh();

                            }
                            else {
                                toastr.error(e.response.Message, "تخصیص فعالیت ها", ToasterOptionMessage
                                );
                            }

                            var grid = $("#ProductsListForActivityGrid").data("kendoGrid");
                            grid.dataSource.read();
                        }


                    }




                },


                batch: true,
                schema: {
                    model: {
                        id: "TDABCProductAllocationId ",
                        fields: {
                            ProductStepTitle: { type: "string", editable: false },
                            ProcessTitle: { type: "string", editable: false },
                            Path: { type: "string", editable: false },
                            ActivityCount: {
                                editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                        

                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#ProductsListForActivityGrid").kendoGrid({
            toolbar: ["save"],

            dataSource: dataSource,
            batch: true,
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
                    title: "ردیف",
                    template: "#= ++record #",
                    width: 50
                },
                { field: "ProductStepTitle", title: "عنوان مرحله" },
                { field: "ProcessTitle", title: "فرایند" },
                { field: "Path", title: " مسیر" },

                { field: "ActivityCount", title: "تعداد فعالیت برای یک واحد خدمت", editor: customEditor },
            ],
            editable: true,
        
            dataBinding: function () {
                if (this.dataSource.pageSize() !== undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });

        function customEditor(container, options) {
            $('<input data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoNumericTextBox({
                    decimals: 7,
                    format: "n6"
                });
        }

    },

    //انتقال
    //MoveAllocation: function (Id) {
    //    debugger
    //    kendo.ui.progress($('#TDABCProductAllocationGrid'), true);

    //    var dataItem = $("#TDABCProductAllocationGrid").data("kendoGrid").dataSource.get(Id);
    //    var Activityid = dataItem.ActivityId;
    //    $.ajax(
    //        {
    //            type: 'POST',
    //            url: '/TDABCProductAllocation/MoveAllocated',
    //            dataType: 'json',
    //            async: true,
    //            data: { 'Activityid': Activityid },
    //            success: function (response) {
    //                if (response.Status == true) {
    //                    messageClass = 'success';
    //                }
    //                else {
    //                    messageClass = 'danger';
    //                }
    //                kendo.ui.progress($('#TDABCProductAllocationGrid'), false);

    //                var dataItem = $("#TDABCProductAllocationGrid").data("kendoGrid").dataSource.get(Id);
    //                var row = $("#TDABCProductAllocationGrid").data("kendoGrid").tbody.find("tr[data-uid='" + dataItem.uid + "']");
    //                row.find(".k-grid-secondCustom").removeClass("k-button k-button-icontext k-grid-secondCustom ").addClass("btn btn-success").find("span.iconInfo").removeClass("iconInfo").removeClass("customIcon").addClass("k-icon k-i-check btn-success").text("");

    //            },
    //            error: function () {
    //                var errorMessage = 'بروز خطا در برقراری ارتباط';
    //                TDABCProductAllocation.Error(errorMessage);
    //            },
    //        });
    //},

    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
//انتقال  همه
//async function MoveAllocationAll() {
//    debugger

//    $.ajax(
//        {
//            type: 'POST',
//            url: '/TDABCProductAllocation/MoveAllocated',
//            dataType: 'json',
//            async: true,
      
//            success: function (response) {
//                if (response.Status == true) {
//                    toastr.success("با موفقیت ثبت شد", "تخصیص", {
//                        "timeOut": "0",
//                        "closeButton": true,
//                        "positionClass": "toast-bottom-full-width",
//                        "timeOut": "4000",
//                    });
//                }
//                else {
//                    toastr.error("خطا در ثیت", "تخصیص", {
//                        "timeOut": "0",
//                        "closeButton": true,
//                        "positionClass": "toast-bottom-full-width",
//                        "timeOut": "4000",
//                    });
//                }
              
//            },
//            error: function () {
//                var errorMessage = 'بروز خطا در برقراری ارتباط';
//                TDABCProductAllocation.Error(errorMessage);
//            },
//        });

//}
TDABCProductAllocation.init();
function LoadProductAllocation() {
    debugger;
    var form = $('#__AjaxAntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    $.ajax({
        url: "/TDABCProductAllocation/LoadTDABCProduct",
        dataType: "json",
        type: "POST",
        data:
        {
            __RequestVerificationToken : token
        },
        success: function (response) {
            debugger;
            if (response.Status) {
                AllertSuccess(response.Message, "بروزرسانی")
               
           

            }
            else {
                AllertWarning(response.Message, "بروزرسانی")
            }

        },
        error: function (errResponse) {
            debugger;
            AllertError(response.Message, "خطا در ثبت")
           
        }
    })
}