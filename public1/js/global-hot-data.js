function getDateDiff(dateTimeStamp) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
        result = " " + parseInt(monthC) + " ??";
    }
    else if (weekC >= 1) {
        result = " " + parseInt(weekC) + " ??";
    }
    else if (dayC >= 1) {
        result = " " + parseInt(dayC) + " ??";
    }
    else if (hourC >= 1) {
        result = "?? " + parseInt(hourC) + " ???";
    }
    else if (minC >= 1) {
        result = " " + parseInt(minC) + " ???";
    } else
        result = "??";
    return result;
}

$(document).ready(setTimeout(function () { // ??1s???????????

        var COMMENT_ARR = {};
        var COMMENT_COOKIE = document.cookie;
        var COMMENT = {};

        if (COMMENT_COOKIE != '') {
            console.log("load cache data...");
            // ?????
            COMMENT = JSON.parse(COMMENT_COOKIE.split("commentV=")[1]);
            COMMENT_ARR = COMMENT["data"];
        }


        if (COMMENT_COOKIE == '' || new Date().getTime() - COMMENT["date"] > 60 * 1000 * 10) { // request per 10 minutes
            console.log("load data...");
            var resultMap = {};
            var resultArr = [];
            $.ajaxSettings.async = false;
            // sort=comments?????????????????????,????updated?????0?????????????????????????
            // per_page ???????????
            console.log("request url:" + "https://api.github.com/repos/removeif/blog_comment/issues/comments?sort=created&direction=desc&per_page=10&page=1");
            $.getJSON("https://api.github.com/repos/removeif/blog_comment/issues/comments?sort=created&direction=desc&per_page=10&page=1", function (result) {
                $.each(result, function (i, item) {
                    var contentStr = item.body.trim();
                    if (contentStr.lastIndexOf(">") != -1) {
                        contentStr = contentStr.substr(contentStr.lastIndexOf(">") + 1);
                    }
                    // ????
                    contentStr = contentStr.replace(/![\s\w\](?:http(s)?:\/\/)+[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+\)/g, "[??]");

                    // ????
                    contentStr = contentStr.replace(/(?:http(s)?:\/\/)+[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+/g, "[??]");
                    if (contentStr.length > 50) {
                        contentStr = contentStr.substr(0, 60);
                        contentStr += "...";

                    }

                    // ????url
                    var itemUrl = "";
                    $.ajaxSettings.async = false;
                    $.getJSON(item.issue_url, function (result) {
                        itemUrl = result.body.substr(0, result.body.indexOf("\n") - 1);
                    });
                    // ??
                    resultArr.push({
                        "content": contentStr,
                        "date": item.created_at,
                        "userName": item["user"].login,
                        "userUrl": item["user"].html_url,
                        "userAvatar": item["user"].avatar_url,
                        "url": itemUrl
                    });
                });
            });

            resultMap["date"] = new Date().getTime();
            resultMap["data"] = resultArr;
            COMMENT_ARR = resultArr;
            if (COMMENT_ARR.length > 0) {
                document.cookie = "commentV=" + JSON.stringify(resultMap) + ";path=/";
            }
        }


        if (COMMENT_ARR.length > 0) {
            // ??????
            var htmlContentWidget = "<h3 class=\"menu-label\">" + "????<br></h3>" + "<div class='comment-content'>";
            for (var i = 0; i < COMMENT_ARR.length; i++) {
                var item = COMMENT_ARR[i];
                var contentStr = item.content;
                htmlContentWidget +=
                    "<div class='card-comment-item'>"+"<a href=\"" + item.userUrl + "\"target=\"_blank\">"+"<img class='ava' src='" + item.userAvatar + "'>" +
                    "<div class=\"tag is-success item\">"  + item.userName + "</a>&nbsp;???" + getDateDiff(new Date(item.date).getTime()) + "<br>" + "<a href =\"" + item.url + '#comment-container' + "\"target=\"_blank\">" + contentStr + "</a></div>" +
                    "</div><br>";
            }
            htmlContentWidget += "</div>"
            $("#body_hot_comment").html(htmlContentWidget);
        }
        // ?????? ????????60?
        var classDiv = "";
        var hotContent = "";
        if ($("#index_hot_div").length > 0) {
            var hotDiv = $("#index_hot_div");
            $.ajaxSettings.async = false;
            console.log("request url:" + "https://api.github.com/repos/removeif/blog_comment/issues?per_page=10&sort=comments");
            $.getJSON("https://api.github.com/repos/removeif/blog_comment/issues?per_page=10&sort=comments", function (result) {
                $.each(result, function (i, item) {
                    // ????
                    if (i >= 0 & i < 4) {
                        classDiv = "class=\"tag is-danger\"";
                    } else if (i >= 4 & i < 7) {
                        classDiv = "class=\"tag is-success\"";
                    } else if (i >= 7 & i < 9) {
                        classDiv = "class=\"tag is-warning\"";
                    } else {
                        classDiv = "class=\"tag is-white is-white1\"";
                    }
                    hotContent += "<a href =\"" + item.body.substr(0, item.body.indexOf("\n") - 1) + "\"target=\"_blank\"" + classDiv + ">" + item.title.substr(0, item.title.indexOf("-") - 1) + "&nbsp;??" + (item.comments * 101) + "</a>&nbsp;&nbsp;"
                })
                hotDiv.html("");
                hotDiv.append(hotContent);
            });
        }

        console.clear();
        console.log("~~~~xiu xiu xiu ????~~~");
        console.log("~~~~???????????????~~~");
        console.log("~~~~???????????https://removeif.github.io/")
    }
    ,
    1000
))
;