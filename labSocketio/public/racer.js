function moveFace(face){
	var player;
	if(face === 'firstBtn')
		player = document.querySelector('.player1');
	else if(face === 'secBtn')
		player = document.querySelector('.player2');
	var newleft = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
	player.style.left = (++newleft).toString() + 'px';
	if(newleft > 150){
		document.querySelector('.player1Btn').classList.add('hidden');
		document.querySelector('.player2Btn').classList.add('hidden');
		document.querySelector('.winner').classList.remove('hidden');
		document.querySelector('.winner').appendChild(document.createTextNode(face === 'firstBtn' ? 'Tears of Joy WINS' : 'Face Screaming WINS'));
	}
}

function main(){
	const socket = io();
	socket.on('clicked', moveFace);
	socket.on('newcon', function(socketid){
		let first = parseInt(window.getComputedStyle(document.querySelector('.player1')).getPropertyValue('left'));
		let sec = parseInt(window.getComputedStyle(document.querySelector('.player2')).getPropertyValue('left'));
		socket.emit('coords', {'first': first, 'sec': sec});
	});
	socket.on('coords', function(coords){
		console.log(coords);
		document.querySelector('.player1').style.left = coords['first'].toString() + 'px';
		document.querySelector('.player2').style.left = coords['sec'].toString() + 'px';
	});
	
	let firstBtn = document.querySelector('.player1Btn');
	firstBtn.addEventListener('click', function(evt){
		console.log('clicked first');
		evt.preventDefault();
		socket.emit('clicked', 'firstBtn');
	});

	let secBtn = document.querySelector('.player2Btn');
	secBtn.addEventListener('click', function(evt){
		console.log('clicked second');
		evt.preventDefault();
		socket.emit('clicked', 'secBtn');
	});
}

document.addEventListener('DOMContentLoaded', main);