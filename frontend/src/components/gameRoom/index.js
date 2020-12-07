import React, { useState, useEffect } from "react";
import '../../App.css';
import {Grid, Typography} from '@material-ui/core'
import PlayerHolder from '../playerHolder'
import { makeStyles } from '@material-ui/core/styles';
import {useParams} from 'react-router-dom'
import socketIOClient from "socket.io-client";
const ENDPOINT = "ws://localhost:8888";

const useStyles = makeStyles({
  rootTitle: {
    fontSize: '30px',
    color: '#fff',
    textAlign: 'center'
  },
  rootGrid: { 
    minHeight: '90vh'
  }
});

function GameRoom() {
  const classes = useStyles();
  const {room, player} = useParams();
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    });
    return () => socket.disconnect();
  }, []);
  
  console.log(room, player, response)


  return (
    <div className="GameRoom">
      <Typography classes={{root: classes.rootTitle}}>Welcome to the game</Typography>
      <a href="http://localhost:8887/SurvivorScore/thoai"> Click here to play</a>
      <Grid container classes={{root: classes.rootGrid}} direction='row' justify='space-around' alignItems='center'>
        <Grid item>
          <PlayerHolder/>
          <PlayerHolder/>
          
        </Grid>
        <Grid item>
          <PlayerHolder/>
          <PlayerHolder/>
          
        </Grid>
        <Grid item>
          <PlayerHolder/>
          <PlayerHolder/>
        </Grid>
      </Grid>
      
    </div>
  );
}

export default GameRoom;
