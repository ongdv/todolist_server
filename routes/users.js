var express = require('express');
var router = express.Router();
var pool = require('../config/dbConfig');

/* GET users listing. */
router.get('/list', function(req, res, next) {
	pool.getConnection((err, conn) => {
		var sql = "SELECT * FROM user";
		conn.query(sql, (err, row) => {
			if(err){
				res.send(300, {
					result: 0,
					msg: err
				})
			}
			res.send(200, {
				result: 1,
				data: row
			})
		})
	})
});

router.post('/signup', (req, res, next) => {
	var postData = req.body;
	if(postData.mail === "" || postData.password === "" || postData.username ===""){
		res.send(300, {
			result: 0,
			msg: "check the blank"
		});
	}
	var sql ="SELECT * FROM user WHERE mail = ?";
	conn.query(sql, [postData.mail], (err, row) => {
		if(err){
			res.send(300, {
				result: 0,
				msg: err
			});
		}
		if(row.length === 0){
			var sql = "INSERT INTO user VALUES (?, ?, ?)";
			conn.query(sql, [postData.mail, postData.password, postData.username], (err, result) => {
				if(err){
					throw err;
				}

				if(result){
					res.send(200, {
						result: 1,
						msg : "SignUp Success"
					});
				}else{
					res.send(300, {
						result: 0,
						msg: "SignUp Failure"
					});
				}
			});
		}else{
			res.send(300, {
				result: 0,
				msg: "Invalid Data"
			});
		}
	});
});


router.post('/signin', (req, res, next) => {
	var postData = req.body;
	if(postData.mail === "" || postData.password === ""){
		res.send(300, {
			result: 0,
			msg: "check the blank"
		});
	}
	var sql = "SELECT * FROM user WHERE mail = ? AND password = ?";
	conn.query(sql, [postData.mail, postData.password], (err, row) => {
		if(err){
			throw err;
		}

		if(row.length === 0){
			res.send(300, {
				result: 0,
				msg: "Invalid Data"
			});
		}else{
			res.send(200, {
				result: 1,
				data: row
			});
		}
	});
});


module.exports = router;
