var fs = require('fs');
var common = require('../common/common.js');



//存放当前工程请求链接
var urls = ['/user/m/qunarbaby/node.do', 'm/qunarbaby/getActivityList.do',
	'm/qunarbaby/getActivity.do', 'm/qunarbaby/getActivity.do',
	'm/qunarbaby/getActivity.do', 'm/qunarbaby/getActivity.do'];

/*
 * 判断该url是否配置，当前数组中是否存在该链接
 */
Array.prototype.isInArray = function(obj){
	if (!obj) {
		return '';
	}
	for (var i = 0;i < this.length;i++) {
		if (this[i] == obj) {
			return obj;
		}
	}
	return '';
}
/*
 * 根据url获取文件名（截取）
 */
function getFileName(url) {
	if (!url) {
		return '';
	}
	return url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('.'));
}
/*
 * 解析请求链接
 */
module.exports.parseRequestUrl = function(req, res, callback) {
	var current_url = req.url;
	console.log(current_url);
	/* 是否走连接开关 */
	if (global.painfo.use_url_map) { //开启强连接关联
		if (urls.isInArray(current_url)) { //该请求链接必须在配置的连接数组中，否则报错
			responseJson();
		} else {
			common.send404(req, res, "请求链接不在配置中，请添加配置");
		}
	} else { //不走强连接关联
		responseJson();
	}
	/* 相应json数据子函数 */
	function responseJson() {
		var filename = getFileName(current_url).toLowerCase();
		var fileNames = common.getFileNames(global.painfo.mock_folder); //从配置信息获取mock数据文件夹
		/*待判断是否存在该文件*/
		if (fileNames.isInArray(filename)) {
			filename = global.painfo.mock_folder +"/"+ filename +'.json';
			filemock(req, res, filename, function(data){
				callback && callback(data);
			});
		} else {
			/* 不存在该json文件 */
			common.send404(req, res, '不存在该json文件');
		}
	}
}
/*
 * 读取JSON数据格式文件，将数据包装返给客户端
 */
function filemock(req, res, filepath, callback){
	console.log("--- reading file ---");
	fs.readFile(filepath, function(err, data){
		if (err) {
			common.send404(req, res);
		} else {
			common.sendFile(req, res, data);
			callback && callback(data);
		}
	});
}
