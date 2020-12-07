// this is not module, cannot import any
let TTTScoreBoard = [
	[0, 0, 0, 0],
	[0, 2, 2, 0],
	[0, 2, 2, 0],
	[0, 0, 0, 0]
];

class AlphaBetaAgent {
	static isDraw(board){
		let isDraw = true, xPos, yPos;
		// check if all notation in state
		[...Array(4*4).keys()].forEach((position, idx)=>{
			xPos = Math.floor(idx/4);
			yPos = idx%4;

			if(board[xPos][yPos] == ' ')
				isDraw = false;
		});

		return isDraw;
	}

	static isWin(board, lastPosition, piece, neededToWin = 4){
		// check win
	  let rowCount = 0, colCount = 0, diagCount = 0, revDiagCount = 0, checkCol = 0;

	  // last position
	  let row = parseInt(lastPosition/4), col = parseInt(lastPosition%4);

	  // loop check row, col and diagnol based on last position
	  for(let i = 0; i < board.length; i++) {
	    // Check column that latest played piece, if being block count = 0
	    colCount += board[row][i] === piece ? 1 : (colCount * -1);

	    // Check row that latest played piece, if being block count = 0
	    rowCount += board[i][col] === piece ? 1 : (rowCount * -1);

	    // Check diagonal running top left to bottom right, if being block count = 0
	    checkCol = col - row + i;
	    if(checkCol >= 0 && checkCol < board.length){
	      diagCount += board[i][checkCol] === piece ? 1 : (diagCount * -1);
	    }

	    // Check reverse diagonal running top right to bottom left, if being block count = 0
	    checkCol = row + col - i;
	    if(checkCol >= 0 && checkCol < board.length){
	      revDiagCount += board[i][checkCol] === piece ? 1 : (revDiagCount * -1);
	    }

	    // if any 4 in row, col, or diagnol return win in case of not middle diagnol -> 3 win
      if((rowCount === neededToWin) || (colCount === neededToWin) || 
      	(diagCount === (row!=col ? neededToWin-1 : neededToWin)) || (revDiagCount === (col+row!=3 ? neededToWin-1 : neededToWin))){
	      return true;
	    }
	  }
	  return false;
	}

	static getLegalActions(board){
		let legalActions = [], xPos, yPos;
		[...Array(4*4).keys()].forEach((position, idx)=>{
			xPos = Math.floor(idx/4);
			yPos = idx%4;

			if(board[xPos][yPos] == ' ')
				legalActions.push(position);
		});

		return legalActions;
	}

	static generateSuccessor(parentBoard, notation, position){
		let board = JSON.parse(JSON.stringify(parentBoard)), xPos = Math.floor(position/4), yPos = position%4;

		// change notation
		board[xPos][yPos] = notation;

		return board;
	}

	static getScore(board, lastPosition, notation){
		// calculate score for this state
		let score = 0;
		// let xPos = Math.floor(position/4), yPos = position%4;

		// if win
		if(AlphaBetaAgent.isWin(board, lastPosition, 'X')){
			return -100;
		}
		if(AlphaBetaAgent.isWin(board, lastPosition, 'O')){
			return 100;
		}
		if(AlphaBetaAgent.isDraw(AlphaBetaAgent.generateSuccessor(board, notation, lastPosition))){
			return 20;
		}

		// biased on middle
		TTTScoreBoard.forEach((xPos, idx)=>{
			TTTScoreBoard[idx].forEach((yPos, jdx)=>{
				if(board[idx][jdx] == 'X'){
					score -= TTTScoreBoard[idx][jdx];
				} else if(board[idx][jdx] == 'O'){
					score += TTTScoreBoard[idx][jdx];
				}
			});
		});

		// check nearly win
	 //  if(AlphaBetaAgent.isWin(board, lastPosition, 'X', 3)){
	 //  	score -= Math.random()+1;
	 //  } else if(AlphaBetaAgent.isWin(board, lastPosition, 'O', 3)){
	 //  	score += Math.random()+1;
		// }

		// score += Math.random();

		return score;
	}

	static toString(gameState){
		gameState.forEach(state=>{
			console.log(state);
		});
	}

	static getAction(gameState, lastAction, depth) {
		// alpha-beta
	  // console.log("getAction", gameState, lastAction, depth);

	  AlphaBetaAgent.gameState = JSON.parse(JSON.stringify(gameState));
	  AlphaBetaAgent.depth = depth;
	  function value(gameState, agentType='O', depth=0, isMax=true, alpha=-100000, beta=100000, action=lastAction){
	    let legalActions = AlphaBetaAgent.getLegalActions(JSON.parse(JSON.stringify(gameState))); // [position]
	    // console.log('1st value', action, 'to', legalActions);

	    // reach depth or end game
	    if ((AlphaBetaAgent.depth <= depth) || AlphaBetaAgent.isWin(gameState, action, 'X') || 
	    	AlphaBetaAgent.isWin(gameState, action, 'O') || AlphaBetaAgent.isDraw(gameState) || legalActions.length < 1){
	      let depthPoint = AlphaBetaAgent.getScore(gameState, action, agentType);

	    	// console.log('depth', depth, 'state', AlphaBetaAgent.toString(gameState), 'action:', action, 'score:', depthPoint);

	      return depthPoint; // old state, depth state
	    }

	    let bestAction;
	    if(isMax){
	      let maxValue = -100000;
	      for(let idx in legalActions){
	        if(idx > legalActions.length-1){
	          break;
	        }

	        let legalAction = legalActions[idx];
	        // switch to check min by opponent
	        let v = value(AlphaBetaAgent.generateSuccessor(gameState, agentType, legalAction), 'X', depth+1, false, alpha, beta, legalAction);

	        // update maxValue
	        if(maxValue < v){
	          maxValue = v;
	          // if go back to root 0 -> get best action
	          if(depth == 0){
	            bestAction = legalAction;
	          }
          	// console.log('update best action -------------------', bestAction, alpha, beta, maxValue);
	        }

	        if(maxValue > beta){
	          return maxValue; // if maxvalue now > beta ignore the rest for the root purpose
	        }
	        // update alpha
	        alpha = Math.max(alpha, maxValue);
	      }
	      if(depth == 0){
	        return bestAction;
	      } else {
	        return maxValue;
	      }
	    }

	    let minValue = 100000;
	    for(let idx in legalActions){
	      if(idx > legalActions.length-1){
	        break;
	      }
	    let legalAction = legalActions[idx];
	      minValue = Math.min(minValue, value(AlphaBetaAgent.generateSuccessor(gameState, agentType, legalAction), 'O', depth+1, true, alpha, beta, legalAction));
	      if(minValue < alpha){
	        return minValue; // if minvalue now < alpha ignore the rest for the root purpose
	      }
	      beta = Math.min(beta, minValue);
	    }
	    return minValue;
	  }

	  // send position of bot move
	  self.postMessage(JSON.parse(JSON.stringify(value(gameState))));
	}
}

self.onmessage = function(event) {
  let gameState = event.data.gameState, lastAction = event.data.lastPosition, depth = event.data.depth;
  AlphaBetaAgent.getAction(gameState, lastAction, depth);
}