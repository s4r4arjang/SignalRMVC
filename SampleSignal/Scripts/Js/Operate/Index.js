Operate = {
    init: function () {
        Operate.AddListener();
        Operate.GetProcess();
    },
    AddListener: function () {
        //انتخاب سال مالی
        $(document).on('change', '#ProcessListOptions', function () {
            var ProcessId = parseInt($(this).val());
            Operate.GetProcessProduct(ProcessId);
        });
    },
    GetProcess: function () {
        var ProcessListContent = '<option selected disabled>فرایند مورد نظر را انتخاب نمائید</option>';
        $.ajax(
            {
                type: 'GET',
                url: '/Process/GetProcessList',
                dataType: 'jsonp',
                async: false,
                data: {},
                success: function (response) {
                    if (response.length > 0) {
                        for (i = 0; i < response.length; i++) {
                            ProcessListContent += '<option value="' +
                                response[i].Id +
                                '">' +
                                response[i].Title +
                                '</option>';
                        }
                    } else {
                         ProcessListContent = '<option selected disabled>فرایندی یافت نشد</option>';
                    }
                    $('#ProcessListOptions').html(ProcessListContent);
                },
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    Operate.Error(errorMessage);
                },
            });
    },
    GetProcessProduct: function (ProcessId) {
        $.ajax(
            {
                type: 'GET',
                url: '/Product/GetProductList',
                dataType: 'jsonp',
                async: true,
                data: { processId: ProcessId },
                success: function (response) {
                    if (response.length > 0) {
                        for (i = 0; i <response.length; i++) {
                            $('#productsList').html('<div class="checkbox">' +
                                '<input type="checkbox" value="' + response[i].Id + '"><span>' + response[i].Title + '</span></div>');
                        }
                    }
                },
                error: function () {
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    Operate.Error(errorMessage);
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
Operate.init();