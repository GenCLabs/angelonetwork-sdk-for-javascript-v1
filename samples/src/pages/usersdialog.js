import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';

//const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = {
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
};

class UsersDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: null
    }
  };

  handleClose = () => {
    //alert("item close " + this.props.selectedValue.email);
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    //alert("item click " + value.email);
    this.props.onClose(value);
  };

  render() {
    const { classes, data, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Select user to share</DialogTitle>
        <div>
          <List>
            {data && data.map(user => (
              <ListItem button onClick={() => this.handleListItemClick(user)} key={user}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.email} />
              </ListItem>
            ))}
            {/* <ListItem button onClick={() => this.handleListItemClick('addAccount')}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="add account" />
            </ListItem> */}
          </List>
        </div>
      </Dialog>
    );
  }
}

UsersDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

//const UserDialog = withStyles(styles)(SimpleDialog);

export default withStyles(styles)(UsersDialog);

// class SimpleDialogDemo extends React.Component {
//   state = {
//     open: false,
//     selectedValue: emails[1],
//   };

//   handleClickOpen = () => {
//     this.setState({
//       open: true,
//     });
//   };

//   handleClose = value => {
//     this.setState({ selectedValue: value, open: false });
//   };

//   render() {
//     return (
//       <div>
//         <Typography variant="subtitle1">Selected: {this.state.selectedValue}</Typography>
//         <br />
//         <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
//           Open simple dialog
//         </Button>
//         <SimpleDialogWrapped
//           selectedValue={this.state.selectedValue}
//           open={this.state.open}
//           onClose={this.handleClose}
//         />
//       </div>
//     );
//   }
// }

