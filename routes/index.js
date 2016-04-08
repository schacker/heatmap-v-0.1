/*
 * 场景：应该使用node发送数据到前端，然后前端根据数据渲染html，这才是Node.js在javascript中的强大驱动力
 */
var fs = require('fs'); //引入文件操作API
var mysql = require('mysql'); //数据库驱动
var url = require('url');
var querystring = require('querystring');
var common = require('./common/common.js');
var chp = require('child_process');
var spawn = chp.spawn;
var execFile = chp.execFile;

var contype = {'Content-Type': 'text/html'};

var routerTools = {
	urlparse: function(req, res) {
		var originurl = url.parse(req.url);
		var pathname = originurl.pathname;
		var disurl = querystring.parse(originurl.query)['url'];
		routerTools.execBat(req, res, disurl);
	},
	// 执行bat文件
	// responsesive-tourl.js
	execBat: function(req, res, disurl) {
		console.log("开始执行背景截图");
		var disurl_v = (new Date()).getTime();
		var sourcebat = chp.execFile("/bin/sh", ['-c', '~/nusers '+disurl+ ' ' +disurl_v], function(error, stdout, stderr){
			console.log("执行回调");
			if (error) {
				console.log("error: "+error.stack);
				common.send404(req, res, error.stack);
			} else {
				console.log("---stdout---: ");
				console.log(stdout);
				console.log("shell脚本执行完毕");
				fs.readFile('/Users/qitmac000455/work/paycenter/heatmap-v-0.1/sourceimg/localhost/dis_'+disurl_v+'.png', 'binary', function(err, file){
					if (err) {
						console.log(err);
						common.send404(req, res, "找不到该图片");
					} else {
						res.writeHead(200, {"Content-Type": 'image/jpeg'});
						res.write(file, 'binary');
						res.end();
					}
				});
			}
		});
	},
	// 基路由，走pojo前的路由，也就是决定走哪一个pojo
	route: function(req, res) {
		if (!req || !req.url) {
			common.send404(req, res, 'response dead cause by request url is null！');
		} else {
			//开始走路由
			var originurl = url.parse(req.url);
			var pathname = originurl.pathname;
			var pojo = {};
			//存下类名，然后用类名做匹配，在匹配的时候，require，最后return require对象   实际存的是pojo对象
			if (pojo = getPojo(pathname)) { //可以存在对象里，一一映射
				pojo.initRoute(req, res, pojo);
			} else {
				common.send404(req, res, 'response dead cause by: not pojo');
			}
		}
		//获取pojo实例
		function getPojo(pathname) {
			var pojoMap = global.pojoMap; //可存在xml中，最后解析xml中注入的类（pojo）
			var len = pojoMap.length;
			pathname = pathname.toLowerCase();
			for (var i = 0;i < len; i++) {
				var reg = new RegExp('\/' + pojoMap[i].toLowerCase() + '\/\s*');
				if (reg.test(pathname)) {
					//pojo路由文件必须在routes/下
					return require('./pojo/'+ pojoMap[i]);
				}
			}
		}
	},
	/*
	 * 连接数据库：
	 * @accesstoken 用户名和密码 {}
	 * @sqlDatabase 数据库名 string
	 */
	connect: function(accesstoken, sqlDatabase) {
		var TEST_DATABASE = 'nodetest';
		var TEST_TABLE = 'user';
		//创建连接
		var accesstoken = accesstoken || {
		  	user: 'root',
		  	password: 'root'
		};
		if (!global.client) {
			global.client = mysql.createConnection(accesstoken);
		}
		try {
			global.client.connect();
			global.client.query('use '+ sqlDatabase);
			console.log('connect success');
			return global.client;
		} catch(e) {
			console.log(e);
			return global.client;
		} finally {
		}
	},
	/*
	 * 统一查询：
	 * @client 数据库实例 {}
	 * @sql 查询语句 string
	 * @callback 查询回调 Function
	 */
	query: function(client, sql, callback) {
		if (!client || !sql) {
			console.log('!client || !sql');
		}
		client.query(sql, function selectCb(err, results, fields) {
		    if (err) {
		      	throw err;
		    }
	      	if (results) {
	      		console.log('callback');
	      		callback && callback(results);
	      	}
		});
	},
	/*
	 * 通过Id查询：
	 * @client 数据库实例 {}
	 * @pojo 表实例 {}
	 * @id 数据项id string
	 * @callback 回调函数 Function
	 */
	getById: function(client, pojo, id, callback) {
		if (!client || !id) {
			console.log('!client || !id');
			return;
		}
		var sql = 'select * from '+ pojo._pojo +' where id = ' + id;
		client.query(sql, function selectCb(err, results, fields) {
			if (err) {
				throw err;
			}
			if (results) {
				callback && callback(results);
			}
		});
	},
	/*
	 * 通过Id查询：
	 * @client 数据库实例 {}
	 * @pojo 表实例 {}
	 * @ids 数据项id串 string  ex: 1,2,3
	 * @callback 回调函数 Function
	 */
	getByIds: function(client, pojo, ids, callback) {
		if (!client || !ids) {
			console.log('!client || !ids');
			return;
		}
		var sql = 'select * from '+ pojo._pojo +' where id in(' + ids + ')';
		client.query(sql, function selectCb(err, results, fields) {
			if (err) {
				throw err;
			}
			if (results) {
				callback && callback(results);
			}
		});
	},
	/*
	 * 查询当前表所有数据：
	 * @client 数据库实例 {}
	 * @pojo 表实例 {}
	 * @callback 回调函数 Function
	 */
	getAll: function(client, pojo) {
		var sql = 'select * from '+ pojo._pojo;
		client.query(sql, function selectCb(err, results, fields) {
			if (err) {
				throw err;
			}
			if (results) {
				callback && callback(results);
			}
		});
	}
};

exports.rt = routerTools;
