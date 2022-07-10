var record;
var OrganizationalMissionVision = {
    init: function () {
        OrganizationalMissionVision.GetOrganizationalMissionVision();
    },
    GetOrganizationalMissionVision: function () {

        $.ajax({
            type: "GET",
            url: "/OrganizationalMissionVision/Create",

            dataType: "html",
            success: function (response) {

                $('#missionvision').html(response);




            },

        });

    },

}
OrganizationalMissionVision.init();