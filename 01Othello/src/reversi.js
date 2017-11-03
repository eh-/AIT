const rev = {
//repeat: returns an array contain n elements, with each element being value
	repeat: function(value, n){
		let res = [];
		for(let i = 0; i < n; i++){
			res.push(value);
		}
		return res;
	},

//generateBoard: creates board with row * col of initialCellValue(default " ")
	generateBoard: function(rows, columns, initialCellValue){
		if(initialCellValue === undefined)
			initialCellValue = " ";
		return module.exports.repeat(initialCellValue, rows * columns);
	},
	
//rowColToIndex: finds index of rowNumber and columnNumber
	rowColToIndex: function(board, rowNumber, columnNumber){
		let h = Math.sqrt(board.length);
		return h * rowNumber + columnNumber;
	},
	
//indexToRowCol: find row & col from index i
	indexToRowCol: function(board, i){
		let h = Math.sqrt(board.length);
		let res = {};
		res.row = Math.floor(i / h);
		res.col = i % h;
		return res;
	},
	
//setBoardCell return	new board with set letter in row, col
	setBoardCell: function(board, letter, row, col){
		let index = module.exports.rowColToIndex(board, row, col);
		return [...board.slice(0, index), letter, ...board.slice(index + 1)];
	},
	
//algebraicToRowCol: return row, col of algebraicNotation
	algebraicToRowCol: function(algebraicNotation){
		if(algebraicNotation.length < 2 || algebraicNotation.length > 3 ||
			algebraicNotation.includes(" ") || algebraicNotation.includes("\^[a-z0-9]+$/i"))
			return undefined;
		let res = {};
		let letter = algebraicNotation.charCodeAt(0) - 65;
		let num = algebraicNotation.substring(1);
		if(letter < 0 || letter > 25 || isNaN(num))
			return undefined;
		let row = Number(num) - 1;
		if(row < 0 || row > 25) return undefined;
		res.row = row;
		res.col = letter;
		return res;
	},
	
//placeLetter: place letter in board at algebraicNotation
	placeLetter: function(board, letter, algebraicNotation){
		let rowcol = module.exports.algebraicToRowCol(algebraicNotation);
		return module.exports.setBoardCell(board, letter, rowcol.row, rowcol.col);
	},
	
//placeLetters: place multiple letters in board
	placeLetters: function(board, letter, ...algebraicNotation){
		let newboard = [...board];
		for(let i = 0; i < algebraicNotation.length; i++){
			newboard = rev.placeLetter(newboard, letter, algebraicNotation[i]);
		}
		return newboard;
	},
	
//boardToString: return string representation of board
	boardToString: function(board){
		let h = Math.sqrt(board.length);
		let res = "";
		let header = "   ";
		let border = "   ";
		for(let i = 0; i < h; i++){
			header += ("  " + String.fromCodePoint(65 + i) + " ");
			border += "+---"
		}
		header += " \n";
		border += "+\n";
		res += (header + border);
		for(let i = 0; i < h; i++){
			let curr = " " + (i + 1).toString() + " ";
			for(let j = 0; j < h; j++){
				let index = rev.rowColToIndex(board, i, j);
				curr += ("| " + board[index] + " ");
			}
			curr += "|\n";
			res += (curr + border);
		}
		return res;
	},
	
//isBoardFull: find if there are empty cells in board
	isBoardFull: function(board){
		return !board.some(function(ele){ return ele === " "; });
	},
	
//flip: change piece board[row][col] from X to O or O to X
	flip: function(board, row, col){
		let index = rev.rowColToIndex(board, row, col);
		if(board[index] === " ") return board;
		else if(board[index] === "X")
			return rev.setBoardCell(board, "O", row, col);
		else if(board[index] === "O")
			return rev.setBoardCell(board, "X", row, cell);
	},
	
//flipCells: flip the group of cells
	flipCells: function(board, cellsToFlip){
		let newboard = [...board];
		for(let i = 0; i < cellsToFlip.length; i++){
			for(let j = 0; j < cellsToFlip[i].length; j++)
				newboard = rev.flip(newboard, cellsToFlip[i][j][0], cellsToFlip[i][j][1]);
		}
		return newboard;
	},
	
//getCellsToFlip: find all groups of cells to flip	
};

module.exports = rev;
