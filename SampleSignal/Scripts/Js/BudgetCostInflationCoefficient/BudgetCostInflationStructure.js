var BudgetCostInflationCoefficientId, BudgetCostInflationCoefficientTreeTitleId;
var BudgetCostInflationCoefficient = {
    init: function () {
       
        BudgetCostInflationCoefficient.AddListener();

    },
    AddListener: function () {
       
        //دریافت آی دی درخت هزینه
        $(document).ready(function () {
            BudgetCostInflationCoefficientTreeTitleId = $('#treeTitleId').val();
            //دریافت اطلاعات درخت هزینه
            BudgetCostInflationCoefficient.GetBudgetCostInflationCoefficientTree();
            BudgetCostInflationCoefficient.UpdateBudgetCostInflationCoefficient();
            
        });
    },
    UpdateNode: function () {
        
        
        $('.BudgetCostInflationCoefficientTreeUpdateForm').removeClass('displayNone').addClass('displayShow');
        
        
        BudgetCostInflationCoefficient.UpdateBudgetCostInflationCoefficient();
    },
    GetBudgetCostInflationCoefficientTree: function () {
       
        function onChangeBudgetCostInflationCoefficientTree(e) {
            $('.BudgetCostInflationCoefficientTreeUpdateForm').removeClass('displayShow').addClass('displayNone');
            

        }


        var rootUrl = "/BudgetCostInflationCoefficient";
        data = new kendo.data.HierarchicalDataSource({
            transport: {
                read: {
                    url: rootUrl + "/GetLevels?TreeTitleId=" + $('#treeTitleId').val(),
                    dataType: "jsonp"
                }
            },
            schema: {
                model: {
                    id: "CostId",
                    hasChildren: "HasChild",
                }
            },
        });

        $("#BudgetCostInflationCoefficientTreeMenu").kendoContextMenu({
            target: "#BudgetCostInflationCoefficientTree",
            filter: ".k-in",
            select: function (e) {
                var button = $(e.item);
                var node = $(e.target);
                var data = $("#BudgetCostInflationCoefficientTree").data("kendoTreeView").dataItem(node);
                BudgetCostInflationCoefficientId = data.CostId;

                BudgetCostInflationCoefficientTitle = data.Title;
                
                parentBudgetCostInflationCoefficientId = data.ParentId;
               
                


                if (button.text() === 'تورم') {
                    if (data.hasChildren) {

                        $('#frm-UpdateBudgetCostInflationCoefficient').find('#InflationCoefficientNumber').val(" ");
                        $('.BudgetCostInflationCoefficientTreeUpdateForm').removeClass('displayNone').addClass('displayShow');
                        

                        BudgetCostInflationCoefficient.UpdateBudgetCostInflationCoefficient()
                       

                    }
                    else {

                        
                        
                         $.ajax({
                        type: 'GET',
                               url: '/BudgetCostInflationCoefficient/GetBudgetCostInflationCoefficient/' + BudgetCostInflationCoefficientId,
                        
                        async: false,
                        
                               success: function (response) {
                                
                            var res=JSON.parse(response);
                                   $('#frm-UpdateBudgetCostInflationCoefficient').find('#InflationCoefficientNumber').val(res);
                                  

                        },
                        error: function () {

                            AllertError("بروز خطا در دریافت اطلاعات", "نرخ تورم هزینه بودجه");
                        }
                           });

                        $('.BudgetCostInflationCoefficientTreeUpdateForm').removeClass('displayNone').addClass('displayShow');

                    }
                }
                

            }
        });
        $("#BudgetCostInflationCoefficientTree").kendoTreeView({

            dataSource: data,
            dataTextField: "Title",
            change: onChangeBudgetCostInflationCoefficientTree,

        });
    },
    UpdateBudgetCostInflationCoefficient: function () {
       
       
        $("#frm-UpdateBudgetCostInflationCoefficient").submit(function (e) {
           
            e.preventDefault();
        }).validate({
            rules: {
                InflationCoefficient: { required: true },
                CostId: { required: true },
                
            },
            messages: {
            },
            submitHandler: function (form) {
                var InflationCoefficient = $('#frm-UpdateBudgetCostInflationCoefficient').find('#InflationCoefficient').val();
                debugger;
                var model = {
                     'CostId': BudgetCostInflationCoefficientId,
                      'InflationCoefficient': InflationCoefficient
                    
                }
                var Form = $('#frm-UpdateBudgetCostInflationCoefficient');
                var token = $('input[name="__RequestVerificationToken"]', Form).val();
                $.ajax(
                    {
                        type: 'POST',
                        url: '/BudgetCostInflationCoefficient/UpdateBudgetCostInflationCoefficient',
                        dataType: 'json',

                        data: {
                            model,
                            __RequestVerificationToken : token
                        },
                        success: function (response) {


                         
                            if (response.Status === true) {
                                AllertSuccess(response.Message, "نرخ تورم هزینه بودجه");
                                document.getElementById("frm-UpdateBudgetCostInflationCoefficient").reset();
                                $('.BudgetCostInflationCoefficientTreeUpdateForm').removeClass('displayShow').addClass('displayNone');
                                var BudgetCostInflationCoefficientTree = $("#BudgetCostInflationCoefficientTree").data("kendoTreeView");
                                BudgetCostInflationCoefficientTree.dataSource.read();
                            }
                            else {
                                AllertError(response.Message, "نرخ تورم هزینه بودجه");
                            }

                           

                        },
                        error: function () {

                            AllertError("امکان ثبت وجود ندارد", "نرخ تورم هزینه بودجه");

                        },
                    });
            }
        });
    },
    



   
}
BudgetCostInflationCoefficient.init();


