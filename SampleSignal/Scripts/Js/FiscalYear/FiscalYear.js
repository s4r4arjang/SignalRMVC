var record;
FiscalYear = {
    init: function () {
        FiscalYear.GetFinancialYear();
        FiscalYear.AddListener();
    },
        AddListener: function() {
        //محاسبه بهای تمام شده
            $(document).ready(function () {
            
            $(document).on('click','#btnForceDelete',
            function () {
                FiscalYear.ForceDelete($(this).attr("data-btnForceDelete"));
            });
            
            });
        
    },
    GetFinancialYear: function () {
        //kendo.culture("fa-IR");
        var crudServiceBaseUrl = "/FiscalYear",
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
        $("#financialYearGrid").kendoGrid({

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
                        //{ name: "firstCustom", text: "<span class='customIcon iconActive'>فعالسازی</span>", click: SetDefaultFiscalYear },
                        { name: "secondCustom", text: "<span class='customIcon iconCalendar'>تعیین دوره  </span>", click: SetPeriod },
                        //{
                        //    name: "customDeletePeriod", text: ' حذف دوره های مربوطه', iconClass: "k-icon k-i-close", click: deletePeriod
                        //},
                        {
                            name: "customBranchComputation", text: 'نوع محاسبات بها', iconClass: "k-icon k-i-edit", click: customBranchComputationType
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
           //آپدیت رکورد
        //نوع محاسبات مالی
        function customBranchComputationType(e) {
          
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var YearId = dataItem.YearId;
            var MenuId = 'FiscalYear';
            var TabUrl = '/BranchComputionType/Index?YearId=' + YearId + "&Type=1" ;
            var TabScriptAddress = '/Scripts/Js/BranchComputationType/Index.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        };
         //نوع محاسبات پشتیبانی
            function customBranchStaffComputationType(e) {
            debugger;
            e.preventDefault();
            e.stopPropagation();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var YearId = dataItem.YearId;
            var MenuId = 'FiscalYear';
            var TabUrl = '/BranchComputionType/StaffComputation?YearId=' + YearId + "&Type=1";
            var TabScriptAddress = '/Scripts/Js/BranchComputationType/StaffComputation.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        };

            function  customEdit(e) {
                e.preventDefault();
                e.stopPropagation();
                   var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var rowId = dataItem.YearId;
                var MenuId = 'FiscalYear';
                var TabUrl = '/FiscalYear/Update?id='+rowId;
                var TabScriptAddress = '/Scripts/Js/FiscalYear/Update.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        };

        // افزودن رکورد جدید
        $(".k-grid-add").on("click", 
            function (e) {
                e.preventDefault();
                e.stopPropagation();
                var MenuId = 'FiscalYear';
                var TabUrl = '/FiscalYear/Create';
                var TabScriptAddress = '/Scripts/Js/FiscalYear/Create.js';
                CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
            });

        //ایجاد دوره و فعالسازی
        function SetPeriod(e) {
            e.stopPropagation();
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var rowId = dataItem.YearId;
            var MenuId = 'FiscalYear';
            var TabUrl = '/Period/Create?fiscalYearId=' + rowId +"&Type=1";
            var TabScriptAddress = '/Scripts/Js/Period/Create.js';
            CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        }
    },
    //دریافت منو بصورت پارشیال
    LoadSideBarFiscalYear: function () {
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
    GetActiveItemsForFiscalYear: function() {
        //دریافت سال مالی فعال هر کاربر
        $.ajax({
            type: 'GET',
            url: '/FiscalYear/GetActiveFiscalYearTitle',
            dataType: 'json',
            cache: false,
            success: function (response) {
                if (response != "") {
                    $('.ActivFiscalYear').find('.text').html(response);
                } else {
                    $('.ActivFiscalYear').find('.text').html('__');
                }
            },
            error: function () {
                kendo.ui.progress($('#financialYearGrid'), false);
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                FiscalYear.Error(errorMessage);
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
                    $('.ActivFiscalYearPeriod').find('.text').html(response);
                } else {
                    $('.ActivFiscalYearPeriod').find('.text').html('__');
                }
            },
            error: function () {
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                FiscalYear.Error(errorMessage);
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
                FiscalYear.Error(errorMessage);
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
                FiscalYear.Error(errorMessage);
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
                FiscalYear.Error(errorMessage);
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
                                url: '/ForceDelete/DeleteFiscalYear',
                                dataType: 'json',
                                async: false,
                                data: {
                                    'id': id
                                },
                                success: function (response) {
                                    var messageClass = '';
                                    if (response.Status == true) {
                                        //بارگذاری مجدد سایدبار
                                        FiscalYear.LoadSideBarFiscalYear();
                                        FiscalYear.LoadAllSessions();
                                        FiscalYear.GetActiveItemsForFiscalYear();
                                        messageClass = 'success';
                                        $('#financialYearGrid').data('kendoGrid').dataSource.read();
                                        $('#financialYearGrid').data('kendoGrid').refresh();
                                    }
                                    else {
                                        messageClass = 'danger';
                                    }
                                    $('#messageFiscalYear').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                                       
                                        '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                        '<strong>' +
                                        response.Message +
                                        '</strong>' +
                                        '</div>').delay(5000).fadeOut(800);
                                    var offset = -270;
                                    $('html, body').animate({
                                        scrollTop: $("#messageFiscalYear").offset().top + offset
                                    }, 500);
                                },
                                error: function () {
                                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                                    FiscalYear.Error(errorMessage);
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
FiscalYear.init();