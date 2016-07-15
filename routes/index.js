var express = require('express');
var router = express.Router();
var session = require('express-session');
/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.name){
		res.render('home', { title: 'Title | Home Page', username : req.session.name});	  		
  	}else{
  		res.render('index', { title: 'Title | Default Page' });
  	}
});

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

// router.get('/get_sess',function(req,res){
//     res.send(req.session.name);
// });

module.exports = router;
