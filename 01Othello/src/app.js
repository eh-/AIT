var rev = require('./reversi.js'),
    readlineSync = require('readline-sync'),
    fs = require('fs');

var board = [],
    boardsize = 0,
    playerLetter = " ";

/*
If there is a config file and there isn't error opening it
copy the data over.
*/
if(process.argv[2] !== undefined){
	fs.readFile(process.argv[2], "utf8", function(err, data){
		if(!err){
			let object = JSON.parse(data);
			board = [...object.boardPreset.board];
			boardsize = Math.sqrt(board.length);
			playerLetter = object.boardPreset.playerLetter;
			let computerMoves, playerMoves;
			if(object.scriptedMoves.player)
				playerMoves = object.scriptedMoves.player;
			if(object.scriptedMoves.computer)
				computerMoves = object.scriptedMoves.computer;
			play(board, playerLetter, computerMoves, playerMoves);
		}
	});
}

/*
Else ask user for game settings
*/
else{
	console.log("REVERSI?");
	//boardsize must be at least 4 and at most 26 and even
	while(boardsize < 4 || boardsize > 26 || boardsize % 2 === 1){
		const resp = readlineSync.question("How wide should the board be? (even numbers between 4 and 26 inclusive): ");
		if(!isNaN(resp))
			boardsize = Number(resp);
	}
	//Initialize board with 4 pieces in center
	board = rev.generateBoard(boardsize, boardsize, " ");
	let midBoard = boardsize / 2;
	board = rev.setBoardCell(board, "O", midBoard, midBoard);
	board = rev.setBoardCell(board, "O", midBoard - 1, midBoard - 1);
	board = rev.setBoardCell(board, "X", midBoard - 1, midBoard);
	board = rev.setBoardCell(board, "X", midBoard, midBoard - 1);
	
	while(playerLetter !== "X" && playerLetter !== "O"){
		const resp = readlineSync.question("Pick your letter: X (black) or O (white): ")
		if(resp === "X"){
			playerLetter = "X";
		}
		else if(resp === "O"){
			playerLetter = "O";
		}
	}
	play(board, playerLetter);	
}

function play(board, playerLetter, computerMoves, playerMoves){
	let compLetter = playerLetter === "X" ? "O" : "X";
	//let board = [...startboard];
	console.log("REVERSI\n");
	let computerMovesSize = 0, playerMovesSize = 0;
	if(computerMoves !== undefined){
		console.log("Computer will make the following moves: " + computerMoves);
		computerMovesSize = computerMoves.length;
	}
	if(playerMoves !== undefined){
		console.log("The player will make the following moves: " + playerMoves);
		playerMovesSize = playerMoves.length;
		
	}
	console.log("Player is " + playerLetter);
	let currPlay = 0,
			currComp = 0, 
			playerTurn = playerLetter === "X" ? true : false,
			compPass = 0,
			playPass = 0;
	while(!rev.isBoardFull(board)){
		//Players turn
		if(playerTurn){
			let validMoves = rev.getValidMoves(board, playerLetter);
			if(validMoves.length === 0){
				console.log("No valid moves available for you.");
				
				if(++playPass === 2){
					console.log("No valid moves for two turns in a row. Game over");
					break;
				}
			}
			else{
				//If there are scripted moves
				if(currPlay < playerMovesSize){
					console.log("Player move to " + playerMoves[currPlay] + " is scripted");
					if(rev.isValidMoveAlgebraicNotation(board, playerLetter, playerMoves[currPlay])){
						board = rev.placeLetter(board, playerLetter, playerMoves[currPlay]);
						let coords = rev.algebraicToRowCol(playerMoves[currPlay]);
						board = rev.flipCells(board, rev.getCellsToFlip(board, coords.row, coords.col));
						playPass = 0;
					}
					else{
						console.log("Not valid. Skipped")
					}
					currPlay++;
				}
				//No scripted moves ask user for input
				else{
					console.log(rev.boardToString(board));
					let coords;
					while(!coords){
						let userin = readlineSync.question("What\'s your move?");
						coords = rev.algebraicToRowCol(userin);
						if(!coords || !rev.isValidMove(board, playerLetter, coords.row, coords.col)){
							console.log("INVALID MOVE. Your move should:\n* be in a LetterNumber format\n* specify an existing empty cell\n* flip at least one of our opponent\'s pieces");
							coords = undefined;
						}
					}
					board = rev.setBoardCell(board, playerLetter, coords.row, coords.col);
					board = rev.flipCells(board, rev.getCellsToFlip(board, coords.row, coords.col));
					playPass = 0;
				}
			}
		}
		//Computer's turn
		else{
			let validMoves = rev.getValidMoves(board, compLetter);
			//If there aren't any valid moves for two consecutive turns game is over
			if(validMoves.length === 0){
				if(++compPass === 2){
					console.log("Invalid moves for two turns in a row. Game over");
					break;
				}
			}
			else{
				//If there are scripted moves
				if(currComp < computerMovesSize){
					console.log("Computer move to " + computerMoves[currComp] + " was scripted");
					if(rev.isValidMoveAlgebraicNotation(board, compLetter, computerMoves[currComp])){
						board = rev.placeLetter(board, compLetter, computerMoves[currComp]);
						let coords = rev.algebraicToRowCol(computerMoves[currComp]);
						board = rev.flipCells(board, rev.getCellsToFlip(board, coords.row, coords.col));
						compPass = 0;
					}
					else{
						console.log("Not valid. Skipped");
					}
					currComp++;
				}
				//No scripted moves
				else{
					let bestCoords = validMoves[0];
					let bestFlips = rev.getCellsToFlip(board, bestCoords.row, bestCoords.col);
					for(let i = 1; i < validMoves.length; i++){
						let currFlip = rev.getCellsToFlip(board, validMoves[i].row, validMoves[i].col);
						if(currFlip.length > bestFlips.length){
							bestCoords = validMoves[i];
							bestFlips = [...currFlip];
						}
					}
					board = rev.setBoardCell(board, compLetter, bestCoords.row, bestCoords.col);
					board = rev.flipCells(board, rev.getCellsToFlip(board, bestCoords.row, bestCoords.col));
					compPass = 0;
				}
			}
		}
		display(board);
		
		if(playerTurn)
			readlineSync.question("Press <Enter> to show computer's move...");
		playerTurn = !playerTurn;
		
	}
	
	//Game is over display 
	let counts = display(board);
	if(counts.xs === counts.os)
		console.log("Tie Game :|");
	else if((counts.xs > counts.os && playerLetter === "X") || (counts.os > counts.xs && playerLetter === "O"))
		console.log("You Win :)");
	else
		console.log("You Lose :(");
	
}


function display(board){
	let counts = rev.getLetterCounts(board);
	console.log(rev.boardToString(board));
	console.log("Score");
	console.log("=====");
	console.log("X: " + counts.xs);
	console.log("O: " + counts.os);
	return counts;
}