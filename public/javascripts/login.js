
// 登陆
module.exports = function() {
    var urlRandCode = "/mobile/getLoginCode.jsp"; //验证码接口
    xmlHttp=null;
    if (window.XMLHttpRequest) {// code for IE7, Firefox, Opera, etc.
        xmlHttp=new XMLHttpRequest();
    } else if (window.ActiveXObject) {// code for IE6, IE5
        xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlHttp != null) {
        // 请求短信验证码
        xmlHttp.open("GET", urlRandCode+"?prenum=86&mobile=15210123559&usersource=ucenter", false);
        xmlHttp.send(null);

        // xmlDoc = xmlHttp.responseText;
        xmlHttp.onreadystatechange = changeState;
        xmlHttp.open("GET", urlRandCode, false);
        xmlHttp.send(null);
    } else {
        alert("Your browser does not support XMLHTTP.");
    }
    function changeState() {
        if (xmlhttp.readyState == 4) {// 4 = "loaded"
            if (xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);
                if () {
                    
                }
            } else {
                alert("Problem retrieving XML data");
            }
        }
    }
}
