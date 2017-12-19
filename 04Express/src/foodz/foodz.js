const path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser');

var meals = [];
const app = express();
app.set('view engine', 'hbs');
const publicPath = path.resolve(__dirname, 'public');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(publicPath));
app.use(function(req, res, next){
	console.log(req.method + ' ' + req.originalUrl);
	next();
});
app.get('/', function(req, res){
	if(Object.keys(req.query).length){
		let filtered = meals.filter(function(req, meal){
			return meal.category === req.query.filterCategory;
		}.bind(undefined, req));
		res.render('meals', {'meals': filtered});
	}
	else{
		res.render('meals', {'meals': meals});
	}
});
app.post('/', function(req, res){
	meals.push(new Meal(req.body.name, req.body.description, req.body.filterCategory));
	res.redirect('/');
});

function Meal(name, description, category){
	this.name = name;
	this.description = description;
	this.category = category;
}
meals.push(new Meal('chocoramen', 'ramen noodles in a chocolate almond milk broth', 'breakfast'));
meals.push(new Meal('lycheezy', 'cheese pizza with lychee on top', 'anytime'));
meals.push(new Meal('crazy cookie', 'a 1 foot diameter cookie', 'dinner'));

app.listen(8080);