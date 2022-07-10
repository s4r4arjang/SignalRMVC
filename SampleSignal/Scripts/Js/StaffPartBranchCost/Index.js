
var StaffPartBranchCost = {
    init: function () {
        StaffPartBranchCost.GetStaffPartBranchCost();
    },
    GetStaffPartBranchCost: function () {
        debugger;
        var crudServiceBaseUrl = "/StaffPartBranchCost",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetList",
                        dataType: "jsonp"
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
                        id: "BranchStaffId",
                        fields: {
                            Title: { type: "string", validation: { required: true } },

                            PriorityValue: { type: "number", validation: { required: true } },
                            CalculatePrice: { type: "number", validation: { required: true } },
                        },



                    },
                },
                pageSize: 10
            });
        record = 0;
        $("#StaffPartBranchCostGrid").kendoGrid({
            //toolbar: ["excel"],

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

         
                { field: "Title", title: "عنوان " },
                { field: "PriorityValue", title: "اولویت " },
                {
                    field: "StaffPrice", title: "مبلغ"
                   , format: "{0:n}"
                },
                {
                    field: "OtherPrice", title: "سهم از ادارات", 
                     format: "{0:n}"
                },
                //{
                //    field: "CalculatePrice", title: "مبلغ محاسباتی"
                //    , format: "{0:n}"
                //},
              
                {
                    command: [
                        {
                            name: "customEdit",
                            text: 'شعبه عملیاتی',
                            iconClass: "k-icon k-i-edit",
                            click: SetStaffCostBranchAssigned,
                           
                        },
                    ],
                    title: "عملیات",
                    width: 300
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
            dataBound: function (e) {

                debugger;
               
                //dataItems = e.sender.dataSource.data();
                //for (var i = 0; i < dataItems.length; i++) {
                //    debugger;
                
                //    var row = this.tbody.find("[data-uid='" + dataItems[i].uid + "']");
                //    if (dataItems[i].StaffPrice > 0) {
                //        $(row).find(".k-grid-customEdit").css('display', 'show');;


                //    }
                //    else {
                //        $(row).find(".k-grid-customEdit").css('display', 'none');;
                //    }
                //}
            


            }
        });




        function SetStaffCostBranchAssigned(e) {

            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItemCost = this.dataItem($(e.currentTarget).closest("tr"));
            var BranchStaffId = dataItemCost.BranchStaffId;

            var Title = dataItemCost.Title;
            var MenuId = 'StaffPartBranchCost';
            var TabUrl = '/StaffPartBranchCost/Details?BranchStaffId=' + BranchStaffId + "&StaffBranchTitle=" + Title;
            var TabScriptAddress = '/Scripts/Js/StaffPartBranchCost/Detail.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            //e.preventDefault();


            //var dataItemProcess = this.dataItem($(e.currentTarget).closest("tr"));
            //$("#ProcessActivityAccountStructureId").val(dataItemProcess.RoleId)
            //RoleList.GetPermission( dataItemProcess.RoleId)

            //$('#HeadPermissionTitle').text("دسترسی ها  " + dataItemProcess.Title);
        }
    },

    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
StaffPartBranchCost.init();
function customEditordisabled(container, options) {
    $('<input disabled data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            decimals: 7,
            format: "n6"
        });
}
function UpdaetStaffBranchCost() {
    function showLoader() {
        $("#idloder").css("display", "");
        $("#loadButtonBox").css("display", "none");
    }

    function hideLoader() {

        $("#idloder").css("display", "none");
        $("#loadButtonBox").css("display", "");
    }
    debugger;
    
    var token = $('input[name="__RequestVerificationToken"]').val();
    $.ajax({
        beforeSend: function () { showLoader(); },
        url: "/StaffPartBranchCost/SetStaffPartBranchCost",
        dataType: "json",
        type: "POST",
        data:
            { __RequestVerificationToken: token } ,

        success: function (response) {
            hideLoader();
            if (response.Status) {
                AllertSuccess(response.Message, "ادارات ستادی ");

                var grid = $("#StaffPartBranchCostGrid").data("kendoGrid");
                grid.dataSource.read();
                grid.refresh();

            }
            else {
                AllertWarning(response.Message, "ادارات ستادی ");
            }
        },
        error: function (response) {
            
            AllertError("خطا در ثبت", "ادارات ستادی ");

        }
    })
}


function downloadexcel() {

    window.open( '/StaffPartBranchCost/Export');
   // window.location = window.location.origin + '/StaffPartBranchCost/Export' ;
   
 
}