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

let start = new Deck();
console.log(start.deck[start.findCard('A')]);
console.log(start.deck[start.findCard('5')]);
console.log(start.deck[start.findCard('Q')]);
console.log(start.deck[start.findCard('4')]);