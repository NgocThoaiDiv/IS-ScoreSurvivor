export class TicTacToeGameState {
	constructor(questionId){
    // init tic tac toe board
    this.board = [
      [' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ']
    ];

    this.playerNotation = 'X'; // player always 'X', bot 'O'
    this.isYourTurn = true;
    this.lastPosition;
    this.noMove = 0;

    this.questionId = questionId; // this is room id
	}

	isDraw(noMove){
		return noMove == this.board.length*this.board[0].length;
	}

	isWin(lastPosition, yourTurn){
		// check win
    let rowCount = 0, colCount = 0, diagCount = 0, revDiagCount = 0, neededToWin = 4, checkCol = 0;

    // get notation
    let piece = (yourTurn ? 'X' : 'O');
    // last position
    let row = Math.floor(lastPosition/4), col = parseInt(lastPosition%4);

    // loop check row, col and diagnol based on last position
    for(let i = 0; i < this.board.length; i++) {
      // Check column that latest played piece, if being block count = 0
      colCount += this.board[row][i] === piece ? 1 : (colCount * -1);

      // Check row that latest played piece, if being block count = 0
      rowCount += this.board[i][col] === piece ? 1 : (rowCount * -1);

      // Check diagonal running top left to bottom right, if being block count = 0
      checkCol = col - row + i;
      if(checkCol >= 0 && checkCol < this.board.length){
        diagCount += this.board[i][checkCol] === piece ? 1 : (diagCount * -1);
        // console.log('isWin', lastPosition, this.board[i][checkCol], '[', i, '-', checkCol, ']', diagCount);
      }

      // Check reverse diagonal running top right to bottom left, if being block count = 0
      checkCol = row + col - i;
      if(checkCol >= 0 && checkCol < this.board.length){
        revDiagCount += this.board[i][checkCol] === piece ? 1 : (revDiagCount * -1);
      }

	    // if any 4 in row, col, or diagnol return win in case of not middle diagnol -> 3 win
      if((rowCount === neededToWin) || (colCount === neededToWin) || 
      	(diagCount === (row!=col ? neededToWin-1 : neededToWin)) || (revDiagCount === (col+row!=3 ? neededToWin-1 : neededToWin))){
	      return true;
	    }
    }
    return false;
	}

	setMarkPosition(position, label=null, isBot=false){
		// this one is move
		let xPos = Math.floor(position/4), yPos = position%4;
		// if already have mark
		if(this.board[xPos][yPos] != ' '){
			return;
		}

		// switch turn
		if(this.isYourTurn){
			this.board[xPos][yPos] = 'X';
			label.getElement('text').setText('X');
		} else {
			this.board[xPos][yPos] = 'O';
			label.getElement('text').setText('O');
		}

		// get last move and count move
		this.lastPosition = position;
		this.noMove++;

		if(this.isDraw(this.noMove)){
			// set score
			// send to server score
      SSSocket.emit('answer-question', {
      	questionId: this.questionId,
        name: userId,
        score: 50
      });
			return;
		}

		if(this.isWin(this.lastPosition, this.isYourTurn)){
    	if(this.isYourTurn){
				// set score
				// send to server score
	      SSSocket.emit('answer-question', {
      		questionId: this.questionId,
	        name: userId,
	        score: 100
	      });
				return;
    	} else {
				// set score
				// send to server score
	      SSSocket.emit('answer-question', {
      		questionId: this.questionId,
	        name: userId,
	        score: 10
	      });
				return;
			}
			// remove dialog
			let dialog = label.rexContainer.parent.rexContainer.parent;
			dialog.destroy();

			return;
		}

		this.isYourTurn = !this.isYourTurn;
		
		// generate bot move
		if(!isBot){
			generateMove(position);
		}
	}
}

// generate by using worker for bot brain
function generateMove(lastPosition) {
  // init worker
  var botBrainTimeout = new Worker("./assets/js/TTTBotWorker.js");
  botBrainTimeout.onmessage = function(evt){
    let position = evt.data;
    // console.log("after AI", position);

    // set mark
    TIC_TAC_TOE.setMarkPosition(position, SSScene.currentQuestion.getElement('content').getButton(position), true);

    // terminate worker
    botBrainTimeout.terminate();
    botBrainTimeout = undefined;
  }

  // difficulty = depth of tree
  let depth = 2;

  // run bot worker
  botBrainTimeout.postMessage(JSON.parse(JSON.stringify({
      gameState: TIC_TAC_TOE.board,
      lastPosition: lastPosition,
      depth: parseInt(depth)
    }))
  );
}