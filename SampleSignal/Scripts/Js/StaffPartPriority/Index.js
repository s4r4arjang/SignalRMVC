var record;
var StaffPartPriority = {
    init: function () {
        StaffPartPriority.GetStaffPartPriority();
    },
     GetStaffPartPriority: function () {
        var crudServiceBaseUrl = "/StaffPartPriority",
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
                    //create: {
                    //    url: crudServiceBaseUrl + "/Create",
                    //    dataType: "json",
                    //    type: "post"
                    //},
                    //destroy: {
                    //    url: crudServiceBaseUrl + "/Delete",
                    //    dataType: "json",
                    //    type: "post"
                    //},

                    parameterMap: function (options, operation) {
                        if (operation !== "read" && options.models) {

                            return { models: options.models };
                        }
                    }

                },
               requestEnd: function (e) {

                   if (e.type === "update") {
                       if (e.response.Status != undefined) {
                           if (e.response.Status) {
                               toastr.success(e.response.Message, "دوایر شعب جاری", ToasterOptionMessage);
                               var grid = $("#StaffPartPriorityGrid").data("kendoGrid");
                               grid.dataSource.read();
                               grid.refresh();

                           }
                           else {
                               toastr.error(e.response.Message, "دوایر شعب جاری", ToasterOptionMessage
                               );
                           }

                           var grid = $("#StaffPartPriorityGrid").data("kendoGrid");
                           grid.dataSource.read();
                       }


                   }



               },
                batch: true,
                schema: {
                    model: {
                        id: "StaffPartPriorityId",
                        fields: {

                            StaffPartTitle: { type: "string", editable: false },
                            Priority: {
                                editable: true, type: "number", validation: { required: true, min: 0 }
                            },
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#StaffPartPriorityGrid").kendoGrid({
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
                    width: 50,
                    title: "ردیف",
                    template: "#= ++record #",
                },
                { field: "StaffPartTitle", title: "عنوان دایره" },
                { field: "Priority", title: "اولویت", format: "{0}"/*, editor: customEditor */},
            ],

            editable: true,
            edit: function (event) {
                //   event.container.find(".k-edit-label:first").hide();
                //   event.container.find(".k-edit-field:first").hide();
                event.container.parent().find('.k-window-title').text(event.model.isNew() ? "ایجاد" : "ویرایش");
            },
            cancel: function (e) {
                $('#StaffPartPriorityGrid').data("kendoGrid").cancelChanges();
            },
            dataBinding: function () {
                if (this.dataSource.pageSize() != undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });

    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
 StaffPartPriority.init();

function LoadStaffPartPriority() {
    debugger;
    var form = $('#__AjaxAntiForgeryForm');
    var token = $('input[name="__RequestVerificationToken"]', form).val();
    $.ajax({
        url: "/StaffPartPriority/SetStaffPartPriority",
        dataType: "json",
        type: "POST",
        data:
        {
            __RequestVerificationToken: token
        },
        success: function (response) {

            if (response.Status) {
                AllertSuccess(response.Message, "دوایر شعب جاری");

                StaffPartPriority.init();

            }
            else {
                AllertWarning(response.Message, "دوایر شعب جاری");
            }
        },
        error: function (response) {
            debugger;
            AllertError(response.Message, "خطا در ثبت");

        }
    })
}
//function customEditor(container, options) {
//    $('<input data-bind="value:' + options.field + '"/>')
//        .appendTo(container)
//        .kendoNumericTextBox({
//            decimals: 7,
//            format: "n6"
//        });
//}
