const rev = {
	prod: function(...numbers){
		if(numbers.length === 0) return undefined;
		const product = numbers.reduce((total, curr) => {return total * curr;}, 1);
		return product;
	},
	
	any: function(arr, fn){
		return arr.some(fn);
	},
	
	maybe: function(fn){
		return function(...args){
			if(rev.any(args, x => x === null || x === undefined))
				return undefined;
			return fn(...args);
		};
	},
	
	constrainDecorator: function(fn, min, max){
		return function(...args){
			const res = fn.apply(this, args);
			if(res < min) return min;
			if(res > max) return max;
			return res;
		};
	},
	
	limitCallsDecorator: function(fn, n){
		return function(...args){
			if(n < 1) return undefined;
			n--;
			return fn(...args);
		};
	},
	
	mapWith: function(fn){
		return function(arr){
			return arr.map(fn);
		};
	},
	
	simpleINIParse: function(s){
		const res = {};
		const arr = s.split(/[\r\n]+/);
		arr.forEach(function(currVal){
			const equalSign = currVal.indexOf('=');
			if(equalSign >= 0){
				const key = currVal.substring(0, equalSign);
				const val = currVal.substring(equalSign + 1);
				res[key] = val;
			}
		});
		return res;
	},
	
	readFileWith(fn){
		const fs = require('fs');
		return function(fileName, callBack){
			fs.readFile(fileName, 'utf8', (err, data) => {
				if(err)
					callBack(err, data);
				else{
					callBack(err, fn(data));
				}
			});
		};
	},
	
};

module.exports = rev;