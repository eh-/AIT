const express = require('express'),
			path = require('path');
			
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.listen(3000);
