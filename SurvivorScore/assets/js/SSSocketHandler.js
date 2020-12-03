SSSocket.on('moving', function(data){
	data = JSON.parse(JSON.stringify(data));
	let name=data.name, velo=data.velo, isUp=data.isUp, direction=data.direction;

	if(name == userId){
    player.x += allPossibleMove[direction][0] * player.velo;
    player.y += allPossibleMove[direction][1] * player.velo;

    player.switchDirection(direction);
  } else {
  	otherPlayers.forEach((otherGraphic, idx)=>{
	    otherGraphic.x += allPossibleMove[direction][0] * otherGraphic.velo;
	    otherGraphic.y += allPossibleMove[direction][1] * otherGraphic.velo;

	    otherGraphic.switchDirection(direction);
  	});
  }
});