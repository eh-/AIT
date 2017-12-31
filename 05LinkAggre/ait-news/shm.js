const uuid = require('node-uuid');

var SESSION_IDS = {}; //storage of session ids

const parseCookies = function(req, res, next){
	let parsed = {};
	if(req.get('Cookie')){
		const cookieList = req.get('Cookie').split('; ');
		cookieList.forEach(function(i){
			const cookie = i.split('=');
			parsed[cookie[0]] = cookie[1];
		});
	}
	req.hwCookies = parsed;
	next();
};

const manageSession = function(req, res, next){
	const a = req.hwCookies.sessionId;
	if(SESSION_IDS[a]){
		console.log('found');
		req.hwSession = SESSION_IDS[req.hwCookies['sessionId']];
		req.hwSession.sessionId = req.hwCookies.sessionId;
	}
	else{
		console.log('new');
		let currId = uuid.v4();
		while(SESSION_IDS.hasOwnProperty(currId))
			currId = uuid.v4();
		req.hwSession = {};
		res.append('Set-Cookie', 'sessionId=' + currId + '; HttpOnly');
		req.hwSession.sessionId = currId;
	}
	next();		
};

module.exports.parseCookies = parseCookies;
module.exports.manageSession = manageSession;