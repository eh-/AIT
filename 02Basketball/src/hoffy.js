const rev = {
	prod: function(...numbers){
		if(numbers.length === 0) return undefined;
		let product = numbers.reduce((total, curr) => {return total * curr;}, 1);
	},

};

module.exports = rev;