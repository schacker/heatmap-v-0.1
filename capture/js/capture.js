var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
// 准备数据点
function addtips(xlimit, ylimit) {
    var tips = [];
    console.log(xlimit);
    for (var i = 0;i < 50000;i++) {
        var tipx = (Math.random()* xlimit);
        var tipy = (Math.random()* ylimit);
        var tip = {
            x: tipx,
            y: tipy,
            r: 5
        };
        tips.push(tip);
    }
    return tips;
}
setTimeout(function(){
    // 准备背景图片
    var img = new Image();
    img.onload = function() {
        console.log(img.width);
        canvas.width = img.width || window.innerWidth;
        canvas.height = img.height || window.innerHeight;
        drawBGImage(context, img);
    }
    var imgurl = getPicurl();
    img.src = imgurl || "";
}, 6000);
// 获取截屏的canvas背景图url
function getPicurl() {
    var url = window.location.href;
    if (url.indexOf("?pic=") != -1) {
        var imgsrc = url.substring(url.indexOf("?pic=")+5);
        console.log(imgsrc);
        return imgsrc;
    }
    return "";
}
// 画背景图
function drawBGImage(ctx, imgEle) {
    ctx.drawImage(imgEle, 0, 0, context.canvas.width, context.canvas.height);
    // 画好背景图，开始打点
    setTimeout(function(){
        addtip(canvas.width, canvas.height);
    }, 1000);
}
// 打点
function drawCircles(tips) {
    tips = tips || [];
    var len = tips.length;
    for (var i = 0;i < len; i++) {
        drawCircle(tips[i]);
    }
}
// 单个打点
function drawCircle(tip) {
    context.beginPath();
    context.lineWidth = 10;
    tip = tip || {};
    context.arc(tip.x, tip.y, tip.r, 0, 2 * Math.PI, false);
    //context.stroke(); //空心圆
    context.closePath(); //实心圆
    context.fillStyle = "rgba(225, 250, 209, 0.1)";
    context.fill();
}
// 增加背景图遮罩
function addMask() {
    context.fillStyle = "rgba(255,255,255,0.2)";//样式，颜色渐变
    var w = window.innerWidth;
    var h = window.innerHeight;
    context.beginPath(); //创建新路径
    context.fillRect(0,0,w,h); //绘制矩形
    context.fill(); //
}
// 打点入口
function addtip(xlimit, ylimit) {
    var tips = addtips(xlimit, ylimit);
    setTimeout(function(){
        drawCircles(tips);
    }, 0);
}
