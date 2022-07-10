var /*ParameterId,*/ parentParameterId, ParameterTypeId, ParameterTitle, HasBranch = '', isCreateNode = false,
    copySourceParameterId, copyDistinationParameterId;
var ParameterStructure = {
    init: function () {
        debugger;
        ParameterStructure.AddListener();
        ParameterStructure.BranchManage();
    },
    AddListener: function () {
        debugger;
        //دریافت آی دی درخت اهداف
        $(document).ready(function () {
            debugger;

            //دریافت اطلاعات درخت اهداف
            ParameterStructure.GetParameterTree();
            //ایجاد اهداف
            ParameterStructure.CreateParameter(isCreateNode);
            //ایجاد اهداف
            ParameterStructure.EditParameter();


            //ایجاد نود
            $('#createParameterNode').on('click',
                function () {

                    ParameterStructure.CreateNode();

                });


        });
    },
    CreateNode: function () {
        debugger;
        $('.ParameterTreeCreateForm').removeClass('displayNone').addClass('displayShow');
        $('.ParameterTreeEditForm').removeClass('displayShow').addClass('displayNone');
        isCreateNode = true;
        ParameterStructure.CreateParameter(isCreateNode);
    },

    GetParameterTree: function () {
        function onChangeParameterTree() {
            debugger;
            $('.ParameterTreeCreateForm').removeClass('displayShow').addClass('displayNone');
            $('.ParameterTreeEditForm').removeClass('displayShow').addClass('displayNone');
        }


        debugger;


      
        var rootUrl = "BranchParameter";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/GetLevels",
                    dataType: "jsonp"
                }
            },
            schema: {
                model: {
                    id: "Id",
                    hasChildren: "HasChild",
                }
            },
        });
        $("#ParameterTreeMenu").kendoContextMenu({

            target: "#ParameterTree",
            filter: ".k-in",
            select: function (e) {
                debugger;
                var $item = $(e.node);
                console.log($item.hasChildren);

                var button = $(e.item);
                var node = $(e.target);
                var contextMenu = $("#ParameterTree").data("kendoTreeView");
                var data = $("#ParameterTree").data("kendoTreeView").dataItem(node);
                ParameterId = data.Id;
                parentParameterId = data.ParentId;
                ParameterTitle = data.Title;
                HasBranch = data.HasBranch;
                ParameterTypeId = data.ParameterTypeId;

                $('#ListBranch').removeClass('displayShow').addClass('displayNone');
                $('.ParameterTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                $('.ParameterTreeEditForm').removeClass('displayShow').addClass('displayNone');
                if (button.text() == 'افزودن') {
                    isCreateNode = false;
                    if (HasBranch == true) {
                        messageClass = 'danger';
                        $('#messageParameterStructure').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                            '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                            '<strong>' +
                            "به علت  نوع دارای شعبه بودن امکان اضافه کردن زیر مجوعه ندارد" +
                            '</strong>' +
                            '</div>').delay(5000).fadeOut(800);
                    }
                    else {
                        $('.ParameterTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                        $('.ParameterTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    }
                }
                else if (button.text() == 'ویرایش') {
                    $('.ParameterTreeEditForm').removeClass('displayNone').addClass('displayShow');
                    $('.ParameterTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    $('#frm-editParameter').find('#BranchParameterId').val(ParameterId);
                    $('#frm-editParameter').find('#Title').val(ParameterTitle);



                    $('#frm-editParameter').find('#ParameterTypeId').val(ParameterTypeId);
                    $('#frm-editParameter').find('#HasBranch').prop("checked", HasBranch)


                }
                else if (button.text() == 'حذف') {

                    ParameterId = data.Id;
                    ParameterId = parseInt(ParameterId);
                    var form = $('#__AjaxAntiForgeryForm');
                    var token = $('input[name="__RequestVerificationToken"]', form).val();
                    $.ajax({
                        type: 'POST',
                        url: '/BranchParameter/DeleteParameter',
                        dataType: 'json',
                        async: false,
                        data: {
                            'id': ParameterId,
                            __RequestVerificationToken : token
                        },
                        success: function (response) {
                            var messageClass = '';
                            if (response.Status == true) {
                                messageClass = 'success';
                            }
                            else {
                                messageClass = 'danger';
                            }
                            $('#messageParameterStructure').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                                '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                '<strong>' +
                                response.Message +
                                '</strong>' +
                                '</div>').delay(5000).fadeOut(800);
                            var ParameterTree = $("#ParameterTree").data("kendoTreeView");
                            ParameterTree.dataSource.read();
                            var offset = -270;
                            $('html, body').animate({
                                scrollTop: $("#messageParameterStructure").offset().top + offset
                            }, 500);
                        },
                        error: function () {
                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                            ParameterStructure.Error(errorMessage);
                        }
                    });
                }
                else if (button.text() == " شعبه ها") {

                    if (HasBranch == false) {
                        messageClass = 'danger';
                        $('#messageParameterStructure').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                            '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                            '<strong>' +
                            "به علت   دارای شعبه نبودن امکان شعبه ای وجود ندارد" +
                            '</strong>' +
                            '</div>').delay(5000).fadeOut(800);
                    }
                    else {
                        $('#ListBranch').removeClass('displayNone').addClass('displayShow');
                        ParameterStructure.BranchManage();

                    }
                }
                //*********************************تغییرات
                else if (button.text() == "شعبه های ستادی") {

                  
                   
                        $('#ListBranch').removeClass('displayNone').addClass('displayShow');
                        ParameterStructure.StaffBranchManage();

                   
                }
            }
        });


        $("#ParameterTree").kendoTreeView({

            // appends a new node to the root level
            dataSource: data,
            dataTextField: "Title",
            change: onChangeParameterTree,
            //dragend: onDragEndParameterTree,
            //dragAndDrop: true,
        });
    },
    BranchManage: function () {
        debugger;
        $.ajax({
            type: "GET",
            url: 'BranchNew/index?ParameterId=' + ParameterId + "&BranchType=" + 1,

            dataType: "html",
            success: function (response) {

                $('#ListBranch').html(response);




            },

        });

    },
    StaffBranchManage: function () {
        debugger;
        $.ajax({
            type: "GET",
            url: 'BranchNew/index?ParameterId=' + ParameterId + "&BranchType=" + 2,

            dataType: "html",
            success: function (response) {

                $('#ListBranch').html(response);




            },

        });

    },

    CreateParameter: function (isCreateNode) {
        if (isCreateNode == true) {
            ParameterId = null;
        }
        $("#frm-createParameter").submit(function (e) {

            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },
                ParameterTypeId: { required: true },
            },
            messages: {
            },
            submitHandler: function (form) {
                var Title = $('#frm-createParameter').find('#Title').val();
                var HasBranch = $('#frm-createParameter').find('#HasBranch').is(":checked");
                var ParameterTypeId = $('#frm-createParameter').find('#ParameterTypeId').val();
                var model = {
                    'ParentId': ParameterId,
                    'Title': Title, 'HasBranch': HasBranch, 'ParameterTypeId': ParameterTypeId
                }

                var form = $('#frm-createParameter');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/BranchParameter/CreateParameter',
                        dataType: 'json',
                        async: false,
                        data: {
                            model,
                            __RequestVerificationToken : token
                        },
                        success: function (response) {
                            var messageClass = '';
                            if (response.Status == true) {
                                document.getElementById("frm-createParameter").reset();
                                messageClass = 'success';
                            }
                            else {
                                messageClass = 'danger';
                            }
                            $('#messageParameterStructure').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                                '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                '<strong>' +
                                response.Message +
                                '</strong>' +
                                '</div>').delay(5000).fadeOut(800);
                            var ParameterTree = $("#ParameterTree").data("kendoTreeView");
                            ParameterTree.dataSource.read();
                            var offset = -270;
                            $('html, body').animate({
                                scrollTop: $("#messageParameterStructure").offset().top + offset
                            }, 500);
                        },
                        error: function () {
                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                            ParameterStructure.Error(errorMessage);
                        },
                    });
            }
        });
    },
    EditParameter: function () {
        $("#frm-editParameter").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },
            },
            messages: {
            },
            submitHandler: function (form) {
                debugger;
                var BranchParameterId = $('#frm-editParameter').find('#BranchParameterId').val();
                var Title = $('#frm-editParameter').find('#Title').val();
                var HasBranch = $('#frm-editParameter').find('#HasBranch').is(":checked");
                var ParameterTypeId = $('#frm-editParameter').find('#ParameterTypeId').val();
                var model = {
                    'BranchParameterId': BranchParameterId,
                    'ParentId': parentParameterId, 'Title': Title, 'HasBranch': HasBranch, 'ParameterTypeId': ParameterTypeId
                }

                var form = $('#frm-editParameter');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/BranchParameter/EditParameter',
                        dataType: 'json',
                        async: false,
                        data: {
                            model,
                            __RequestVerificationToken : token
                        },
                        success: function (response) {
                            var messageClass = '';
                            if (response.Status == true) {
                                document.getElementById("frm-editParameter").reset();
                                messageClass = 'success';
                            }
                            else {
                                messageClass = 'danger';
                            }
                            $('#messageEditParameterStructure').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                                '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                '<strong>' +
                                response.Message +
                                '</strong>' +
                                '</div>').delay(5000).fadeOut(800);
                            var ParameterTree = $("#ParameterTree").data("kendoTreeView");
                            ParameterTree.dataSource.read();
                            var offset = -270;
                            $('html, body').animate({
                                scrollTop: $("#messageEditParameterStructure").offset().top + offset
                            }, 500);
                        },
                        error: function () {
                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                            ParameterStructure.Error(errorMessage);
                        },
                    });
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
ParameterStructure.init();



function listbranch(id, type) {
    debugger;
    $.ajax({
        type: "GET",
        url: "/BranchNew/index?ParameterId=" + id + "&BranchType=" + type,

        dataType: "html",
        success: function (response) {

            $('#ListBranch').html(response);




        },

    });
}