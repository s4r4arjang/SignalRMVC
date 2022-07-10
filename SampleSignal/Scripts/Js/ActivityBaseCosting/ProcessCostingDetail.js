var record, TotalProcessBaseCosting, totalProductCostingValue;
ProcessCostingDetail = {
    init: function () {
        ProcessCostingDetail.AddListener();
    },
    AddListener: function () {
        //دریافت بهای تمام شده هر بخش و تعیین درصد آن
        $(document).ready(function () {
            //دریافت بهای تمام شده
             TotalProcessBaseCosting = parseFloat($('#TotalProcessBaseCosting').val().replace("/", "."));
            //نمایش بهای تمام شده فرایند
            $('.TotalProcessCostingText').html(SetThousandSeprator(TotalProcessBaseCosting));

        
            //دریافت آی دی فرایند
           
            var ProcessCostingId = parseInt($('#ProcessCostingId').val());
            ProcessCostingDetail.GetProductCostingInPeriodsByProcessId(ProcessCostingId);
        });
    },
    GetProductCostingInPeriodsByProcessId: function (ProcessCostingId) {
   
        var crudServiceBaseUrl = "/ActivityBaseCosting",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetProductCostingInPeriodsByProcessId?processId=" + ProcessCostingId,
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
                            Costing: { type: "number", editable: false, format: "{n2}", },
                            RealCosting: { type: "number", editable: false, format: "{n2}", },
                         
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#ProductCostingInPeriodsListGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "جزئیات بهای تمام شده فرایند.xlsx",
                proxyURL: "",
                filterable: true
            },excelExport: function (e) { ExcelSetup(e,cleanupText($('[data-Direct]').text()),"ProductCostingInPeriodsListGrid")},
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
            detailTemplate: kendo.template($("#productStepSubGrid").html()),
            detailInit: detailInit,
            dataBound: function () {
                //this.expandRow(this.tbody.find("tr.k-master-row").first());
            },
            columns: [
                {
                    width: 50,
                    title: "ردیف",
                    template: "#= ++record #",
                },
                { field: "ProductTitle", title: "عنوان برنامه" },
                {
                    field: "Costing", title: "بهای تمام شده  برنامه",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator((dataItem.Costing).toFixed(2)) + '</span>';
                    }
                },
                {
                    field: "RealCosting", title: "بهای تمام شده واقعی برنامه",
                    template: function (dataItem) {
                        return '<span class="number">' + SetThousandSeprator((dataItem.RealCosting).toFixed(2)) + '</span>';
                    }
                },
                //{
                //    field: "percentProduct", title: "درصد", filterable: false,
                //    template: function (dataItem) {
                //            var className = '';
                //            var percentProductStepValue=GetpercentValue(dataItem.Costing,TotalProcessBaseCosting);                          
                //            switch (true) {
                //            case (percentProductStepValue >= 0 && percentProductStepValue <= 25):
                //                className = 'myRedBg';
                //                break;
                //            case (percentProductStepValue > 25 && percentProductStepValue <= 50):
                //                className = 'myYellowBg';
                //                break;
                //            case (percentProductStepValue > 50 && percentProductStepValue <= 75):
                //                className = 'myBlueBg';
                //                break;
                //            case (percentProductStepValue > 75 && percentProductStepValue <= 100):
                //                className = 'myGreenBg';
                //                break;
                //            }
                //            return '<span class="badge number ' + className + '">' + percentProductStepValue + ' %</span>';
                //        }
                //},
              /*   { field: "ProductTitle", title: "واحد اندازه گیری" },*/
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
        function detailInit(e) {
            var productIdABC = e.data.ProductId;
            totalProductCostingValue = e.data.Costing;
            var detailRow = e.detailRow;
            detailRow.find(".tabstrip").kendoTabStrip({
                animation: {
                    open: { effects: "fadeIn" }
                }
            });
            var crudServiceBaseUrl = "/ActivityBaseCosting",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetProductStepCostingInPeriodsByProductId?productId=" + productIdABC,
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
                            
                            Completed: { type: "string", editable: false },
                            ProductStepTitle: { type: "string", editable: false },
                            TotalCosting: { type: "string", editable: false },
                            RealTotalCosting: { type: "string", editable: false },
                            OneCosting: { type: "string", editable: false },
                            RealOneCosting: { type: "string", editable: false },
                            //percentProductStep: {
                            //    type: "number", format: "{n2}", editable: false
                            //},
                        }
                    }
                },
                pageSize: 10,
            });
            //record = 0;
            detailRow.find(".productStep").kendoGrid({
                toolbar: ["excel"],
                excel: {
                    fileName: "جزئیات بهای تمام شده برنامه.xlsx",
                    proxyURL: "",
                    filterable: true
                },excelExport: function (e) { ExcelSetup(e,cleanupText($('[data-Direct]').text()),"productStep")} ,
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
                    { field: "ProductStepTitle", title: "عنوان مرحله" },
                    //{
                    //    field: "TotalCosting", title: "بهای تمام شده واحد مرحله",
                    //    template: function (dataItem) {
                    //        return '<span class="number">' + SetThousandSeprator(dataItem.TotalCosting) + '</span>';
                    //    }
                    //},
                     {
                         field: "Completed", title: "میزان تکمیل شده",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.Completed) + '</span>';
                        }
                    },
                    {
                        field: "OneCosting", title: "بهای تمام شده یک واحد",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.OneCosting) + '</span>';
                        }
                    },
                      {
                          field: "TotalCosting", title: "بهای تمام شده مرحله",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.TotalCosting) + '</span>';
                        }
                    },
                    {
                        field: "RealOneCosting", title: "بهای تمام شده واقعی یک واحد",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.RealOneCosting) + '</span>';
                        }
                    },
                    {
                        field: "RealTotalCosting", title: "بهای تمام شده واقعی مرحله",
                        template: function (dataItem) {
                            return '<span class="number">' + SetThousandSeprator(dataItem.RealTotalCosting) + '</span>';
                        }
                    },
                    //{
                    //    field: "percentProductStep", title: "درصد", filterable: false,
                    //    template: function(dataItem) {
                    //        var className = '';
                    //        var percentProductStepValue=GetpercentValue(dataItem.TotalCosting,totalProductCostingValue);
                           
                    //            switch (true) {
                    //            case (percentProductStepValue >= 0 && percentProductStepValue <= 25):
                    //                className = 'myRedBg';
                    //                break;
                    //            case (percentProductStepValue >25 && percentProductStepValue <= 50):
                    //                className = 'myYellowBg';
                    //                break;
                    //            case (percentProductStepValue > 50 && percentProductStepValue <= 75):
                    //                className = 'myBlueBg';
                    //                break;
                    //            case (percentProductStepValue > 75 && percentProductStepValue <= 100):
                    //                className = 'myGreenBg';
                    //                break;
                    //            }
                    //            return '<span class="badge number ' +
                    //                className +
                    //                '">' +
                    //                percentProductStepValue +
                    //                ' %</span>';
                    //    }
                    //},
                    {
                        command: [
                            { name: "thirdCustom", text: "<span class='customIcon iconInfo'>جزئیات</span>", click: ProductStepActivityCostingDetail },
                        ],
                        title: "عملیات"
                    }
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
        //جزئیات بهای تمام شده
        function ProductStepActivityCostingDetail(e) {
            e.stopPropagation();
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var productStepCostingId = dataItem.ProductStepId;
            var MenuId = 'ActivityBaseCosting';
            var TabUrl = '/ActivityBaseCosting/ProductStepCostingDetail?productStepCostingId=' + productStepCostingId;
            var TabScriptAddress = '/Scripts/Js/ActivityBaseCosting/ProductCostingDetail.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
ProcessCostingDetail.init();
function ExcelSetup(e,lastTitle,TableName){

                  var sheet = e.workbook.sheets[0];
                  sheet.frozenRows = 5;
                  sheet.mergedCells = ["A3:B3","A1:B1","A2:B2","C1:D1","C2:D2","C3:D3","A4:D4"];
                  sheet.name = "Orders";
                sheet.hAlign="center";
           for (var CurrentRowIdx = 0; CurrentRowIdx < sheet.rows.length; CurrentRowIdx++) {
                var row = sheet.rows[CurrentRowIdx];
            sheet.rows[CurrentRowIdx].cells.reverse();   //reverse for rtl coulms 
            for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
              sheet.rows[i].cells[ci].hAlign = "center";
            }
                if (CurrentRowIdx > 0) {//first row is header
               if (TableName == "productStep") {
                  
                       row.cells[0].value = GetpercentValue(e.data[CurrentRowIdx - 1].TotalCosting, totalProductCostingValue); //
                }else{                
                       row.cells[0].value = GetpercentValue(e.data[CurrentRowIdx - 1].Costing, TotalProcessBaseCosting); //
                       }
               }

          }
                       var myHeaders = [{
                    value: cleanupText($("[data-PricingTitleExcel]").text()),
                    textAlign: "center",
                    background:"#60b5ff",   
                    color:"#ffffff",
                     fontSize: 18,
                    verticalAlign: "center",
                  },{
                    value:$("[data-ProgramTitleExcel]").text().trim(),
                    textAlign: "center",
                    background:"#60b5ff",
                    color:"#ffffff",
                     fontSize: 18,
                    verticalAlign: "center",
                    
                  }];
                  var myHeaders1 = [{
                    value:"",
                    textAlign: "center",
                    background:"#60b5ff",
                    color:"#ffffff",
                     fontSize: 16,
                    verticalAlign: "center",
                  },{
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
                var myHeadersFinal = [{
                    value:lastTitle,
                    textAlign: "center",
                    background:"#60b5ff",
                    color:"#ffffff",
                     fontSize: 14,
                    verticalAlign: "center",
                  }];

                  sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70,width:100},
                      { cells: myHeaders1, type: "header", height: 40,width:100},
                      { cells: myHeaders2, type: "header", height: 40},
                      { cells: myHeadersFinal, type: "header", height: 40});
                }
function GetpercentValue(value,Total) { 
     var percentProductStepValue;
                            if (value == 0) {
                                percentProductStepValue = 0;
                            } else {
                                 percentProductStepValue =((value /Total) * 100).toFixed(2);
                            }
    return percentProductStepValue;
}

