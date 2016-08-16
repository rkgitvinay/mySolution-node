var express = require('express');
var router = express.Router();
var session = require('express-session');
var md5 = require('md5');
var db = require('../config/database');

/* GET home page. */
router.post('/register', function(req, res) {
	var json = req.body;
  	var register_data = {first_name:json.first_name,last_name:json.last_name,email:json.email,password:md5(json.password),profile_pic:'default.png'};
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
      db.query("SELECT id,first_name,last_name,CONCAT(first_name, ' ', last_name) as full_name, email,profile_pic,(SELECT count(*) FROM notification WHERE notify_to = ? AND is_read='0') as notifications, (SELECT count(id) FROM posts WHERE user_id=?) as posts,(SELECT count(id) FROM user_follow WHERE follower_id = ?) as following, (SELECT count(id) FROM user_follow WHERE user_id = ?) as followers FROM users WHERE id = ?", [user_id,user_id,user_id,user_id,user_id], function(err,result){
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
      db.query("SELECT id as user_id,first_name,last_name,CONCAT(first_name, ' ', last_name) as full_name, email,profile_pic FROM users WHERE id != ? AND id NOT IN (SELECT user_id FROM user_follow WHERE follower_id = ?) ORDER BY id DESC LIMIT 20", [user_id,user_id], function(err,result){
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

router.post('/unfollow', function(req,res){
    var user_id = req.body.userId;    
    var follower_id = req.session.user_id;
    db.query('SELECT id FROM user_follow WHERE follower_id = ? AND user_id = ?', [follower_id,user_id], function(err,response){
        if(err) res.send({status:'error', error:err});
        else if(response.length > 0){            
            db.query('DELETE FROM user_follow WHERE follower_id = ? AND user_id = ?', [follower_id,user_id]);
            db.query('UPDATE users SET followers = followers - 1 WHERE id = ?', user_id);              
            res.send({status:'success', message:'unfollow successful'});
        }
    });
});

router.get('/getNotifications', function(req,res){
    var user_id = req.session.user_id;
      db.query("SELECT n.id as noti_id,n.notify_by as notify_by_id,CONCAT(u.first_name, ' ', u.last_name) as full_name,u.profile_pic,n.post_id,n.notify_type,n.is_read FROM notification as n LEFT JOIN users as u on u.id = n.notify_by WHERE n.notify_to = ?", [user_id], function(err,result){
          if(err) res.send({status:'error', error:err});
          else{
            db.query("UPDATE notification SET is_read = '1' WHERE notify_to = ? AND is_read = '0'",[user_id]);
            res.send(result);
          } 
      });
});

router.get('/getFollowingsList', function(req,res){
    var user_id = req.session.user_id;
    db.query("SELECT u.id as user_id, CONCAT(u.first_name, ' ', u.last_name) as full_name, u.profile_pic FROM users as u LEFT JOIN user_follow as uf on uf.user_id = u.id WHERE uf.follower_id = ?", [user_id], function(err,result){
        if(err) res.send({status:'error', error:err});
        else res.send(result);
    });
});

router.get('/getFollowersList', function(req,res){
    var user_id = req.session.user_id;
    db.query("SELECT u.id as user_id, CONCAT(u.first_name, ' ', u.last_name) as full_name, u.profile_pic, IF((select id from user_follow WHERE user_id = u.id AND follower_id = ?) IS NULL, 0,1 ) as is_following FROM users as u LEFT JOIN user_follow as uf on uf.follower_id = u.id WHERE uf.user_id = ?", [user_id,user_id], function(err,result){
        if(err) res.send({status:'error', error:err});
        else res.send(result);
    });
});



module.exports = router;
