var PermissionCreation = {
    init: function () {
        PermissionCreation.AddListener();
        PermissionCreation.CreatePermission();
          var Roles = $("#Roles").kendoMultiSelect({
              
              placeholder: "حد اقل یک نقش را انتخاب کنید"
            }).data("kendoMultiSelect");
         PermissionCreation.changePermType();
    },
    AddListener: function () {
        //iCheck for checkbox and radio inputs    
          $('select[name="PermissionType"]').change(function () {
       PermissionCreation.changePermType();
           });
    },
    changePermType:function() {
    $('[data-madule]').hide();
        $('[data-operation]').hide();
    var permType = $('select[name="PermissionType"]').val();
    switch (permType) {
        case "MODULE_PERMTYPE":
            $('[data-madule]').show();
            break;
        case "CATEGORY_PERMTYPE":
            $('#-').show();
            break;
        case "OPERATION_PERMTYPE":
            $('[data-operation]').show();
            break;
    default:
    }
      },

    CreatePermission: function () {
       
  
    $.validator.addMethod("EngCharachters",
            function (value, element, options) {
                return this.optional(element) || /^[A-Za-z][A-Za-z0-9]*$/.test(value);

                //if ($('#Title').val() != "") {
                //    if (this.optional(element) || isValid == true) {
                //        return true;
                //    } else {
                //        return this.optional(element);
                //    }
                //}
            });
        $("#frm-addPermission").submit(function (e) {
            e.preventDefault();
        }).validate({
            rules: {
                Title: { required: true, },
                Roles: { required: true, EngCharachters: true },
                BranchId: { required: true, },

              
            },
            messages: {
            },
            submitHandler: function (form) {
                var Id = $(form).find('#Id').val();
                var Title = $(form).find('#Title').val();
                var RoleIds = $(form).find('#Roles').val();
                var PermissionType = $(form).find('#PermissionType').val();
                var PortalModules = $(form).find('#PortalModules').val();
                var PermissionCode = PermissionType=="MODULE_PERMTYPE"? PortalModules :  $(form).find('#PermissionCode').val() ;
                var PermissionAccsessType = $(form).find('#PermissionAccsessType').val();
             
                $.ajax(
                    {
                        type: 'POST',
                        url: '/Permission/Update',
                        dataType: 'json',
                        async: false,
                        data: {
                          'Id':Id,  'Title': Title, 'RoleIds': RoleIds, 'PermissionType': PermissionType, 'PermissionCode': PermissionCode, 'PermissionAccsessType': PermissionAccsessType,
                        },
                        success: function (response) {
                            var messageClass = '';
                            if (response.Status == true) {
                               
                                messageClass = 'success';
                            }
                            else {
                                messageClass = 'danger';
                            }
                            $('#messagePermissionCreation').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                                '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                                '<strong>' +
                                response.Message +
                                '</strong>' +
                                '</div>').delay(5000).fadeOut(800);
                            var offset = -270;
                            $('html, body').animate({
                                scrollTop: $("#messagePermissionCreation").offset().top + offset
                            }, 500);
                        },
                        error: function () {
                            var errorMessage = 'بروز خطا در برقراری ارتباط';
                            PermissionCreation.Error(errorMessage);
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
PermissionCreation.init();