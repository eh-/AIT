const directions = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]];


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
			return rev.setBoardCell(board, "X", row, col);
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
	getCellsToFlip: function(board, lastRow, lastCol){
		let res = [];
		const h = Math.sqrt(board.length);
		const currsign = board[rev.rowColToIndex(board, lastRow, lastCol)];
		let curr = [];
		for(let cDir = 0; cDir < directions.length; cDir++){
			curr = [];
			let cRow = lastRow + directions[cDir][0];
			let cCol = lastCol + directions[cDir][1];
			while(cRow >= 0 && cRow < h && cCol >= 0 && cCol < h && board[rev.rowColToIndex(board, cRow, cCol)] !== currsign && board[rev.rowColToIndex(board, cRow, cCol)] !== " "){
				curr.push([cRow, cCol]);
				cRow += directions[cDir][0];
				cCol += directions[cDir][1];
			}
			if(cRow >= 0 && cRow < h && cCol >= 0 && cCol < h && board[rev.rowColToIndex(board, cRow, cCol)] === currsign && curr.length != 0)
				res.push(curr);
		}
		return res;
	},
	
//isValidMove: checks if move is valid
	isValidMove: function(board, letter, row, col){
		if(board[rev.rowColToIndex(board, row, col)] !== " ") return false;
		let testBoard = rev.setBoardCell(board, letter, row, col);
		return rev.getCellsToFlip(testBoard, row, col).length != 0;
	},
	
//isValidMoveAlgebraicNotation: check if move is valid
	isValidMoveAlgebraicNotation: function(board, letter, algebraicNotation){
		let rowcol = rev.algebraicToRowCol(algebraicNotation);
		return rev.isValidMove(board, letter, rowcol.row, rowcol.col);
	},
	
//getLetterCounts: return count of letters
	getLetterCounts: function(board){
		let res = {};
		res.xs = 0;
		res.os = 0;
		for(let i = 0; i < board.length; i++){
			if(board[i] === "X")
				res.xs++;
			else if(board[i] === "O")
				res.os++;
		}
		return res;
	},
	
//getValidMoves: return array of valid moves
	getValidMoves: function(board, letter){
		let res = [];
		for(let i = 0; i < board.length; i++){
			let rowcol = rev.indexToRowCol(board, i);
			if(rev.isValidMove(board, letter, rowcol.row, rowcol.col)){
				res.push([rowcol.row, rowcol.col]);
			}
		}
		return res;
	},
};

module.exports = rev;
