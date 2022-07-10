var selectedCostIds = [], activityId, ActivityAccountStructureId, record, listOfCosts = [], AccountTreeTitleId;
var CostActivity = {
    init: function () {
        CostActivity.AddListener();
        CostActivity.AssignAllIndirectCostToAllActivity();
        CostActivity.AssignAllStaffCostToAllStaffActivity();
        CostActivity.UnAssignAllIndirectCostFromAllActivity();
       CostActivity.UnAssignAllStaffCostFromAllStaffActivity();
        // CostActivity.GetAllForAssigningToActivity();

        CostActivity.GetAllAssignedToActivity();
    },
    AddListener: function () {
        debugger;
        //دریافت آی دی درخت هزینه
        $(document).ready(function () {
            var ActivityTreeTitleId = $('#ActivityTreeTitleId').val();
            AccountTreeTitleId = $('#AccountTreeTitleId').val();
            ActivityAccountStructureId = $('#ActivityAccountStructureId').val();
            //var ActiveActivityTreeId = $('#ActiveActivityTreeId').val();
            //var ActiveCostTreeId = $('#ActiveCostTreeId').val();
            //دریافت اطلاعات درخت فعالیت
            CostActivity.GetActivityTree(ActivityTreeTitleId);
         //  CostActivity.GetCostsPathInCostActivity(AccountTreeTitleId);
        }); 
        //$('#AccountTreeTitleId').on('change', function () {
        //    AccountTreeTitleId = parseInt($(this).val()); 
         
        //    $('#BoxAllCostForAssign').removeClass('displayShow').addClass('displayNone');
        //    $('#BoxCostAssigned').removeClass('displayShow').addClass('displayNone');
        //    var activityTreeActivityCost = $("#activityTreeActivityCost").data("kendoTreeView");
        //    activityTreeActivityCost.dataSource.read();
        //    $('.costToActivityBox').removeClass('displayNone');
        //    CostActivity.GetCostsPathInCostActivity(AccountTreeTitleId);
        //});
        //دریافت لیست ساختار هزینه
    
        //افزودن هزینه به فعالیت انتخاب شده
        $('#AssignCostsToActivity').on('click',
            function () {
        CostActivity.AssignCostsToActivity();
            });
    },

    //   تمام هزینه های پشتیبانی 
    
    AssignAllStaffCostToAllStaffActivity: function () {



        $("#frm-assignAllCostStaff").submit(function (e) {

            e.preventDefault();

            kendo.ui.progress($('#costsListGrid'), true);
            kendo.ui.progress($('#costsAssignedListGrid'), true);
        }).validate({
            rules: {
                AccountTreeTitleId: { required: true },
            },
            messages: {
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") == "AccountTreeTitleId") {
                    error.appendTo("#AccountTreeTitleIdError");
                }
                else {
                    error.insertAfter(element);
                }
            },
            submitHandler: function (form) {
                bootbox.confirm({
                    message: "آیا از اتصال همه هزینه هاپشتیبانی به تمامی فعالیت ها پشتیبانی مطمعا هستید؟",
                    callback: function (result) {
                        if (result) {
                            $('#frm-assignAllCostStaff').find('.btn-custom').attr('disabled', true).addClass('buttonLoading');
                            var AccountTreeTitleId = parseInt($('#AccountTreeTitleId').val());
                            var ActiveActivityTreeId = parseInt($('#ActivityTreeTitleId').val());
                            var option = {
                                "timeOut": "0",
                                "closeButton": true,
                                "positionClass": "toast-bottom-full-width",
                                "timeOut": "4000",
                            }
                            var form = $('#frm-assignAllCostStaff');
                            var token = $('input[name="__RequestVerificationToken"]', form).val();
                            $.ajax({
                                type: 'POST',
                                url: '/ActivityCost/AssignAllStaffCostToAllStaffActivity',
                                dataType: 'json',
                                data: {
                                    'activityTreeId': ActiveActivityTreeId, 'costTreeId': AccountTreeTitleId, 'ActivityAccountStructureId': ActivityAccountStructureId,
                                     __RequestVerificationToken : token },
                                async: true,
                                success: function (response) {
                                    $('#frm-assignAllCostStaff').find('.btn-custom').attr('disabled', false).removeClass('buttonLoading');
                                    kendo.ui.progress($('#costsListGrid'), false);
                                    kendo.ui.progress($('#costsAssignedListGrid'), false);
                                    if (response.Status) {


                                        toastr.success(response.Message, "فعالیت - هزینه ", option);


                                    } else {
                                        toastr.warning(response.Message, "فعالیت - هزینه ", option);
                                    }
                                    $('#BoxCostAssigned').removeClass('displayShow').addClass('displayNone');
                                    $('#BoxAllCostForAssign').removeClass('displayShow').addClass('displayNone');
                                },
                                error: function () {
                                    $('#frm-assignAllCostStaff').find('.btn-custom').attr('disabled', false).removeClass('buttonLoading');
                                    kendo.ui.progress($('#costsListGrid'), false);
                                    kendo.ui.progress($('#costsAssignedListGrid'), false);
                                    toastr.error("خطا در عملیات", "فعالیت - هزینه ", option);
                                },
                            });
                        }
                    }, locale: "fa"
                });


            }
        });
    
    },


    //   تمام هزینه های پشتیبانی 
    UnAssignAllStaffCostFromAllStaffActivity: function () {
        $("#frm-UnassignAllStaffCost").submit(function (e) {

            e.preventDefault();

            kendo.ui.progress($('#costsListGrid'), true);
            kendo.ui.progress($('#costsAssignedListGrid'), true);
        }).validate({
            rules: {
                AccountTreeTitleId: { required: true },
            },
            messages: {
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") == "AccountTreeTitleId") {
                    error.appendTo("#AccountTreeTitleIdError");
                }
                else {
                    error.insertAfter(element);
                }
            },
            submitHandler: function (form) {
                bootbox.confirm({
                    message: "آیا از حذف اتصال همه هزینه های پشتیبانی به تمامی فعالیت های پشتیبانی مطمعا هستید؟",
                    callback: function (result) {
                        if (result) {
                            $('#frm-UnassignAllCost').find('.btn-custom').attr('disabled', true).addClass('buttonLoading');
                            var AccountTreeTitleId = parseInt($('#AccountTreeTitleId').val());
                            var ActiveActivityTreeId = parseInt($('#ActivityTreeTitleId').val());
                            var option = {
                                "timeOut": "0",
                                "closeButton": true,
                                "positionClass": "toast-bottom-full-width",
                                "timeOut": "4000",
                            }
                            var form = $('#frm-UnassignAllCost');
                            var token = $('input[name="__RequestVerificationToken"]', form).val();
                            $.ajax({
                                type: 'POST',
                                url: '/ActivityCost/UnAssignAllStaffCostFromAllStaffActivity',
                                dataType: 'json',
                                data: {
                                    'activityTreeId': ActiveActivityTreeId, 'costTreeId': AccountTreeTitleId, 'ActivityAccountStructureId': ActivityAccountStructureId,
                                    __RequestVerificationToken : token },
                                async: true,
                                success: function (response) {
                                    $('#frm-UnassignAllStaffCost').find('.btn-custom').attr('disabled', false).removeClass('buttonLoading');
                                    kendo.ui.progress($('#costsListGrid'), false);
                                    kendo.ui.progress($('#costsAssignedListGrid'), false);
                                    if (response.Status) {


                                        toastr.success(response.Message, "فعالیت - هزینه ", option);


                                    } else {
                                        toastr.warning(response.Message, "فعالیت - هزینه ", option);
                                    }
                                    $('#BoxCostAssigned').removeClass('displayShow').addClass('displayNone');
                                    $('#BoxAllCostForAssign').removeClass('displayShow').addClass('displayNone');
                                },
                                error: function () {
                                    $('#frm-UnassignAllStaffCost').find('.btn-custom').attr('disabled', false).removeClass('buttonLoading');
                                    kendo.ui.progress($('#costsListGrid'), false);
                                    kendo.ui.progress($('#costsAssignedListGrid'), false);
                                    toastr.error("خطا در عملیات", "فعالیت - هزینه ", option);
                                },
                            });
                        }
                    }, locale: "fa"
                });


            }
        });

    },
    //اتصال تمام هزینه ها از درخت انتخاب شده به تمامی فعالیت ها ی انتخابی
    AssignAllIndirectCostToAllActivity: function () {
      


        $("#frm-assignAllCost").submit(function (e) {

            e.preventDefault();
    
            kendo.ui.progress($('#costsListGrid'), true);
            kendo.ui.progress($('#costsAssignedListGrid'), true);
        }).validate({
            rules: {
                AccountTreeTitleId: { required: true},
            },
            messages: {
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") == "AccountTreeTitleId") {
                    error.appendTo("#AccountTreeTitleIdError");
                }
                else {
                    error.insertAfter(element);
                }
            },
            submitHandler: function (form) {
            bootbox.confirm({message:"آیا از اتصال همه هزینه ها به تمامی فعالیت ها مطمعا هستید؟",
             callback:function(result){
        if (result) {
       $('#frm-assignAllCost').find('.btn-custom').attr('disabled', true).addClass('buttonLoading');
            var AccountTreeTitleId = parseInt($('#AccountTreeTitleId').val());
            var ActiveActivityTreeId = parseInt($('#ActivityTreeTitleId').val());
            var option = {
                "timeOut": "0",
                "closeButton": true,
                "positionClass": "toast-bottom-full-width",
                "timeOut": "4000",
            }

            var form = $('#frm-assignAllCost');
            var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax({
                    type: 'POST',
                    url: '/ActivityCost/AssignAllIndirectCostToAllActivity',
                    dataType: 'json',
                    data: {
                        'activityTreeId': ActiveActivityTreeId, 'costTreeId': AccountTreeTitleId, 'ActivityAccountStructureId': ActivityAccountStructureId,
                         __RequestVerificationToken : token },
                    async: true,
                    success: function (response) {
                        $('#frm-assignAllCost').find('.btn-custom').attr('disabled', false).removeClass('buttonLoading');
                        kendo.ui.progress($('#costsListGrid'), false);
                        kendo.ui.progress($('#costsAssignedListGrid'), false);
                        if (response.Status) {


                            toastr.success(response.Message, "فعالیت - هزینه ", option);


                        } else {
                            toastr.warning(response.Message, "فعالیت - هزینه ", option);
                        }
                        $('#BoxCostAssigned').removeClass('displayShow').addClass('displayNone');
                        $('#BoxAllCostForAssign').removeClass('displayShow').addClass('displayNone');
                    },
                    error: function () {
                        $('#frm-assignAllCost').find('.btn-custom').attr('disabled', false).removeClass('buttonLoading');
                        kendo.ui.progress($('#costsListGrid'), false);
                        kendo.ui.progress($('#costsAssignedListGrid'), false);
                        toastr.error("خطا در عملیات", "فعالیت - هزینه ", option);
                    },
                });
            }
   }, locale: "fa"});

             
            }
        });
  
    },
     //حذف اتصال تمام هزینه ها از درخت انتخاب شده به تمامی فعالیت ها ی انتخابی
    UnAssignAllIndirectCostFromAllActivity: function () {
        $("#frm-UnassignAllCost").submit(function (e) {

            e.preventDefault();
    
            kendo.ui.progress($('#costsListGrid'), true);
            kendo.ui.progress($('#costsAssignedListGrid'), true);
        }).validate({
            rules: {
                AccountTreeTitleId: { required: true},
            },
            messages: {
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") == "AccountTreeTitleId") {
                    error.appendTo("#AccountTreeTitleIdError");
                }
                else {
                    error.insertAfter(element);
                }
            },
            submitHandler: function (form) {
            bootbox.confirm({message:"آیا از حذف اتصال همه هزینه ها به تمامی فعالیت ها مطمعا هستید؟",
             callback:function(result){
        if (result) {
       $('#frm-UnassignAllCost').find('.btn-custom').attr('disabled', true).addClass('buttonLoading');
            var AccountTreeTitleId = parseInt($('#AccountTreeTitleId').val());
            var ActiveActivityTreeId = parseInt($('#ActivityTreeTitleId').val());
            var option = {
                "timeOut": "0",
                "closeButton": true,
                "positionClass": "toast-bottom-full-width",
                "timeOut": "4000",
            }
            var form = $('#frm-UnassignAllCost');
            var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax({
                    type: 'POST',
                    url: '/ActivityCost/UnAssignAllIndirectCostFromAllActivity',
                    dataType: 'json',
                    data: {
                        'activityTreeId': ActiveActivityTreeId, 'costTreeId': AccountTreeTitleId, 'ActivityAccountStructureId': ActivityAccountStructureId
                        , __RequestVerificationToken : token                    },
                    async: true,
                    success: function (response) {
                        $('#frm-assignAllCost').find('.btn-custom').attr('disabled', false).removeClass('buttonLoading');
                        kendo.ui.progress($('#costsListGrid'), false);
                        kendo.ui.progress($('#costsAssignedListGrid'), false);
                        if (response.Status) {


                            toastr.success(response.Message, "فعالیت - هزینه ", option);
                       

                        } else {
                            toastr.warning(response.Message, "فعالیت - هزینه ", option);
                        }
                        $('#BoxCostAssigned').removeClass('displayShow').addClass('displayNone');
                        $('#BoxAllCostForAssign').removeClass('displayShow').addClass('displayNone');
                    },
                    error: function () {
                        $('#frm-assignAllCost').find('.btn-custom').attr('disabled', false).removeClass('buttonLoading');
                        kendo.ui.progress($('#costsListGrid'), false);
                        kendo.ui.progress($('#costsAssignedListGrid'), false);
                        toastr.error("خطا در عملیات", "فعالیت - هزینه ", option);
                    },
                });
            }
   }, locale: "fa"});

             
            }
        });
  
    },
    //دریافت لیست هزینه های گرید هزینه های افزوده شده به فعالیت بمنظور نمایش مسیر در گرید
    GetCostsPathInCostActivity: function (AccountTreeTitleId) {
        debugger;
            $.ajax(
                {
                    type: 'GET',
                    url: '/Cost/GetCostByTreeTitle?costTreeTitleId=' + AccountTreeTitleId,
                    dataType: 'json',
                    async: false,
                    success: function (response) {
                        if (response.length > 0) {
                            listOfCosts = response;
                        }
                    },
                    error: function () {
                        var errorMessage = 'بروز خطا در برقراری ارتباط';
                        CostActivity.Error(errorMessage);
                    },
                });
    },
    GetActivityTree: function (ActivityTreeTitleId) {
        debugger;
        var rootUrl = "/ActivityCost";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/GetLevelActivity?TreeTitleId=" + ActivityTreeTitleId,
                    dataType: "jsonp"
                }
            },
            schema: {
                model: {
                    id: "ActivityId",
                    hasChildren: "HasChild",
                }
            },
        });
        $("#activityTreeActivityCostMenu").kendoContextMenu({
            target: "#activityTreeActivityCost",
            filter: ".k-in",
            open: function (e) {
                var node = $(e.target);
                var data = $("#activityTreeActivityCost").data("kendoTreeView").dataItem(node);
                activityId = parseInt(data.ActivityId);
                if (data.hasChildren === true) {
                    e.preventDefault();
                }
            },
            select: function (e) {
                var button = $(e.item);
            var crudServiceBaseUrl = "/ActivityCost";
                if (button.text() === 'هزینه ها') {
                    $('#BoxCostAssigned').removeClass('displayNone').addClass('displayShow');
                    $('#BoxAllCostForAssign').removeClass('displayShow').addClass('displayNone');
                    
                 //   CostActivity.GetAllAssignedToActivity();
                    var costsAssignedListGrid = $("#costsAssignedListGrid").data("kendoGrid");
                    costsAssignedListGrid.dataSource.transport.options.read.url =  "/ActivityCost/GetAllAssignedToActivity?activityId=" + activityId + "&&AccountTreeTitleId=" + AccountTreeTitleId + '&&ActivityAccountStructureId=' + ActivityAccountStructureId,
                  //  costsAssignedListGrid.dataSource.transport.options.read.url =  "/ActivityCost/GetAllAssignedToActivity?activityId=" + activityId + "&&costTreeTitleId=" + AccountTreeTitleId ;
        costsAssignedListGrid.dataSource.read();


                   
                    }
                else if (button.text() === 'افزودن هزینه') {
                    $('#BoxAllCostForAssign').removeClass('displayNone').addClass('displayShow');
                    $('#BoxCostAssigned').removeClass('displayShow').addClass('displayNone');
                    CostActivity.GetAllForAssigningToActivity();

        //              var costsListGrid = $("#costsListGrid").data("kendoGrid");
        //costsListGrid.dataSource.transport.options.read.url = crudServiceBaseUrl + "/GetAllForAssigningToActivity?activityId=" + activityId + "&&costTreeTitleId=" + AccountTreeTitleId;
        //costsListGrid.dataSource.read(); 
                
                    }
            }
        });
        $("#activityTreeActivityCost").kendoTreeView({
            dataSource: data,
            dataTextField: "Title",
        });
    },
    //افزودن هزینه به فعالیت انتخاب شده
    AssignCostsToActivity: function () {
        debugger;
        selectedCostIds = JSON.stringify(selectedCostIds);
        //var form = $('#__AjaxAntiForgeryForm');
        var token = $('input[name="__RequestVerificationToken"]').val();
        $.ajax(
            {
                type: 'POST',
                url: '/ActivityCost/AssignCostsToActivity',
                dataType: 'json',
                //contentType: "application/json; charset=utf-8",
                async: false,
                data: {
                    'ActivityAccountStructureId': ActivityAccountStructureId, 'activityId': activityId, 'costsId': selectedCostIds,
                    __RequestVerificationToken : token
                },
                success: function (response) {
                   
                    if (response.Status === true)
                    {
                        toastr.success(response.Message, "فعالیت هزینه ", ToasterOptionMessage);

                        var costsListGrid = $("#costsListGrid").data("kendoGrid");
                        costsListGrid.clearSelection();
                       // costsListGrid.dataSource.transport.options.read.url = crudServiceBaseUrl + "/GetAllForAssigningToActivity?activityId=" + activityId + "&&costTreeTitleId=" + AccountTreeTitleId;
                        costsListGrid.dataSource.read();
                    
                        costsListGrid.refresh();
                       
                    }
                    else
                    {
                        toastr.error(response.Message, "فعالیت هزینه ", ToasterOptionMessage);
                    
                    }
                   
             
                },
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    CostActivity.Error(errorMessage);
                },
            });
    },
    GetAllForAssigningToActivity: function () {
        debugger;
        var crudServiceBaseUrl = "/ActivityCost";
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {

                        url: crudServiceBaseUrl + '/GetAllForAssigningToActivity?activityId=' + activityId + '&&AccountTreeTitleId=' + AccountTreeTitleId + '&&ActivityAccountStructureId=' + ActivityAccountStructureId,
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
                            Title: { type: "string", editable: false },
                       
                          //  Code: { type: "string", editable: false ,hidden: true },
                         //   CostCode: { type: "string", editable: false},
                            Path: { type: "string", editable: false },

                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#costsListGrid").kendoGrid({
            dataSource: dataSource,
            sortable: true,
            resizable: true,
            columnMenu: false,
           
            persistSelection: true,
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
                { selectable: true, width: "50px" },
                {
                    width: 50,
                    title: "ردیف",
                    template: "#= ++record #",
                },
                { field: "Title", title: "عنوان هزینه" },
                { field: "Path", title: "مسیر " },
             
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
            debugger;
            var selectedIds = [];
            selectedIds=   this.selectedKeyNames();
            selectedCostIds = [];
            for (i = 0; i < selectedIds.length; i++) {
                
                selectedCostIds.push(parseInt(selectedIds[i]));
            }
            if (selectedCostIds.length > 0) {
                $('#AssignCostsToActivityBox').removeClass('displayNone').addClass('displayShow');
            } else {
                $('#AssignCostsToActivityBox').removeClass('displayShow').addClass('displayNone');
            }
        }
    },
    //لیست هزینه های متصل شده به فعالیت
    GetAllAssignedToActivity: function () {
        debugger;

        var crudServiceBaseUrl = "/ActivityCost",
            dataSource = new kendo.data.DataSource({ 
                transport: {
                    read: {
                        url: '',// crudServiceBaseUrl + "/GetAllAssignedToActivity?activityId=" + activityId + "&&AccountTreeTitleId=" + AccountTreeTitleId + '&&ActivityAccountStructureId=' + ActivityAccountStructureId ,
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
                        id: "ActivityCostId",
                        fields: {
                            Title: { type: "string", editable: false },
                     
                            Path: { type: "string", editable: false },
                        }
                    }
                },
                pageSize: 10
            });
        record = 0;
        $("#costsAssignedListGrid").kendoGrid({
            dataSource: dataSource,
            sortable: true,
            resizable: true,
            columnMenu: false,
            persistSelection: true,
         
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
                { field: "Title", title: "عنوان هزینه" },
                { field: "Path", title: " مسیر" },
                {
                    command: [
                        {
                            name: "customDelete1",
                            text: 'حذف هزینه',
                            iconClass: "k-icon k-i-close",
                            click: RemoveAssignedCost
                        },
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
        //حذف اتصال هزینه به فعالیت
        function RemoveAssignedCost(e) {
            e.preventDefault();
           
            var dataItemActivityCost = this.dataItem($(e.currentTarget).closest("tr"));
            var activityCostId = dataItemActivityCost.ActivityCostId;
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
                    if (result === true) {
                        
                        var token = $('input[name="__RequestVerificationToken"]').val();
                        $.ajax(
                            {
                                type: 'POST',
                                url: '/ActivityCost/RemoveAssignedCost/'+activityCostId,
                                dataType: 'json',
                                
                                data: {
                                    'costId': activityCostId, 'activityId': activityId,
                                    __RequestVerificationToken : token
                                },
                                success: function (response) {
                                 
                                  
                                   
                                    if (response.Status === true) {
                                       $('#costsAssignedListGrid').data('kendoGrid').dataSource.read();
                                  $('#costsAssignedListGrid').data('kendoGrid').refresh();
                                        toastr.success(response.Message, "فعالیت هزینه ", ToasterOptionMessage);
                                      
                       
                                       
                                    }
                                    else {
                                        toastr.error(response.Message, "فعایت هزینه ", ToasterOptionMessage);
                                    }
                                  //  CostActivity.GetAllAssignedToActivity();
                                    //$('#costsAssignedListGrid').data('kendoGrid').dataSource.read();
                                    //$('#costsAssignedListGrid').data('kendoGrid').refresh();


                                   
                                },
                                error: function () {
                                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                                    CostActivity.Error(errorMessage);
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
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
CostActivity.init();