const fs = require('fs'),
			basketfunc = require('./basketfunc.js'),
			request = require('request');

			
/*			
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
*/
function requestGames(gameDataLink){
	request(gameDataLink, function(error, response, body){
		if(!error){
			const gameData = JSON.parse(body);
			const report = basketfunc(gameData);
			console.log(report);
			if(gameData.g.nextgid){
				const linkparts = gameDataLink.split(gameData.g.gid);
				const newlink = linkparts[0] + gameData.g.nextgid + linkparts[1];
				requestGames(newlink);
			}
		}
	});
}

requestGames('https://foureyes.github.io/csci-ua.0480-spring2017-008/homework/02/0021600680_gamedetail.json');
