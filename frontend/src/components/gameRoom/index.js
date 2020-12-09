import React, { useState, useEffect } from "react";
import '../../App.css';
import {Button, Grid, Typography, Dialog, Snackbar, IconButton} from '@material-ui/core'
import PlayerHolder from '../playerHolder'
import { makeStyles } from '@material-ui/core/styles';
import {useParams} from 'react-router-dom'
import {socket} from '../../commons/socket'
import CloseIcon from '@material-ui/icons/Close';
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
  const [host, setHost] = useState({})
  const [open, setOpen] = useState(false)
  const [gameHolder, setGameHolder] = useState(true)
  const [snackbar, setSnackbar] = useState(false)

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
      for(var i = 0; i < data.players.length; i++) {
        if(data.players[i].isHost === true) {
          setHost(data.players[i])
        }
      }
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
      console.log(data)
    });

    socket.on('set-start', data =>{
      // dataFromServer: { id: player_id, idx: position in room, isReady: false, isHost }
      // set state for player at idx
      if(data.ret === true) {
        setGameHolder(false)
      }
      if(data.ret === false) {
        openSnackbar()
      }
    });

    socket.on('error-access', function(dataFromServer){
      // error in case room is start or no exist room or the name is already exist
      // dataFromServer: { msg }
      alert(dataFromServer.msg);

      // return to home
      window.location.href = '/';
    });

    return () => socket.disconnect();
  }, []);
  // console.log(userList)

  const closeSnackbar = () => {
    setSnackbar(false)
  }

  const openSnackbar = () => {
    setSnackbar(true)
  }

  const startgame = () => {
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }

  // make a function onclick button ready and put on that function: socket.emit('set-ready', { isReady:  }); to tell server
  return (
    <Grid className="GameRoom">
      <Typography classes={{root: classes.rootTitle}}>Welcome to Score Survivor</Typography>
      <Grid container classes={{root: classes.rootGrid}} direction='row' justify='space-around' alignItems='center'>
          {userList && userList.length !== 0 && userList.map((item, index) => {
            if(item.id === player) {
              return (
                  <Grid item key={index}>
                    <PlayerHolder name={item.id} status={item.isReady} isHost={item.isHost} isOP={true}/>
                  </Grid>
              )
            }
            return (
              <Grid item key={index}>
                <PlayerHolder name={item.id} status={item.isReady} isHost={item.isHost} isOP={false}/>
              </Grid>
            )
          })}
      </Grid>
      <Button variant='contained' disabled={gameHolder} onClick={() => startgame()}>Join game</Button>
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
        <iframe src={`http://localhost:8887/ScoreSurvivor/${room}&${player}`} height="100%" width="100%"/>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackbar}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        message="All user must be ready"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </Grid>
  );
}

export default GameRoom;
