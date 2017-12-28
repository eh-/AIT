const path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser');
require('./db');

const app = express();
//express static setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next){
	console.log(req.method + ' ' + req.originalUrl);
	next();
});
//hbs setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const mongoose = require('mongoose');
const Link = mongoose.model('Link');

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
	Link.findOne({'slug': req.params.currSlug}, function(err, foundLink){
		if(foundLink){
			res.render('linkComs', {
				'title': foundLink.title, 
				'currTitle': foundLink.title,
				'currUrl': foundLink.url,
				'currComs': foundLink.comments,
				'currSlug': foundLink.slug,
			});
		}
		else{
			res.render('error', {'title': '480 News!', 'errorMessage': err});
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
	console.log(req.body);
	Link.findOneAndUpdate({'slug': req.body.slug},{$push: {comments: {text: req.body.newCom, user: req.body.newName}}}, function(err, foundLink){
		if(err){
			res.render('error', {'title': '480 News!', 'errorMessage': err});
		}
		else{
			res.redirect(foundLink.slug);
		}
	});
});
app.listen(3000);