var express = require('express');
var router = express.Router();
var session = require('express-session');
var md5 = require('md5');
var db = require('../config/database');

/* GET home page. */
router.post('/register', function(req, res) {
	var json = req.body;
  	var register_data = {first_name:json.first_name,last_name:json.last_name,email:json.email,password:md5(json.password)};
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
        req.session.id = result[0].id;
        req.session.name = result[0].first_name;
        req.session.email = result[0].email;
  			res.send({status:'success', message : 'login successful'});
  		}else{
  			res.send({status:'fail', message:'email or password does not match'});
  		}
  	});	

});

router.post('/logout',function(req,res){
    req.session.destroy();
    res.send({status:'success', message : 'logout successful'});
});


module.exports = router;
