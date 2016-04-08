"use strict";
var fs = require('fs');
var page = require('webpage').create();
var args = require('system').args;
var disurl_v; //图片唯一标识
var urlAddress; //热点图网页地址
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
    page.evaluate(function(){
        var step = window.innerHeight;
        var steps = window.innerHeight;
        var winHeight = document.body.scrollHeight;
        // 循序渐进拉到底部，同时拉取步长尽量短，步长停留时间尽量长，保证每一步长完全加载
        var hander = setInterval(function(){
            window.scrollTo(0, steps);
            steps += step;
            if (steps > winHeight) {
                clearInterval(hander);
            }
        }, 200);
    });
    // 构造文件路径，并加上图片唯一标识
    var filePath = urlToDir(urlAddress)+"/bg_"+disurl_v+".png";
    // 截取背景
    setTimeout(function(){
        page.render(filePath);
        console.log("截取背景图片路径-->"+filePath);
        var newpage = new WebPage();// 新开page
        //newpage.viewportSize = {width:375,height:667};
        newpage.open("http://localhost/heatmap-v-0.1/capture/html/capture.html?pic="+filePath, function(status){
            if ('success' !== status) {
                console.log("加载capture失败");
            } else {
                // 做延时，避免截屏时未打点
                setTimeout(function(){
                    var heatmapurl = "./sourceimg/localhost/dis_"+disurl_v+".png";
                    newpage.render(heatmapurl);
                    console.log("截取热点图路径-->"+heatmapurl);
                    phantom.exit();
                }, 3000);
            }
        });
    }, 6000);
    // 构造文件路径
    function urlToDir(url) {
        var dir = url
            .replace(/^(http|https):\/\//, '')
            .replace(/\/$/, '')
            .replace(/\./g, '');
            dir = "sourceimg/"+dir;
        if ( !fs.makeTree(dir) ) {
            console.log(dir+ "文件夹创建失败");
            phantom.exit();
        }
        return dir;
    }
}
