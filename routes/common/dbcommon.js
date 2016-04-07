//var sys = require('sys');

var db = require('mysql');
/*
 * 数据库工具
 */
var dbtools = {
    /**
     * 创建实例
     * @ dbObj 数据库用户和密码
     */
	createClient: function(dbObj) {
		if (!dbObj) {
			return;
		}
		this.client = db.createConnection({
	  		user: global.painfo.dbUser,
	  		password: global.painfo.dbPwd
		});
	},
    /**
     * 连接数据库
     */
	connectDB: function() {
		this.client.connect(function(error, results) {
			if (error) {
				console.log("Connection Error: " + error.message);
				return false;
			}
            console.log("Connected to MySql");
            return true;
		});
	},
	/**
     * 使用数据库
     * 选择某个数据库
     * @database 数据库名
     */
	openDB: function(database) {
		this.client.query('USE '+ database, function(error, results) {
			if (error) {
				console.log('ClientConnectionReady Error: ' + error.message);
				client.end();
				return false;
			}
			console.log("ready");
            return true;
		});
	},
    /**
     * 数据库操作
     */
	query: function() {
		var values = ['Chad', 'Lung', 'Hello World'];
		this.client.query('INSERT INTO MyTable SET firstname = ?, lastname = ? , message = ?', values,
			function(error, results) {
				if (error) {
					console.log("ClientReady Error: " + error.message);
					return;
				}
				console.log('Inserted: ' + results.affectedRows + ' row.');
				console.log('Id inserted: ' + results.insertId);
			}
		);
	},
	query2: function() {
		client.query('SELECT * FROM MyTable', function selectCb(error, results, fields) {
			if (error) {
				console.log('GetData Error: ' + error.message);
				return;
			}
			if (results.length > 0) {
				var firstResult = results[0];
				console.log('First Name: ' + firstResult['firstname']);
				console.log('Last Name: ' + firstResult['lastname']);
				console.log('Message: ' + firstResult['message']);
			}
		});
	}
};
module.exports.db = dbtools;
