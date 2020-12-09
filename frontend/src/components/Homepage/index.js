import {Button, Card, Typography, CardContent, CardActions, FormControl, Select, MenuItem, TextField, InputLabel, FormHelperText} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const useStyles = makeStyles({
  Homepage: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputField: {
    height: '25px',
    marginBottom: '20px'
  },
  inputSelect: {
    height: '25px',
    marginBottom: '20px'
  },
  root: {
    maxWidth: '400px'
  },
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
    <div className={classes.Homepage}>
      <Card className={classes.root}>
        <CardContent classes={{root: classes.rootCardContent}}>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Choose your username and your game room
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.rootform}>
            <input className={classes.inputField} type="text" placeholder="Username..." name="Firstname" ref={register({required: true, maxLength: 10})} />
            <select className={classes.inputSelect} name="Title" ref={register({ required: true })}>
              <option value="room1">room 1</option>
              <option value="room2">room 2</option>
              <option value="room3">room 3</option>
              <option value="room4">room 4</option>
            </select>
            <Button type="submit">submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Homepage;
