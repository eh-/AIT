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
			res.render('index');
		}
		else{
			res.render('index', {'subLinks': foundLinks});
		}
	});
});
app.post('/', function(req, res){
	const addedLink = new Link({
		url: req.body.suburl,
		title: req.body.subtitle,
	});
	addedLink.save(function(err, addedLink, count){
		if(err){
			res.render('error', {'errorMessage': err})
		}
		else{
			console.log('added ', addedLink, count, err);	
			res.redirect('/');
		}
	});
});
app.listen(3000);