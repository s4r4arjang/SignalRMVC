
   
$("#frm-createCost").submit(function (e) {
        e.preventDefault();
    }).validate({
        rules: {
            Title: { required: true },
            Code: { required: true, number: true },
            CostType: { required: true },
            CostDriverId: { required: true },
            StaffPartId: { required: true },
            CostGroupId: { required: true },
            MoneyUnitId: { required: true },
            CostStaffId: { required: true}
               
            
        },
        messages: {
        },
        submitHandler: function (form) {
            var Title = $('#frm-createCost').find('#Title').val();
            var Code = $('#frm-createCost').find('#Code').val();
            var ParentCode = $('#frm-createCost').find('#preCode').val();
            var CostType = $('#frm-createCost').find('#CostType').val();
            var CostDriverId = CostType == 3 ? $('#frm-createCost').find('#CostDriverId').val() : null;
            var CostGroupId = $('#frm-createCost').find('#CostGroupId').val();
            var StaffPartId = CostType == 4 ? $('#frm-createCost').find('#CostStaffId').val() : null;
            var Description = $('#frm-createCost').find('#Description').val();
            var DynamicType = $('#frm-createCost').find('#dynamicType').val();
            var MoneyUnitId = $('#frm-createCost').find('#MoneyUnitId').val();
            var model = {
                'TreeTitleId': treeTitleCostId, 'ParentId': costId, 'Title': Title,
                'Code': Code, 'ParentCode': ParentCode, 'CostType': CostType,
                'CostDriverId': CostDriverId, 'CostGroupId': CostGroupId, 'Description': Description
                , StaffPartId: StaffPartId, 'DynamicType': DynamicType, 'MoneyUnitId': MoneyUnitId
            }
            $.ajax(
                {
                    type: 'POST',
                    url: '/Cost/CreateCost',
                    dataType: 'json',
                    async: false,
                    data: {
                        model,
                    },
                    success: function (response) {
                        var messageClass = '';
                        if (response.Status == true) {
                            $('#CostDriverId').attr('disabled', false);
                            document.getElementById("frm-createCost").reset();
                            messageClass = 'success';
                        }
                        else {
                            messageClass = 'danger';
                        }
                        $('#messageCreateCostStructure').fadeIn().html('<div class= "alert alert-' + messageClass + ' alert-dismissible">' +
                            '<a href = "#" class= "close" data-dismiss="alert" aria-label="close">&times;</a >' +
                            '<strong>' +
                            response.Message +
                            '</strong>' +
                            '</div>').delay(5000).fadeOut(800);
                        var costTree = $("#costTree").data("kendoTreeView");
                        costTree.dataSource.read();
                        var offset = -270;
                        $('html, body').animate({
                            scrollTop: $("#messageCreateCostStructure").offset().top + offset
                        }, 500);
                    },
                    error: function () {
                        var errorMessage = 'بروز خطا در برقراری ارتباط';
                        CostStructure.Error(errorMessage);
                    },
                });
        }
    });
