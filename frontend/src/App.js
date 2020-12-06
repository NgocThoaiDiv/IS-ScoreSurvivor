import './App.css';
import {Grid, Typography, Button} from '@material-ui/core'
import PlayerHolder from './components/playerHolder'
import { makeStyles } from '@material-ui/core/styles';

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

function App() {
  const classes = useStyles();
  return (
    <div className="App">
      <Typography classes={{root: classes.rootTitle}}>Welcome to the game</Typography>
      <a href="http://localhost:8887/SurvivorScore/thoai"> Click here</a>
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

export default App;
