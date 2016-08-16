var express = require('express');
var router = express.Router();
var session = require('express-session');
var md5 = require('md5');
var db = require('../config/database');
/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.name){ //
		db.query("SELECT p.*, u.id as user_id, CONCAT(u.first_name,' ',u.last_name) as user_name,IF(l.user_id IS NULL, '0','1') as is_like FROM posts as p LEFT JOIN users as u on u.id=p.user_id LEFT JOIN likes as l on l.post_id = p.id ORDER BY created_at DESC", function(err,posts){
            if(err) res.render('home',{status:'fail',error:err});            
            else res.render('home',{title:'My Twitter | Home Page', username : req.session.name});
        }); 		
  	}else{
  		res.render('index', { title: 'Title | Default Page' });
  	}
});
// test change
router.get('/home', function(req,res){
	if(req.session.name){  
		res.render('home', { title: 'Title | Home Page', username : req.session.name});	
	}else{
		res.render('login', { title: 'Title | Home Page' });	
	}
	
});

router.get('/login', function(req,res){
	res.render('login', { title: 'Title | Login Page' });
});

router.get('/register', function(req,res){
	res.render('register', { title: 'Title | Registration Page' });
});

router.get('/profile/:username', function(req,res){
	res.render('profile', { title: 'Title | profile Page' });
});


module.exports = router;
