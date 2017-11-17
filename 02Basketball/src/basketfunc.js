/* 
	Game object is taken from parsing the data in a gamedetail.json file.
*/

const processGameData = function(gameObj){
	//Report the game's id and date
	const gameidString = 'Game ID: ' + gameObj.g.gid + ', ' + gameObj.g.gdte + '\n=====';
	
	//Report the final score of the game
	const vScore = parseInt(gameObj.g.vls.q1) + parseInt(gameObj.g.vls.q2) + parseInt(gameObj.g.vls.q3) + parseInt(gameObj.g.vls.q4);
	const hScore = parseInt(gameObj.g.hls.q1) + parseInt(gameObj.g.hls.q2) + parseInt(gameObj.g.hls.q3) + parseInt(gameObj.g.hls.q4);
	const gameScoreString = gameObj.g.vls.tc + ' ' + gameObj.g.vls.tn + ' - ' + vScore.toString() + '\n' + gameObj.g.hls.tc + ' ' + gameObj.g.hls.tn + ' - ' + hScore.toString();
	
	//Player with most rebounds
	const homePlayers = gameObj.g.hls.pstsg;
	const visiPlayers = gameObj.g.vls.pstsg;
	const allPlayers = [...homePlayers, ...visiPlayers];
	let mostReb = -1, mostRebPlayer;
	const findMostReb = function(curr){
		const totalReb = parseInt(curr.oreb) + parseInt(curr.dreb);
		if(totalReb > mostReb){
			mostReb = totalReb;
			mostRebPlayer = curr.fn + ' ' + curr.ln;
		}
	};
	allPlayers.forEach(findMostReb);
	const mostRebString = '* Most rebounds: ' + mostRebPlayer + ' with ' + mostReb.toString();
	
	//Player with highest three point percentage that attempted at least 5 three pointers
	const fiveAttempts = function(curr){
		return parseInt(curr.tpa) >= 5;
	};
	const playersFiveAttempts = [...homePlayers.filter(fiveAttempts), ...visiPlayers.filter(fiveAttempts)];
	let highPercPlayer;
	const highPerc = playersFiveAttempts.reduce(function(accum, curr){
		const currPerc = parseInt(curr.tpm) / parseInt(curr.tpa);
		if(currPerc > accum){
			highPercPlayer = curr;
			return currPerc;
		}
		return accum;
	}, -1);
	const highThreeString = '* Player with highest 3 point percentage that took at least 5 shots: ' + highPercPlayer.fn + ' ' + highPercPlayer.ln + ' at %' + (highPerc * 100).toString() + ' (' + highPercPlayer.tpm + '/' + highPercPlayer.tpa + ')';
	
	//Total number of players with at least 1 block
	const oneBlock = allPlayers.filter(function(curr){
		return curr.blk >= 1;
	}).length;
	const oneBlockString = '* There ' + (oneBlock === 1 ? 'was ' : 'were ') + oneBlock + ' player' + (oneBlock === 1 ? '' : 's') + ' that had at least one block';
	
	//More turnovers than assists
	const turnoAssist = function(curr){
		return curr.ast < curr.tov;
	};
	const stringify = function(curr){
		return '* ' + curr.fn + ' ' + curr.ln + ' has an assist to turnover ratio of ' + curr.ast + ':' + curr.tov;
	};
	let hTurnoAssist = homePlayers.filter(turnoAssist);
	hTurnoAssist = hTurnoAssist.map(stringify);
	let hTurnoString = '\t' + gameObj.g.hls.tc + ' - ' + gameObj.g.hls.tn + '\n';
	hTurnoAssist.forEach(function(curr){
		hTurnoString += '\t' + curr + '\n';
	});
	let vTurnoAssist = visiPlayers.filter(turnoAssist);
	vTurnoAssist = vTurnoAssist.map(stringify);
	let vTurnoString = '\t' + gameObj.g.vls.tc + ' - ' + gameObj.g.vls.tn + '\n';
	vTurnoAssist.forEach(function(curr){
		vTurnoString += '\t' + curr + '\n';
	});
	const turnoString = '* Players with more turnovers than assists:\n' + hTurnoString + '\n' + vTurnoString;
	
	
	return gameidString + '\n' + gameScoreString + '\n' + mostRebString + '\n' + highThreeString + '\n' + oneBlockString + '\n' + turnoString;
};

module.exports = processGameData;