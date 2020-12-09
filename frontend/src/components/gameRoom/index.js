import React, { useState, useEffect } from "react";
import '../../App.css';
import {Button, Grid, Typography, Dialog} from '@material-ui/core'
import PlayerHolder from '../playerHolder'
import { makeStyles } from '@material-ui/core/styles';
import {useParams} from 'react-router-dom'
import {socket} from '../../commons/socket'
import GameHolder from '../gameRoom';
const url = ''

const useStyles = makeStyles({
  rootTitle: {
    fontSize: '30px',
    color: '#fff',
    textAlign: 'center'
  },
  rootGrid: { 
    minHeight: '90vh'
  },
  paperClaims: {
    width: '100%',
    height: '100%',
    maxWidth: 'unset',
    maxHeight: 'unset',
    margin: 0,
    background: '#E5E5E5',
    position: 'relative',
  }
});

function GameRoom() {
  const classes = useStyles();
  const {room, player} = useParams();
  const [userList, setUserList] = useState([]);
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // receive msg shutdown from 
    window.addEventListener("message", function (event) {
      // check is white list access
      if(event.origin !== "http://localhost:8887")
        return;
      
      // console.log('reload');
      window.location.reload();
    });

    socket.emit('join-room', { room_id: room, player_id: player });

    // socket.on('join-room', function(dataFromServer){
    //   // dataFromServer: 
    //   // { self: { id: player_id, idx: position in room, isReady: false, isHost }, 
    //   //  others: [{ id: player_id, idx: position in room, isReady: false, isHostm }, ...] }
    //   // set position for all player, set state for self and others
    //   console.log('data')
    // });

    socket.on("join-room", data => {
      setUserList(data.players)
    });
    
    
    //socket.emit('set-ready', {isReady: true})
    // socket.on('set-start', function(dataFromServer){
    //   // dataFromServer: {}
    //   // set iframe
    // });

    socket.on('set-ready', data =>{
      // dataFromServer: { id: player_id, idx: position in room, isReady: false, isHost }
      // set state for player at idx
      setUserList(data.players)
      // console.log(data)
    });

    socket.on('set-start', data =>{
      // dataFromServer: { id: player_id, idx: position in room, isReady: false, isHost }
      // set state for player at idx
      // console.log(data)
    });

    socket.on('error-access', function(dataFromServer){
      // error in case room is start or no exist room or the name is already exist
      // dataFromServer: { msg }
      alert(dataFromServer.msg);

      // return to home
      window.location.href = "http://localhost:3000/";
      // window.location.href = 'https://www.google.com';
    });

    return () => socket.disconnect();
  }, []);
  // console.log(userList)

  const startgame = () => {
    socket.emit('set-start')
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }
  // make a function onclick button ready and put on that function: socket.emit('set-ready', { isReady:  }); to tell server
  return (
    <Grid className="GameRoom">
      <Typography classes={{root: classes.rootTitle}}>Welcome to the game</Typography>
      <a href="http://localhost:8887/SurvivorScore/thoai"> Click here to play</a>
      <Grid container classes={{root: classes.rootGrid}} direction='row' justify='space-around' alignItems='center'>
          {userList && userList.length !== 0 && userList.map((item, index) => {
            return (
              <Grid item key={index}>
                <PlayerHolder name={item.id} status={item.isReady} isHost={item.isHost}/>
              </Grid>
            )
          })}
      </Grid>
      <Button variant='contained' onClick={() => startgame()}>Play game</Button>
      {/* <GameHolder showDialog={open} handleCloseDialog={handleCloseDialog}/> */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableEscapeKeyDown={true}
        classes={{
          paper: classes.paperClaims,
        }}
      >
        <div onClick={handleCloseDialog}>
          <div>BACK</div>
        </div>
        <iframe src={`http://localhost:8887/ScoreSurvivor/${room}&${player}`} height="200" width="300"/>
      </Dialog>
    </Grid>
  );
}

export default GameRoom;
