var activityId, parentActivityId, activityTitle, activityCode,activityType, activityParentCode, activityDriverId, description = '', isCreateNode = false,
    copySourceId, copyDistinationId;
var ActivityStructure = {
    init: function () {
        ActivityStructure.AddListener();
        ActivityStructure.GetComboes();
    },
    AddListener: function () {
        //iCheck for checkbox and radio inputs
        //$('input[type="radio"].minimal').iCheck({
        //    checkboxClass: 'icheckbox_minimal-blue',
        //    radioClass: 'iradio_minimal-blue'
        //});
        //دریافت آی دی درخت فعالیت
        $(document).ready(function () {
            var treeTitleActivityId = $('#treeTitleActivityId').val();
            //دریافت اطلاعات درخت فعالیت
            ActivityStructure.GetActivityTree(treeTitleActivityId);
            //ایجاد فعالیت
            ActivityStructure.CreateActivity(treeTitleActivityId, isCreateNode);
            //ویرایش فعالیت
            ActivityStructure.EditActivity(treeTitleActivityId);
            //ایجاد فعالیت
            $('#createNode').on('click',
                function () {
                    ActivityStructure.CreateNode(treeTitleActivityId);
                });
        });
    },
    CreateNode: function (treeTitleActivityId) {
        $('.activityTreeCreateForm').removeClass('displayNone').addClass('displayShow');
        $('.activityTreeEditForm').removeClass('displayShow').addClass('displayNone');
        isCreateNode = true;
        ActivityStructure.CreateActivity(treeTitleActivityId, isCreateNode);
    },
    GetActivityTree: function (treeTitleActivityId) {
        function onChangeActivityTree(e) {
            $('.activityTreeCreateForm').removeClass('displayShow').addClass('displayNone');
            $('.activityTreeEditForm').removeClass('displayShow').addClass('displayNone');
        }

        function onDragEndActivityTree(e) {
            kendo.ui.progress($('#activityTree'), true);
            var treeview = this,
                sourceUid = $(e.sourceNode).data("uid"),
                destinationUid = $(e.destinationNode).data("uid"),
                source,
                destination;
            source = treeview.dataSource.getByUid(sourceUid);
            destination = treeview.dataSource.getByUid(destinationUid);
            sourceId = parseInt(source.id);
            destinationId = parseInt(destination.id);
            //تغییر نود درخت
            $.ajax(
                {
                    type: 'GET',
                    url: '/Activity/ChangeNodePosition',
                    dataType: 'json',
                    async: true,
                    data: { 'nodeId': sourceId, 'newParentId': destinationId },
                    success: function (response) {
                        kendo.ui.progress($('#activityTree'), false);
                        var messageClass = '';
                        if (response.Status == true) {
                            messageClass = 'success';
                        }
                        else {
                            messageClass = 'danger';
                        }
                        $('#messageActivityStructure').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                            '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                            '<strong>' +
                            response.Message +
                            '</strong>' +
                            '</div>').delay(5000).fadeOut(800);
                        var activityTree = $("#activityTree").data("kendoTreeView");
                        activityTree.dataSource.read();
                        var offset = -270;
                        $('html, body').animate({
                            scrollTop: $("#messageActivityStructure").offset().top + offset
                        }, 500);
                    },
                    error: function () {
                        kendo.ui.progress($('#activityTree'), false);
                        var errorMessage = 'بروز خطا در برقراری ارتباط';
                        ActivityStructure.Error(errorMessage);
                    },
                });
            var activityTree = $("#activityTree").data("kendoTreeView");
            activityTree.dataSource.read();
        }
        var rootUrl = "/Activity";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/GetLevelActivity?treeTitleId=" + treeTitleActivityId,
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
        $("#activityTreeMenu").kendoContextMenu({
            target: "#activityTree",
            filter: ".k-in",
            select: function (e) {
                var button = $(e.item);
                var node = $(e.target);
                var data = $("#activityTree").data("kendoTreeView").dataItem(node);
                activityId = data.Id;
                parentActivityId = data.ParentId;
                activityTitle = data.Title;
                activityCode = data.Code;
                activityType=data.ActivityType;
                activityParentCode = data.ParentCode;
                activityDriverId = data.ActivityDriverId;
                //IsProductive = data.IsProductive;
                description = data.Description;
                if (button.text() == 'افزودن') {
                    console.log(button)
                    isCreateNode = false;
                    $('.activityTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                    $('.activityTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    var preCode = '';
                    if (activityParentCode != null) {
                        preCode = activityParentCode + activityCode;
                    } else {
                        preCode = activityCode;
                    }
                    $('#frm-createActivity').find('#preCode').val(preCode);

                }
                else if (button.text() == 'ویرایش') {
                    $('.activityTreeEditForm').removeClass('displayNone').addClass('displayShow');
                    $('.activityTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    $('#frm-editActivity').find('#ID').val(activityId);
                    $('#frm-editActivity').find('#preCode').val(activityParentCode);
                    $('#frm-editActivity').find('#Title').val(activityTitle);
                    $('#frm-editActivity').find('#Code').val(activityCode);
                   debugger;
                    $('#frm-editActivity').find('#Type').val(activityType);
                    $('#frm-editActivity').find("#ActivityDriverId").find('option').each(function () {
                        if (this.value == activityDriverId) {
                            this.selected = true;
                        }
                    });
                    //if (IsProductive == true) {
                    //    $('#frm-editActivity').find('input[value="Productive"]').prop("checked", true);
                    //} else {
                    //    $('#frm-editActivity').find('input[value="Provider"]').prop("checked", true);
                    //}
                    $('#frm-editActivity').find('#Description').val(description);
                }
                else if (button.text() == 'حذف') {
                    debugger;
                    activityId = data.Id;
                    activityId = parseInt(activityId);
                    $.ajax({
                        type: 'POST',
                        url: '/Activity/DeleteActivity',
                        dataType: 'json',
                        async: false,
                        data: {
                            'id': activityId,
                        },
                        success: function (response) {
                            var messageClass = '';
                            if (response.Status == true) {
                                messageClass = 'success';
                            }
                            else {
                                messageClass = 'danger';
                            }
                            $('#messageActivityStructure').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                                '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                '<strong>' +
                                response.Message +
                                '</strong>' +
                                '</div>').delay(5000).fadeOut(800);
                            var activityTree = $("#activityTree").data("kendoTreeView");
                            activityTree.dataSource.read();
                            var offset = -270;
                            $('html, body').animate({
                                scrollTop: $("#messageActivityStructure").offset().top + offset
                            }, 500);
                        },
                        error: function () {
                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                            ActivityStructure.Error(errorMessage);
                        }
                    });
                }
                else if (button.text() == 'کپی') {
                    copySourceId = parseInt(data.id);
                    $('#pasteActivityNode').removeClass('k-state-disabled');
                }
                else if (button.text() == 'انتقال') {
                    copyDistinationId = parseInt(data.id);
                    kendo.ui.progress($('#activityTree'), true);
                    ActivityStructure.CopyNod(copySourceId, copyDistinationId);
                }
            }
        });
        $("#activityTree").kendoTreeView({
            // appends a new node to the root level
            dataSource: data,
            dataTextField: "Title",
            change: onChangeActivityTree,
            dragend: onDragEndActivityTree,
            dragAndDrop: true,
        });
    },
    GetComboes: function () {
        //دریافت لست محرک ها
        $.ajax({
            type: 'GET',
            url: '/Activity/GetUnit',
            dataType: 'json',
            async: false,
            success: function (response) {
                var ActivityDriverContent = '<option selected disabled>لطفا محرک فعالیت را انتخاب نمائید</option>';
                for (i = 0; i < response.length; i++) {
                    ActivityDriverContent += '<option value="' + response[i].Id + '">' + response[i].Title + '</option>';
                }
                $('.ActivityDriverId').html(ActivityDriverContent);
            },
            error: function () {
                var errorMessage = 'بروز خطا در برقراری ارتباط';
                ActivityStructure.Error(errorMessage);
            }
        });
    },
    CreateActivity: function (treeTitleActivityId, isCreateNode) {
        if (isCreateNode == true) {
            activityId = null;
        }
        $("#frm-createActivity").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },
                Code: { required: true, number: true },
                ActivityDriverId: { required: true },
                //IsProductive: { required: true },
            },
            messages: {
            },
            submitHandler: function (form) {
                var Title = $('#frm-createActivity').find('#Title').val();
                var Code = $('#frm-createActivity').find('#Code').val();
                var ParentCode = $('#frm-createActivity').find('#preCode').val();
                var activityDriverId = $('#frm-createActivity').find('#ActivityDriverId').val();
                var Description = $('#frm-createActivity').find('#Description').val();
                 var Type = $('#frm-createActivity').find('#Type').val();
                //var IsProductive;
                //if ($('#frm-createActivity').find('input[value = "Productive"]').is(':checked')) {
                //    IsProductive = true
                //} else {
                //    IsProductive = false;
                //}

                var model = {
                    'TreeTitleId': treeTitleActivityId, 'ParentId': activityId, 'Title': Title,
                    'Code': Code, 'ParentCode': ParentCode,
                    'activityDriverId': activityDriverId, 'Description': Description,"Type":Type
                }
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Activity/CreateActivity',
                        dataType: 'json',
                        async: false,
                        data: {
                            model,
                        },
                        success: function (response) {
                        
                            var messageClass = '';
                            document.getElementById("frm-createActivity").reset();
                            $('.activityTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                            if (response.Status == true) {
                                messageClass = 'success';
                            }
                            else {
                                messageClass = 'danger';
                            }
                            $('#messageCreateActivityStructure').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                                '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                '<strong>' +
                                response.Message +
                                '</strong>' +
                                '</div>').delay(5000).fadeOut(800);
                            var activityTree = $("#activityTree").data("kendoTreeView");
                            activityTree.dataSource.read();
                            var offset = -270;
                            $('html, body').animate({
                                scrollTop: $("#messageCreateActivityStructure").offset().top + offset
                            }, 500);
                        },
                        error: function () {
                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                            ActivityStructure.Error(errorMessage);
                        },
                    });
            }
        });
    },
    EditActivity: function (treeTitleActivityId) {
        $("#frm-editActivity").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },
                Code: { required: true, number: true },
                ActivityDriverId: { required: true },
                //IsProductive: { required: true },
            },
            messages: {
            },
            submitHandler: function (form) {
                var Id = $('#frm-editActivity').find('#ID').val();
                var Title = $('#frm-editActivity').find('#Title').val();
                var Code = $('#frm-editActivity').find('#Code').val();
                var activityDriverId = $('#frm-editActivity').find('#ActivityDriverId').val();
                var Description = $('#frm-editActivity').find('#Description').val();
                 var Type = $('#frm-editActivity').find('#Type').val();
                //var IsProductive;
                //if ($('#frm-editActivity').find('input[value = "Productive"]').is(':checked')) {
                //    IsProductive = true;
                //} else {
                //    IsProductive = false;
                //}

                var model = {
                    'Id': Id, 'TreeTitleId': treeTitleActivityId, 'ParentId': parentActivityId, 'Title': Title,
                    'Code': Code,'activityDriverId': activityDriverId, 'Description': Description,'Type':Type
                }
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Activity/EditActivity',
                        dataType: 'json',
                        async: false,
                        data: {
                            model,
                        },
                        success: function (response) {
                            debugger;
                            var messageClass = '';
                        //    document.getElementById("frm-editActivity").reset();
                          //  $('.activityTreeEditForm').removeClass('displayShow').addClass('displayNone');
                            if (response.Status == true) {
                                messageClass = 'success';
                            }
                            else {
                                messageClass = 'danger';
                            }
                            $('#messageEditActivityStructure').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                                '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                '<strong>' +
                                response.Message +
                                '</strong>' +
                                '</div>').delay(5000).fadeOut(800);
                            var activityTree = $("#activityTree").data("kendoTreeView");
                            activityTree.dataSource.read();
                            var offset = -270;
                            $('html, body').animate({
                                scrollTop: $("#messageEditActivityStructure").offset().top + offset
                            }, 500);
                        },
                        error: function () {
                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                            ActivityStructure.Error(errorMessage);
                        },
                    });
            }
        });
    },
    CopyNod: function (copySourceId, copyDistinationId) {
        var activityTree = $("#activityTree").data("kendoTreeView");
        activityTree.dataSource.read();
        $.ajax(
            {
                type: 'GET',
                url: '/Activity/CopyNode',
                dataType: 'json',
                async: true,
                data: { 'nodeId': copySourceId, 'newParentId': copyDistinationId },
                success: function (response) {
                    kendo.ui.progress($('#activityTree'), false);
                    var messageClass = '';
                    document.getElementById("frm-editActivity").reset();
                    if (response.Status == true) {
                        messageClass = 'success';
                    }
                    else {
                        messageClass = 'danger';
                    }
                    $('#messageActivityStructure').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                        '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                        '<strong>' +
                        response.Message +
                        '</strong>' +
                        '</div>').delay(5000).fadeOut(800);
                    var activityTree = $("#activityTree").data("kendoTreeView");
                    activityTree.dataSource.read();
                    var offset = -270;
                    $('html, body').animate({
                        scrollTop: $("#messageActivityStructure").offset().top + offset
                    }, 500);
                },
                error: function () {
                    kendo.ui.progress($('#activityTree'), false);
                    var errorMessage = 'بروز خطا در برقراری ارتباط';
                    ActivityStructure.Error(errorMessage);
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
ActivityStructure.init();