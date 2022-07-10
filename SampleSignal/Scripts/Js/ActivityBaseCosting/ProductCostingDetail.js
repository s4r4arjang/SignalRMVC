var record, ActivityActivityBaseCosting, costType, activityBaseCostingdetailTitle;
var sourceActivityTrace = document.getElementById("ActivityTraceTemplate").innerHTML;
var templateActivityTrace = Handlebars.compile(sourceActivityTrace);
var sourceActivityCostTrace = document.getElementById("ActivityCostTraceTemplate").innerHTML;
var templateActivityCostTrace = Handlebars.compile(sourceActivityCostTrace);

ProductCostingDetail = {
    init: function () {
        ProductCostingDetail.AddListener();
        
    },
    AddListener: function () {
        //دریافت بهای تمام شده هر بخش و تعیین درصد آن
        $(document).ready(function () {
            //دریافت آی دی مرحله
            var ProductStepCostingId = parseInt($('#ProductStepCostingId').val());
            //دریافت بهای تمام شده
          //  var TotalActivityBaseCosting = parseFloat($('#TotalActivityBaseCosting').val().replace("/", "."));
          //  ActivityActivityBaseCosting = parseFloat($('#ActivityActivityBaseCosting').val().replace("/", "."));
          //  var DirectCostActivityBaseCosting = parseFloat($('#DirectCostActivityBaseCosting').val().replace("/", "."));
          //  var DirectWageActivityBaseCosting = parseFloat($('#DirectWageActivityBaseCosting').val().replace("/", "."));
          //  var SupportCenterActivityBaseCosting = parseFloat($('#SupportCenterActivityBaseCosting').val().replace("/", "."));
          //  //محاسبه درصد بهای تمام شده
          //  var percentActivityCosting,percentDirectCostCosting,
          //      percentDirectWageCosting,
          //      percentSupportCenterCosting;
          //  if (TotalActivityBaseCosting === 0) {
          //      percentActivityCosting = 0; percentDirectCostCosting = 0, percentDirectWageCosting = 0,percentSupportCenterCosting = 0
          //  }
          //  else {
          //       percentActivityCosting =((ActivityActivityBaseCosting / TotalActivityBaseCosting) * 100).toFixed(2);
          //       percentDirectCostCosting =((DirectCostActivityBaseCosting / TotalActivityBaseCosting) * 100).toFixed(2);
          //       percentDirectWageCosting =((DirectWageActivityBaseCosting / TotalActivityBaseCosting) * 100).toFixed(2);
          //       percentSupportCenterCosting =((SupportCenterActivityBaseCosting / TotalActivityBaseCosting) * 100).toFixed(2);
          //  }
          //  //تعیین درصد نمودار
          //  $('.ActivityCostingValue').val(percentActivityCosting).trigger('change');
          // // $('.DirectCostCostingValue').val(percentDirectCostCosting).trigger('change');
          //  $('.DirectWageCostingValue').val(percentDirectWageCosting).trigger('change');
          //  $('.SupportCenterValue').val(percentSupportCenterCosting).trigger('change');
          //  //تعیین مبلغ نمودار
          //  $('.ActivityCostingText').html(SetThousandSeprator((ActivityActivityBaseCosting).toFixed(2)));
          ////  $('.DirectCostCostingText').html(SetThousandSeprator((DirectCostActivityBaseCosting).toFixed(2)));
          //  $('.DirectWageCostingText').html(SetThousandSeprator((DirectWageActivityBaseCosting).toFixed(2)));
          //  $('.SupportCenterText').html(SetThousandSeprator((SupportCenterActivityBaseCosting).toFixed(2)));
          //  //نمایش بهای تمام شده مرحله
          //  $('.TotalCostingText').html(SetThousandSeprator(TotalActivityBaseCosting));
            ProductCostingDetail.ChartKnob();
            $('.activityCostDetailLinks').on('click', function (e) {
                e.preventDefault();
         
                if ($(this).attr('type') == 'activity') {

                       $('.activityBaseBoxes').removeClass('displayShow').addClass('displayNone');
                    $('.activityBaseBoxesActivity').removeClass('displayNone').addClass('displayShow');
                    $("#ActivitiesInStepCostingGrid").data("kendoGrid")?.destroy();
                    ProductCostingDetail.GetActivitiesInProductStepCosting(ProductStepCostingId);
                 
                }
                else if ($(this).attr('type') == 'otherCost') {
                    costType = parseInt($(this).attr('costType'));
                    $('.activityBaseBoxes').removeClass('displayShow').addClass('displayNone');
                    $('.StaffBranch').removeClass('displayShow').addClass('displayNone');
                    $('.activityBaseBoxesOtherItems').removeClass('displayNone').addClass('displayShow');
                    $("#otherItemsInStepCostingGrid").data("kendoGrid")?.destroy();
                    ProductCostingDetail.GetCostsInProductStepCosting(ProductStepCostingId, costType);
                    activityBaseCostingdetailTitle = $(this).find('.detailTitle').html();
                    $('.otherItemsInPeriodTitle').html(activityBaseCostingdetailTitle+' ');
                  
                }
                else if ($(this).attr('type') == 'directWage') {
                    costType = parseInt($(this).attr('costType'));
                     $('.activityBaseBoxes').removeClass('displayShow').addClass('displayNone');
                    $('.activityBaseBoxesOtherItems').removeClass('displayNone').addClass('displayShow');
                    $('.StaffBranch').removeClass('displayShow').addClass('displayNone');
                     $("#otherItemsInStepCostingGrid").data("kendoGrid")?.destroy();
                     
                    ProductCostingDetail.GetCostsInProductStepCosting(ProductStepCostingId, costType);
                    activityBaseCostingdetailTitle = $(this).find('.detailTitle').html();
                    $('.otherItemsInPeriodTitle').html(activityBaseCostingdetailTitle + ' ');
                   
                }
                else if ($(this).attr('type') == 'support') {
                    costType = parseInt($(this).attr('costType'));
                    $('.activityBaseBoxes').removeClass('displayShow').addClass('displayNone');
                    $('.StaffBranch').removeClass('displayShow').addClass('displayNone');
                    $('.activityBaseBoxesOtherItems').removeClass('displayNone').addClass('displayShow');
                    ProductCostingDetail.GetCostsInProductStepCosting(ProductStepCostingId, costType);
                    activityBaseCostingdetailTitle = $(this).find('.detailTitle').html();
                    $('.otherItemsInPeriodTitle').html(activityBaseCostingdetailTitle + ' ');
                   
                }

                else if ($(this).attr('type') == 'StaffBranch') {
                 
                    $('.activityBaseBoxes').removeClass('displayShow').addClass('displayNone');
                    $('.activityBaseBoxesOtherItems').removeClass('displayShow').addClass('displayNone');
                    $('.StaffBranch').removeClass('displayNone').addClass('displayShow');
                    ProductCostingDetail.GetProductStepBranchStaffCosting(ProductStepCostingId);
                }
            });
            //دریافت هزینه های غیر مستقیم مرحله جاری
            $('#getIndirectCostInPeriod').on('click',
                function () {
                    $('.indirectCostsInStepCostingBox').removeClass('displayNone').addClass('displayShow');
                    ProductCostingDetail.GetIndirectCostsInProductStepCost(ProductStepCostingId);
                });
        });
    },
    ChartKnob: function () {
        $(function () {
            /* jQueryKnob */

            $('.knob').knob({
                readOnly: true,
                thickness: 0.2,
                height: '75%' ,
                width: '75%',
                
                draw: function () {
                    //style rtl
                    this.i.css({
                        'margin-right': '-' + ((this.w * 3 / 4 + 2) >> 0) + 'px',
                        'margin-left': 'auto',
                        'font-size': '16px!important',
                    }).css('font-size', '11.5pt');;
                    if (this.$.data('skin') == 'tron') {
                        
                        var a = this.angle(this.cv) // Angle
                            ,
                            sa = this.startAngle // Previous start angle
                            ,
                            sat = this.startAngle // Start angle
                            ,
                            ea // Previous end angle
                            ,
                            eat = sat + a // End angle
                            ,
                            r = true

                        this.g.lineWidth = this.lineWidth

                        this.o.cursor && (sat = eat - 0.3) && (eat = eat + 0.3)

                        if (this.o.displayPrevious) {
                            ea = this.startAngle + this.angle(this.value)
                            this.o.cursor && (sa = ea - 0.3) && (ea = ea + 0.3)
                            this.g.beginPath()
                            this.g.strokeStyle = this.previousColor
                            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false)
                            this.g.stroke()
                        }

                        this.g.beginPath()
                        this.g.strokeStyle = r ? this.o.fgColor : this.fgColor
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false)
                        this.g.stroke()

                        this.g.lineWidth = 2
                        this.g.beginPath()
                        this.g.strokeStyle = this.o.fgColor
                        this.g.arc(this.xy,
                            this.xy,
                            this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3,
                            0,
                            2 * Math.PI,
                            false)
                        this.g.stroke()

                        return false
                    }
                }
            })
        });
    },
    GetActivitiesInProductStepCosting: function (ProductStepCostingId) {
        var crudServiceBaseUrl = "/ActivityBaseCosting",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/ActivitiesInProductStepCosting?productStepId=" + ProductStepCostingId,
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
                        id: "ActivityId",
                        fields: {
                            ActivityTitle: { type: "string", editable: false },
                            ProductStepId: { type: "number", editable: false },
                            //ActivityRate: { type: "number", editable: false },
                            //ActivityUsageRateInProductStep: { type: "number", editable: false },
                            // ActivityPathTitle: { type: "string", editable: false },
                            RealOneCost: { type: "number", editable: false },
                            RealTotalCost: { type: "number", editable: false },
                            OneCost: { type: "number", editable: false },
                            TotalCost: { type: "number", editable: false },
                         //   OneConsumptionActivityProductStepRate: { type: "number", editable: false },
                            //percentActivity: {
                            //    type: "number", format: "{n4}", editable: false
                            //},
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#ActivitiesInStepCostingGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "جزئیات بهای تمام شده فعالیت.xlsx",
                proxyURL: "",
                filterable: true
            }, excelExport: function (e) { ExcelSetup(e,cleanupText($('[data-Direct]').text()))},
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
           detailTemplate: kendo.template($("#ActivitycostSubGrid").html()),
            detailInit: detailInitcost,
            columns: [
                {
                    width: 50,
                    title: "ردیف",
                    template: "#= ++record #",
                },
                { field: "ActivityTitle", title: "عنوان فعالیت" },
             //   { field: "ActivityPathTitle", title: "مسیر" },
                //{
                //    field: "ActivityRate", title: "بهای تمام شده واحد فعالیت در دوره",
                //    template: function (dataItem) {
                //        var classname = '';
                //        if (record % 2 == 0) {
                //            classname = 'myGreenBg';
                //        } else {
                //            classname = 'myBlueBg';
                //        }
                //        return '<span class="badge number' + ' ' + classname + '">' + SetThousandSeprator((dataItem.ActivityRate).toFixed(2))+'</span>';
                //    }
                //},
                // {
                //     field: "OneConsumptionActivityProductStepRate", title: "نرخ مصرف",
                //    template: function (dataItem) {
                //        return SetThousandSeprator((dataItem.OneConsumptionActivityProductStepRate).toFixed(2));//((dataItem.ActivityRate) * (dataItem.ActivityUsageRateInProductStep)
                //    }
                //},
             
                {
                    field: "RealOneCost", title: "بهای تمام شده واقعی واحد مرحله",
                    template: function (dataItem) {
                        return SetThousandSeprator((dataItem.RealOneCost).toFixed(2));//((dataItem.ActivityRate) * (dataItem.ActivityUsageRateInProductStep)
                    }
                },
                {
                    field: "RealTotalCost", title: "بهای تمام شده واقعی مرحله",
                    template: function (dataItem) { return SetThousandSeprator((dataItem.RealTotalCost).toFixed(2)); }
                },
                {
                    field: "OneCost", title: "بهای تمام شده ظرفیت واحد مرحله",
                    template: function (dataItem) { return SetThousandSeprator((dataItem.OneCost).toFixed(2)); }
                },
                {
                    field: "TotalCost", title: "بهای تمام شده ظرفیت مرحله",
                    template: function (dataItem) { return SetThousandSeprator((dataItem.TotalCost).toFixed(2)); }
                },
              


                 //{
                 //       command: [
                 //           { name: "thirdCustom", text: "<span class='customIcon iconInfo'>جزئیاrrrت</span>", click: ProductStepActivityCostingDetail },
                 //       ],
                 //       title: "عملیات"
                 //   }
                //{
                //    field: "percentActivity", title: "درصد",
                //    template: function(dataItem) {
                //        if (dataItem.Rate == 0) {
                //            return '<span class="badge number myRedBg">0 %</span>';

                //        } else {
                //            var className = '';
                //            var percentActivityValue;
                //            if (dataItem.Rate == 0 || ActivityActivityBaseCosting==0) {
                //                percentActivityValue = 0;

                //            } else {
                //                percentActivityValue = ((dataItem.Rate / ActivityActivityBaseCosting) * 100).toFixed(2);
                //            }
                //            switch (true) {
                //            case (percentActivityValue >= 0 && percentActivityValue <= 25):
                //                className = 'myRedBg';
                //                break;
                //            case (percentActivityValue > 25 && percentActivityValue <= 50):
                //                className = 'myYellowBg';
                //                break;
                //            case (percentActivityValue > 50 && percentActivityValue <= 75):
                //                className = 'myBlueBg';
                //                break;
                //            case (percentActivityValue > 75 && percentActivityValue):
                //                className = 'myGreenBg';
                //                break;
                //            }
                //            return '<span class="badge number ' + className + '">' + percentActivityValue + ' %</span>';
                //        }
                //    }
                //},
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

        function detailInitcost(e) {
           
            debugger;
            var ActivityId = e.data.ActivityId;
            var ProductStepId = e.data.ProductStepId;
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
                            url: crudServiceBaseUrl + "/CostInActivitiesCosting?ActivityId=" + ActivityId + "&ProductStepId=" + ProductStepId,
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
                            id: "CostId",
                            fields: {
                                CostTitle: { type: "string", editable: false },
                        
                               // OneConsumptionCostProductStepRate: { type: "number", editable: false },
                            //    TotalConsumptionCostProductStepRate: { type: "number", editable: false },
                       
                                RealOneCost: { type: "number", editable: false },
                                RealTotalCost: { type: "number", editable: false },
                                OneCost: { type: "number", editable: false },
                                TotalCost: { type: "number", editable: false },
                            }
                        }
                    },
                    pageSize: 10,
                });
            //record = 0;
            detailRow.find(".Activitycost").kendoGrid({
                toolbar: ["excel"],
                excel: {
                    fileName: "جزئیات بهای تمام شده برنامه.xlsx",
                    proxyURL: "",
                    filterable: true
                }, excelExport: function (e) { ExcelSetup(e, cleanupText($('[data-Direct]').text()), "productStep") },
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
                    { field: "CostTitle", title: "عنوان هزینه" },
                    //{
                    //    field: "CostRate", title: "بهای تمام شده واحد هزینه در دوره",
                    //    template: function (dataItem) {
                    //        var classname = '';
                    //        if (record % 2 == 0) {
                    //            classname = 'myGreenBg';
                    //        } else {
                    //            classname = 'myBlueBg';
                    //        }
                    //        return '<span class="badge number' + ' ' + classname + '">' + SetThousandSeprator((dataItem.CostRate).toFixed(2)) + '</span>';
                    //    }
                    //},
                    //{
                    //    field: "OneConsumptionCostProductStepRate", title: " نرخ مصرف واحد ",
                    //    template: function (dataItem) {
                    //        return SetThousandSeprator((dataItem.OneConsumptionCostProductStepRate).toFixed(2));
                    //    }
                    //},

                    {
                        field: "RealOneCost", title: "بهای تمام شده واقعی  واحد ",
                        template: function (dataItem) {
                            return SetThousandSeprator((dataItem.RealOneCost).toFixed(2));
                        }
                    },
                    {
                        field: "OneCost", title: "بهای تمام شده ظرفیت  واحد  ",
                        template: function (dataItem) {
                            return SetThousandSeprator((dataItem.OneCost).toFixed(2));
                        }
                    },

                    //{
                    //    field: "TotalConsumptionCostProductStepRate", title: " نرخ مصرف  ",
                    //    template: function (dataItem) {
                    //        return SetThousandSeprator((dataItem.TotalConsumptionCostProductStepRate).toFixed(2));
                    //    }
                    //},
                    {
                        field: "RealTotalCost", title: "بهای تمام شده واقعی    ",
                        template: function (dataItem) {
                            return SetThousandSeprator((dataItem.RealTotalCost).toFixed(2));
                        }
                    },

                    {
                        field: "TotalCost", title: "بهای تمام شده ظرفیت    ",
                        template: function (dataItem) {
                            return SetThousandSeprator((dataItem.TotalCost).toFixed(2));
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
          //جزئیات بهای تمام شده
        function ProductStepActivityCostingDetail(e) {
            e.stopPropagation();
            e.preventDefault();
             $("[data-trace]").remove();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
              var productStepId = $("#ProductStepCostingId").val();
           var activityId = dataItem.Activity.Id;
              $.ajax(
            {
                type: 'GET',
                url: '/ActivityBaseCosting/ActivityCostingDetail',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                data: {
                    'productStepId': productStepId,'activityId':activityId
                },
                success: function (response) {
                     context={ActivityId:activityId,Cost:SetThousandSeprator(response.Cost),ActivityCapacity:response.ActivityCapacity,
                         ActivityCapacityInProductStep:response.ActivityCapacityInProductStep,
                         OprateInPeriod:response.OprateInPeriod};
                           ActivityTraceHtml=templateActivityTrace(context)
                    $(e.currentTarget).closest("tr").after(ActivityTraceHtml)
                  ProductCostingDetail.GetCostsInActivityProductStepCost(productStepId,activityId);
                  
                },
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    ActivityBaseCosting.Error(errorMessage);
                },
            });

            
            
           // var MenuId = 'ActivityBaseCosting';
           // var TabUrl = '/ActivityBaseCosting/ActivityCostingDetail?productStepCostingId=' + productStepCostingId+'&activityId='+ productStepCostingId;
           // var TabScriptAddress = '/Scripts/Js/ActivityBaseCosting/ActivityCostingDetail.js';
           // CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
    },
      GetCostsInActivityProductStepCost: function (ProductStepCostingId,activityId) {
        var crudServiceBaseUrl = "/ActivityBaseCosting",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/CostsInProductStepActivity?productStepId=" + ProductStepCostingId+"&activityId="+activityId,
                        dataType: "json"
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
                            CostTitle: { type: "string", editable: false },
                              CostCode: { type: "string", editable: false },
                            CostRate: { type: "number", editable: false },
                         
                             CostPathTitle:  { type: "string", editable: false },
                            TotalCostInActivity: { type: "number", editable: false },
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#IndirectCostsInStepCostingByActivityGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "جزئیات بهای تمام شده دستمزد مستقیم.xlsx",
                proxyURL: "",
                filterable: true
            }, excelExport: function (e) { ExcelSetup(e,cleanupText($('[data-InDirectTitle]').text()))},
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
                { field: "CostTitle", title: "عنوان" },
                { field: "CostCode", title: "کد هزینه" },
                //{
                //    field: "CostRate", title: "بهای تمام شده واحد هزینه در دوره",
                //    template: function (dataItem) {
                //        var classname = '';
                //        if (record % 2 == 0) {
                //            classname = 'myGreenBg';
                //        } else {
                //            classname = 'myBlueBg';
                //        }
                //        return '<span class="badge number' + ' ' + classname + '">' + SetThousandSeprator((dataItem.CostRate).toFixed(2)) + '</span>';
                //    }
                //},
                //{
                //    field: "CostUsageRateInProductStep", title: "نرخ مصرف",
                //    template: function (dataItem) {
                //        return SetThousandSeprator((dataItem.CostUsageRateInProductStep).toFixed(2));
                //    }
                //},
                 { field: "CostPathTitle", title: "مسیر" },
                {
                    field: "TotalCostInProductStep", title: "بهای تمام شده هزینه در این مرحله",
                    template: function (dataItem) {
                        return SetThousandSeprator((dataItem.TotalCostInActivity ?? 0).toFixed(2));//(dataItem.CostRate) * (dataItem.CostUsageRateInProductStep)
                    }
                }
                ,
                 {
                        command: [
                            { name: "thirdCustom", text: "<span class='customIcon iconInfo'>جزئیات</span>", click: ActivityCostingDetail },
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
           //جزئیات بهای تمام شده
        function ActivityCostingDetail(e) {
            e.stopPropagation();
            e.preventDefault();
            
            $("[data-costtrace]").remove();
           var activityId= $("[data-trace]").attr("data-trace");
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            //  var productStepId = $("#ProductStepCostingId").val();
           var costId = dataItem.Cost.Id;
              $.ajax(
            {
                type: 'GET',
                url: '/ActivityBaseCosting/CostInActivityDetail',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                data: {
                    'costId': costId,'activityId':activityId
                },
                success: function (response) {
                     context={TotalCost:SetThousandSeprator(response.TotalCost),Capacity:response.Capacity,
                         CostCapacityInActivity:response.CostCapacityInActivity};
                           ActivityTraceHtml=templateActivityCostTrace(context)
                    $(e.currentTarget).closest("tr").after(ActivityTraceHtml)
                
                  
                },
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    ActivityBaseCosting.Error(errorMessage);
                },
            });

            
            
         
        }
    },

    GetProductStepBranchStaffCosting: function (ProductStepId) {
        var crudServiceBaseUrl = "/StaffPartBranchCost",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetDetilsCosting/" + ProductStepId,
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
                        id: "BranchId",
                        fields: {
                            Title: { type: "string", editable: false },

                            Price: { type: "number", editable: false },
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#ProductStepBranchStaffgGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "جزئیات بهای تمام شده  .xlsx",
                proxyURL: "",
                filterable: true
            }, excelExport: function (e) { ExcelSetup(e, cleanupText($('[data-otherItemsInPeriod]').text())) },
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
                { field: "Title", title: "عنوان ادارات" },


              

                {
                    field: "Price", title: "مبلغ       ",
                    template: function (dataItem) {
                        return SetThousandSeprator((dataItem.Price).toFixed(2));
                    }
                },
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
       
    },
    GetCostsInProductStepCosting: function (ProductStepCostingId, costType) {
        var crudServiceBaseUrl = "/ActivityBaseCosting",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/CostsInProductStepCosting?productStepId=" + ProductStepCostingId + '&&costType=' + costType,
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
                        id: "CostId",
                        fields: {
                            CostTitle: { type: "string", editable: false },
                           
                            AssignCapacity: { type: "number", editable: false },
                       
            
                            RealOneCost: { type: "number", editable: false },
                            RealTotalCost: { type: "number", editable: false },
                            OneCost: { type: "number", editable: false },
                            TotalCost: { type: "number", editable: false },
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#otherItemsInStepCostingGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "جزئیات بهای تمام شده هزینه های مستقیم.xlsx",
                proxyURL: "",
                filterable: true
            }, excelExport: function (e) { ExcelSetup(e,cleanupText($('[data-otherItemsInPeriod]').text()))},
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
                { field: "CostTitle", title: "عنوان هزینه" },
            

                {
                    field: "RealOneCost", title: "بهای تمام شده واقعی  واحد مرحله",
                    template: function (dataItem) {
                        return SetThousandSeprator((dataItem.RealOneCost).toFixed(2));
                    }
                },
                {
                    field: "OneCost", title: "بهای تمام شده ظرفیت  واحد  مرحله",
                    template: function (dataItem) {
                        return SetThousandSeprator((dataItem.OneCost).toFixed(2));
                    }
                },

               
                {
                    field: "RealTotalCost", title: "بهای تمام شده واقعی    مرحله",
                    template: function (dataItem) {
                        return SetThousandSeprator((dataItem.RealTotalCost).toFixed(2));
                    }
                },

                {
                    field: "TotalCost", title: "بهای تمام شده ظرفیت    مرحله",
                    template: function (dataItem) {
                        return SetThousandSeprator((dataItem.TotalCost).toFixed(2));
                    }
                },
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
         //جزئیات بهای تمام شده
        function CostingDetail(e) {
            e.stopPropagation();
            e.preventDefault();
            
            $("[data-costtrace]").remove();
          
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
             var productStepId = $("#ProductStepCostingId").val();
           var costId = dataItem.Cost.Id;
              $.ajax(
            {
                type: 'GET',
                url: '/ActivityBaseCosting/CostsInProductStepCostingDetail',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                async: false,
                data: {
                    'costId': costId,'productStepId':productStepId
                },
                success: function (response) {
                     context={TotalCost:SetThousandSeprator(response.TotalCost),Capacity:response.TotalCapacity,
                         CostCapacityInActivity:response.CostCpacityInProductStep};
                           ActivityTraceHtml=templateActivityCostTrace(context)
                    $(e.currentTarget).closest("tr").after(ActivityTraceHtml)
                
                  
                },
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    ActivityBaseCosting.Error(errorMessage);
                },
            });

            
            
         
        }
    },
    GetIndirectCostsInProductStepCost: function (ProductStepCostingId) {
        var crudServiceBaseUrl = "/ActivityBaseCosting",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/IndirectCostsInProductStepCosting?productStepId=" + ProductStepCostingId,
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
                        id: "CostId",
                        fields: {
                            CostTitle: { type: "string", editable: false },
                         //   CostRate: { type: "number", editable: false },
                          //  OneConsumptionCostProductStepRate: { type: "number", editable: false },
                          //  TotalConsumptionCostProductStepRate: { type: "number", editable: false },
                          //   CostPathTitle:  { type: "string", editable: false },
                            RealOneCost: { type: "number", editable: false },
                            RealTotalCost: { type: "number", editable: false },
                            OneCost: { type: "number", editable: false },
                            TotalCost: { type: "number", editable: false },
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#IndirectCostsInStepCostingGrid").kendoGrid({
            toolbar: ["excel"],
            excel: {
                fileName: "جزئیات بهای تمام شده دستمزد مستقیم.xlsx",
                proxyURL: "",
                filterable: true
            }, excelExport: function (e) { ExcelSetup(e,cleanupText($('[data-InDirectTitle]').text()))},
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
                { field: "CostTitle", title: "عنوان هزینه" },
                //{
                //    field: "CostRate", title: "بهای تمام شده واحد هزینه در دوره",
                //    template: function (dataItem) {
                //        var classname = '';
                //        if (record % 2 == 0) {
                //            classname = 'myGreenBg';
                //        } else {
                //            classname = 'myBlueBg';
                //        }
                //        return '<span class="badge number' + ' ' + classname + '">' + SetThousandSeprator((dataItem.CostRate).toFixed(2)) + '</span>';
                //    }
                //},
                //{
                //    field: "OneConsumptionCostProductStepRate", title: " نرخ مصرف واحد مرحله",
                //    template: function (dataItem) {
                //        return SetThousandSeprator((dataItem.OneConsumptionCostProductStepRate).toFixed(2));
                //    }
                //},
              
                {
                    field: "RealOneCost", title: "بهای تمام شده واقعی  واحد مرحله",
                    template: function (dataItem) {
                        return SetThousandSeprator((dataItem.RealOneCost).toFixed(2));
                    }
                },
                {
                    field: "OneCost", title: "بهای تمام شده ظرفیت  واحد  مرحله",
                    template: function (dataItem) {
                        return SetThousandSeprator((dataItem.OneCost).toFixed(2));
                    }
                },

                //{
                //    field: "TotalConsumptionCostProductStepRate", title: " نرخ مصرف  مرحله",
                //    template: function (dataItem) {
                //        return SetThousandSeprator((dataItem.TotalConsumptionCostProductStepRate).toFixed(2));
                //    }
                //},
                {
                    field: "RealTotalCost", title: "بهای تمام شده واقعی    مرحله",
                    template: function (dataItem) {
                        return SetThousandSeprator((dataItem.RealTotalCost).toFixed(2));
                    }
                },
             
                {
                    field: "TotalCost", title: "بهای تمام شده ظرفیت    مرحله",
                    template: function (dataItem) {
                        return SetThousandSeprator((dataItem.TotalCost).toFixed(2));
                    }
                },
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
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
ProductCostingDetail.init();
function ExcelSetup(e,lastTitle,TableTitle){

                  var sheet = e.workbook.sheets[0];
                  sheet.frozenRows = 5;
                  sheet.mergedCells = ["A3:B3","A1:B1","A2:B2","C1:D1","C2:D2","C3:D3","A4:D4"];
                  sheet.name = "Orders";
                sheet.hAlign="center";
               
   
    var test= e.data;
           for (var i = 0; i < sheet.rows.length; i++) {
            sheet.rows[i].cells.reverse();    
            for (var ci = 0; ci < sheet.rows[i].cells.length; ci++) {
              sheet.rows[i].cells[ci].hAlign = "center";
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

