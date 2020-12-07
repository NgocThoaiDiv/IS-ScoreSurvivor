import { PriorityQueue, QElement } from './DataStructureHelper.js';

export class SSGameState {
	constructor(map){
		this.map = map;
		// console.log(this.map);
	}

	getPossibleMove(state){
		let possibleMove = [];
		// console.log(this.map);
		Object.keys(allPossibleMove).forEach((direction, idx)=>{
			// if not be block -> push
			// console.log(parseInt(state[1]) + parseInt(allPossibleMove[direction][1]), parseInt(state[0]) + parseInt(allPossibleMove[direction][0]));
			if([2, 3].includes(
				this.map[parseInt(state[1]) + parseInt(allPossibleMove[direction][1])]
					[parseInt(state[0]) + parseInt(allPossibleMove[direction][0])])) {
				possibleMove.push(direction);
			}
		});

		return possibleMove;
	}

	generateSuccessors(state){
		let nextState = [], successors = []; // [nextState, direction, cost of this move]
		this.getPossibleMove(state).forEach((direction, idx)=>{
			nextState = [parseInt(state[0]) + parseInt(allPossibleMove[direction][0]), parseInt(state[1]) + parseInt(allPossibleMove[direction][1])];
			successors.push([nextState, direction, 10]);
		});

		return successors;
	}
}

export function aStar(state, destination){
  // Search the node that has the lowest combined cost and heuristic first.
  let pq = new PriorityQueue();
  pq.enqueue([state, [], 0], 0); // [state, path, cost from beginning], priority to heapify
  let visitedList = [], cost_heu = {}, _cost_heu;
  let successor, path, curCost, qElement;
  let nextState, move, cost, succList, newPath;

  let cnt = 0;

  while(!pq.isEmpty()){
  	qElement = pq.dequeue(); // [state, path, curCost], priority
    successor = qElement.element[0];
    path = qElement.element[1];
    curCost = qElement.element[2];

    if(cnt > 3200)
    	return;

  	// console.log('astar', pq, visitedList, successor, path, curCost);

    // if reach destination return path
    if(successor[0] == destination[0] && successor[1] == destination[1]){
      // console.log('found', path);
      return path;
    }

    // if not visit the node, visit it and push successor in queue
    if(visitedList.filter(visitor => (visitor[0] == successor[0] && visitor[1] == successor[1])).length == 0) {
      visitedList.push(successor);
    	succList = SSBotState.generateSuccessors(successor);
    	for(let i=0; i<succList.length; i++){
    		nextState = succList[i][0];
    		move = succList[i][1];
    		cost = succList[i][2];
    		// if not visit succ, check if this heu is needed to be update?
        if(visitedList.filter(visitor => (visitor[0] == nextState[0] && visitor[1] == nextState[1])).length == 0) {
          _cost_heu = curCost + cost + manhattan(nextState, destination)
          // if this nextstate is already have heu, check if it lower
          if(Object.keys(cost_heu).includes(nextState.toString()) && cost_heu[nextState] <= _cost_heu)
            continue;

          // console.log("current cost: ", curCost + cost);
          newPath = [...path];
          newPath.push(move);
          pq.enqueue([nextState, newPath, curCost + cost], _cost_heu);
          cost_heu[nextState] = _cost_heu;
        }
    	}
    }
    cnt++;
	}

	return undefined;
}

function manhattan(pos0, pos1) {
  return (Math.abs(pos1[0] - pos0[0]) + Math.abs(pos1[1] - pos0[1]))*10;
}
