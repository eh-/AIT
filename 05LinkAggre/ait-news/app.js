const path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser');

const app = express();
//express static setup
app.use(express.static(path.join(__dirname, 'public')));

//hbs setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.listen(3000);