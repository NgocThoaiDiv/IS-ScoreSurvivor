import {Button, Card, Typography, CardContent, CardActions, FormControl, Select, MenuItem, TextField, InputLabel, FormHelperText} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const useStyles = makeStyles({
  rootTitle: {
    fontSize: '30px',
    color: '#fff',
    textAlign: 'center'
  },
  rootGrid: { 
    minHeight: '90vh'
  },
  rootCardContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  rootform: {
    display: 'flex',
    flexDirection: 'column'
  }
});


function Homepage() {
  const { register, handleSubmit, errors } = useForm();
  const classes = useStyles();
  
  const onSubmit = data => {
    window.location.href=`/ScoreSurvivor/${data.Title}/${data.Firstname }`
  };
  return (
    <div className="Homepage">
      <Link to='/ScoreSurvivor/id123/thoai123'>Click to play</Link>
      <Card className={classes.root}>
        <CardContent classes={{root: classes.rootCardContent}}>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Choose your game room and your username
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.rootform}>
            <input type="text" placeholder="First name" name="Firstname" ref={register({required: true, maxLength: 10})} />
            <select name="Title" ref={register({ required: true })}>
              <option value="room1">room 1</option>
              <option value="room2">room 2</option>
              <option value="room3">room 3</option>
              <option value="room4">room 4</option>
            </select>
            <input type="submit" />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Homepage;
