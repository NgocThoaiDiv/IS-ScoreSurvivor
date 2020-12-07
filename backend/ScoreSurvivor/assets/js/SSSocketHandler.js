import { refreshScoreTable, createCongratulation, refreshLimitCountDown } from './GraphicUtils.js';

SSSocket.on('moving', function(dataFromServer){
  // data: { direction, name }
	let data = JSON.parse(JSON.stringify(dataFromServer));
	let name=data.name, direction=data.direction;

	if(name == userId){
		player.move(direction);
  } else {
  	otherPlayers.forEach((otherGraphic, idx)=>{
  		if(otherGraphic.player_id == name){
  			otherGraphic.move(direction);
				// if(isUp){
			 //    otherGraphic.body.setVelocityY(velo);
				// } else {
			 //    otherGraphic.body.setVelocityX(velo);
				// }
		  // 	otherGraphic.switchDirection(direction);
  		}
  	});
  }
});

SSSocket.on('update-score-table', function(dataFromServer){
	// data: { questtionId(can be undefined if TTT), name, score(can be undefined if normal Q) }
	let data = JSON.parse(JSON.stringify(dataFromServer));
	let name=data.name, score=data.score;

	if(name == userId){
		player.score += score;
  } else {
  	otherPlayers.forEach((otherGraphic, idx)=>{
  		if(otherGraphic.player_id == name){
  			otherGraphic.score += score;
				// if(isUp){
			 //    otherGraphic.body.setVelocityY(velo);
				// } else {
			 //    otherGraphic.body.setVelocityX(velo);
				// }
		  // 	otherGraphic.switchDirection(direction);
  		}
  	});
  }

	// update table
	refreshScoreTable(SSScene);
});

SSSocket.on('congratulation-question', function(dataFromServer){
	// data: { score }
	console.log(dataFromServer);
	createCongratulation(dataFromServer['score']);
});

SSSocket.on('congratulation-winner', function(dataFromServer){
	// data: { winner }
	createCongratulation(0, dataFromServer['winner']);
});

SSSocket.on('time-down', function(dataFromServer){
	// console.log(dataFromServer);
	// data: { time }
	let data = JSON.parse(JSON.stringify(dataFromServer));
	let time = {
		mm: Math.floor(data['time']/60),
		ss: Math.floor(data['time']%60)
	};

	// update time
	refreshLimitCountDown(SSScene, time);
});

SSSocket.on('shutdown', function(dataFromServer){
	window.location.replace('https://www.google.com'); // TODO: comeback when finish game
});