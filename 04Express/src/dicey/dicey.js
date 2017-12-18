const path = require('path');
const fs = require('fs');
const express = require('express');
const NUMCOUNT = 5;
const glues = {
	space: ' ',
	dash: '-',
	comma: ',',
	star: '*',
	none: '',
}

var wordlist = {};
function generateWord(){
	let num = '';
	for(let i = 0; i < NUMCOUNT; i++){
		num += (Math.floor(Math.random() * 6) + 1).toString();
	}
	return num;
}

const app = express();
app.set('view engine', 'hbs');
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));
app.use(function(req, res, next){
	console.log(req.method + ' ' + req.originalUrl);
	next();
});
app.get('/', function(req, res){
	res.redirect('/dice');
});
app.get('/dice', function(req, res){
	if(Object.keys(req.query).length === 0)
		res.render('dice', {'title':'Home Page'});
	else{
		let fullRes = '', words = [], nums = [];
		for(let i = 0; i < req.query.numWords; i++){
			const num = generateWord();
			nums.push(num);
			words.push(wordlist[num]);
			fullRes += glues[req.query.glue] + wordlist[num];
		}
		if(fullRes[0] !== words[0][0])fullRes = fullRes.substring(1);
		res.render('phrase', {'title':'Home Page', 'formedPhrase': fullRes, 'nums': nums, 'words':words});
	}
});
app.get('/about', function(req, res){
	res.render('about', {'title':'About Page'});
});

fs.readFile('./diceware.wordlist.txt', 'utf8', function(err, data){
	if(!err){
		let splits = data.split('\n');
		for(let i = 0; i < splits.length; i++){
			const asplit = splits[i].split('\t');
			wordlist[asplit[0]] = asplit[1];
		}
		app.listen(8080);
	}
});
