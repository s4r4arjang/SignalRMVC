var record;
AnalysisFiscalYear = {
    init: function () {
        AnalysisFiscalYear.GetFinancialYear();
        AnalysisFiscalYear.AddListener();
    },
        AddListener: function() {
        //محاسبه بهای تمام شده
            $(document).ready(function () {
            
            $(document).on('click','#btnForceDelete',
            function () {
                AnalysisFiscalYear.ForceDelete($(this).attr("data-btnForceDelete"));
            });
            
            });
        
    },
    GetFinancialYear: function () {
        //kendo.culture("fa-IR");
        var crudServiceBaseUrl = "/AnalysisFiscalYear",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: crudServiceBaseUrl + "/GetAll",
                        dataType: "jsonp"
                    },
                    destroy: {
                        url: crudServiceBaseUrl + "/Delete",
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
                        id: "YearId",
                        fields: {
                         /*   YearId: { hidden: true },*/
                            Title: { type: "string", validation: { required: true }, editable: false },
                            StartDatePersian: { type: "string", validation: { required: true }, editable: false },
                            EndDatePersian: {
                                type: "string", validation: { required: true }, editable: false
                            },
                            Year: { type: "number", editable: false },
                            Budgetyear: { type: "number", editable: false },
                         
                        }
                    }
                },
                pageSize: 10,
            });
        record = 0;
        $("#AnalysisfinancialYearGrid").kendoGrid({

            toolbar: ["create", "excel"],
            excel: {
                fileName: "سال مالی.xlsx",
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
                //{
                //    name: "Id",
                //    hidden: true,
                //    template: function (dataItem) {
                //        return '<span class="rowId" id="' + dataItem.Id + '"></span>'
                //    }
                //},
                { field: "Year", title: "سال " },
                { field: "Budgetyear", title: "سال بودجه " },
                
                { field: "Title", title: "عنوان" },
                { field: "StartDatePersian", title: "تاریخ شروع" },
                {
                    field: "EndDatePersian", title: "تاریخ خاتمه"
                },
   
              
                {
                    command: [
                        {
                            name: "customEdit", text: 'ویرایش', iconClass: "k-icon k-i-edit", click: customEdit
                        },
                        //{
                        //    name: "customDelete", text: 'حذف', iconClass: "k-icon k-i-close", click: deleteData
                        //},
                        //{ name: "firstCustom", text: "<span class='customIcon iconActive'>فعالسازی</span>", click: SetDefaultAnalysisFiscalYear },
                        { name: "secondCustom", text: "<span class='customIcon iconCalendar'>تعیین دوره  </span>", click: SetPeriod },
                        //{
                        //    name: "customDeletePeriod", text: ' حذف دوره های مربوطه', iconClass: "k-icon k-i-close", click: deletePeriod
                        //},
                        {
                            name: "customEdit2", text: 'نوع محاسبات بها', iconClass: "k-icon k-i-edit", click: customBranchComputationType
                        },


                        {
                            name: "customStaffComputation", text: 'نوع محاسبات پشتیبانی', iconClass: "k-icon k-i-edit", click: customBranchStaffComputationType
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
        });

        //نوع محاسبات مالی
        function customBranchComputationType(e) {
            
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var YearId = dataItem.YearId;
            var MenuId = 'AnalysisFiscalYear';
            var TabUrl = '/BranchComputionType/Index?YearId=' + YearId + "&Type=2";
            var TabScriptAddress = '/Scripts/Js/BranchComputationType/Index.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        };

        //نوع محاسبات پشتیبانی
        function customBranchStaffComputationType(e) {
            
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var YearId = dataItem.YearId;
            var MenuId = 'AnalysisFiscalYear';
            var TabUrl = '/BranchComputionType/StaffComputation?YearId=' + YearId + "&Type=2";
            var TabScriptAddress = '/Scripts/Js/BranchComputationType/StaffComputation.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        };

           //آپدیت رکورد
      

            function  customEdit(e) {
                e.preventDefault();
                e.stopPropagation();
                   var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var rowId = dataItem.YearId;
                var MenuId = 'AnalysisFiscalYear';
                var TabUrl = '/AnalysisFiscalYear/Update?id='+rowId;
                var TabScriptAddress = '/Scripts/Js/AnalysisFiscalYear/Update.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            };
        // افزودن رکورد جدید
        $(".k-grid-add").on("click", 
            function (e) {
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'AnalysisFiscalYear';
                var TabUrl = '/AnalysisFiscalYear/Create';
                var TabScriptAddress = '/Scripts/Js/AnalysisFiscalYear/Create.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });
        //حذف رکورد گرید
        function deleteData(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItemFinancialYear = this.dataItem($(e.currentTarget).closest("tr"));
            var financialYearId = dataItemFinancialYear.YearId;
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
                    if (result == true) {
                        $.ajax(
                            {
                                type: 'GET',
                                url: '/AnalysisFiscalYear/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': financialYearId
                                },
                                success: function (response) {
                                    var messageClass = '';
                                    if (response.Status == true) {
                                        //بارگذاری مجدد سایدبار
                                        AnalysisFiscalYear.LoadSideBarAnalysisFiscalYear();
                                        AnalysisFiscalYear.LoadAllSessions();
                                        AnalysisFiscalYear.GetActiveItemsForAnalysisFiscalYear();
                                        messageClass = 'success';
                                        $('#AnalysisfinancialYearGrid').data('kendoGrid').dataSource.read();
                                        $('#AnalysisfinancialYearGrid').data('kendoGrid').refresh();
                                    }
                                    else {
                                        messageClass = 'danger';
                                        var forceDeletebtn= '<button data-btnForceDelete="'+financialYearId+'" id="btnForceDelete" class="btn btn-warning">!حذف بهمراه وابستگی ها </button>';
                                    }
                                    $('#messageAnalysisFiscalYear').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +                                      
                                        '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                        '<strong>' +
                                        response.Message +
                                        '</strong>' +
                                         forceDeletebtn+
                                        '</div>').delay(5000).fadeOut(800);
                                    var offset = -270;
                                    $('html, body').animate({
                                        scrollTop: $("#messageAnalysisFiscalYear").offset().top + offset
                                    }, 500);
                                },
                                error: function () {
                                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                                    AnalysisFiscalYear.Error(errorMessage);
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
        //حذف دوره ها
        function deletePeriod(e) {
            e.preventDefault();
            e.stopPropagation();
            var dataItemFinancialYear = this.dataItem($(e.currentTarget).closest("tr"));
            var financialYearId = dataItemFinancialYear.Id;
            bootbox.confirm({
                title: "حذف اطلاعات!",
                message: "آیا از حذف دوره ها مربوطه اطمینان دارید؟",
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
                                type: 'GET',
                                url: '/Period/Delete',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': financialYearId
                                },
                                success: function (response) {
                                    var messageClass = '';
                                    if (response.Status == true) {
                                        //بارگذاری مجدد سایدبار
                                        AnalysisFiscalYear.LoadSideBarAnalysisFiscalYear();
                                        AnalysisFiscalYear.LoadAllSessions();
                                        AnalysisFiscalYear.GetActiveItemsForAnalysisFiscalYear();
                                        messageClass = 'success';
                                       
                                    }
                                    else {
                                        messageClass = 'danger';
                                        var forceDeletebtn ="";
                                    }
                                    $('#messageAnalysisFiscalYear').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                                        '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                        '<strong>' +
                                        response.Message +
                                        '</strong>' +
                                        forceDeletebtn +
                                        '</div>').delay(5000).fadeOut(800);
                                    var offset = -270;
                                    $('html, body').animate({
                                        scrollTop: $("#messageAnalysisFiscalYear").offset().top + offset
                                    }, 500);
                                },
                                error: function () {
                                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                                    AnalysisFiscalYear.Error(errorMessage);
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
        //فعال کردن سال مالی
        function SetDefaultAnalysisFiscalYear(e) {
            e.preventDefault();
            e.stopPropagation();
            kendo.ui.progress($('#AnalysisfinancialYearGrid'), true);
            var dataItemAnalysisFiscalYear = this.dataItem($(e.currentTarget).closest("tr"));
            var AnalysisFiscalYearId = dataItemAnalysisFiscalYear.Id;
            bootbox.confirm({
                message:"در صورت فعالسازی سال مالی تب های باز بسته میشوند.آیا مطمئن هستید؟",
             callback:function(result){
        if (result) {
       $.ajax(
                {
                    type: 'GET',
                    url: '/AnalysisFiscalYear/SetActiveAnalysisFiscalYear',
                    dataType: 'json',
                    async: true,
                    data: { AnalysisFiscalYearId: AnalysisFiscalYearId },
                    success: function (response) {
                        kendo.ui.progress($('#AnalysisfinancialYearGrid'), false);
                        var messageClass = '';
                        if (response.Status == true) {
                            AnalysisFiscalYear.LoadSideBarAnalysisFiscalYear();
                            AnalysisFiscalYear.LoadAllSessions();
                            AnalysisFiscalYear.GetActiveItemsForAnalysisFiscalYear();
                         //   $("#tabId_closeAll").click();
                            location.reload();
                            messageClass = 'success';
                        }
                        else {
                            messageClass = 'danger';
                        }
                        $('#messageAnalysisFiscalYear').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                            '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                            '<strong>' +
                            response.Message +
                            '</strong>' +
                            '</div>').delay(5000).fadeOut(800);
                        $('#AnalysisfinancialYearGrid').data('kendoGrid').dataSource.read();
                        $('#AnalysisfinancialYearGrid').data('kendoGrid').refresh();
                        var offset = -270;
                        $('html, body').animate({
                            scrollTop: $("#messageAnalysisFiscalYear").offset().top + offset
                        }, 500);
                    },
                    error: function () {
                        var errorMessage = 'بروز خطا در برقراری ارتباط';
                        kendo.ui.progress($('#AnalysisfinancialYearGrid'), false);
                        AnalysisFiscalYear.Error(errorMessage);
                    },
                });
            }
   }, locale: "fa"});
        }
        //ایجاد دوره و فعالسازی
        function SetPeriod(e) {
            debugger;
            e.stopPropagation();
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var rowId = dataItem.YearId;
            var MenuId = 'AnalysisFiscalYear';
            var TabUrl = '/Period/Create?fiscalYearId=' + rowId + "&Type=2";
            var TabScriptAddress = '/Scripts/Js/Period/Create.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
    },
    //دریافت منو بصورت پارشیال
    LoadSideBarAnalysisFiscalYear: function () {
        $.ajax({
            type: "GET", 
            url: "/Home/RenderSideBar",
            contentType: "application/json; charset=utf-8",
            dataType: "html",
            success: function (response) {
                $('#sideBar').html(response);
            },
            error: function () {
                $('#sideBar').html('<h6 class="errorPart">بروز خطا در بارگذاری منو</h4>');
            },
        });
    },
    //دریافت سشن ها بصورت پارشیال
    LoadAllSessions: function () {
        $.ajax({
            type: "GET",
            url: "/Home/SessionPartial",
            contentType: "application/json; charset=utf-8",
            dataType: "html",
            async: false,
            success: function (response) {
                $('#allSessions').html(response);
            },
            error: function () {
                $('#allSessions').html('<h6 class="errorPart">بروز خطا در بارگذاری</h4>');
            },
        });
    },
    //دریافت عناوین فعال آیتم های فعال(سال مالی،دوره،ساختارها)
    GetActiveItemsForAnalysisFiscalYear: function() {
        //دریافت سال مالی فعال هر کاربر
        $.ajax({
            type: 'GET',
            url: '/AnalysisFiscalYear/GetActiveAnalysisFiscalYearTitle',
            dataType: 'json',
            cache: false,
            success: function (response) {
                if (response !== "") {
                    $('.ActivAnalysisFiscalYear').find('.text').html(response);
                } else {
                    $('.ActivAnalysisFiscalYear').find('.text').html('__');
                }
            },
            error: function () {
                kendo.ui.progress($('#AnalysisfinancialYearGrid'), false);
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                AnalysisFiscalYear.Error(errorMessage);
            },
        });
        //دریافت دوره فعال هر کاربر
        $.ajax({
            type: 'GET',
            url: '/Period/GetActivePeriodTitle',
            dataType: 'json',
            cache: false,
            success: function (response) {
                if (response != "") {
                    $('.ActivAnalysisFiscalYearPeriod').find('.text').html(response);
                } else {
                    $('.ActivAnalysisFiscalYearPeriod').find('.text').html('__');
                }
            },
            error: function () {
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                AnalysisFiscalYear.Error(errorMessage);
            },
        });
        //دریافت درخت فعالیت هر شعبه
        $.ajax({
            type: 'GET',
            url: '/Activity/GetActiveActivityTree',
            dataType: 'json',
            cache: false,
            success: function (response) {
                if (response != "") {
                    $('.ActiveActivityTree').find('.text').html(response.Name);
                } else {
                    $('.ActiveActivityTree').find('.text').html('__');
                }
            },
            error: function () {
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                AnalysisFiscalYear.Error(errorMessage);
            },
        });
        //دریافت درخت هزینه هر شعبه
        $.ajax({
            type: 'GET',
            url: '/Cost/GetActiveCostTree',
            dataType: 'json',
            cache: false,
            success: function (response) {
                if (response != "") {
                    $('.ActiveCostTree').find('.text').html(response.Name);
                } else {
                    $('.ActiveCostTree').find('.text').html('__');
                }
            },
            error: function () {
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                AnalysisFiscalYear.Error(errorMessage);
            },
        });
        //دریافت درخت اهداف هر شعبه
        $.ajax({
            type: 'GET',
            url: '/Goal/GetActiveGoalTree',
            dataType: 'json',
            cache: false,
            success: function (response) {
                        if (response != "") {
                            $('.ActiveGoalTree').find('.text').html(response.Title);
                        } else {
                            $('.ActiveGoalTree').find('.text').html('__');
                        }
            },
            error: function () {
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                AnalysisFiscalYear.Error(errorMessage);
            },
        });
    },
    ForceDelete: function (id) {
     bootbox.confirm({
                title: "حذف اطلاعات!",
                message: "آیا از حذف رکورد مورد نظر بهه همراه وابستگی ها اطمینان دارید؟",
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
                                type: 'GET',
                                url: '/ForceDelete/DeleteAnalysisFiscalYear',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': id
                                },
                                success: function (response) {
                                    var messageClass = '';
                                    if (response.Status == true) {
                                        //بارگذاری مجدد سایدبار
                                        AnalysisFiscalYear.LoadSideBarAnalysisFiscalYear();
                                        AnalysisFiscalYear.LoadAllSessions();
                                        AnalysisFiscalYear.GetActiveItemsForAnalysisFiscalYear();
                                        messageClass = 'success';
                                        $('#AnalysisfinancialYearGrid').data('kendoGrid').dataSource.read();
                                        $('#AnalysisfinancialYearGrid').data('kendoGrid').refresh();
                                    }
                                    else {
                                        messageClass = 'danger';
                                    }
                                    $('#messageAnalysisFiscalYear').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                                       
                                        '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                        '<strong>' +
                                        response.Message +
                                        '</strong>' +
                                        '</div>').delay(5000).fadeOut(800);
                                    var offset = -270;
                                    $('html, body').animate({
                                        scrollTop: $("#messageAnalysisFiscalYear").offset().top + offset
                                    }, 500);
                                },
                                error: function () {
                                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                                    AnalysisFiscalYear.Error(errorMessage);
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
    
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
AnalysisFiscalYear.init();