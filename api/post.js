var express = require('express');
var router = express.Router();
var session = require('express-session');
var md5 = require('md5');
var db = require('../config/database');

/* GET home page. */
router.get('/getPostList', function(req, res, next) { 
    db.query("SELECT p.*, u.id as user_id, CONCAT(u.first_name,' ',u.last_name) as user_name,IF(l.user_id IS NULL, '0','1') as is_like FROM posts as p LEFT JOIN users as u on u.id=p.user_id LEFT JOIN likes as l on l.post_id = p.id ORDER BY created_at DESC", function(err,posts){
            if(err) res.send(err);            
            else res.send(posts);
        });       
});


router.post('/doPost', function(req, res) {
	var json = req.body;
  	var postData = {user_id:req.session.user_id,post_text:json.postData};
  	db.query('INSERT INTO posts SET ?',postData,function(err, result){
  		if(err){
  			res.send({error:err});
  		}else{
          db.query("SELECT p.*, u.id as user_id, CONCAT(u.first_name,' ',u.last_name) as user_name,IF(l.user_id IS NULL, '0','1') as is_like FROM posts as p LEFT JOIN users as u on u.id=p.user_id LEFT JOIN likes as l on l.post_id = p.id WHERE p.id = ?",[result.insertId], function(err, postData){
              if(err) res.send({error:err});
              else res.send({status:'success', message:'post successful', postData:postData[0]});
          });  			
  		}
  		
  	});	

});


router.post('/postLike', function(req, res) {
    var post_id = req.body.postId;
    var user_id = req.session.user_id;
    db.query('SELECT id FROM likes WHERE user_id = ? AND post_id = ?', [user_id,post_id], function(err,response){
        if(err) res.send({status:'error', error:err});
        else if(response.length == 0){
            var like = {user_id:user_id,post_id:post_id};
            db.query('INSERT INTO likes SET ?', like);
            db.query('UPDATE posts SET total_like = total_like + 1 WHERE id = ?', post_id);                           
            res.send({status:'liked', message:'like successful'});
        }else{
            db.query('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [user_id,post_id]);
            db.query('UPDATE posts SET total_like = total_like - 1 WHERE id = ?', post_id);                           
            res.send({status:'unliked', message:'unlike successful'});          
        }
    });

});



module.exports = router;
