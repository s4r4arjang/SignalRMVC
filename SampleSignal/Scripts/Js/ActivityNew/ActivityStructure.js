var ActivityId, activityTreeTitleId;
var Activity = {
    init: function () {
       
        Activity.AddListener();

    },
    AddListener: function () {
       
        //دریافت آی دی درخت فعالیت
        $(document).ready(function () {
            activityTreeTitleId = $('#treeTitleId').val();
            //دریافت اطلاعات درخت فعالیت
            Activity.GetactivityTree(activityTreeTitleId);
            //ویرایش درخت
            Activity.EditActivity();
            // ایجاد ریشه
            $('#createNode').on('click',
            
                function () {
                    
                    Activity.CreateNode();
                });
        });
    },
    CreateNode: function () {
        
        
        $('.activityTreeCreateForm').removeClass('displayNone').addClass('displayShow');
        $('.activityTreeEditForm').removeClass('displayShow').addClass('displayNone');
        isCreateNode = true;
        Activity.CreateActivity(isCreateNode);
    },
    GetactivityTree: function () {
       
        function onChangeactivityTree(e) {
            $('.activityTreeCreateForm').removeClass('displayShow').addClass('displayNone');
            $('.activityTreeEditForm').removeClass('displayShow').addClass('displayNone');

        }


        var rootUrl = "/ActivityNew";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/GetLevels?TreeTitleId=" + $('#treeTitleId').val(),
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

        $("#activityTreeMenu").kendoContextMenu({
            target: "#activityTree",
            filter: ".k-in",
            select: function (e) {
                var button = $(e.item);
                var node = $(e.target);
                var data = $("#activityTree").data("kendoTreeView").dataItem(node);
                ActivityId = data.ActivityId;

                ActivityTitle = data.Title;
                
                parentActivityId = data.ParentId;
                activityTitle = data.Title;
                activityCode = data.Code;
                activityType = data.Type;
                activityParentCode = data.ParentCode;
                activityDriverId = data.ActivityDriverId;
                description = data.Description;
                if (button.text() === 'افزودن') {

                    isCreateNode = false;
                    $('.activityTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                    $('.activityTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    var preCode = '';
                    if (activityParentCode !== null) {
                        preCode = activityParentCode + activityCode;
                    } else {
                        preCode = activityCode;
                    }
                    $('#frm-createActivity').find('#preCode').val(preCode);
                    Activity.CreateActivity(isCreateNode)

                }
                else if (button.text() === 'ویرایش') {
                    
                    $('.activityTreeEditForm').removeClass('displayNone').addClass('displayShow');
                    $('.activityTreeCreateForm').removeClass('displayShow').addClass('displayNone');

                    $('#frm-editActivity').find('#Title').val(ActivityTitle);

                    
                    $('#frm-editActivity').find('#ID').val(ActivityId);
                    $('#frm-editActivity').find('#preCode').val(activityParentCode);
                    $('#frm-editActivity').find('#Title').val(activityTitle);
                    $('#frm-editActivity').find('#Code').val(activityCode);
                   
                    $('#frm-editActivity').find('#Type').val(activityType);

                    $('#frm-editActivity').find('#ActivityDriverId').val(activityDriverId);
                  
                    
                    $('#frm-editActivity').find('#Description').val(description);
                }
                else if (button.text() === 'حذف') {
                    $('.activityTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    $('.activityTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    $('#ListIndicator').removeClass('displayShow').addClass('displayNone');


                    var Form = $('#__AjaxAntiForgeryForm');
                    var token = $('input[name="__RequestVerificationToken"]', Form).val();
                    $.ajax({
                        type: 'POST',
                        url: '/ActivityNew/DeleteActivity',
                        dataType: 'json',
                        async: false,
                        data: {
                            'Id': ActivityId,
                            __RequestVerificationToken: token
                        },
                        success: function (response) {
                            if (response.Status === true) {

                                AllertSuccess(response.Message, "کدینگ فعالیت");
                                var activityTree = $("#activityTree").data("kendoTreeView");
                                activityTree.dataSource.read();
                            }
                            else {
                                AllertError(response.Message, "کدینگ فعالیت");
                            }
                        },
                        error: function () {

                            AllertError("امکان حذف وجود ندارد", "اهداف");
                        }
                    });
                }

            }
        });
        $("#activityTree").kendoTreeView({

            dataSource: data,
            dataTextField: "Title",
            change: onChangeactivityTree,

        });
    },
    CreateActivity: function (isCreateNode) {
        
        if (isCreateNode === true) {
            ActivityId = null;
        }
        $("#frm-createActivity").submit(function (e) {

            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },
                Code: { required: true, number: true },
                ActivityDriverId: { required: true },

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
                

                var model = {
                    'TreeTitleId': activityTreeTitleId, 'ParentId': ActivityId, 'Title': Title,
                    'Code': Code, 'ParentCode': ParentCode,
                    'ActivityDriverId': activityDriverId, 'Description': Description, "Type": Type
                }


                var Form = $('#frm-createActivity');
                var token = $('input[name="__RequestVerificationToken"]', Form).val();
                $.ajax(
                    {

                        type: 'POST',
                        url: '/ActivityNew/CreateActivity',
                        dataType: 'json',

                        data: {
                            model,
                            __RequestVerificationToken: token
                        },
                        success: function (response) {


                         
                            if (response.Status === true) {
                                AllertSuccess(response.Message, "کدینگ فعالیت");
                                document.getElementById("frm-createActivity").reset();
                                $('.activityTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                                var activityTree = $("#activityTree").data("kendoTreeView");
                                activityTree.dataSource.read();
                            }
                            else {
                                AllertError(response.Message, "کدینگ فعالیت");
                            }

                           

                        },
                        error: function () {

                            AllertError("بروز خطا در برقراری ارتباط", "کدینگ فعالیت");

                        },
                    });
            }
        });
    },
    EditActivity: function () {
       
        $("#frm-editActivity").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },
                Code: { required: true, number: true },
                ActivityDriverId: { required: true },

            },
            messages: {
            },
            submitHandler: function (form) {

                var ActivityId = $('#frm-editActivity').find('#ID').val();
                var Title = $('#frm-editActivity').find('#Title').val();
                var Code = $('#frm-editActivity').find('#Code').val();
                var activityDriverId = $('#frm-editActivity').find('#ActivityDriverId').val();
                var Description = $('#frm-editActivity').find('#Description').val();
                var Type = $('#frm-editActivity').find('#Type').val();
                
                var model = {
                    'ActivityId': ActivityId, 'TreeTitleId': activityTreeTitleId, 'ParentId': parentActivityId, 'Title': Title,
                    'Code': Code, 'activityDriverId': activityDriverId, 'Description': Description, 'Type': Type
                }


                var Form = $('#frm-editActivity');
                var token = $('input[name="__RequestVerificationToken"]', Form).val();
           

                $.ajax(
                    {
                        type: 'POST',
                        url: '/ActivityNew/EditActivity',
                        dataType: 'json',

                        data: {
                            model,
                            __RequestVerificationToken: token
                        },
                        success: function (response) {


                            if (response.Status === true) {
                                AllertSuccess(response.Message, "کدینگ فعالیت");
                                $('.activityTreeEditForm').removeClass('displayShow').addClass('displayNone');
                                $('.activityTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                                var activityTree = $("#activityTree").data("kendoTreeView");
                                activityTree.dataSource.read();
                            }
                            else {
                                AllertError(response.Message, "کدینگ فعالیت");
                            }
                          

                        },
                        error: function () {

                            AllertError("امکان ویرایش وجود ندارد", "کدینگ فعالیت");
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
Activity.init();


