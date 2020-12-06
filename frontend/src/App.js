import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import GameRoom from './components/gameRoom';
import Homepage from './components/Homepage'
import { Route, Switch } from 'react-router-dom';

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
    <Switch>
      <Route exact path='/' component={Homepage}/>
      <Route exact path='/ScoreSurvivor/:room/:player' component={GameRoom}/>
    </Switch>
      
    </div>
  );
}

export default App;
