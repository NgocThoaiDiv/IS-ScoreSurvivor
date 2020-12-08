import React from "react";
import '../../App.css';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core';

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

function GameHolder(props) {
  const {showDialog, handleCloseDialog} = props
  const classes = useStyles();

  return (
    <Dialog
        open={showDialog}
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
      </Dialog>
  );
}

export default GameHolder;
