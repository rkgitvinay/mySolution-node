var express = require('express');
var router = express.Router();
var session = require('express-session');
var md5 = require('md5');
var db = require('../config/database');

/* GET home page. */
router.post('/register', function(req, res) {
	var json = req.body;
  	var register_data = {first_name:json.first_name,last_name:json.last_name,email:json.email,password:md5(json.password),profile_pic:json.first_name+'.png'};
  	db.query('INSERT INTO users SET ?',register_data,function(err, result){
  		if(err){
  			res.send({erro:err});
  		}else{
  			res.send({status:'success', message:'registration successful'});	
  		}
  		
  	});	

});


router.post('/login', function(req, res) {
	var json = req.body;  	
  	db.query('SELECT * FROM users WHERE email=? AND password =?', [json.email,md5(json.password)], function(err, result){
  		if(result.length > 0){
        req.session.user_id = result[0].id;
        req.session.name = result[0].first_name;
        req.session.email = result[0].email;
        res.send({status:'success', message:'login successfully!'});         			
  		}else{
  			res.send({status:'fail', message:'email or password does not match'});
  		}
  	});	

});

router.get('/getUserDetails', function(req,res){
      var user_id = req.session.user_id;
      db.query("SELECT id,first_name,last_name,CONCAT(first_name, ' ', last_name) as full_name, email,profile_pic,(SELECT count(*) FROM notification WHERE notify_to = ? AND is_read='0') as notifications FROM users WHERE id = ?", [user_id,user_id], function(err,result){
          if(err) res.send({status:'error', error:err});
          else res.send(result[0]);
      });
});


router.post('/logout',function(req,res){
    req.session.destroy();
    res.send({status:'success', message : 'logout successful'});
});

router.get('/getUserSuggestions', function(req,res){
    var user_id = req.session.user_id;
      db.query("SELECT id as user_id,first_name,last_name,CONCAT(first_name, ' ', last_name) as full_name, email,profile_pic FROM users WHERE id != ? AND id NOT IN (SELECT user_id FROM user_follow WHERE follower_id = ?) ORDER BY id DESC", [user_id,user_id], function(err,result){
          if(err) res.send({status:'error', error:err});
          else res.send(result);
      });
});

router.post('/dofollow', function(req,res){
    var user_id = req.body.userId;    
    var follower_id = req.session.user_id;
    db.query('SELECT id FROM user_follow WHERE follower_id = ? AND user_id = ?', [follower_id,user_id], function(err,response){
        if(err) res.send({status:'error', error:err});
        else if(response.length == 0){
            var follow = {user_id:user_id,follower_id:follower_id};
            db.query('INSERT INTO user_follow SET ?', follow);
            db.query('UPDATE users SET followers = followers + 1 WHERE id = ?', user_id);  
            var notification = {notify_to:user_id,notify_by:follower_id,notify_type:'follow',is_read:'0'};
            db.query('INSERT INTO notification SET ?', notification);
            res.send({status:'success', message:'follow successful'});
        }else{
            res.send({status:'fail', message:'already following'});
        }
    });
});



module.exports = router;
