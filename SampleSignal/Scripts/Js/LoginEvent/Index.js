$("#frm-EventLog").submit(function (e) {
    e.preventDefault();
}).validate({
    rules: {


        EventDate: { required: true },
        
    },

    messages: {
    },
    submitHandler: function (form) {
        debugger;
        var FromEventDate = $('#StartDate').val();
        var ToEventDate = $('#EndDate').val();
       

        $('#BoxEventLog').removeClass('displayNone').addClass('displayShow');
       
       
        var EventLogGrid = $("#EventLogGrid").data("kendoGrid");
        EventLogGrid.dataSource.transport.options.read.url = '/LoginEvent/LoginEventList?Start=' + FromEventDate + "&End=" + ToEventDate ;
        EventLogGrid.dataSource.read();

    }
});
var LoginEvent = {
    init: function () {
        debugger;
        
        LoginEvent.GetLoginEvent();
    },
    GetLoginEvent: function () {
        debugger;
        var crudServiceBaseUrl = "/LoginEvent",
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        /*crudServiceBaseUrl + '/LoginEventList?start=' + FromEventDate + "&end=" + ToEventDate*/
                        url:'',
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
                        id: "LoginEventId",
                        fields: {
                            FullName : { type: "string", validation: { required: true } },
                            TypeTitle: { type: "string", validation: { required: true } },
                            PersianEventDate: { type: "string", validation: { required: true } },
                            TimeStr: { type: "string", validation: { required: true } },
                            UserNameEnter: { type: "string", validation: { required: true } },
                            PassEnter: { type: "string", validation: { required: true } },
                            UserIp : { type: "string", validation: { required: true } },

                        }
                    },
                },
                pageSize: 10
            });
        record = 0;
        $("#EventLogGrid").kendoGrid({ 
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
               
                { field: "FullName ", title: "نام کامل" },
                { field: "TypeTitle", title: "نوع" },
                { field: "PersianEventDate ", title: "تاریخ" },
                { field: "TimeStr ", title: "زمان" },
                { field: "UserNameEnter  ", title: "نام کاربری وارد شده" },
                { field: "PassEnter", title: "گذرواژه وارد شده" },
                { field: "UserIp ", title: "IP" },
             
               
            ],
            editable: "popup",
            dataBinding: function () {
                if (this.dataSource.pageSize() !== undefined) {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                } else {
                    record = 0;
                }
            },
        });
      
        // افزودن رکورد جدید
        //$('#tabview_Driver').find(".k-grid-add").on("click",
        //    function (e) {
        //        debugger;
        //        e.preventDefault();
        //        e.stopPropagation();
        //        var MenuId = 'Driver';
        //        var TabUrl = '/Driver/Create';
        //        var TabScriptAddress = '/Scripts/Js/Driver/Create.js';
        //        CustomTab.LinkToAnOtherPage(MenuId, TabUrl, TabScriptAddress);
        //    });
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
LoginEvent.init();