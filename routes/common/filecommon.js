var http = require('http');
var fs = require('fs');
var path = require('path');
var contype = {'Content-Type': 'text/html'};
/*
 * 使用js对象或字符串构建json对象，最后转字符串
 * @ 组合json
 */
module.exports.parseJSON = function(data) {
	if (!data) {
		return {};
	}
	var json = {
		errorCode: 200,
		errorMsg: '',
		data: data
	};
	return JSON.stringify(json);
}
/*
 * 读取json文件，返回json数据
 * @param path 文件路径
 * @callback 回调函数
 */
module.exports.readFile = function(path, callback) {
	fs.readFile(path, function(err, datajson) {
		if (err) {
			console.log('read file error');
		} else {
			console.log('read file done');
			callback && callback(datajson);
		}
	});
}
/*
 * 响应http请求：
 * 将读取的文件数据包装成JSON格式，相应http
 */
module.exports.sendFile = function(req, res, fileContent) {
	if (!fileContent) {
		fileContent = {};
	}
	var file2json = JSON.parse(fileContent.toString());
	var json = {
		errorCode: file2json.errorCode || 200,
		errorMsg: file2json.errorMsg || '',
		data: file2json.data || ''
	};
	res.writeHead(200, {"Content-Type": 'text/json'});
	res.write(JSON.stringify(json));
	res.end();
}
/*
 * 响应http请求：
 * 当文件或资源不存在，响应404应答
 */
module.exports.send404 = function(req, res, msg){
	var json = {
		errorCode: 404,
		errorMsg: msg || 'Error 404: resource is not found',
		data: ''
	};
	res.writeHead(404, {"Content-Type": "text/json"});
	res.write(JSON.stringify(json));
	res.end();
}
/*
 * 循环遍历文件夹文件函数入口
 * @parma path 文件夹路径
 */
module.exports.getFileList = function(path) {
	var fileList = [];
	this.readFolder(path, fileList);
	return fileList;
}
/*
 * 循环遍历文件夹
 * @param path 文件夹路径，该路径基于项目根目录
 * @param fileList 文件信息对象数组
 */
module.exports.readFolder = function(path, fileList) {
	var files = fs.readdirSync(path);
	files.forEach(function(file){
		console.log(file);
		var state = fs.statSync(path+"/"+file);
		if (state.isDirectory()) {
			readFolder(path+ "/" + file, fileList);
		} else {
			var o = new Object();
			o.size = state.size; //文件大小，kb单位
			o.name = file; //文件名，包含后缀
			o.fileName = file.substring(0, file.indexOf('.')); //文件名，不含后缀
			o.path = path + file; //文件路径，相对路径
			fileList.push(o);
		}
	});
	return fileList;
}
/*
 * 返回文件夹下文件名
 * @param path 文件夹路径
 */
module.exports.getFileNames = function(path) {
	var files = this.getFileList(path);
	var len = files.length;
	var fileNames = [];
	for (var i = 0; i < len; i++) {
		fileNames.push(files[i].fileName.toLowerCase());
	}
	return fileNames;
}
/*
 * 写文件
 * @param fileName 文件名
 * @param data 数据
 */
module.exports.writeFile = function(fileName, data) {
	fs.writeFile(fileName, data, 'utf-8', function(){
		console.log("complete write !");
	});
}
