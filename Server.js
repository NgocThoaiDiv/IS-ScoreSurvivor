const Dungeon = require("@mikewesthad/dungeon");
const dungeoneer = require('dungeoneer');
const hostname = '192.168.6.14';
const port = 8887;

const express = require('express');
const app = express();
const socket = require("socket.io");
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const urlencodedparser = bodyparser.urlencoded({extended:false});
const md5 = require('md5');

// app.set('views', __dirname + '/views');
app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));
app.use(cookieParser());

app.get('/', function(req, res){
  res.send('./index.html');
});

app.get('/SurvivorScore/:user_id', function (req, res){
  if(!req.params.user_id || req.params.user_id.length==0 || gameRoom_id.clientList.includes(req.params.user_id)){
    res.redirect('https://www.google.com');
    return;
  }

  gameRoom_id.scoreList[req.params.user_id] = 0;
  gameRoom_id.clientList.push(req.params.user_id);
  res.render('./SurvivorScore/index.ejs', { user_id: req.params.user_id, otherPlayers: gameRoom_id.clientList });
});

// dungeon randomness
let dungeon = generateDungeon(), gameRoom_id = {
  scoreList: {},
  clientList: [],
};

function generateDungeon(){
  let dungeon = new Dungeon({
    width: 80,
    height: 40,
    doorPadding: 3,
    rooms: {
      width: { min: 7, max: 15 },
      height: { min: 7, max: 15 }
    }
  })
  dungeon.id = md5('hostname_' + new Date().getTime());
  dungeon.rooms.forEach((room, idx)=>{
    let rand = Math.random(), isExistSpecialChest = false;
    room.isContainChest = false; // locate chest
    room.isContainDeco1 = false; // locate decoration
    if(rand >= 0.6){
      room.isContainChest = true;
      room.isSepcialChest = false;
      // specicial chest location
      if(!isExistSpecialChest){
        room.isSepcialChest = true;
      }
    } else if(rand >= 0.2){
      room.isContainDeco1 = true;
    }

    room.id = md5('hostname_' + 'room_' + idx); // id room
    room.openChestCnt = 0; // map open chest times in room
  });
  for(let i=0; i<dungeon.rooms.length; i++){
    if(!dungeon.rooms[i].isContainChest && !dungeon.rooms[i].isContainDeco1){
      dungeon.rooms[i].isSPawnLocation = true;
      break;
    }
  }

  return dungeon;
}

app.post('/SurvivorScore/getDungeon', urlencodedparser, function (req, res){
  // init zombie
  dungeon.zombies = {};
  dungeon.rooms.forEach((room, idx)=>{
    if(room.isContainChest){
      dungeon.zombies[md5('hostname_' + 'zombie_' + idx)] = {
        id: md5('hostname_' + 'zombie_' + idx),
        destination: room.id
      }
    }
  });

  res.send(dungeon);
});

const server = app.listen(port);

// Socket setup
const io = socket(server);

io.on('connection', function (socket) {
  socket.join('gameRoom_id');
  // socket.broadcast.to('game1').emit('generate-zombies', zombies); // exclusive sender
  // io.to('game1').emit('generate-zombies', zombies); // all in room

  socket.on('moving', function(data){
    io.to('gameRoom_id').emit('moving', data);
  });

  // socket.on("new user", function (data) {
  //   socket.userId = data;
  //   activeUsers.add(data);
  //   io.emit("new user", [...activeUsers]);
  // });

  // socket.on("disconnect", () => {

  //   // gameRoom_id.clientList.forEach({

  //   // });
  //   // activeUsers.delete(socket.userId);
  //   // io.emit("user disconnected", socket.userId);
  // });

  socket.on("reset game", function (data) {
    dungeon = generateDungeon();
    gameRoom_id = {
      scoreList: {},
      clientList: [],
    };
  });
  
  // socket.on("typing", function (data) {
  //   socket.broadcast.emit("typing", data);
  // });
});