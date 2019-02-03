var express = require('express');
var router = express.Router();
var pool = require('../config/dbConfig');


/* GET home page. */
router.get('/list', function(req, res, next) {
	pool.getConnection((err, conn) => {
		var sql = "SELECT * FROM todo";
		conn.query(sql, (err, row) => {
			if(err){
				throw err;
			}
			res.send(200, {
				result: 1,
				data: row
			});
		})
	})
});

router.get('/mylist', function(req, res, next) {
	var sql = "SELECT * FROM todo WHERE mail = ?";
	conn.query(sql, [req.query.mail], (err, row) => {
		if(err){
			throw err;
		}
		res.send(200, {
			result: 1,
			data: row
		});
	})
});

router.post('/addTodo', (req, res, next) => {
	var postData = req.body;
	var sql = "INSERT INTO todo (mail, todo, done) VALUES (?,?,?)";
	conn.query(sql, [postData.mail, postData.todo, postData.done], (err, result) => {
		if(err){
			throw err;
		}
		if(!result){
			res.send(300, {
				result: 0,
				msg: "addTodo Failure"
			})
		}else{
			res.send(200, {
				result: 1,
				msg: "addTodo Success"
			})
		}
	})
})

router.get('/deleteTodo/:id', (req, res, next) => {
	var sql = "DELETE FROM todo WHERE idx = ?"
	conn.query(sql, [req.params.id], (err, result) => {
		if(err){
			throw err;
		}
		if(!result) {
			res.send(300, {
				result: 0,
				msg: "DeleteTodo Failure"
			});
		}else{
			res.send(200, {
				result:1,
				msg: "DeleteTodo Success"
			})
		}
	})
})

router.get('/doneTodo/:id', (req, res, next) => {
	var done;
	var sql = "SELECT * FROM todo WHERE idx = ?";
	conn.query(sql, [req.params.id], (err, row) => {
		if(err){
			throw err;
		}
		if(row[0].done === 0){
			done = 1;
		}else{
			done = 0;
		}
		
		var sql = "UPDATE todo SET done=? WHERE idx = ?";
		conn.query(sql, [done, req.params.id], (err, result) => {
			if(err){
				throw err;
			}
			if(!result) {
				res.send(300, {
					result: 0,
					msg: "changeDone Failure"
				});
			}else{
				res.send(200, {
					result:1,
					msg: "changeDone Success"
				})
			}
		})
	});
	
})

// router.post('/editTodo/:id', (req, res, next) => {
// 	var postData = req.body;
// 	var sql = "SELECT * FROM todo WHERE mail = ? AND idx = ?";
// 	conn.query(sql, [postData.mail, req.params.id], (err, row) => {
// 		if(err){
// 			throw err;
// 		}
		
// 	})
// })


module.exports = router;
