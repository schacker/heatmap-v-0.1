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
    } else {
        console.log('url address and disurl_v is required');
        phantom.exit();
    }
}
init();

page.open(urlAddress);
page.onLoadFinished = function(){
    // 构造文件路径
    var filePath = urlToDir(urlAddress)+"/bg_"+disurl_v+".png";
    // 截取背景
    page.render(filePath);
    console.log("---shot bg filePath--->"+filePath);
    // 新开page
    var newpage = new WebPage();
    newpage.viewportSize = {width:375,height:667};
    newpage.open("http://localhost/heatmap-v-0.1/capture/html/capture.html?pic="+filePath, function(status){
        if ('success' !== status) {
            console.log("load newpage fail");
        } else {
            // 做延时，避免截屏时未打点
            setTimeout(function(){
                var heatmapurl = "./sourceimg/localhost/dis_"+disurl_v+".png";
                console.log("---shot heatmap filePath--->"+heatmapurl);
                newpage.render(heatmapurl);
                console.log("---------shot done---------");
                phantom.exit();
            }, 3000);
        }
    });

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
