import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import DesriptionIcon from '@material-ui/icons/Description';
import AssignmentIcon from '@material-ui/icons/Assignment';
import FolderIcon from '@material-ui/icons/Folder';
import pink from '@material-ui/core/colors/pink';
import green from '@material-ui/core/colors/green';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import { MenuItem } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'name', numeric: false, disablePadding: true, label: 'File' },
  // { id: 'size', numeric: true, disablePadding: false, label: 'Size' },
  // { id: 'modifieddate', numeric: true, disablePadding: false, label: 'Modified Date' },
  // { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
  // { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          {/* <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell> */}
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});


function SimpleMenu({buttonText, menuTextList, menuHandlerList}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <IconButton aria-label="Add">
                <AddIcon />
              </IconButton>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuTextList.map((value, index) =>{
          return <MenuItem onClick={event=>{handleClose();menuHandlerList[index]();}}>{value}</MenuItem>  
        })}
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
      </Menu>
    </div>
  );
}
class EnhancedTableToolbar extends React.Component {
  constructor(props) {        
    super(props);
  }
  
  // handleAddFile(){
  //   this.props.addFileHandler();    
  // }
  // handleAddFolder(){
  //   this.props.addFolderHandler();    
  // }
  render(){
    const { numSelected, classes } = this.props;
    //const [anchorEl, setAnchorEl] = useState(true);

    return (
      <div>abc
      <Toolbar
        className={classNames(classes.root, {
          //[classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {/* {numSelected} selected */}
            </Typography>
          ) : (
            <Typography variant="h6" id="tableTitle">
               {/* Nutrition  */}
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {/* {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )} */}
          {this.props.enableAdd == "true" && (
          <div>
            <SimpleMenu menuTextList={["Add File", "Add Folder"]} menuHandlerList={[this.props.addFileHandler, this.props.addFolderHandler]}></SimpleMenu>
          {/* <Menu id="simple-menu"
        anchorEl={this.anchorEl}
        keepMounted
        open={Boolean(this.anchorEl)}
        onClose={this.handleClose}>
            <MenuItem onClick={this.handleAddFile}>Add File</MenuItem>
            <MenuItem onClick={this.handleAddFolder}>Add Folder</MenuItem>
          </Menu>
          <Tooltip title="Add" onClick={event => this.handleClick(event)}>
              <IconButton aria-label="Add">
                <AddIcon />
              </IconButton>
          </Tooltip> */}
          </div> )}
        </div>
      </Toolbar></div>
    );
  }
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    //minWidth: 1020,
    width: '100%'
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  avatar: {
    margin: 10,
  },
  pinkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: pink[500],
  },
  greenAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: green[500],
  },
});

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'size',
      selected: [],
      //data: this.props.data,//? this.props.data:[], 
      // [
      //   createData('Cupcake', 305, "2019-10-10", 67, 4.3),
      //   createData('Donut', 452, "2019-10-10", 51, 4.9),
      //   createData('Eclair', 262, "2019-10-10", 24, 6.0),
      //   createData('Frozen yoghurt', 159, "2019-10-10", 24, 4.0),
      //   createData('Gingerbread', 356, "2019-10-10", 49, 3.9),
        //createData('Honeycomb', 408, 3.2, 87, 6.5),
        // createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        // createData('Jelly Bean', 375, 0.0, 94, 0.0),
        // createData('KitKat', 518, 26.0, 65, 7.0),
        // createData('Lollipop', 392, 0.2, 98, 0.0),
        // createData('Marshmallow', 318, 0, 81, 2.0),
        // createData('Nougat', 360, 19.0, 9, 37.0),
        // createData('Oreo', 437, 18.0, 63, 4.0),
      //],
      page: 0,
      rowsPerPage: 5,
      theme: this.props.theme? this.props.theme : 'green',
      addFileHandler: this.props.addFileHandler,
      addFolderHandler: this.props.addFolderHandler,
    };
    //alert(this.props.data);
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };
  handleDoubleClick = (event, item) => {
    if(item.type == "folder"){
      if(this.props.doubleClickHandler != null)
        this.props.doubleClickHandler(item);
    }
  };
  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    let multipleSelect = false;
    if(multipleSelect){
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
    }else{
      newSelected = [id];
    }    
    this.setState({ selected: newSelected });
    if(this.props.selectItemHandler != null)
      this.props.selectItemHandler(newSelected);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { data, classes } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    
    
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    
    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} 
        addFileHandler={this.props.addFileHandler} 
        addFolderHandler={this.props.addFolderHandler} 
        enableAdd={this.props.enableAdd}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onDoubleClick={event => this.handleDoubleClick(event, n)}
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell> */}
                      <TableCell component="th" scope="row" padding="none">
                      <Grid container justify="left" alignItems="center"> 
                        <Avatar className={n.isShared == false ? classes.greenAvatar : classes.pinkAvatar}>
                          {(n.type == "folder") && (
                            <FolderIcon />
                          )}
                          {(n.type == "file") && (
                            <AssignmentIcon />
                          )}
                        </Avatar>
                        {/* <DesriptionIcon/> */}
                        {n.name}
                        </Grid>
                      </TableCell>
                      {/* <TableCell align="right">{n.size}</TableCell>
                      <TableCell align="right">{n.modifieddate}</TableCell> */}
                      {/* <TableCell align="right">{n.carbs}</TableCell>
                      <TableCell align="right">{n.protein}</TableCell> */}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);