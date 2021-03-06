const path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session');
require('./db');

const sessionOptions = {
	secret: 'secret cookie thang',
	resave: true,
	saveUninitialized: true
};

const shMods = require('./shm.js');

const app = express();
//app.use(session(sessionOptions));
app.use(shMods.parseCookies);
app.use(function(req, res, next){
	console.log(req.hwCookies);
	next();
});
app.use(shMods.manageSession);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));


app.use(function(req, res, next){
	console.log(req.method + ' ' + req.originalUrl);
	console.log(req.hwSession);
	next();
});
//hbs setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const mongoose = require('mongoose');
const Link = mongoose.model('Link');
const Comment = mongoose.model('Comment');

app.get('/', function(req, res){
	Link.find(function(err, foundLinks, count){
		if(foundLinks.length == 0){
			res.render('index', {'title': '480 News!'});
		}
		else{
			res.render('index', {'title': '480 News!', 'subLinks': foundLinks});
		}
	});
});
app.get('/:currSlug', function(req, res){
	Link.findOne({'slug': req.params.currSlug})
		.populate('comments')
		.exec(function(err, foundLink){
			if(err)
				res.render('error', {'title': '480 News!', 'errorMessage': err});
			else{
				res.render('linkComs', {
					'title': foundLink.title, 
					'currTitle': foundLink.title,
					'currVotes': foundLink.votes,
					'currUrl': foundLink.url,
					'currComs': foundLink.comments,
					'currSlug': foundLink.slug,
					'lastCom': (req.hwSession.lastComment ? '(the last comment you made was: ' + req.session.lastComment + ')' : ''),
				});
			}
		});
});
app.post('/subLink', function(req, res){
	const addedLink = new Link({
		url: req.body.suburl,
		title: req.body.subtitle,
	});
	addedLink.save(function(err, addedLink, count){
		if(err){
			res.render('error', {'title': '480 News!', 'errorMessage': err});
		}
		else{
			console.log('added ', addedLink, count, err);	
			res.redirect('/');
		}
	});
});
app.post('/subCom', function(req, res){
	const addedCom = new Comment({
		text: req.body.newCom,
		user: req.body.newName,
	});
	addedCom.save(function(err, addedCom){
		Link.findOneAndUpdate({'slug': req.body.slug},{$push: {comments: addedCom._id}}, function(err, foundLink){
			if(err){
				res.render('error', {'title': '480 News!', 'errorMessage': err});
			}
			else{
				req.hwSession.lastComment = req.body.newCom;
				res.redirect(foundLink.slug);
			}
		});
	});
});
app.post('/upvote', function(req, res){
	Link.findOneAndUpdate({'slug': req.body.slug}, {$inc: {votes: 1}}, function(err, foundLink){
		res.redirect(foundLink.slug);
	});
});
app.listen(3000);