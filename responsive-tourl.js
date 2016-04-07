"use strict";
var fs = require('fs');
var page = require('webpage').create();
var args = require('system').args;
var disurl_v;
var urlAddress;
// 校验参数
function init(){
    if (args.length === 3) {
        disurl_v = args[2];
        urlAddress = args[1].toLowerCase();
        console.log("url is ready");
    } else {
        console.log('url address and disurl_v is required');
        phantom.exit();
    }
}
init();
// 访问index.html，滚动拉取截图
page.open("http://localhost/heatmap-v-0.1/capture/html/index.html?url="+urlAddress);
// 加载完成执行
page.onLoadFinished = function(){
    // 构造背景文件路径
    var filePath = urlToDir(urlAddress)+"/bg_"+disurl_v+".png";
    // 截取背景
    page.render(filePath);
    console.log("---shot bg filePath--->"+filePath);

    // 构造文件路径
    function urlToDir(url) {
        var dir = url
            .replace(/^(http|https):\/\//, '')
            .replace(/\/$/, '')
            .replace(/\./g, '');
            dir = "sourceimg/"+dir;
        if ( !fs.makeTree(dir) ) {
            console.log('"' + dir + '" is NOT created.');
            phantom.exit();
        }
        return dir;
    }
}
