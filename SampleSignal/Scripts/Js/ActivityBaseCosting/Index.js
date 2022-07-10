
var record, selectedProcessIds=[];
ActivityBaseCosting = {
    init: function () {
        ActivityBaseCosting.GetProcessList();
        ActivityBaseCosting.AddListener();
    },
    AddListener: function() {
        //محاسبه بهای تمام شده
        $('#CalculateActivityBaseCosting').on('click',
            function () {
                
          
                ActivityBaseCosting.CalculateActivityBaseCosting();
            });
    },
    GetProcessList: function () {
        var crudServiceBaseUrl = "/ActivityBaseCosting",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetProcessList",
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
                        id: "Id",
                        fields: {
                            Title: { type: "string", editable: false },
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#processListGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "لیست عناوین بهای تمام شده.xlsx",
                proxyURL: "",
                filterable: true
            },  excelExport:function (e) { ExcelSetup(e,"محاسبه و آنالیز بهای تمام شده")},
              
                pdf: {
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.9
                },
            dataSource: dataSource,
            sortable: true,
            resizable: true,
            columnMenu: false,
            change: onChange,
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
             //   { selectable: true, width: "50px" },
                {
                    width: 50,
                    title: "ردیف",
                    template: "#= ++record #",
                },
                { field: "Title", title: "عنوان" },
                {
                    command: [
                        { name: "thirdCustom", text: "<span class='customIcon iconInfo'>جزئیات</span>", click: DetailActivityCost },
                    ],
                    title: "عملیات"
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
        });
        function onChange(arg) {
            var selectedIds = this.selectedKeyNames();
            selectedProcessIds = [];
            for (i = 0; i < selectedIds.length; i++) {
                selectedProcessIds.push(parseInt(selectedIds[i]));
            }
            if (selectedProcessIds.length > 0) {
                $('#ActivityBaseCostingBox').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#ActivityBaseCostingBox').removeClass('displayShow').addClass('displayNone');
            }
        }
        //جزئیات بهای تمام شده
        function DetailActivityCost(e) {
            e.stopPropagation();
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var ProcessId = dataItem.ProcessId;
            var MenuId = 'ActivityBaseCosting';
            var TabUrl = '/ActivityBaseCosting/ProcessCostingDetail?processId=' + ProcessId;
            var TabScriptAddress = '/Scripts/Js/ActivityBaseCosting/ProcessCostingDetail.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
    },
    CalculateActivityBaseCosting: function () {
        debugger
        function showLoader() {
            $("#idloder").css("display", "");
            $("#ActivityBaseCostingBox").css("display", "none");
        }

        function hideLoader() {
          
                $("#idloder").css("display", "none");
            $("#ActivityBaseCostingBox").css("display", "");
        }
       
        selectedProcessIds = JSON.stringify(selectedProcessIds);
        debugger
        //var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]').val();
        $.ajax(
            {
                beforeSend: function () { showLoader(); },
                type: 'POST',
                //headers: { __RequestVerificationToken: token } ,
                url: '/ActivityBaseCosting/CalculateActivityBaseCosting',
                dataType: 'json',
                //contentType: "application/json; charset=utf-8",
               
                data: {
                   // 'processIdList': selectedProcessIds,
                   __RequestVerificationToken : token
                },
                success: function (response) {

                    hideLoader();
                    if (response.Status === true) {
                        AllertSuccess(response.Message, "محاسبه بها");
                   }
                    else {
                        AllertError(response.Message, "محاسبه بها");
                 }
                
                    $('#processListGrid').data('kendoGrid').dataSource.read();
                    $('#processListGrid').data('kendoGrid').refresh();
                },
                error: function () {
                    AllertError("بروز خطا در برقراری ارتباط", "محاسبه بها")
                  
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
ActivityBaseCosting.init();
  $(document).ready(function () {
     var exportFlag = false;
        
          $("#processListGrid").data("kendoGrid").bind("pdfExport", function (e) {
            if (!exportFlag) {
              e.sender.hideColumn(3);
                e.sender.hideColumn(0);
              e.preventDefault();
              exportFlag = true;

              e.sender.saveAsPDF().then(function(){
                e.sender.showColumn(3);
                  e.sender.showColumn(0);
                exportFlag = false;
              });

            }
          });
        });
function ExcelSetup(e,CustomeTitle){

                  var sheet = e.workbook.sheets[0];
                  sheet.frozenRows = 4;
                  sheet.mergedCells = ["A3:B3","A1:D1","A2:D2","C3:D3"];
                  sheet.name = "Orders";
                sheet.hAlign="Center";
               
   
           for (var i = 0; i < sheet.rows.length; i++) {
            sheet.rows[i].cells.reverse();    
            for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
              sheet.rows[i].cells[ci].hAlign = "Center";
            }
          }
                       var myHeaders = [{
                    value:CustomeTitle,
                    textAlign: "center",
                    background:"#60b5ff",
                    color:"#ffffff",
                     fontSize: 18,
                    verticalAlign: "center",
                    
                  }];
                  var myHeaders1 = [{
                    value:"تاریخ گزارش :"+$("[data-CurrentDate]").attr("data-CurrentDate"),
                    textAlign: "center",
                    background:"#60b5ff",
                    color:"#ffffff",
                     fontSize: 16,
                    verticalAlign: "center",
                  }];
                           var myHeaders2 = [{
                    value:cleanupText($('[data-activeFiscalYearPeriodName]').text().trim()),
                    textAlign: "center",
                    background:"#60b5ff",
                    color:"#ffffff",
                     fontSize: 14,
                    verticalAlign: "center",
                  },{
                    value:cleanupText($('[data-activefiscalyearname]').text().trim()),
                    textAlign: "center",
                    background:"#60b5ff",
                    color:"#ffffff",
                     fontSize: 14,
                    verticalAlign: "center",
                  }] ;
               
                  sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70,width:100},
                      { cells: myHeaders1, type: "header", height: 40,width:100},
                      { cells: myHeaders2, type: "header", height: 40}
                     );
                }