const express = require('express'),
			path = require('path'),
			bodyParser = require('body-parser'),
			session = require('express-session');
require('./db');

const sessionOptions = {
	secret: 'secret cookie thang',
	resave: true,
	saveUninitialized: true
};

const app = express();
app.use(session(sessionOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const mongoose = require('mongoose');
const User = mongoose.model('User');

app.get('/',function(req, res){
	if(req.session.username !== undefined)
		res.render('index', {'user': req.session.username});
	else
		res.render('index');
});
app.get('/register', function(req, res){
	res.render('register');
});
app.get('/login', function(req, res){
	res.render('login');
});
app.get('/restricted', function(req, res){
	if(req.session.username)
		res.render('restricted');
	else
		res.redirect('/login');
});
app.get('/logout', function(req, res){
	req.session.destroy(function(err){
		if(err)
			res.render('error', {'error': err});
		else
			res.redirect('/');
	});
});
app.post('/register',function(req, res){
	if(req.body.pwd.length < 8)
		res.render('error', {'error': 'Password has to be at least 8 chars long.'});
	else{
		User.find({'usr': req.body.user}, function(err, users){
			if(err){
				res.render('error', {'error': err});
			}
			else{
				if(users.length === 0){
					register(req, res);
				}
				else{
					res.render('error', {'error': 'username is taken'});
				}
			}
		});
	}
});
app.post('/login', function(req, res){
	User.findOne({'usr': req.body.user}, function(err, user){
		if(err)
			res.render('error', {'error': err});
		else if(user){
			bcrypt.compare(req.body.pwd, user.pwd, function(err, match){
				if(err)
					res.render('error', {'error': err});
				if(match){
					req.session.regenerate((err)=>{
						if(err)
							res.render('error', {'error': err});
						else{
							req.session.username = user.usr;
							res.redirect('/');
						}
					});
				}
				else
					res.render('error', {'error': 'password incorrect'});
			});
		}
		else
			res.render('error', {'error': 'username not in db'});
	});
});

const bcrypt = require('bcrypt');
function register(req, res){
	const saltRound = 10;
	bcrypt.hash(req.body.pwd, saltRound, function(err, hash){
		if(err){
			res.render('error', {'error': err});
		}
		else{
			const currUser = new User({
				usr: req.body.user,
				pwd: hash,
			});
			currUser.save(function(err, currUser){
				if(err){
					res.render('error', {'error': err});
				}
				else{
					req.session.regenerate(function(err){
						if(err)
							res.render('error', {'error': err});
						else{
							req.session.username = currUser.usr;
							res.redirect('/');
						}
					});
				}
			});
		}
	});
}

app.listen(3000);
