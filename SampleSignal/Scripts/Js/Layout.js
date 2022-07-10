var MenuId, Tabs, TabsContent, tabTitle, tabUrl, tabScriptAddress, tabClass, tabContentClass, activeClass, deactiveClass, TabIdList = [];
var Layout = {
    init: function () {
        Layout.AddListener();
        Layout.LoadAllSessions();
     //   Layout.GetActiveSessions();
        Layout.LoadSideBar();
        Layout.GetDateTime();
    },
    AddListener: function () {
        //نمایش دکمه بستن تمام تب ها
        $(document).ready(function () {
            var TabId = '';
            var TabIdList = [];
            $('.customTabs').find('.customTabsItem').each(function () {
                TabId = $(this).attr('id');
                TabIdList.push(TabId);
            });
            if (TabIdList.length > 1) {
                Tabs.prepend('<li menuId="closeAll" id="tabId_closeAll" class="customTabsItem">' +
                    '<a title="بستن تمام تب ها">' +
                    '<span><i class="fas fa-times"></i></span>' +
                    '</a></li>');
            }
        });
        //دریافت کوکی تب های باز و نمایش تب ها هنگام لود صفحه
        Tabs = $('.customTabs');
        TabsContent = $('.customTabContents');
        var allOfCookie = document.cookie.replace('CustomTab=', '');
        var TabsDataCookie = allOfCookie.split('],');
        for (i = 0; i < TabsDataCookie.length; i++) {
            var TabDataCookie = TabsDataCookie[i];
            TabDataCookie = TabDataCookie.split(',');
            if (TabDataCookie.length > 1) {
                for (j = 0; j < TabDataCookie.length; j++) {
                    if (TabDataCookie[j].includes('MenuId')) {
                        MenuId = TabDataCookie[j].split(':')[1].replace(/"/g, '');
                    }
                    if (TabDataCookie[j].includes('Tabtitle')) {
                        tabTitle = TabDataCookie[j].split(':')[1].replace(/"/g, '');
                    }
                    if (TabDataCookie[j].includes('TabUrl')) {
                        tabUrl = TabDataCookie[j].split(':')[1].replace(/"/g, '');
                    }
                    if (TabDataCookie[j].includes('TabClass')) {
                        tabClass = TabDataCookie[j].split(':')[1].replace(/"/g, '');
                    }
                    if (TabDataCookie[j].includes('TabContentClass')) {
                        tabContentClass = TabDataCookie[j].split(':')[1].replace(/"/g, '');
                    }
                    if (TabDataCookie[j].includes('DeactiveClass')) {
                        deactiveClass = TabDataCookie[j].split(':')[1].replace(/"|}/g, '');
                    }
                    if (TabDataCookie[j].includes('ActiveClass')) {
                        activeClass = TabDataCookie[j].split(':')[1].replace(/"/g, '');
                    }
                    if (TabDataCookie[j].includes('TabScriptAddress')) {
                        tabScriptAddress = TabDataCookie[j].split(':')[1].replace(/"/g, '');
                    }
                }
                CustomTab.AddDynaTab(MenuId,
                    tabTitle,
                    tabUrl,
                    tabScriptAddress,
                    tabClass,
                    tabContentClass,
                    activeClass,
                    deactiveClass);
            }
        }
    },
    //درسافت سال مالی و دوره و ساختار های فعال هر کاربر

    //دریافت منو بصورت پارشیال
    LoadSideBar: function() {
        $.ajax({
            type: "GET",
            url: "/Home/RenderSideBar",
            contentType: "application/json; charset=utf-8",
            dataType: "html",
            success: function (response) {
                    $('#sideBar').html(response);
            },
            error: function () {
                $('#sideBar').html('<h6 class="errorPart">بروز خطا در بارگذاری منو</h4>');
            },
        });
    },
    //دریافت سشن ها بصورت پارشیال
    LoadAllSessions: function () {
        $.ajax({
            type: "GET",
            url: "/Home/SessionPartial",
            contentType: "application/json; charset=utf-8",
            dataType: "html",
            async:false,
            success: function (response) {
                $('#allSessions').html(response);
            },
            error: function () {
                $('#allSessions').html('<h6 class="errorPart">بروز خطا در بارگذاری</h4>');
            },
        });
    },
    GetDateTime: function () {
        var ContentDate = "";
        $(document).ready(function () {
            try {
                var result = $.ajax({ 'type': 'HEAD', 'url': '/' }).success(function () {
                    var Systemdate = new Date(result.getResponseHeader('Date'));
                    var WeekNameMiladi = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    var MiladiMonthes = [
                        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ];
                    var z = String(Systemdate).split(" ")[4];
                    var MiladidayName = String(Systemdate).split(" ")[0];
                    var MiladiMonthName = String(Systemdate).split(" ")[1];
                    var MiladiDay = String(Systemdate).split(" ")[2];
                    var Miladiyear = String(Systemdate).split(" ")[3];
                    var MiladiMonth = MiladiMonthes.findIndex(findMonth) + 1;

                    function findDayOfWeek(element) {
                        return element === MiladidayName;
                    }

                    function findMonth(element) {
                        return element === MiladiMonthName;
                    }

                    var jalaliDate = gregorian_to_jalali(Miladiyear, MiladiMonth, MiladiDay);
                    var jalaliMonth = get_persian_month(jalaliDate[1]);
                    var jalaliDayWeek = get_persian_day(MiladidayName);
                    ContentDate =
                        'امروز ' + jalaliDayWeek + ' ' + jalaliDate[2] + ' ' + jalaliMonth + ' ' + jalaliDate[0];
                    $("#DateToday").html(ContentDate);
                    myTime = new MyTime();
                    myTime.Init(z.split(":")[0], z.split(":")[1], z.split(":")[2], 'TimeToday');
                    myTime.Run();
                });
            } catch (err) {
                //...
            }
        });
        var MyTime = function () {
            var date;
            var tag;
            var init = function (hour, minute, seconds, tagId) {
                var constructor = getConstructorString(hour, minute, seconds);
                date = new Date(constructor);
                tag = document.getElementById(tagId);
            };

            var run = function () {
                update();
                window.setInterval(update, 1000);
            };
            var update = function updateClock() {
                var h = date.getHours();
                var m = date.getMinutes();
                var s = date.getSeconds();

                s++;
                if (s == 60) {
                    m++;
                    s = 0;
                };
                if (m == 60) {
                    h++;
                    m = 0;
                };
                //if (h == 13) h = 1;
                var constructor = getConstructorString(h, m, s);
                date = new Date(constructor);
                //h = (h < 10) ? ("0" + h) : h;
                m = (m < 10) ? ("0" + m) : m;
                s = (s < 10) ? ("0" + s) : s;
                tag.innerHTML = '<i class="demo-icon icon-clock"></i>' + h + ":" + m + ":" + s;
            };

            var getConstructorString = function (hour, minute, seconds) {
                return '01/01/2000 ' + hour + ':' + minute + ':' + seconds;
            };
            return {
                Init: init,
                Run: run
            };
        }
    },
    Error: function (errorMessage) {
        bootbox.alert({
            message: errorMessage,
            locale: "fa"
        });
    },
}
document.addEventListener('DOMContentLoaded', Layout.init, false);
function cleanupText(text) {
    
  return text && text            // Ensure text exists
    .trim()                      // Trim left and right spaces
    .replace(/\n{2,}/g, '\n\n')  // Replace 2+ linebreaks with 2 ones
    .replace(/ +/g, ' ');        // Replace consecutive spaces with one
}