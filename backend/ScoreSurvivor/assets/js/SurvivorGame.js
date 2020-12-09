import { Player, Zombie } from './SSPlayer.js';
import {} from './SSSocketHandler.js';
import { createQuestionTable, loadScoreTable, createCongratulation, createLimitCountDown } from './GraphicUtils.js';
import { SSGameState, aStar } from './aStar.js';

class SurvivorShooterScene extends Phaser.Scene {
  constructor(){
    super('SurvivorShooterScene');
    // Phaser.Scene.call(this, { key: 'SurvivorShooterScene', active: true });

    this.zombieList = []; // list guideline
    this.lastSpaceTime = 0; // delay time open
    this.activeRoom;
    this.discoveredRoom = [];
  }

  preload(){
    this.load.plugin('rexanchorplugin', './assets/libs/rexanchorplugin.min.js', true);

    this.load.setPath('assets/sprites/');

    this.load.atlasXML({
      key: 'characters',
      textureURL: 'characters/characters.png',
      atlasURL: 'characters/characters.xml'
    });

    this.load.atlasXML({
      key: 'tables',
      textureURL: 'tables/tables.png',
      atlasURL: 'tables/tables.xml'
    });

    this.load.atlasXML({
      key: 'questions',
      textureURL: 'questions/questions.png',
      atlasURL: 'questions/questions.xml'
    });

    this.load.image('tiles', 'buch-dungeon-tileset-extruded.png');

    // scene UI
    // rex UI phaser plugin
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url: '../libs/rexuiplugin.min.js',
      sceneKey: 'rexUI'
    });

    // this.load.setPath(window.location.href + 'assets/sprites/');
    // this.load.atlasXML({
    //   key: 'map',
    //   textureURL: 'map/map.png',
    //   atlasURL: 'map/map.xml'
    // });
  }

  loadDungeon(){
    // Creating a blank tilemap with dimensions matching the dungeon
    map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: dungeon.width, height: dungeon.height });

    // addTilesetImage: function (tilesetName, key, tileWidth, tileHeight, tileMargin, tileSpacing, gid)

    var tileset = map.addTilesetImage('tiles', 'tiles', 16, 16, 1, 2);

    layer = map.createBlankDynamicLayer('Layer 1', tileset);

    if(!debug){
      layer.setScale(3);
    }

    layer.setScale(GET_TILE_SIZE()/16);

    // Fill with black tiles
    layer.fill(20);

    // console.log(map, tileset, layer);
    let chessCnt = 0, deco1Cnt = chessCnt;

    // Use the array of rooms generated to place tiles in the map
    dungeon.rooms.forEach(function(room, idx) {
      var x = room.x;
      var y = room.y;
      var w = room.width;
      var h = room.height;
      var cx = Math.floor(x + w / 2); // center x of room
      var cy = Math.floor(y + h / 2); // center y of room
      var left = x;
      var right = x + (w - 1);
      var top = y;
      var bottom = y + (h - 1);

      // Fill the floor with mostly clean tiles, but occasionally place a dirty tile
      // See "Weighted Randomize" example for more information on how to use weightedRandomize.
      map.weightedRandomize(x, y, w, h, TILES.FLOOR);

      // Place the room corners tiles
      map.putTileAt(TILES.TOP_LEFT_WALL, left, top);
      map.putTileAt(TILES.TOP_RIGHT_WALL, right, top);
      map.putTileAt(TILES.BOTTOM_RIGHT_WALL, right, bottom);
      map.putTileAt(TILES.BOTTOM_LEFT_WALL, left, bottom);

      // Fill the walls with mostly clean tiles, but occasionally place a dirty tile
      map.weightedRandomize(left + 1, top, w - 2, 1, TILES.TOP_WALL);
      map.weightedRandomize(left + 1, bottom, w - 2, 1, TILES.BOTTOM_WALL);
      map.weightedRandomize(left, top + 1, 1, h - 2, TILES.LEFT_WALL);
      map.weightedRandomize(right, top + 1, 1, h - 2, TILES.RIGHT_WALL);

      // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the
      // room's location. Each direction has a different door to tile mapping.
      var doors = room.getDoorLocations(); // Returns an array of {x, y} objects

      for(var i = 0; i < doors.length; i++){
        map.putTileAt(6, x + doors[i].x, y + doors[i].y);
      }

      // Place some random stuff in rooms 
      if(room.isContainChest){
        chessCnt++;
        layer.putTileAt(166, cx, cy); // Chest
      } else if (room.isContainDeco1){
        if(room.width > 10 && room.height > 10){
          layer.putTilesAt([
            [ 186 ],
            [ 205 ]
          ], cx - 1, cy - 1);

          layer.putTilesAt([
            [ 186 ],
            [ 205 ]
          ], cx + 1, cy - 1);
          deco1Cnt++;
        } else {
          if(room.height > 9){
            layer.putTilesAt([
              [ 186 ],
              [ 205 ]
            ], cx, cy);
            deco1Cnt++;
          }
        }
      }
      // else if (rand <= 0.3){
      //   layer.putTileAt(81, cx, cy); // Stairs
      // }
      // else if (rand <= 0.4){
      //   layer.putTileAt(167, cx, cy); // Trap door
      // }
    });

    console.log('cnt', dungeon.rooms.length, chessCnt, deco1Cnt);

    // Not exactly correct for the tileset since there are more possible floor tiles, but this will
    // do for the example.
    layer.setCollisionByExclusion([-1, 6, 7, 8, 26]);

    // Hide all the rooms
    if(!debug){
      layer.forEachTile(function (tile) { tile.alpha = 0; });
    }

    // Place all in the same room
    let playerRoom = dungeon.rooms[0], zombieX, zombieY, destZombieRoom;
    for(let i=0; i<dungeon.rooms.length; i++){
      if(dungeon.rooms[i].isSPawnLocation){
        playerRoom = dungeon.rooms[i];

        // zombie posistion
        zombieX = map.tileToWorldX(playerRoom.x + Math.floor(playerRoom.width/2)),
        zombieY = map.tileToWorldY(playerRoom.y + Math.floor(playerRoom.height/2));

        // all zombies graphic
        Object.keys(dungeon.zombies).forEach((zombie_id, idx)=>{
          // find the destination room of the zombie by id room contain chest
          for(let i=0; i<dungeon.rooms.length; i++){
            if(dungeon.rooms[i].id == dungeon.zombies[zombie_id].destination){
              destZombieRoom = dungeon.rooms[i];
              break;
            }
          }

          // console.log(zombie_id, destZombieRoom, [map.worldToTileX(zombieX), map.worldToTileY(zombieY)], 
          //   destZombieRoom.x, destZombieRoom.y,
          //   [destZombieRoom.x + Math.floor(destZombieRoom.width/2)-1, destZombieRoom.y + Math.floor(destZombieRoom.height/2)-1]);

          // generate path for the zombie
          let path = aStar([map.worldToTileX(zombieX), map.worldToTileY(zombieY)], 
            [destZombieRoom.x + Math.floor(destZombieRoom.width/2)-1, destZombieRoom.y + Math.floor(destZombieRoom.height/2)]);

          // test 1 zombie
          // if(idx < 8){
          //   this.zombieList.push(this.add.existing(new Zombie(SSScene, zombieX+8*layer.scale, zombieY+8*layer.scale, 
          //     'zoimbie_empty_down_chase_', zombie_id, path)));
          // } else {
          //   this.zombieList.push(this.add.existing(new Zombie(SSScene, zombieX+8*layer.scale, zombieY+8*layer.scale, 
          //     'zoimbie_empty_down_chase_', zombie_id, [])));
          // }
          this.zombieList.push(this.add.existing(new Zombie(SSScene, zombieX+8*layer.scale, zombieY+8*layer.scale, 
            'zoimbie_empty_down_chase_', zombie_id, path)));
        });

        break;
      }
    }

    // console.log(destZombieRoom.x, destZombieRoom.y, dungeon.tiles[destZombieRoom.y][destZombieRoom.x]);
    // aStar([map.worldToTileX(zombieX), map.worldToTileY(zombieY)], 
    //   [destZombieRoom.x+1, destZombieRoom.y+1]);

    // player graphic
    // player = this.add.graphics({ fillStyle: { color: 0xedca40, alpha: 1 } }).fillRect(0, 0, map.tileWidth * layer.scaleX, 
    //   map.tileHeight * layer.scaleY);
    // let playerX=map.tileToWorldX(playerRoom.x + 1 + Math.floor(Math.random()*(playerRoom.width-2))), 
    //   playerY=map.tileToWorldY(playerRoom.y + 1 + Math.floor(Math.random()*(playerRoom.height-2)));
    let playerX = map.tileToWorldX(playerRoom.x+1), playerY = map.tileToWorldX(playerRoom.y+1);
    player = this.add.existing(new Player(SSScene, playerX+8*layer.scale, playerY+8*layer.scale, 'manBlue_empty_down_chase_', userId));

    // others graphic
    otherUsers.forEach((other, idx)=>{
      otherPlayers.push(SSScene.add.existing(new Player(SSScene, playerX+8*layer.scale, playerY+8*layer.scale, 'manBlue_empty_down_chase_', other)));
    });

    if(!debug){
      this.setRoomAlpha(playerRoom, 1); // Make the starting room visible
    }

    // Scroll to the player
    SSMainCam.setBounds(0, 0, layer.width * layer.scaleX, layer.height * layer.scaleY);
    SSMainCam.scrollX = player.x - SSMainCam.width * 0.5;
    SSMainCam.scrollY = player.y - SSMainCam.height * 0.5;

    cursors = this.input.keyboard.createCursorKeys();

    // load score table for client
    this.scoreTable = loadScoreTable(this);

    this.limitCountDown = createLimitCountDown(this);

    isDoneLoadGame = true;
  }

  create(){
    SSScene = this;
    SSMainCam = this.cameras.main;

    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // copy dungeon
    (function(){
      // reuse class dungeon
      dungeon = new Dungeon({
        width: 80,
        height: 40,
        doorPadding: 2,
        rooms: {
          width: { min: 7, max: 15, onlyOdd: true },
          height: { min: 7, max: 15, onlyOdd: true }
        }
      });

      let clone = Object.assign(Object.create(Object.getPrototypeOf(dungeon.rooms[0])), dungeon.rooms[0]);

      // console.log(dungeon, dungeonFromServer);

      dungeon.id = dungeonFromServer.id;
      dungeon.width = dungeonFromServer.width;
      dungeon.height = dungeonFromServer.height;
      dungeon.roomGrid = dungeonFromServer.roomGrid;
      dungeon.zombies = dungeonFromServer.zombies;

      // update room to match server
      dungeon.rooms = [];
      dungeonFromServer.rooms.forEach((room, idx)=>{
        let tempClone = Object.assign(Object.create(Object.getPrototypeOf(clone)), clone);
        ['bottom', 'left', 'right', 'top', 'centerX', 'centerY', 'height', 'width', 'x', 'y', 'doors',
          'tiles', 'id', 'isContainChest', 'isSpecialChest', 'isContainDeco1', 'isSPawnLocation',
          'questionMap']
          .forEach((key, jdx)=>{
            tempClone[key] = room[key];
          });

        dungeon.rooms.push(tempClone);
      });

      // update roomgrid to match server
      dungeon.roomGrid = dungeonFromServer.roomGrid;
      dungeonFromServer.roomGrid.forEach((grid, idx)=>{
        grid.forEach((roomList, jdx)=>{
          if(roomList.length){
            dungeon.roomGrid[idx][jdx] = [];
            roomList.forEach((room, kdx)=>{
              let tempClone = Object.assign(Object.create(Object.getPrototypeOf(clone)), clone);
              ['bottom', 'left', 'right', 'top', 'centerX', 'centerY', 'height', 'width', 'x', 'y', 'doors',
                'tiles', 'id', 'isContainChest', 'isSpecialChest', 'isContainDeco1', 'isSPawnLocation',
                'questionMap']
                .forEach((key, jdx)=>{
                  tempClone[key] = room[key];
                });

              dungeon.roomGrid[idx][jdx].push(tempClone);
            });
          }
        });
      });

      dungeon.tiles = dungeonFromServer.tiles;

      // create gamestate for astar zombie find the chest
      SSBotState = new SSGameState(dungeon.tiles);

      // console.log(dungeon);

      // let html = dungeon.drawToHtml({
      //   empty: " ",
      //   wall: "📦",
      //   floor: "☁️",
      //   door: "🚪"
      // });

      // // Append the element to an existing element on the page
      // document.body.appendChild(html);
    })();

    SSScene.loadDungeon();

    // load scenes
    SSGame.scene.add('SSUIScene', SSUIScene);

    // start title
    SSGame.scene.start('SSUIScene');

    if(debug){
      let debugGraphic = this.add.graphics().strokeRoundedRect(0, 0, 10, 10);
      map.renderDebugFull(debugGraphic, {
        tileColor: null, // Non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
      });
    }
  }

  update(time, delta){
    // wait to load game
    if(!isDoneLoadGame){
      return;
    }

    player.body.setVelocityX(0);
    player.body.setVelocityY(0);

    // if player is answering question -> no interaction
    if(isLockCamera){
      return;
    }

    this.updatePlayerMovement(time);

    // update room position
    let playerTileX = map.worldToTileX(player.x), playerTileY = map.worldToTileY(player.y);

    // Another helper method from the dungeon - dungeon XY (in tiles) -> room
    let room = dungeon.getRoomAt(playerTileX, playerTileY);

    // If the player has entered a new room, make it visible and dim the last room
    if (room && this.activeRoom && this.activeRoom.id !== room.id){
      if (!debug){
        this.setRoomAlpha(room, 1);
        this.setRoomAlpha(this.activeRoom, 0.5);
      }
    }

    this.activeRoom = room;
    this.discoveredRoom.push(this.activeRoom);

    // bright zombie
    if(!debug){
      this.zombieList.forEach((zombie, idx)=>{
        if(zombie.room_id == room.id){
          zombie.setAlpha(1);
        } else {
          zombie.setAlpha(SSScene.discoveredRoom.map(room=>room.id).includes(zombie.room_id) ? 0.5 : 0);
        }
      });
    }

    // bright other players
    if(!debug){
      otherPlayers.filter((other, idx)=>other.player_id != player.player_id).forEach((other, idx)=>{
        if(other.room_id == room.id){
          other.setAlpha(1);
          other.banner.setAlpha(1);
        } else {
          other.setAlpha(SSScene.discoveredRoom.map(room=>room.id).includes(other.room_id) ? 0.5 : 0);
          other.banner.setAlpha(SSScene.discoveredRoom.map(room=>room.id).includes(other.room_id) ? 0.5 : 0);
        }
      });
    }

    // Smooth follow the player
    let smoothFactor = 0.9;

    SSMainCam.scrollX = smoothFactor * SSMainCam.scrollX + (1 - smoothFactor) * (player.x - SSMainCam.width * 0.5);
    SSMainCam.scrollY = smoothFactor * SSMainCam.scrollY + (1 - smoothFactor) * (player.y - SSMainCam.height * 0.5);

    // this.controls.update(delta);
    // if (SSScene.game.input.activePointer.isDown) {
    //   this.cameraMovingHandler();
    // } else {
    //   SSScene.game.origDragPoint = null;
    // }
  }

  setRoomAlpha(room, alpha){
    map.forEachTile(function(tile){
      tile.alpha = alpha;
    }, this, room.x, room.y, room.width, room.height);
  }

  isMovableTile(worldX, worldY){
    // nonNull = true, don't return null for empty tiles. This means null will be returned only for
    // tiles outside of the bounds of the map.
    let tile = map.getTileAtWorldXY(worldX, worldY, true);

    if(tile && !tile.collides){
      return true;
    } else {
      return false;
    }
  }

  updatePlayerMovement(time){
    let tw = map.tileWidth * layer.scaleX;
    let th = map.tileHeight * layer.scaleY;
    let repeatMoveDelay = 100;

    // movement
    if(cursors.down.isDown){
      if(this.isMovableTile(player.x, player.y + th)){
        SSSocket.emit('moving', {
          name: userId,
          velo: player.velo,
          isUp: true,
          direction: 'down'
        });
      }
    } else if(cursors.up.isDown){
      if(this.isMovableTile(player.x, player.y - th)){
        SSSocket.emit('moving', {
          name: userId,
          velo: -player.velo,
          isUp: true,
          direction: 'top'
        });
      }
    }

    if(cursors.left.isDown){
      if(this.isMovableTile(player.x - tw, player.y)){
        SSSocket.emit('moving', {
          name: userId,
          velo: -player.velo,
          isUp: false,
          direction: 'left'
        });
      }
    } else if(cursors.right.isDown){
      if(this.isMovableTile(player.x + tw, player.y)){
        SSSocket.emit('moving', {
          name: userId,
          velo: player.velo,
          isUp: false,
          direction: 'right'
        });
      }
    }

    // key open chest, 0.1s each space
    if(time - this.lastSpaceTime > repeatMoveDelay && Phaser.Input.Keyboard.JustDown(this.spaceBar)){
      this.lastSpaceTime = time;
      // if player in range
      let playerTileX = map.worldToTileX(player.x), playerTileY = map.worldToTileY(player.y);
      let room = dungeon.getRoomAt(playerTileX, playerTileY);
      let cx = Math.floor(room.x + room.width / 2); // center x of room
      let cy = Math.floor(room.y + room.height / 2); // center y of room

      // check range at chest in this room
      if(room.isContainChest && !isLockCamera
        && playerTileX <= cx + 1 && playerTileX >= cx - 1
        && playerTileY <= cy + 1 && playerTileY >= cy - 1){
        // get score of chest
        // if already open score -> half -> ...
        this.currentQuestion = createQuestionTable(SSSceneUI, room);
      }
    }
  }
}

// scene pop up
class SSUIScene extends Phaser.Scene {
  constructor(handle=null, parent=null){
    super('SSUIScene');
    Phaser.Scene.call(this, { key: 'SSUIScene', active: true });

    this.DEPTH_COUNT = 0;
  }

  create(){
    SSSceneUI = this;

    this.coverBackgroundPanelLayer1 = null;
    this.coverBackgroundPanelLayer2 = null;

    if(isMobile()){
      // loadUIInteraction(this);
    }
  }

  createCoverBackgroundPanel1(){
    this.destroyCoverBackgroundPanel1();
    isLockCamera = true;

    // draw pivot at middle
    this.coverBackgroundPanelLayer1 = this.rexUI.add.roundRectangle(GET_SCREEN_WIDTH()/2, GET_SCREEN_HEIGHT()/2, 
      GET_SCREEN_WIDTH()*1.5, GET_SCREEN_HEIGHT()*1.5, 0, COLOR_GRAY)
    .setFillStyle(COLOR_GRAY, 0.3).setInteractive().setDepth(-1);
  }

  createCoverBackgroundPanel2(){
    this.destroyCoverBackgroundPanel2();
    isLockCamera = true;

    this.coverBackgroundPanelLayer2 = this.rexUI.add.roundRectangle(GET_SCREEN_WIDTH()/2, GET_SCREEN_HEIGHT()/2, 
      GET_SCREEN_WIDTH()*1.5, GET_SCREEN_HEIGHT()*1.5, 0, COLOR_GRAY)
    .setFillStyle(COLOR_GRAY, 0.3).setInteractive().setDepth(this.DEPTH_COUNT-1);
  }

  destroyCoverBackgroundPanel1(){
    if(this.coverBackgroundPanelLayer1){
      this.coverBackgroundPanelLayer1.destroy();
      this.coverBackgroundPanelLayer1 = null;
    }

    if(!this.coverBackgroundPanelLayer1 && !this.coverBackgroundPanelLayer2){
      isLockCamera = false;
    }
  }

  destroyCoverBackgroundPanel2(){
    if(this.coverBackgroundPanelLayer2){
      this.coverBackgroundPanelLayer2.destroy();
      this.coverBackgroundPanelLayer2 = null;
    }

    if(!this.coverBackgroundPanelLayer1 && !this.coverBackgroundPanelLayer2){
      isLockCamera = false;
    }
  }

  refresh(){
    this.scene.bringToTop();
  }
}

var config = {
  type: Phaser.AUTO,
  backgroundColor: BG_COLOR,
  parent: ssGameContainer,
  width: GET_SCREEN_WIDTH(),
  height: GET_SCREEN_HEIGHT(),
  physics: {
    default: 'arcade',
    arcade: {
      tileBias: 16,
      debug: debug
    }
  },
  scene: [SurvivorShooterScene],
};

var SSGame = new Phaser.Game(config);