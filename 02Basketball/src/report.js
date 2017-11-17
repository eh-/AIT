const fs = require('fs'),
			basketfunc = require('./basketfunc.js');

fs.readFile('./tests/0021600681_gamedetail.json', 'utf8', (err, data) => {
	if(!err){
		const gameData = JSON.parse(data);
		const report = basketfunc(gameData);
		console.log(report);
	}
	else{
		console.log(err);
	}
});