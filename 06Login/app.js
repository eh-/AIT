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
