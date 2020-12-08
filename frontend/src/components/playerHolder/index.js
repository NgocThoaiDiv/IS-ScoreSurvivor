import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import {socket} from '../../commons/socket';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: 100,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  name: {
    marginBottom: 12,
  },
});

export default function SimpleCard(props) {
  const {name, status, setReady} = props
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Player 1
        </Typography>
        <Typography className={classes.name} color="textSecondary">
          {name}
        </Typography>
        {status === true ? (
          <Alert severity="success" onClick={()=> socket.emit('set-ready', {isReady: false})}>Ready</Alert>
        ) : (
          <Button onClick={()=> socket.emit('set-ready', {isReady: true})}>Click here to ready</Button>
        )}
        
      </CardContent>
    </Card>
  );
}