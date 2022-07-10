var GoalId, GoalTreeTitleId;
var Goal = {
    init: function () {
        Goal.AddListener();

    },
    AddListener: function () {
        debugger;
        //دریافت آی دی درخت فعالیت
        $(document).ready(function () {
            GoalTreeTitleId = $('#GoalTreeTitleId').val();
            //دریافت اطلاعات درخت فعالیت
            Goal.GetGoalTree();
            ////ایجاد درخت
            //  Goal.CreateGoal( isCreateNode);
            ////ویرایش درخت
            Goal.EditGoal();
            // ایجاد ریشه
            $('#createNode').on('click',
                function () {
                    Goal.CreateNode();
                });
        });
    },
    CreateNode: function () {
        $('.GoalTreeCreateForm').removeClass('displayNone').addClass('displayShow');
        $('.GoalTreeEditForm').removeClass('displayShow').addClass('displayNone');
        isCreateNode = true;
        Goal.CreateGoal(isCreateNode);
    },
    GetGoalTree: function () {
        debugger;
        function onChangeGoalTree(e) {
            $('.GoalTreeCreateForm').removeClass('displayShow').addClass('displayNone');
            $('.GoalTreeEditForm').removeClass('displayShow').addClass('displayNone');
       
        }

        
        var rootUrl = "/Goal";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/GetLevels?GoalTreeTitleId=" + $('#GoalTreeTitleId').val(),
                    dataType: "jsonp"
                }
            },
            schema: {
                model: {
                    id: "GoalId",
                    hasChildren: "HasChild",
                }
            },
        });

        $("#GoalTreeMenu").kendoContextMenu({
            target: "#GoalTree",
            filter: ".k-in",
            select: function (e) {
                var button = $(e.item);
                var node = $(e.target);
                var data = $("#GoalTree").data("kendoTreeView").dataItem(node);
                GoalId = data.GoalId;

                GoalTitle = data.Title;


                if (button.text() === 'افزودن') {

                    isCreateNode = false;
                    $('.GoalTreeCreateForm').removeClass('displayNone').addClass('displayShow');
                    $('.GoalTreeEditForm').removeClass('displayShow').addClass('displayNone');
        
                    Goal.CreateGoal(isCreateNode)

                }
                else if (button.text() === 'ویرایش') {
                    $('.GoalTreeEditForm').removeClass('displayNone').addClass('displayShow');
                    $('.GoalTreeCreateForm').removeClass('displayShow').addClass('displayNone');
            

                    $('#frm-editGoal').find('#Title').val(GoalTitle);


                }
                else if (button.text() === 'حذف') {
                    $('.GoalTreeEditForm').removeClass('displayShow').addClass('displayNone');
                    $('.GoalTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                    $('#ListIndicator').removeClass('displayShow').addClass('displayNone');
                    
                    var token = $('input[name="__RequestVerificationToken"]').val();
                    $.ajax({
                        type: 'POST',
                        url: '/Goal/DeleteGoal',
                        dataType: 'json',
                        async: false,
                        data: {
                            'id': GoalId,
                            __RequestVerificationToken :token
                        },
                        success: function (response) {
                            if (response.Status === true) {
                                
                                AllertSuccess(response.Message, "اهداف");
                            }
                            else {
                                AllertError(response.Message, "اهداف");
                            }

                            var GoalTree = $("#GoalTree").data("kendoTreeView");
                            GoalTree.dataSource.read();

                        },
                        error: function () {
                           
                            AllertError("امکان حذف وجود ندارد", "اهداف");
                        }
                    });
                }

            }
        });
        $("#GoalTree").kendoTreeView({

            dataSource: data,
            dataTextField: "Title",
            change: onChangeGoalTree,

        });
    },
    CreateGoal: function (isCreateNode) {

        if (isCreateNode === true) {
            GoalId = null;
        }
        $("#frm-createGoal").submit(function (e) {

            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },

            },
            messages: {
            },
            submitHandler: function (form) {

                var Title = $('#frm-createGoal').find('#Title').val();
                var GoalTreeTitleId = $("#GoalTreeTitleId").val();
                debugger;
                var model = {

                    'Title': Title,
                    'ParentId': GoalId,
                    'GoalTreeTitleId': GoalTreeTitleId
                }
                var form = $('#frm-createGoal');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Goal/CreateGoal',
                        dataType: 'json',

                        data: {
                            model,
                            __RequestVerificationToken : token
                        },
                        success: function (response) {

                            
                            document.getElementById("frm-createGoal").reset();
                            $('.GoalTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                            if (response.Status === true) {
                                AllertSuccess(response.Message, "اهداف");
                            }
                            else {
                                AllertError(response.Message, "اهداف");
                            }

                            var GoalTree = $("#GoalTree").data("kendoTreeView");
                            GoalTree.dataSource.read();

                        },
                        error: function () {
                            
                            AllertError("بروز خطا در برقراری ارتباط", "اهداف");

                        },
                    });
            }
        });
    },
    EditGoal: function () {
        debugger;
        $("#frm-editGoal").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true },

            },
            messages: {
            },
            submitHandler: function (form) {

                var Title = $('#frm-editGoal').find('#Title').val();

                var model = {

                    'Title': Title,
                    'GoalId': GoalId,

                }
                var form = $('#frm-editGoal');
                var token = $('input[name="__RequestVerificationToken"]', form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Goal/EditGoal',
                        dataType: 'json',

                        data: {
                            model,
                            __RequestVerificationToken : token
                        },
                        success: function (response) {


                            if (response.Status === true) {
                                AllertSuccess(response.Message, "اهداف");
                            }
                            else {
                                AllertError(response.Message, "اهداف");
                            }
                            $('.GoalTreeEditForm').removeClass('displayShow').addClass('displayNone');
                            $('.GoalTreeCreateForm').removeClass('displayShow').addClass('displayNone');
                            var GoalTree = $("#GoalTree").data("kendoTreeView");
                            GoalTree.dataSource.read();

                        },
                        error: function () {
                           
                            AllertError("بروز خطا در برقراری ارتباط", "اهداف");
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
Goal.init();


