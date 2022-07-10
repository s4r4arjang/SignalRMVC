$("#ReportProcessYear").on("change", function () {

    $("#ReportProcessPeriod").val(null).trigger('change');
    var year = $("#ReportProcessYear").val();
    if (year != "") {
        $("#ReportProcessPeriod").val(null).trigger('change');
        $.ajax({
            type: 'Get',
            url: '/UserSetting/Period',
            dataType: 'json',
            data: { id: year },
            success: function (response) {
                var period =
                    '<option value >دوره مالی را انتخاب کنید </option>';
                $.each(response, function (index, value) {

                    period += '<option value="' + value.PeriodId + '">' + value.Title + '</option>';

                });

                $("#ReportProcessPeriod").html(period);
            }
        })

    }
    else {
        var period =
            '<option value >دوره مالی را انتخاب کنید </option>';
        $("#ReportProcessPeriod").html(period);
    }
})


$("#frm-ReportProcess").submit(function (e) {

    e.preventDefault();
}).validate({
    rules: {

       
        ReportProcessBranch: { required: true },
        ReportProcessYear: { required: true },
       // ReportProcessPeriod: { required: true },
        },

    messages: {
    },
    submitHandler: function (form) {
     
        var BranchId = parseInt($('#ReportProcessBranch').val());
        var FiscalYearId = parseInt($('#ReportProcessYear').val());
        var PeriodId = parseInt($('#ReportProcessPeriod').val());


        var ReportFilter = {
            
            'BranchId': BranchId,
            'FiscalYearId': FiscalYearId,
            'PeriodId': PeriodId,
        }
        $('#BoxReportBudgetProcess').removeClass('displayNone').addClass('displayShow');
        $('#BoxReportBudgetProduct').removeClass('displayShow').addClass('displayNone');
     
        var ReportBudgetProcessGrid = $("#ReportBudgetProcessGrid").data("kendoGrid");
        ReportBudgetProcessGrid.dataSource.transport.options.read.url = '/ReportBudget/BudgetProcessList?FiscalYearId=' + FiscalYearId + "&PeriodId=" + PeriodId + "&BranchId=" + BranchId;
        ReportBudgetProcessGrid.dataSource.read();

    }
});


var ReportBudgetProcess = {
    init: function () {
     
    
        ReportBudgetProcess.GetAllProcess();
    },
      GetAllProcess: function () {
       
      
      
        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    
                    url: '',
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
                    id: "ProcessId",
                    fields: {
                        ProcessTitle: { type: "string", editable: false },

                        ActivityBudget: { type: "number", editable: false },
                        DirectCostBudget: { type: "number", editable: false },
                        DirectWageBudget: { type: "number", editable: false },
                        StaffBudget: { type: "number", editable: false },
                        TotalBudget: { type: "number", editable: false },



                    }
                }
            },
            pageSize: 10
            , aggregate:
                [
                    { field: "ActivityBudget", aggregate: "sum" },
                    { field: "DirectCostBudget", aggregate: "sum" },
                    { field: "DirectWageBudget", aggregate: "sum" },
                    { field: "StaffBudget", aggregate: "sum" },
                    { field: "TotalBudget", aggregate: "sum" }
                ]
        });
        record = 0;
          $("#ReportBudgetProcessGrid").kendoGrid({
              toolbar: ["excel"],
              excel: {
                  fileName: "جزئیات بودجه  فرایند.xlsx",
                  proxyURL: "",
                  filterable: true,
                  allPages: true
              },
              excelExport: function (e) {
                  ExcelSetupHasib(e, $('#ReportProcessPeriod option:selected').text(), $('#ReportProcessYear option:selected').text(), $('#ReportProcessBranch option:selected').text())
               //   ExcelSetup(e, cleanupText($('[data-Direct]').text()), $('#ReportProcessBranch option:selected').text())
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
                { field: "ProcessTitle", title: "عنوان", footerTemplate: "مجموع" },

                {
                    field: "ActivityBudget", title: "بودجه هزینه غیرمستقیم  ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.ActivityBudget) + '</span>';
                    }
                },
                {
                    field: "DirectCostBudget", title: "بودجه هزینه مستقیم  ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.DirectCostBudget) + '</span>';
                    }
                },
                {
                    field: "DirectWageBudget", title: "بودجه دستمزد مستقیم  ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.DirectWageBudget) + '</span>';
                    }
                },
                {
                    field: "StaffBudget", title: "بودجه پشتیبانی  ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.StaffBudget) + '</span>';
                    }
                },
                {
                    field: "TotalBudget", title: "کل بودجه ",
                    aggregates: ["sum"], footerTemplate: "#=sum#",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator(dataItem.TotalBudget) + '</span>';
                    }
                },

                {
                    command: [
                        { name: "thirdCustom", text: "<span class='customIcon iconInfo'>جزئیات</span>", click: ProductBudget },
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
          //جزئیات   بودجه محصولات
          function ProductBudget(e) {
              debugger;
              $('#BoxReportBudgetProduct').removeClass('displayNone').addClass('displayShow');
              var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
              var ProcessId = dataItem.ProcessId;
              var BranchId = parseInt($('#ReportProcessBranch').val());
              var FiscalYearId = parseInt($('#ReportProcessYear').val());
              var PeriodId = parseInt($('#ReportProcessPeriod').val());
              $('#BoxReportBudgetProduct .title-box').html(dataItem.ProcessTitle);
              var crudServiceBaseUrl = "/ReportBudget",
                  dataSource = new kendo.data.DataSource({
                      transport: {
                          read: {
                              url: crudServiceBaseUrl + '/BudgetProductList?FiscalYearId=' + FiscalYearId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId + '&ProcessId=' + ProcessId,
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
                              id: "ProductId",
                              fields: {
                                  ProductTitle: { type: "string", editable: false },
                                  ActivityBudget: { type: "number", editable: false },
                                  DirectCostBudget: { type: "number", editable: false },
                                  DirectWageBudget: { type: "number", editable: false },
                                  StaffBudget: { type: "number", editable: false },
                                  TotalBudget: { type: "number", editable: false },

                              }
                          }
                      },
                      pageSize: 10
                      , aggregate:
                          [
                              { field: "ActivityBudget", aggregate: "sum" },
                              { field: "DirectCostBudget", aggregate: "sum" },
                              { field: "DirectWageBudget", aggregate: "sum" },
                              { field: "StaffBudget", aggregate: "sum" },
                              { field: "TotalBudget", aggregate: "sum" }
                          ]
                  });
              record = 0;
              $("#ReportBudgetProductGrid").kendoGrid({
                  toolbar: ["excel"],
                  excel: {
                      fileName: "جزئیات بودجه  برنامه.xlsx",
                      proxyURL: "",
                      filterable: true,
                      allPages: true
                  },
                  excelExport: function (e) {
                      ExcelSetupHasib(e, $('#ReportProcessPeriod option:selected').text(), $('#ReportProcessYear option:selected').text(), $('#ReportProcessBranch option:selected').text())
                    //  ExcelSetup(e, cleanupText($('[data-Direct]').text()), "ReportBudgetProductGrid")
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
                  detailTemplate: kendo.template($("#ReportBudgetproductStepSubGrid").html()),
                  detailInit: detailInitBudgetProductStep,
                  dataBound: function () {
                      //this.expandRow(this.tbody.find("tr.k-master-row").first());
                  },
                  columns: [
                      {
                          width: 50,
                          title: "ردیف",
                          template: "#= ++record #",
                      },
                      { field: "ProductTitle", title: "عنوان برنامه", footerTemplate: "مجموع" },
                      {
                          field: "ActivityBudget", title: "بودجه هزینه غیرمستقیم  ",
                          aggregates: ["sum"], footerTemplate: "#=sum#",
                          template: function (dataItem) {
                              return '<span class="number">' + SetThousandSeprator(dataItem.ActivityBudget) + '</span>';
                          }
                      },
                      {
                          field: "DirectCostBudget", title: "بودجه هزینه مستقیم  ",
                          aggregates: ["sum"], footerTemplate: "#=sum#",
                          template: function (dataItem) {
                              return '<span class="number">' + SetThousandSeprator(dataItem.DirectCostBudget) + '</span>';
                          }
                      },
                      {
                          field: "DirectWageBudget", title: "بودجه دستمزد مستقیم  ",
                          aggregates: ["sum"], footerTemplate: "#=sum#",
                          template: function (dataItem) {
                              return '<span class="number">' + SetThousandSeprator(dataItem.DirectWageBudget) + '</span>';
                          }
                      },
                      {
                          field: "StaffBudget", title: "بودجه پشتیبانی  ",
                          aggregates: ["sum"], footerTemplate: "#=sum#",
                          template: function (dataItem) {
                              return '<span class="number">' + SetThousandSeprator(dataItem.StaffBudget) + '</span>';
                          }
                      },
                      {
                          field: "TotalBudget", title: "کل بودجه ",
                          aggregates: ["sum"], footerTemplate: "#=sum#",
                          template: function (dataItem) {
                              return '<span class="number">' + SetThousandSeprator(dataItem.TotalBudget) + '</span>';
                          }
                      },

                  ],
                  filterable: {
                      mode: "row"
                  },
                  editable: "popup",
                  dataBinding: function () {
                      if (this.dataSource.pageSize() != undefined) {
                          record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                      } else {
                          record = 0;
                      }
                  },
              });
              function detailInitBudgetProductStep(e) {
                  debugger;
                  var ProductId = e.data.ProductId;
              
                  //var ProcessId = e.data.ProcessId;

                  var BranchId = parseInt($('#ReportProcessBranch').val());
                  var FiscalYearId = parseInt($('#ReportProcessYear').val());
                  var PeriodId = parseInt($('#ReportProcessPeriod').val());

                  var detailRow = e.detailRow;
                  detailRow.find(".tabstrip").kendoTabStrip({
                      animation: {
                          open: { effects: "fadeIn" }
                      }
                  });
                  var crudServiceBaseUrl = "/ReportBudget",
                      dataSource = new kendo.data.DataSource({
                          transport: {
                              read: {
                                  url: crudServiceBaseUrl + '/BudgetProductStepList?FiscalYearId=' + FiscalYearId + " &ProductId=" + ProductId + " &PeriodId=" + PeriodId + "&BranchId=" + BranchId  ,//+ '&ProcessId=' + ProcessId,
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
                                  id: "ProductStepId",
                                  fields: {

                                      ProductStepTitle: { type: "string", editable: false },
                                      ActivityBudget: { type: "number", editable: false },
                                      DirectCostBudget: { type: "number", editable: false },
                                      DirectWageBudget: { type: "number", editable: false },
                                      StaffBudget: { type: "number", editable: false },
                                      TotalBudget: { type: "number", editable: false },
                                  }
                              }
                          },
                          pageSize: 10
                          , aggregate:
                              [
                                  { field: "ActivityBudget", aggregate: "sum" },
                                  { field: "DirectCostBudget", aggregate: "sum" },
                                  { field: "DirectWageBudget", aggregate: "sum" },
                                  { field: "StaffBudget", aggregate: "sum" },
                                  { field: "TotalBudget", aggregate: "sum" }
                              ]
                      });
                  //record = 0;
                  detailRow.find(".productStep").kendoGrid({
                      toolbar: ["excel"],
                      excel: {
                          fileName: "جزئیات بودجه  مرحله.xlsx",
                          proxyURL: "",
                          filterable: true
                      }, excelExport: function (e) {
                          ExcelSetupHasib(e, $('#ReportProcessPeriod option:selected').text(), $('#ReportProcessYear option:selected').text(), $('#ReportProcessBranch option:selected').text())
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
                          { field: "ProductStepTitle", title: "عنوان مرحله", footerTemplate: "مجموع" },

                          {
                              field: "ActivityBudget", title: "بودجه هزینه غیرمستقیم  ",
                              aggregates: ["sum"], footerTemplate: "#=sum#",
                              template: function (dataItem) {
                                  return '<span class="number">' + SetThousandSeprator(dataItem.ActivityBudget) + '</span>';
                              }
                          },
                          {
                              field: "DirectCostBudget", title: "بودجه هزینه مستقیم  ",
                              aggregates: ["sum"], footerTemplate: "#=sum#",
                              template: function (dataItem) {
                                  return '<span class="number">' + SetThousandSeprator(dataItem.DirectCostBudget) + '</span>';
                              }
                          },
                          {
                              field: "DirectWageBudget", title: "بودجه دستمزد مستقیم  ",
                              aggregates: ["sum"], footerTemplate: "#=sum#",
                              template: function (dataItem) {
                                  return '<span class="number">' + SetThousandSeprator(dataItem.DirectWageBudget) + '</span>';
                              }
                          },
                          {
                              field: "StaffBudget", title: "بودجه پشتیبانی  ",
                              aggregates: ["sum"], footerTemplate: "#=sum#",
                              template: function (dataItem) {
                                  return '<span class="number">' + SetThousandSeprator(dataItem.StaffBudget) + '</span>';
                              }
                          },
                          {
                              field: "TotalBudget", title: "کل بودجه ",
                              aggregates: ["sum"], footerTemplate: "#=sum#",
                              template: function (dataItem) {
                                  return '<span class="number">' + SetThousandSeprator(dataItem.TotalBudget) + '</span>';
                              }
                          },
                         
                      ],
                      editable: "popup",
                      //dataBinding: function () {
                      //    if (this.dataSource.pageSize() != undefined) {
                      //        record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                      //    } else {
                      //        record = 0;
                      //    }
                      //},
                  });
              }
  
          }

    },

   
}
ReportBudgetProcess.init();


function ExcelSetup(e, lastTitle, TableName) {
    debugger
  //  var sheet = e.workbook.sheets[0];
    var workbook = e.workbook;
    var sheet = workbook.sheets[0];

    workbook.rtl = true;


    sheet.frozenRows = 5;
  sheet.mergedCells = ["A3:B3", "A1:B1", "A2:B2", "C1:D1", "C2:D2", "C3:D3", "A4:D4"];
    sheet.name = "حسیب سیستم";
    sheet.hAlign = "right";
    for (var CurrentRowIdx = 0; CurrentRowIdx < sheet.rows.length; CurrentRowIdx++) {
        var row = sheet.rows[CurrentRowIdx];
        sheet.rows[CurrentRowIdx].cells.reverse();   //reverse for rtl coulms 
        for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
            sheet.rows[i].cells[ci].hAlign = "center";
        }
        //if (CurrentRowIdx > 0) {//first row is header
        //    if (TableName == "productStep") {

        //        row.cells[0].value = GetpercentValue(e.data[CurrentRowIdx - 1].TotalCosting, totalProductCostingValue); //
        //    } else {
        //        row.cells[0].value = GetpercentValue(e.data[CurrentRowIdx - 1].Costing, TotalProcessBaseCosting); //
        //    }
        //}

    }
    var myHeaders = [
       
        {
       
        textAlign: "center",
      background: "#B7B7B7",
            color: "#000",
        fontSize: 18,
        verticalAlign: "center",

        },
        {
            value: "بانک سپه",
            textAlign: "center",
            background: "#B7B7B7",
            color: "#000",
            fontSize: 22,
            verticalAlign: "center",

        },
        {
         
            textAlign: "center",
            background: "#B7B7B7",
            color: "#ffffff",
            fontSize: 18,
            verticalAlign: "center",

        },
        {
            value: "حسیب سیستم",
            textAlign: "center",
            background: "#B7B7B7",
            color: "#ffffff",
            fontSize: 15,
            verticalAlign: "center",
        },

    ];

    var myHeaders1 = [
        {
            value: "تاریخ گزارش :" + $("[data-CurrentDate]").attr("data-CurrentDate"),
            textAlign: "center",
            background: "#B7B7B7",
            color: "#ffffff",
            fontSize: 16,
            verticalAlign: "center",
        },
        {
            value: cleanupText($('[data-activefiscalyearname]').text().trim()),
            textAlign: "center",
            background: "#B7B7B7",
            color: "#ffffff",
            fontSize: 14,
            verticalAlign: "center",
        },
        {
            value: cleanupText($('[data-activeFiscalYearPeriodName]').text().trim()),
            textAlign: "center",
            background: "#B7B7B7",
            color: "#ffffff",
            fontSize: 14,
            verticalAlign: "center",
        },
        {
        value: "",
        textAlign: "center",
       background: "#B7B7B7",
        color: "#ffffff",
        fontSize: 16,
        verticalAlign: "center",
        }
        ,
      

    ];
    var myHeaders2 = [
        {
      
        textAlign: "center",
        background: "#B7B7B7",
        color: "#ffffff",
        fontSize: 14,
        verticalAlign: "center",
    },
        {
            value: TableName+"شعبه ",
        textAlign: "center",
       background: "#B7B7B7",
        color: "#ffffff",
        fontSize: 22,
        verticalAlign: "center",
        },
        {

            textAlign: "center",
            background: "#B7B7B7",
            color: "#ffffff",
            fontSize: 14,
            verticalAlign: "center",
        },
        {

            textAlign: "center",
            background: "#B7B7B7",
            color: "#ffffff",
            fontSize: 14,
            verticalAlign: "center",
        },
    ];
    //var myHeadersFinal = [{
    //    value: TableName,
    //    textAlign: "center",
    //    background: "#B7B7B7",
    //    color: "#ffffff",
    //    fontSize: 14,
    //    verticalAlign: "center",
    //}];

    sheet.rows.splice(0, 0, {
        cells: myHeaders, type: "header", height: 70, width: 100
    },
        { cells: myHeaders1, type: "header", height: 40, width: 100 },
        { cells: myHeaders2, type: "header", height: 40 },
       // { cells: myHeadersFinal, type: "header", height: 40 },
       
    );
}


