import {Button} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

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

function Homepage() {
  const classes = useStyles();
  return (
    <div className="Homepage">
      <Link to='/ScoreSurvivor/id123/thoai123'>Click to play</Link>
    </div>
  );
}

export default Homepage;
