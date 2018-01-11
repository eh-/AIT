function Card(number, face, suit){
	this.number = number;
	this.face = face;
	this.suit = suit;
}

function Deck(){
	this.names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	this.suits = ['Diamonds','Clubs','Hearts','Spades'];
	this.deck = [];
	for(let i = 0; i < this.suits.length; i++){
		for(let j = 0; j < this.names.length; j++){
			this.deck.push(new Card(j + 1, this.names[j], this.suits[i]));
		}
	}
	for(let i = 0; i < 1000; i++){
		let card1 = Math.floor(Math.random() * this.deck.length);
		let card2 = Math.floor(Math.random() * this.deck.length);
		let temp = this.deck[card1];
		this.deck[card1] = this.deck[card2];
		this.deck[card2] = temp;
	}
}

Deck.prototype.findCard = function(sFace){
	for(let i = 51; i >= 0; i--){
		if(this.deck[i].face === sFace)
			return i;
	}
}

Deck.prototype.findTotal = function(cards){
	let total = 0;
	let aces = false;
	for(let i = 0; i < cards.length; i++){
		if(this.deck[cards[i]].number > 9)
			total += 10;
		else if(this.deck[cards[i]].number === 1){
			aces = true;
			total += 1;
		}
		else{
			total += this.deck[cards[i]].number;
		}
	}
	if(aces && total + 10 <= 21)
			total += 10;
	return total;
}

function createEle(type, textVal){
	let newEle = document.createElement(type);
	newEle.appendChild(document.createTextNode(textVal));
	return newEle;
}

function winScreen(playerWin){
	let hitBut = document.querySelector('.hitBut');
	let standBut = document.querySelector('.standBut');
	let currDiv = document.querySelector('.game');
	currDiv.removeChild(hitBut);
	currDiv.removeChild(standBut);
	let statement = '';
	if(playerWin === -1){
		statement = createEle('h4', 'Player Lost');
	}
	else if(playerWin === 1){
		statement = createEle('h4', 'Player Win');
	}
	else{
		statement = createEle('h4', 'Tie');
	}
	currDiv.appendChild(statement);
	
}

function main(){
	const playBtn = document.querySelector('.playBtn');
	playBtn.addEventListener('click', function(evt){
		
		//Stop the default action of postin and hide the form
		evt.preventDefault();
		document.querySelector('.start').classList.add('hidden');
		
		let deck = new Deck();
		if(document.querySelector('#startValues').value.length > 0){
			let starts = document.querySelector('#startValues').value.split(',');
			for(let i = 0; i < starts.length; i++){
				let found = deck.findCard(starts[i]);
				let temp = deck.deck[found];
				deck.deck[found] = deck.deck[i];
				deck.deck[i] = temp;
			}
		}
		console.log(deck);
		let currDiv = document.querySelector('.game');
		let curr = 4;
		let comp = [0, 2];
		let user = [1, 3];
		let compDiv = document.createElement('div');
		compDiv.classList.add('compDiv');
		let compHeader = document.createElement('h2');
		compHeader.classList.add('compHeader');
		let compHand = document.createElement('ul');
		compHand.classList.add('compHand');
		compHeader.appendChild(document.createTextNode('Computer Hand - Total: ?'))
		compDiv.appendChild(compHeader);
		compHand.appendChild(createEle('li', deck.deck[0].face));
		let hidCard = createEle('li', deck.deck[2].face);
		hidCard.classList.add('invis');
		compHand.appendChild(hidCard);
		compDiv.appendChild(compHand);
		
		let userDiv = document.createElement('div');
		userDiv.classList.add('userDiv');
		let userHeader = document.createElement('h2');
		userHeader.classList.add('userHeader');
		let userHand = document.createElement('ul');
		userHand.classList.add('userHand');
		userHeader.appendChild(document.createTextNode('Player Hand - Total: ' + deck.findTotal(user).toString()));
		userDiv.appendChild(userHeader);
		createEle('li', deck.deck[1].face + ' ');
		userHand.appendChild(createEle('li', deck.deck[1].face));
		userHand.appendChild(createEle('li', deck.deck[3].face));
		userDiv.appendChild(userHand);
		
		currDiv.appendChild(compDiv);
		currDiv.appendChild(userDiv);
		let hitBut = document.createElement('button');
		hitBut.classList.add('hitBut');
		let standBut = document.createElement('button');
		standBut.classList.add('standBut');
		hitBut.appendChild(document.createTextNode('Hit'));
		standBut.appendChild(document.createTextNode('Stand'));
		currDiv.appendChild(hitBut);
		currDiv.appendChild(standBut);
		hitBut.addEventListener('click', function(evt){
			
			userHand.appendChild(createEle('li', deck.deck[curr].face));
			user.push(curr);
			userHeader.textContent = 'Player Hand - Total: ' + deck.findTotal(user).toString();
			curr++;
			if(deck.findTotal(user) > 21)
				winScreen(-1);
			
		});
		standBut.addEventListener('click', function(evt){
			while(deck.findTotal(comp) < 14){
				compHand.appendChild(createEle('li', deck.deck[curr].face));
				comp.push(curr);
				curr++;
			}
			let compTotal = deck.findTotal(comp);
			compHeader.textContent = 'Computer Hand - Total: ' + compTotal.toString();
			console.log(hidCard);
			hidCard.classList.remove('invis');
			if(compTotal > 21)
				winScreen(1);
			else{
				let userTotal = deck.findTotal(user);
				if(compTotal > userTotal)
					winScreen(-1);
				else if(compTotal < userTotal)
					winScreen(1);
				else
					winScreen(0);
			}
		});
		
	});
}


document.addEventListener('DOMContentLoaded', main);
