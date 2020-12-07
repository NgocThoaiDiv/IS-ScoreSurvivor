const Dungeon = require("@mikewesthad/dungeon");
const dungeoneer = require('dungeoneer');
const hostname = '192.168.6.14';
const port = 8887;

const express = require('express');
const app = express();
const socket = require("socket.io");
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const urlencodedparser = bodyparser.urlencoded({ extended: true });
const md5 = require('md5');

const cors = require('cors');
// Set up a whitelist and check against it:
var whitelist = ['http://localhost:3000/'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) === -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// read questions for game from json
const fs = require('fs');
var questionJson = JSON.parse(fs.readFileSync('QuestionDocumentation.json', 'utf8'));
// fs.readFile('QuestionDocumentation.json', 'utf8', (err, data) => {
//   if (err) throw err;
//   console.log(JSON.parse(data));
//   questionJson = JSON.parse(data);
// });

// Then pass them to cors:
app.use(cors(corsOptions));

// app.set('views', __dirname + '/views');
app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(__dirname + '/'));
app.use(cookieParser());

app.get('/', function(req, res){
  res.send('./index.html');
});

// init rooms
var gameRoomList = {}, clients = {}; // list of game rooms, clients
let ableRoom = ['room1', 'room2', 'room3', 'room4', 'room5'];
ableRoom.forEach((room_id, idx)=>{
  gameRoomList[room_id] = {
    scoreList: {},
    clientList: [],
    questionCnt: {},
    limitCountDown: 600,
    isStart: false
  };
});
function resetRoom(room_id){
  gameRoomList[room_id] = {
    scoreList: {},
    clientList: [],
    questionCnt: {},
    limitCountDown: 600,
    isStart: false
  };
}

function setGameTimeout(room_id){
  // send time
  setTimeout(()=>{
    gameRoomList[room_id].limitCountDownInterval = setInterval(()=>{
      io.to(room_id).emit('time-down', { time: --gameRoomList[room_id].limitCountDown });

      // send to client the winner
      if(gameRoomList[room_id].limitCountDown == 0){
        let highestScoreUser = Object.keys(gameRoomList[room_id].scoreList).sort((a,b)=>gameRoomList[room_id].scoreList[b]>gameRoomList[room_id].scoreList[a])[0];

        io.to(room_id).emit('congratulation-winner', { winner: highestScoreUser });
        resetRoom(room_id);
        clearInterval(gameRoomList[room_id].limitCountDownInterval);

        setTimeout(()=>{
          createRoom();
          io.to(room_id).emit('shutdown');
        }, 3000);
      }
    }, 1000);
  }, 2000); // temp solution when no confirm done load on server and client
}

function generateDungeon(room_id){
  let dungeon = new Dungeon({
    width: 80,
    height: 40,
    doorPadding: 2,
    rooms: {
      width: { min: 7, max: 15, onlyOdd: true },
      height: { min: 7, max: 15, onlyOdd: true }
    }
  });

  dungeon.id = md5('hostname_' + new Date().getTime());
  dungeon.rooms.forEach((room, idx)=>{
    let rand = Math.random(), specicialChesCnt = 0;
    room.isContainChest = false; // locate chest
    room.isContainDeco1 = false; // locate decoration
    room.questionMap = {};

    if(rand >= 0.6){
      room.isContainChest = true;
      room.isSepcialChest = false;
      // specicial chest location
      if(specicialChesCnt < 2){
        room.isSepcialChest = true;
        specicialChesCnt++;
      } else {
        // random equally question and level
        let randomLevel = 'level' + Math.floor(Math.random()*Object.keys(questionJson.questions).length + 1),
          randomQuestion = 'question' + Math.floor(Math.random()*Object.keys(questionJson.questions[randomLevel].qDesc).length + 1);

        room.questionMap = questionJson.questions[randomLevel].qDesc[randomQuestion]; // question of this room, only server need to map score
      }
    } else if(rand >= 0.2){
      room.isContainDeco1 = true;
    }

    room.id = md5('hostname_' + 'room_' + idx); // id room
    room.openChestCnt = 0; // map open chest times in room
    gameRoomList[room_id].questionCnt[room.id] = 0; // init game room question count
  });

  for(let i=0; i<dungeon.rooms.length; i++){
    if(!dungeon.rooms[i].isContainChest && !dungeon.rooms[i].isContainDeco1){
      dungeon.rooms[i].isSPawnLocation = true;
      break;
    }
  }

  // init zombie
  gameRoomList[room_id]['dungeon'].zombies = {};
  gameRoomList[room_id]['dungeon'].rooms.forEach((room, idx)=>{
    if(room.isContainChest){
      gameRoomList[room_id]['dungeon'].zombies[md5('hostname_' + 'zombie_' + idx)] = {
        id: md5('hostname_' + 'zombie_' + idx),
        destination: room.id
      }
    }
  });

  return dungeon;
}

// http
app.get('/ScoreSurvivor/:room_id&:player_id', function(req, res){
  let room_id = req.body.room_id, player_id = req.body.player_id;

  res.render('./ScoreSurvivor/index.ejs', { 
    player_id: req.params.player_id, 
    otherPlayers: JSON.parse(JSON.stringify(gameRoomList[room_id].clientList)),
    dungeon: gameRoomList[room_id]['dungeon'] 
  });
  // res.send({ 
  //   dungeon: gameRoomList[room_id]['dungeon'],
  //   player_id: player_id, 
  //   otherPlayers: JSON.parse(JSON.stringify(gameRoomList[room_id].clientList)) 
  // });
});

const server = app.listen(port);

// Socket room setup
const ioRoom = socket(8888, {
  cors: {
    origin: '*',
  }
});
ioRoom.on('connection', function(socket){
  socket.on('join-room', function(data){
    console.log('join-room');
    // data: { room_id, player_id }
    let player_id = data.player_id, room_id = data.room_id;
    // join room in io
    socket.join(data.room_id);

    if(!player_id || player_id.length==0 || 
      (gameRoomList[room_id] && gameRoomList[room_id].clientList.includes(player_id))){
      // send result access room
      socket.emit('error-access', {
        msg: "Already Name"
      });
      return;
    }

    let ret = (ableRoom.includes(room_id) && !gameRoomList[room_id].isStart);
    if(player_id.length > 25) {
      player_id = player_id.splice(0, 25);
    }

    if(ret){
      // if access room push to jsons
      gameRoomList[room_id].clientList.push(player_id);
      socket.player_id = player_id;
      socket.playerDecs = { 
        id: player_id,
        isReady: false,
        isHost: (gameRoomList[room_id].clientList.indexOf(player_id) == 0 ? true : false),
        idx: gameRoomList[room_id].clientList.indexOf(player_id)
      };
      clients[player_id] = { room: room_id, playerDecs: socket.playerDecs };

      // send back to notice join room
      socket.emit('join-room', { self: socket.playerDecs, 
        others: gameRoomList[room_id].clientList.map((other, idx)=>{ 
          if(other != player_id){
            return clients[other].playerDecs;
          }
        })
      });
    } else {
      socket.emit('error-access', {
        msg: "No room exist!"
      });
    }
  });
  
  socket.on('set-ready', function(data){
    // data: { isReady }
    // broadcast all one ready
    clients[socket.player_id] = data.isReady;
    io.to(clients[socket.player_id].room).emit('set-ready', clients[socket.player_id].playerDecs);
  });
  
  socket.on('set-start', function(data){
    // data: {}
    // broadcast all game start
    io.to(clients[socket.player_id].room).emit('set-start');
  });

  socket.on('disconnect', function(reason){
    console.log('disconnect', reason);
    // delete client in room and player infor
    if(clients[socket.player_id]){
      let index = gameRoomList[clients[socket.player_id].room].clientList.indexOf(socket.player_id);
      gameRoomList[clients[socket.player_id].room].clientList.splice(index, 1);
      delete clients[socket.player_id];      
    }
  });

  socket.on('start-game', function(data){
    console.log('start-game');
    // data: { room_id, player_id }
    let player_id = data.player_id, room_id = data.room_id;

    gameRoomList[room_id].scoreList[player_id] = 0;
    gameRoomList[room_id]['dungeon'] = generateDungeon(room_id);

    io.to(room_id).emit('start-game');
  });
});

// Socket game setup
const io = socket(server);
// socket for score survivor
io.on('connection', function (socket) {
  // socket.broadcast.to('game1').emit('generate-zombies', zombies); // exclusive sender
  // io.to('game1').emit('generate-zombies', zombies); // all in room

  socket.on('join-game', function(data){
    // data: { player_id }
    let player_id = data.player_id, room_id = clients[player_id].room;
    // join room in io
    socket.join(data.room_id);

    if(player_id.length > 25) {
      player_id = player_id.splice(0, 25);
    }

    socket.player_id = player_id;
  });

  socket.on('moving', function(data){
    // data: { direction, name }
    io.to(clients[data.name].room).emit('moving', data);
  });

  // when someone solve question
  socket.on('answer-question', function(data){
    // data: { questionId, name, score(can be undefined if normal Q), answer(undefined if TTT) }
    // questionId = roomid in dungeon
    if(!data.score){
      for(let idx=0; idx<gameRoomList[room_id]['dungeon'].rooms.length; idx++){
        let room = gameRoomList[room_id]['dungeon'].rooms[idx];
        if(room.id == data.questionId){
          // get score of question if normal question
          data['score'] = (room.questionMap.true == data.answer[0] ? room.questionMap.score : 2);
          break;
        }
      }
    }

    data['score'] = Math.floor(data['score'] / 
      Math.pow(2, gameRoomList[clients[data.name].room].questionCnt[data.questionId])); // divide pow 2 of times of question
    // increase question count
    gameRoomList[clients[data.name].room].questionCnt[data.questionId]++;
    data['score'] = data['score'] == 0 ? 1 : data['score'];

    // update score list on server
    gameRoomList[clients[data.name].room].scoreList[data.name] += data['score'];

    // send congratulation to user
    socket.emit('congratulation-question', { score: data['score'] });

    io.to(clients[data.name].room).emit('update-score-table', data);
  });

  socket.on("reset game", function (data) {
    createRoom();
  });
});